# external
import pandas as pd
from flask import Flask
from flask import request
from flask_cors import CORS

# local
from processor import Processor
from binder.generation.generator import Generator
from server.binder.nsql.database import NeuralDB
from server.binder.nsql.nsql_exec import Executor
from server.binder.utils.normalizer import post_process_sql

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3000/'])


@app.route('/', methods=['POST'])
def plot():
    # fetch the form from the data
    data = request.form

    # Access the data in the dictionary
    rawData = data['rawData']
    with open("temp.txt", "w") as f:
        f.write(rawData)
    dataset = pd.read_csv('temp.txt')
    print('dataset=', dataset)
    query = data['query']

    # Construct the prompt and query the result
    processor = Processor("plotter", dataset, query)

    return processor.produce_payload()


@app.route('/ask', methods=['POST'])
def ask():
    # fetch the form from the data
    data = request.form

    # Access the data in the dictionary
    rawData = data['rawData']
    with open("temp.txt", "w") as f:
        f.write(rawData)
    dataset = pd.read_csv('temp.txt')
    print('dataset=', dataset)
    query = data['query']
    dataset = pd.read_csv('temp.txt')

    generator = Generator(keys=["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"])

    title = "Data Scientist Salaries"
    prompt_args = {
        'table': dataset.head(),
        'title': title,
        'question': query
    }

    few_shot_prompt = generator.build_few_shot_prompt_from_file(
        file_path='./binder/templates/prompts/wikitq_binder.txt',
        n_shots=14
    )
    generate_prompt = generator.build_generate_prompt(
        data_item=prompt_args,
        generate_type=("nsql",)
    )
    prompt = few_shot_prompt + "\n\n" + generate_prompt
    # Ensure the input length fit Codex max input tokens by shrinking the n_shots
    response_dict = generator.generate_one_pass(
        prompts=[(0, prompt)],
        verbose=False
    )
    text_logit_pairs = response_dict[0]
    nsql = max(text_logit_pairs, key=lambda x: x[1])[0]
    db = NeuralDB([{'table': dataset, 'title': title}])

    # nsql = post_process_sql(
    #     sql_str=nsql,
    #     df=db.get_table_df(),
    #     process_program_with_fuzzy_match_on_db=True,
    #     table_title=title
    # )
    executor = Executor(keys=["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"])
    exec_answer = executor.nsql_exec(nsql, db)
    print(nsql, exec_answer)
    return exec_answer


if __name__ == '__main__':
    app.run()
