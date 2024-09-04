import os
from dotenv import load_dotenv
import requests
from dbConnection import db

load_dotenv()

def fetchTips(access_token):
    url = "https://soul-connection.fr/api/tips"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            for tip in data:
                if db.tips.find_one({"id": tip["id"]}):
                    db.tips.update_one(
                        {"id": tip["id"]}, {"$set": tip}
                    )
                    print(f"Tip {tip['id']} updated successfully.")
                else:
                    db.tips.insert_one(tip)
                    print(f"Tip {tip['id']} added successfully.")
