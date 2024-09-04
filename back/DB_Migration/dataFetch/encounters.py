import os
from dotenv import load_dotenv
import requests
from dbConnection import db

load_dotenv()

def fetchEncountersIDs(headers):
    url = "https://soul-connection.fr/api/encounters"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            return [encounter["id"] for encounter in data]
    else:
        return []

def fetchEncounter(encounter_id, headers):
    url = f"https://soul-connection.fr/api/encounters/{encounter_id}"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            customer_id = data["customer_id"]
            if db.customers.find_one({"id": customer_id, "encounters.id": encounter_id}):
                db.customers.update_one(
                    {"id": customer_id, "encounters.id": encounter_id},
                    {"$set": {"encounters.$": data}}
                )
                print(f"Encounter {encounter_id} updated for customer {customer_id}.")
            else:
                db.customers.update_one(
                    {"id": customer_id},
                    {"$push": {"encounters": data}}
                )
                print(f"Encounter {encounter_id} added to customer {customer_id}.")

def fetchEncounters(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    encounters_ids = fetchEncountersIDs(headers)

    for encounter_id in encounters_ids:
        fetchEncounter(encounter_id, headers)
