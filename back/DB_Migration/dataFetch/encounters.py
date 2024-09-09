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

def fetchEncountersIDs(headers, backoff_factor=0.3):
    url = "https://soul-connection.fr/api/encounters"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                if data:
                    return [encounter["id"] for encounter in data]
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch encounter IDs (attempt {attempt}): {e}")


def fetchEncounter(encounter_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/encounters/{encounter_id}"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.json()
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch encounter {encounter_id} (attempt {attempt}): {e}")


def updateEncounter(encounter_id, headers):
    encounter = fetchEncounter(encounter_id, headers)
    if not encounter:
        return

    customer_id = encounter["customer_id"]
    old_encounter = db.customers.find_one(
        {"id": customer_id},
        {"_id": 0, "encounters": {"$elemMatch": {"id": encounter_id}}}
    )

    if old_encounter:
        old_encounter = old_encounter.get("encounters")[0]
        if old_encounter != encounter:
            db.customers.update_one(
                {"id": customer_id, "encounters.id": encounter_id},
                {"$set": {"encounters.$": encounter}}
            )
            debugPrint(f"Updated encounter {encounter_id}")
    else:
        db.customers.update_one(
            {"id": customer_id},
            {"$push": {"encounters": encounter}}
        )
        debugPrint(f"Inserted encounter {encounter_id}")


def fetchEncounters(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    encounters_ids = fetchEncountersIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(updateEncounter, encounter_id, headers) for encounter_id in encounters_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (encounters): {e}")

    print("\033[92m - Fetching encounters completed ✔\033[0m")
