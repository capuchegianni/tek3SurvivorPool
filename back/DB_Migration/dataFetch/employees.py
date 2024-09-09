import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS
from bson.objectid import ObjectId
from concurrent.futures import ThreadPoolExecutor
from utils import debugPrint
from requests.exceptions import RequestException
from http.client import IncompleteRead
import time

load_dotenv()

def fetchEmployeesIDs(headers, retries=3, backoff_factor=0.3):
    url = "https://soul-connection.fr/api/employees"

    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                if data:
                    return [employee["id"] for employee in data]
        except (RequestException, IncompleteRead) as e:
            if attempt < retries - 1:
                time.sleep(backoff_factor * (2 ** attempt))
            else:
                print(f"Failed to fetch employee IDs after {retries} attempts: {e}")
                return []
    return []


def fetchEmployeeImage(employee_id, headers, retries=3, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/employees/{employee_id}/image"

    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.content
        except (RequestException, IncompleteRead) as e:
            if attempt < retries - 1:
                time.sleep(backoff_factor * (2 ** attempt))
            else:
                print(f"Failed to fetch image for employee {employee_id} after {retries} attempts: {e}")
                return None
    return None


def updateEmployeeImage(employee_id, headers):
    old_image = db.employees.find_one(
        {"id": employee_id},
        {"_id": 0, "image": 1}
    )
    employee_image = fetchEmployeeImage(employee_id, headers)

    if not employee_image:
        return

    fs = GridFS(db)

    if old_image:
        old_image = old_image.get("image")
        existing_image = fs.get(ObjectId(old_image)).read()
        if existing_image == employee_image:
            return
        fs.delete(ObjectId(old_image))

    image_id = fs.put(employee_image, filename=f"employee_{employee_id}.jpg")
    db.employees.update_one(
        {"id": employee_id},
        {"$set": {"image": image_id}}
    )
    debugPrint(f"Updated image for employee {employee_id}")


def updateEmployee(employee_id, headers):
    url = f"https://soul-connection.fr/api/employees/{employee_id}"

    for attempt in range(3):
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                old_data = db.employees.find_one(
                    {"id": employee_id},
                    {"_id": 0, "events": 0}
                )

                if old_data:
                    for key in data:
                        if key in old_data:
                            if old_data[key] == data[key]:
                                continue
                        db.employees.update_one(
                            {"id": employee_id},
                            {"$set": {key: data[key]}}
                        )
                        debugPrint(f"Updated {key} for employee {employee_id}")
                else:
                    db.employees.insert_one(data)
                    debugPrint(f"Inserted employee {employee_id}")

                updateEmployeeImage(employee_id, headers)
                return
        except (RequestException, IncompleteRead) as e:
            if attempt < 2:
                time.sleep(0.3 * (2 ** attempt))
            else:
                print(f"Failed to update employee {employee_id} after 3 attempts: {e}")


def fetchEmployees(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    employees_ids = fetchEmployeesIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(updateEmployee, employee_id, headers) for employee_id in employees_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (employees): {e}")

    print("\033[92m - Fetching employees completed ✔\033[0m")
