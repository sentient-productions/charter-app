import numpy as np
import json
import openai
import pandas as pd
import plotly.express as px

class Processor:
    def __init__(self, mode, dataset, query, key = "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"):
        assert(mode in ["plotter", "tabler"])
        self.mode = mode
        self.dataset = dataset
        self.query = query
        # Set the API key for the OpenAI account
        openai.api_key = key

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
        return prompt

    def generate_response(self):
        # Use the GPT-3 model to generate text
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=self.construct_prompt(),
            max_tokens=1024,
            temperature=0.5,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        response_text = response["choices"][0]["text"]
        return response_text.strip(' ')

    def produce_payload(self, temp_file = "temp.json"):
        response = self.generate_response()
        raw_response = response
        print("Raw response=", raw_response)
        response += """ f = open(temp_file, "w"); f.write(fig.to_json()); print(fig.to_json()); f.close(); fig.show();"""
        dataset = self.dataset

        # execute the response, which should result in a json file being written
        exec(response)
        with open(temp_file, "r") as f:
            payload = json.load(f)
        
        payload['response_code'] = raw_response
        return payload

if __name__ == "__main__":

    dataset = pd.read_csv("temp.txt")
    processor = Processor("plotter", dataset, "Histogram of Data Scientist salaries")
    payload = processor.produce_payload()
    print('output payload = ', payload)

    ## CRUFT TO CLEANUP
    # print('prompt = ', processor.construct_prompt())
    # print('response = ', response)
    # exec(response)

    # # Set the API key for your OpenAI account

    # # Use the Codex model to generate text
    # response = openai.Completion.create(
    #     engine="text-davinci-003",
    #     # engine="code-davinci-002",
    #     prompt=processor.construct_prompt(),
    #     max_tokens=1024,
    #     temperature=0.5,
    #     top_p=1,
    #     frequency_penalty=0,
    #     presence_penalty=0
    # )
    # response_text = response["choices"][0]["text"]