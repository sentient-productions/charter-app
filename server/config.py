# load S3 credentials from environment variables
import os

S3_KEY = os.environ.get("S3_KEY")
S3_SECRET = os.environ.get("S3_SECRET")
BUCKET_NAME = "rango-data"
DEFAULT_DATA_DIR = "default"
USER_DATA_DIR = "user"
STORAGE_OPTIONS = {"key": S3_KEY, "secret": S3_SECRET} if S3_KEY and S3_SECRET else None
