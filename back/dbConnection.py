import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

db = None

def dbConnection():
    global db

    if db is None:
        mongodb_uri = os.getenv("MONGODB_URI")
        mongodb_db_name = os.getenv("MONGODB_DB_NAME")

        if not mongodb_uri or not mongodb_db_name:
            print("Missing environment variables. Please check your .env file.")
            return None

        client = MongoClient(mongodb_uri)
        db = client[mongodb_db_name]

    return db

db = dbConnection()
