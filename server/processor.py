import json
import os
import sys

import openai
import pandas as pd

import numpy as np
import plotly.express as px

ROOT_PATH = os.path.join(os.path.dirname(__file__), "../")
sys.path.insert(0, ROOT_PATH)

from server.binder.binder_params import DEFAULT_BINDER_PARAMS
from server.binder.generation.generator import Generator
from server.binder.nsql.database import NeuralDB
from server.binder.nsql.nsql_exec import Executor


class Processor:
    def __init__(self, dataset, query, key = "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"):
        self.dataset = dataset
        self.query = query
        # Set the API key for the OpenAI account
        self.key = key
        openai.api_key = key

class PlotterProcessor(Processor):
    mode = 'plotter'

    def load_template_prompt(self):
        # Load the template prompt
        with open("../templates/%s_template_prompt.txt" % (self.mode), "r") as f:
            plotter_template = f.read()
        return plotter_template

    def load_client_prompt_prefix(self):
        # Load the template prompt
        with open("../templates/%s_client_prompt_prefix.txt" % (self.mode), "r") as f:
            plotter_template = f.read()
        return plotter_template

    def load_client_prompt_suffix(self, query):
        return "Q: %s\nNeuralPlot:" % (query) 

    def construct_data_header(self, tail_size = 3):
        prompt_prefix = self.load_client_prompt_prefix()
        tail_size = int(prompt_prefix.split('tail(')[1][:1])
        data_header = self.dataset.tail(tail_size).to_string() + "\n"
        prompt_suffix = self.load_client_prompt_suffix(self.query)

        return prompt_prefix + data_header + prompt_suffix

    def construct_prompt(self):
        prompt = self.load_template_prompt() + self.construct_data_header(self.dataset)
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
            temperature=0.5,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        response_text = response["choices"][0]["text"]
        print(
            "response_text:\n%s" % (response_text)
        )
        return ';'.join(response_text.strip(' ').split(';')[:-1])

    def produce_payload(self, temp_file = "temp.json"):
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

class TableProcessor(Processor):
    mode = 'table'
    params = DEFAULT_BINDER_PARAMS

    def produce_payload(self):
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
        print(nsql, exec_answer)
        return exec_answer


if __name__ == "__main__":
    dataset = pd.read_csv("temp.txt")
    processor = PlotterProcessor(dataset, "Histogram of Data Scientist salaries")
    payload = processor.produce_payload()