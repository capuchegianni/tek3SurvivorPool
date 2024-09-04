import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS

load_dotenv()

def fetchEmployeesIDs(headers):
    url = "https://soul-connection.fr/api/employees"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            return [employee["id"] for employee in data]
    else:
        return []

def fetchEmployeeImage(employee_id, headers):
    url = f"https://soul-connection.fr/api/employees/{employee_id}/image"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.content
    else:
        return None

def fetchEmployee(employee_id, headers):
    employee_image = fetchEmployeeImage(employee_id, headers)
    url = f"https://soul-connection.fr/api/employees/{employee_id}"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            if employee_image:
                image_id = GridFS(db).put(employee_image, filename=f"employee_{employee_id}.jpg")
                data["image"] = image_id
            if db.employees.find_one({"id": employee_id}):
                db.employees.update_one(
                    {"id": employee_id}, {"$set": data}
                )
                print(f"Employee {employee_id} updated successfully.")
            else:
                db.employees.insert_one(data)
                print(f"Employee {employee_id} inserted successfully.")

def fetchEmployees(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    employees_ids = fetchEmployeesIDs(headers)

    for employee_id in employees_ids:
        fetchEmployee(employee_id, headers)
