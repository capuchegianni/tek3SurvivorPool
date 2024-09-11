import os
from pymongo import MongoClient
from dotenv import load_dotenv
from utils import debugPrint

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

        try:
            client = MongoClient(mongodb_uri)
            db = client[mongodb_db_name]
            debugPrint("Database connection established.")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            return None

    return db

db = dbConnection()
