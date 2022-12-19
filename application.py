# external
import os
import uuid

import boto3
import pandas as pd
from flask import Flask
from flask import request
from flask_cors import CORS

# local
from processor import TableProcessor, PlotterProcessor

# load S3 credentials from environment variables
S3_KEY = os.environ.get("S3_KEY")
S3_SECRET = os.environ.get("S3_SECRET")

application = Flask(__name__)
CORS(application,
     origins=['http://localhost:3000', 'http://localhost:3000/', 'https://feature-amplify.doyldq2ymzq2e.amplifyapp.com',
              'https://rango.run', 'https://www.app.rango.run'])


@application.route('/', methods=['POST'])
def plot():
    dataset, query = preprocess_data_request(request)
    processor = PlotterProcessor(dataset, query)
    return processor.produce_payload()


@application.route('/table', methods=['POST'])
def table():
    dataset, query = preprocess_data_request(request)
    processor = TableProcessor(dataset, query)
    return processor.produce_payload()


@application.route('/upload', methods=['POST'])
def upload():
    # fetch the form from the data
    token = request.args.get('token')
    if not token:
        token = str(uuid.uuid4())

    # Each key in :attr:`files` is the name from the ``<input type="file" name="">``
    for name, file_storage in request.files.items():
        dataset = pd.read_csv(file_storage)
        dataset.to_csv(f's3://rango-data/user/{token}/{name}.csv',
                       storage_options={'key': S3_KEY, 'secret': S3_SECRET})
    return token


def load_from_s3(name, token):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('rango-data')
    default_files = list(bucket.objects.filter(Prefix='default'))
    if name in default_files:
        return pd.read_csv(f's3://rango-data/default/{name}.csv',
                           storage_options={'key': S3_KEY, 'secret': S3_SECRET})
    if token:
        user_files = list(bucket.objects.filter(Prefix=f'user/{token}'))
        if name in user_files:
            return pd.read_csv(f's3://rango-data/user/{token}/{name}.csv',
                               storage_options={'key': S3_KEY, 'secret': S3_SECRET})
    raise ValueError(f'File {name} not found')


def preprocess_data_request(request):
    data = request.form
    dataset_name = data.get('name', 'default')
    user_token = request.args.get('token', None)
    dataset = load_from_s3(dataset_name, user_token)
    query = data['query']
    return dataset, query


@application.route('/generate_token', methods=['GET'])
def generate_auth_token():
    data = request.args
    if 'token' in data:
        return data['token']  # do not create a new token
    token = str(uuid.uuid4())
    return token


if __name__ == '__main__':
    application.debug = True
    application.run()
