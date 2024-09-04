import os
from dotenv import load_dotenv
import requests
from dbConnection import db

load_dotenv()

def fetchEmployees(access_token):
    employees_collection = db["employees"]
    url = "https://soul-connection.fr/api/employees"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            employees_collection.insert_many(data)
    else:
        print(f"Failed to retrieve data: {response.status_code}")
