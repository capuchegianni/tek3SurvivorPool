import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from concurrent.futures import ThreadPoolExecutor
from utils import debugPrint
from requests.exceptions import RequestException
from http.client import IncompleteRead
import time

load_dotenv()

def updateTip(tip_id, tip):
    old_tip = db.tips.find_one(
        {"id": tip_id},
        {"_id": 0}
    )

    if old_tip:
        for key in tip:
            if key in old_tip:
                if old_tip[key] == tip[key]:
                    continue
            db.tips.update_one(
                {"id": tip_id},
                {"$set": {key: tip[key]}}
            )
            debugPrint(f"Updated {key} for tip {tip_id}")
    else:
        db.tips.insert_one(tip)
        debugPrint(f"Inserted tip {tip_id}")


def fetchTips(access_token, backoff_factor=0.3):
    url = "https://soul-connection.fr/api/tips"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                if data:
                    with ThreadPoolExecutor(max_workers=10) as executor:
                        futures = [executor.submit(updateTip, tip["id"], tip) for tip in data]
                        for future in futures:
                            try:
                                future.result()
                            except Exception as e:
                                print(f"Error occurred (tips): {e}")
                print("\033[92m - Fetching tips completed ✔\033[0m")
                return
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch tips (attempt {attempt}): {e}")
