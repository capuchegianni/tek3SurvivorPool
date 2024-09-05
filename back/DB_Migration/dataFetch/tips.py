import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

def processTip(tip,):
    if db.tips.find_one({"id": tip["id"]}):
        db.tips.update_one(
            {"id": tip["id"]}, {"$set": tip}
        )
    else:
        db.tips.insert_one(tip)

def fetchTips(access_token):
    url = "https://soul-connection.fr/api/tips"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(processTip, tip) for tip in data]
                for future in futures:
                    try:
                        future.result()
                    except Exception as e:
                        print(f"Error occurred: {e}")

    print("\033[92m - Fetching tips completed ✔\033[0m")
