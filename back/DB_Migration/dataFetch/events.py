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

def fetchEventsIDs(headers, backoff_factor=0.3):
    url = "https://soul-connection.fr/api/events"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                if data:
                    return [event["id"] for event in data]
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch event IDs (attempt {attempt}): {e}")


def fetchEvent(event_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/events/{event_id}"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.json()
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch event {event_id} (attempt {attempt}): {e}")


def updateEvent(event_id, headers):
    event = fetchEvent(event_id, headers)
    if not event:
        return

    employee_id = event["employee_id"]
    old_event = db.employees.find_one(
        {"id": employee_id},
        {"_id": 0, "events": {"$elemMatch": {"id": event_id}}}
    )

    if old_event:
        old_event = old_event.get("events")[0]
        if old_event != event:
            db.employees.update_one(
                {"id": employee_id, "events.id": event_id},
                {"$set": {"events.$": event}}
            )
            debugPrint(f"Updated event {event_id}")
    else:
        db.employees.update_one(
            {"id": employee_id},
            {"$push": {"events": event}}
        )
        debugPrint(f"Inserted event {event_id}")


def fetchEvents(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    events_ids = fetchEventsIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(updateEvent, event_id, headers) for event_id in events_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (events): {e}")

    print("\033[92m - Fetching events completed ✔\033[0m")
