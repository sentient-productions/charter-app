# external
import pandas as pd
from flask import Flask
from flask import request
from flask_cors import CORS

# local
from processor import TableProcessor, PlotterProcessor

application = Flask(__name__)
CORS(application, origins=['http://localhost:3000', 'http://localhost:3000/', 'https://feature-amplify.doyldq2ymzq2e.amplifyapp.com', 'https://rango.run', 'https://www.app.rango.run'])


@application.route('/', methods=['POST'])
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


@application.route('/table', methods=['POST'])
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
    return processor.produce_payload()


if __name__ == '__main__':
    application.debug = True
    application.run()
