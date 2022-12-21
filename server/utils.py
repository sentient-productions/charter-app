import boto3
from werkzeug.utils import secure_filename
from config import *
import pandas as pd


def load_from_s3(name, token):
    name = secure_filename(name)
    s3 = boto3.resource("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)
    bucket = s3.Bucket(BUCKET_NAME)
    default_files = list([obj.key for obj in bucket.objects.filter(Prefix="default")])
    if f"{DEFAULT_DATA_DIR}/" + name in default_files:
        df = pd.read_csv(
            f"s3://{BUCKET_NAME}/{DEFAULT_DATA_DIR}/{name}",
            storage_options=STORAGE_OPTIONS,
        )
        return clean_column_names(df)
    if token:
        user_files = list(
            [obj.key for obj in bucket.objects.filter(Prefix=f"user/{token}")]
        )
        if f"{USER_DATA_DIR}/{token}/" + name in user_files:
            df = pd.read_csv(
                f"s3://{BUCKET_NAME}/{USER_DATA_DIR}/{token}/{name}",
                storage_options=STORAGE_OPTIONS,
            )
            return clean_column_names(df)
    raise ValueError(f"File {name} not found")


def clean_df(df, dropna=False):
    df = clean_column_names(df)
    if dropna:
        df = df.dropna()
    # todo: extend
    return df


def clean_column_names(df):
    df.columns = [col.strip() for col in df.columns]
    return df


def load_dataset_and_query(request):
    data = request.form
    dataset_name = data.get("name", "default")
    dataset_name = secure_filename(dataset_name)
    user_token = data.get("token", None)
    dataset = load_from_s3(dataset_name, user_token)
    query = data["query"]
    return dataset, query


def pd_read_with_format(file_storage):
    dfs = {}

    if file_storage.filename.endswith(".xlsx") or file_storage.filename.endswith(
        ".xls"
    ):
        read_result = pd.read_excel(file_storage, sheet_name=None)
        # delete extension from filename
        filename_split = file_storage.filename.rsplit(".", 1)
        filename = filename_split[0]
        extension = filename_split[
            1
        ]  # todo this is kinda stupid but we're reattaching extension to remove it correctly later
        if isinstance(read_result, dict):
            for sheet_name, df in read_result.items():
                dfs[filename + "_" + sheet_name + "." + extension] = clean_df(df, True) # we drop empty cells from excel sheets by default
        if isinstance(read_result, pd.DataFrame):
            dfs[file_storage.filename] = clean_df(read_result)

    if file_storage.filename.endswith(".csv"):
        # read the csv file
        dfs[file_storage.filename] = clean_df(pd.read_csv(file_storage))
    if file_storage.filename.endswith(".json"):
        # read the json file
        dfs[file_storage.filename] = clean_df(pd.read_json(file_storage))
    if file_storage.filename.endswith(".parquet"):
        # read the parquet file
        dfs[file_storage.filename] = clean_df(pd.read_parquet(file_storage))
    if file_storage.filename.endswith(".pickle"):
        # read the pickle file
        dfs[file_storage.filename] = clean_df(pd.read_pickle(file_storage))
    if file_storage.filename.endswith(".tsv"):
        # read the tsv file
        dfs[file_storage.filename] = clean_df(pd.read_csv(file_storage, sep="\t"))

    if not dfs:
        raise ValueError("File format not supported")

    return dfs
