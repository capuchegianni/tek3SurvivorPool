import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

db = None

def dbConnection():
    global db
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client[os.getenv("MONGODB_DB_NAME")]
