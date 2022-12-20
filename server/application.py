# external
import os
import sys
import uuid

import boto3
import pandas as pd
from flask import Flask
from flask import request
from flask_cors import CORS

# local
from werkzeug.utils import secure_filename
ROOT_DIR = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, ROOT_DIR)
from processor import TableProcessor, PlotterProcessor

# load S3 credentials from environment variables
S3_KEY = os.environ.get("S3_KEY")
S3_SECRET = os.environ.get("S3_SECRET")
BUCKET_NAME = "rango-data"
DEFAULT_DATA_DIR = "default"
USER_DATA_DIR = "user"
STORAGE_OPTIONS = {"key": S3_KEY, "secret": S3_SECRET} if S3_KEY and S3_SECRET else None

application = Flask(__name__)
CORS(
    application,
    origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3000",
        "http://localhost:3000/",
        "https://feature-amplify.doyldq2ymzq2e.amplifyapp.com",
        "https://rango.run",
        "https://www.app.rango.run",
        "https://grappler.link",
        "https://www.grappler.link",
    ],
)


@application.route("/", methods=["POST"])
def plot():
    dataset, query = load_dataset_and_query(request)
    processor = PlotterProcessor(dataset, query)
    return processor.produce_payload()


@application.route("/table", methods=["POST"])
def table():
    dataset, query = load_dataset_and_query(request)
    processor = TableProcessor(dataset, query)
    return processor.produce_payload()


@application.route("/upload", methods=["POST"])
def upload():
    # fetch the form from the data
    token = request.form.get("token")

    if not token:
        token = str(uuid.uuid4())
    # Each key in :attr:`files` is the name from the ``<input type="file" name="">``
    for file_storage in request.files.values():
        name = file_storage.filename
        dataset = pd.read_csv(file_storage)
        name = secure_filename(name)
        dataset.to_csv(
            f"s3://{BUCKET_NAME}/{USER_DATA_DIR}/{token}/{name}",
            storage_options=STORAGE_OPTIONS,
            index=False,
        )
    return token

@application.route("/list-user-files", methods=["GET"])
def list_user_files():
    token = request.args.get("token")
    if not token:
        return []

    s3 = boto3.resource("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    bucket = s3.Bucket(BUCKET_NAME)
    user_files = list(
        [obj.key for obj in bucket.objects.filter(Prefix=f"user/{token}")]
    )

    return [file.split("/")[-1] for file in user_files]

@application.route("/list-default-files", methods=["GET"])
def list_default_files():
    s3 = boto3.resource("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    bucket = s3.Bucket(BUCKET_NAME)
    user_files = list(
        [obj.key for obj in bucket.objects.filter(Prefix=f"default/")]
    )

    return [file.split("/")[-1] for file in user_files]

@application.route("/generate-token", methods=["GET"])
def generate_auth_token():
    data = request.args
    if "token" in data:
        return data["token"]  # do not create a new token
    token = str(uuid.uuid4())
    return token

@application.route("/get-dataset", methods=["POST"])
def get_dataset_as_csv():
    name = request.form.get("name", "salaries.csv")
    name = secure_filename(name)
    dataset = load_from_s3(name, None)
    return dataset.to_csv(index=False)

def load_from_s3(name, token):
    name = secure_filename(name)
    s3 = boto3.resource("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    bucket = s3.Bucket(BUCKET_NAME)
    default_files = list([obj.key for obj in bucket.objects.filter(Prefix="default")])
    if f"{DEFAULT_DATA_DIR}/" + name in default_files:
        return pd.read_csv(
            f"s3://{BUCKET_NAME}/{DEFAULT_DATA_DIR}/{name}",
            storage_options=STORAGE_OPTIONS,
        )
    if token:
        user_files = list(
            [obj.key for obj in bucket.objects.filter(Prefix=f"user/{token}")]
        )
        if f"{USER_DATA_DIR}/{token}/" + name in user_files:
            return pd.read_csv(
                f"s3://{BUCKET_NAME}/{USER_DATA_DIR}/{token}/{name}",
                storage_options=STORAGE_OPTIONS,
            )
    raise ValueError(f"File {name} not found")


def load_dataset_and_query(request):
    data = request.form
    dataset_name = data.get("name", "default")
    user_token = request.args.get("token", None)
    dataset = load_from_s3(dataset_name, user_token)
    query = data["query"]
    return dataset, query

if __name__ == "__main__":
    application.debug = True
    application.run()
