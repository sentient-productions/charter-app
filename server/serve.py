# external
import pandas as pd
from flask import Flask
from flask import request
from flask_cors import CORS

# local
from processor import TableProcessor, PlotterProcessor

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
    # Rename columns to remove trailing and leading spaces
    dataset.rename(columns=lambda x: x.strip(), inplace=True)
    query = data['query']

    # Construct the prompt and query the result
    processor = PlotterProcessor(dataset, query)

    return processor.produce_payload()


@app.route('/table', methods=['POST'])
def table():
    # fetch the form from the data
    data = request.form

    # Access the data in the dictionary
    rawData = data['rawData']
    with open("temp.txt", "w") as f:
        f.write(rawData)
    dataset = pd.read_csv('temp.txt')
    print('dataset=', dataset)
    query = data['query']

    processor = TableProcessor(dataset, query)
    payload = processor.produce_payload()
    return payload


if __name__ == '__main__':
    app.run()
