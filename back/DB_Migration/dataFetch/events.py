import os
from dotenv import load_dotenv
import requests
from dbConnection import db

load_dotenv()

def fetchEventsIDs(headers):
    url = "https://soul-connection.fr/api/events"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            return [event["id"] for event in data]
    else:
        return []

def fetchEvent(event_id, headers):
    url = f"https://soul-connection.fr/api/events/{event_id}"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            employee_id = data["employee_id"]
            if db.employees.find_one({"id": employee_id, "events.id": event_id}):
                db.employees.update_one(
                    {"id": employee_id, "events.id": event_id},
                    {"$set": {"events.$": data}}
                )
                print(f"Event {event_id} updated for employee {employee_id}.")
            else:
                db.employees.update_one(
                    {"id": employee_id},
                    {"$push": {"events": data}}
                )
                print(f"Event {event_id} added to employee {employee_id}.")

def fetchEvents(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    events_ids = fetchEventsIDs(headers)

    for event_id in events_ids:
        fetchEvent(event_id, headers)
