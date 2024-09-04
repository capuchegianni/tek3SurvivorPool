import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS
from bson.objectid import ObjectId

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
            existing_employee = db.employees.find_one({"id": employee_id})
            if existing_employee:
                if employee_image:
                    existing_image_id = existing_employee.get("image")
                    if existing_image_id:
                        existing_image = GridFS(db).get(ObjectId(existing_image_id)).read()
                        if existing_image != employee_image:
                            image_id = GridFS(db).put(employee_image, filename=f"employee_{employee_id}.jpg")
                            data["image"] = image_id
                        else:
                            data["image"] = existing_image_id
                    else:
                        image_id = GridFS(db).put(employee_image, filename=f"employee_{employee_id}.jpg")
                        data["image"] = image_id
                db.employees.update_one(
                    {"id": employee_id}, {"$set": data}
                )
                print(f"Employee {employee_id} updated successfully.")
            else:
                if employee_image:
                    image_id = GridFS(db).put(employee_image, filename=f"employee_{employee_id}.jpg")
                    data["image"] = image_id
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
