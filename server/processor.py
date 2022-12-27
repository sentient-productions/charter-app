import json
import os
import sys

import openai
import pandas as pd
import sqlfluff

import numpy as np
import plotly.express as px

ROOT_PATH = os.path.join(os.path.dirname(__file__), "../../")
sys.path.insert(0, ROOT_PATH)

from binder.binder_params import DEFAULT_BINDER_PARAMS
from binder.generation.generator import Generator
from binder.nsql.database import NeuralDB
from binder.nsql.nsql_exec import Executor


class Processor:
    def __init__(self, dataset, query, key = "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"):
        self.dataset = dataset
        self.query = query
        # Set the API key for the OpenAI account
        self.key = key
        openai.api_key = key

class PandasProcessor(Processor):
    mode = "default"

    def load_template_prompt(self):
        # Load the template prompt
        with open("templates/%s_template_prompt.txt" % self.mode, "r") as f:
            plotter_template = f.read()
        return plotter_template

    def load_client_prompt_prefix(self):
        # Load the template prompt
        with open("templates/%s_client_prompt_prefix.txt" % self.mode, "r") as f:
            plotter_template = f.read()
        return plotter_template

    def construct_data_header(self):
        prompt_prefix = self.load_client_prompt_prefix()
        tail_size = int(prompt_prefix.split('tail(')[1][:1])
        data_header = self.dataset.tail(tail_size).to_string() + "\n"
        data_info = self.dataset.info() + "\n"
        prompt_suffix = self.load_client_prompt_suffix()

        return prompt_prefix + data_header + data_info + prompt_suffix

    def construct_prompt(self):
        prompt = self.load_template_prompt() + self.construct_data_header()
        print(
            "Prompt:\n%s" % (prompt)
        )
        return prompt

    def generate_response(self):
        # Use the GPT-3 model to generate text
        response = openai.Completion.create(
            engine="code-davinci-002",
            prompt=self.construct_prompt(),
            max_tokens=128,
            temperature=0.2,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        response_text = response["choices"][0]["text"]
        print(
            "response_text:\n%s" % (response_text)
        )
        return ';'.join(response_text.strip(' ').split(';')[:-1])

    def load_client_prompt_suffix(self):
        return f"Q: {self.query}\n"

    def produce_payload(self, temp_file = "temp.json"):
        raw_response = None
        try:
            response = self.generate_response()
            raw_response = response
            response += """; f = open(temp_file, "w"); f.write(fig.to_json()); f.close();"""

            # execute the response, which should result in a json file being written
            dataset = self.dataset # need this for successful exec
            exec(response)
            with open(temp_file, "r") as f:
                payload = json.load(f)

            payload['response_code'] = raw_response
            return payload
        except Exception as e:
            print('an exception e happened =', e)
            return {'error': str(e), 'query': raw_response}

class PlotterProcessor(PandasProcessor):
    mode = 'plotter'

    def load_client_prompt_suffix(self):
        return super().load_client_prompt_suffix() + "NeuralPlot:"


class NsqlProcessor(Processor):
    mode = 'nsql'
    params = DEFAULT_BINDER_PARAMS

    def produce_payload(self):
        nsql = None 
        try:
            generator = Generator(self.params, keys=[self.key])

            title = "" # TODO
            prompt_args = {
                'table': self.dataset.head(),
                'title': title,
                'question': self.query
            }

            few_shot_prompt = generator.build_few_shot_prompt_from_file(
                file_path=self.params.prompt_file,
                n_shots=self.params.n_shots,
            )
            generate_prompt = generator.build_generate_prompt(
                data_item=prompt_args,
                generate_type=(self.params.generate_type,)
            )
            prompt = few_shot_prompt + "\n\n" + generate_prompt
            # Ensure the input length fit Codex max input tokens by shrinking the n_shots
            response_dict = generator.generate_one_pass(
                prompts=[(0, prompt)],
                verbose=False
            )
            text_logit_pairs = response_dict[0]
            nsql = max(text_logit_pairs, key=lambda x: x[1])[0]
            db = NeuralDB([{'table': self.dataset, 'title': title}])

            # nsql = post_process_sql(
            #     sql_str=nsql,
            #     df=db.get_table_df(),
            #     process_program_with_fuzzy_match_on_db=True,
            #     table_title=title
            # )

            executor = Executor(self.params, keys=[self.key])
            exec_answer = executor.nsql_exec(nsql, db)
            print('exec_answer=', exec_answer)
            formatted = sqlfluff.fix(nsql.replace('`', ''))
            payload = {
                'nsql': formatted,
                'data': exec_answer
            }

            return payload

        except Exception as e:
            print('an exception e happened =', e)
            return {'error': str(e), 'query': nsql}


class AggregatorProcessor(PandasProcessor):
    mode = 'aggregator'

    def load_client_prompt_suffix(self):
        return super().load_client_prompt_suffix() + "NeuralAggregator:"


if __name__ == "__main__":
    dataset = pd.read_csv("temp.txt")
    processor = PlotterProcessor(dataset, "Histogram of Data Scientist salaries")
    payload = processor.produce_payload()
