import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

def fetchEncountersIDs(headers):
    url = "https://soul-connection.fr/api/encounters"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            return [encounter["id"] for encounter in data]
    return []

def fetchEncounter(encounter_id, headers):
    url = f"https://soul-connection.fr/api/encounters/{encounter_id}"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            customer_id = data["customer_id"]
            if db.customers.find_one({"id": customer_id, "encounters.id": encounter_id}):
                db.customers.update_one(
                    {"id": customer_id, "encounters.id": encounter_id},
                    {"$set": {"encounters.$": data}}
                )
            else:
                db.customers.update_one(
                    {"id": customer_id},
                    {"$push": {"encounters": data}}
                )

def fetchEncounters(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    encounters_ids = fetchEncountersIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetchEncounter, encounter_id, headers) for encounter_id in encounters_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (encounters): {e}")

    print("\033[92m - Fetching encounters completed ✔\033[0m")
