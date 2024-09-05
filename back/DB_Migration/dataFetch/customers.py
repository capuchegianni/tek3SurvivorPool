import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS
from bson.objectid import ObjectId

load_dotenv()

def fetchCustomersIDs(headers):
    url = "https://soul-connection.fr/api/customers"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            return [customer["id"] for customer in data]
    else:
        return []

def fetchCustomerImage(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/image"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.content
    else:
        return None

def fetchCustomerPaymentsHistory(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/payments_history"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return []

def fetchCustomerClothes(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/clothes"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return []

def fetchCustomer(customer_id, headers):
    customer_image = fetchCustomerImage(customer_id, headers)
    customer_payments_history = fetchCustomerPaymentsHistory(customer_id, headers)
    customer_clothes = fetchCustomerClothes(customer_id, headers)
    url = f"https://soul-connection.fr/api/customers/{customer_id}"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data:
            existing_customer = db.customers.find_one({"id": customer_id})
            if existing_customer:
                if customer_image:
                    existing_image_id = existing_customer.get("image")
                    if existing_image_id:
                        existing_image = GridFS(db).get(ObjectId(existing_image_id)).read()
                        if existing_image != customer_image:
                            image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                            data["image"] = image_id
                        else:
                            data["image"] = existing_image_id
                    else:
                        image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                        data["image"] = image_id
                if customer_payments_history:
                    data["payments_history"] = customer_payments_history
                if customer_clothes:
                    data["clothes"] = customer_clothes
                db.customers.update_one(
                    {"id": customer_id}, {"$set": data}
                )
                print(f"Customer {customer_id} updated successfully.")
            else:
                if customer_image:
                    image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                    data["image"] = image_id
                if customer_payments_history:
                    data["payments_history"] = customer_payments_history
                if customer_clothes:
                    data["clothes"] = customer_clothes
                db.customers.insert_one(data)
                print(f"Customer {customer_id} inserted successfully.")

def fetchCustomers(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    customers_ids = fetchCustomersIDs(headers)

    for customer_id in customers_ids:
        fetchCustomer(customer_id, headers)
