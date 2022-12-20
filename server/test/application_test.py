import sys

import boto3
import pandas as pd

sys.path.insert(0, '../..')
from server.application import load_from_s3, S3_KEY, S3_SECRET
import requests
# make sure the server is running
# and the data is in the s3 bucket
# and the credentials are in the environment
def upload_test():
    url = 'http://127.0.0.1:5000/upload'
    name = 'data.csv'
    csv_file = open(name, 'rb')

    # send the POST request with the CSV file as the body
    response = requests.post(url, files={name: csv_file})
    breakpoint()
    assert response.status_code == 200, 'Upload failed'

    token = response.text
    df = load_from_s3(name, token)
    assert df.shape == pd.read_csv('data.csv').shape, 'Corrupted'
    # remove the uploaded file
    s3 = boto3.resource('s3', aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    bucket = s3.Bucket('rango-data')
    bucket.delete_objects(Delete={'Objects': [{'Key': f'user/{token}/{name}'}]})

def plot_test():
    url = 'http://127.0.0.1:5000/'
    name = 'AAPL.csv'
    query = 'Rolling average of volume'
    form_data = {'name': name, 'query': query}
    response = requests.post(url, data=form_data)
    assert response.status_code == 200, 'Plot failed'

def table_test():
    url = 'http://127.0.0.1:5000/table'
    name = 'AAPL.csv'
    query = 'Close minus open on days when volume is over 100 million'
    form_data = {'name': name, 'query': query}
    response = requests.post(url, data=form_data)
    breakpoint()
    assert response.status_code == 200, 'Aggregation failed'


#upload_test()
#plot_test()
table_test()

