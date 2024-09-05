import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

def fetchEventsIDs(headers):
    url = "https://soul-connection.fr/api/events"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            return [event["id"] for event in data]
    return []

def fetchEvent(event_id, headers):
    url = f"https://soul-connection.fr/api/events/{event_id}"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            employee_id = data["employee_id"]
            if db.employees.find_one({"id": employee_id, "events.id": event_id}):
                db.employees.update_one(
                    {"id": employee_id, "events.id": event_id},
                    {"$set": {"events.$": data}}
                )
            else:
                db.employees.update_one(
                    {"id": employee_id},
                    {"$push": {"events": data}}
                )

def fetchEvents(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    events_ids = fetchEventsIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetchEvent, event_id, headers) for event_id in events_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (events): {e}")

    print("\033[92m - Fetching events completed ✔\033[0m")
