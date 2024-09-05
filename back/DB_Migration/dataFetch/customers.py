import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS
from bson.objectid import ObjectId
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

def fetchCustomersIDs(headers):
    url = "https://soul-connection.fr/api/customers"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            return [customer["id"] for customer in data]
    return []

def fetchCustomerImage(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/image"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        return response.content
    return None

def fetchCustomerPaymentsHistory(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/payments_history"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        return response.json()
    return []

def fetchCustomerClothes(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/clothes"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        return response.json()
    return []

def fetchCustomer(customer_id, headers):
    customer_image = fetchCustomerImage(customer_id, headers)

    customer_payments_history = fetchCustomerPaymentsHistory(customer_id, headers)
    customer_clothes = fetchCustomerClothes(customer_id, headers)
    url = f"https://soul-connection.fr/api/customers/{customer_id}"
    response = requests.get(url, headers=headers)

    if response and response.status_code == 200:
        data = response.json()
        if data:
            existing_customer = db.customers.find_one({"id": customer_id})
            update_data = {}
            add_to_set_data = {}

            if customer_image:
                existing_image_id = existing_customer.get("image") if existing_customer else None
                if existing_image_id:
                    existing_image = GridFS(db).get(ObjectId(existing_image_id)).read()
                    if existing_image != customer_image:
                        image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                        update_data["image"] = image_id
                else:
                    image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                    update_data["image"] = image_id

            if customer_payments_history:
                add_to_set_data["payments_history"] = {"$each": customer_payments_history}

            if customer_clothes:
                add_to_set_data["clothes"] = {"$each": customer_clothes}

            if existing_customer:
                update_operations = {}
                if update_data:
                    update_operations["$set"] = update_data
                if add_to_set_data:
                    update_operations["$addToSet"] = add_to_set_data

                db.customers.update_one(
                    {"id": customer_id}, update_operations
                )
            else:
                if customer_image:
                    image_id = GridFS(db).put(customer_image, filename=f"customer_{customer_id}.jpg")
                    data["image"] = image_id
                if customer_payments_history:
                    data["payments_history"] = customer_payments_history
                if customer_clothes:
                    data["clothes"] = customer_clothes
                db.customers.insert_one(data)

def fetchCustomers(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    customers_ids = fetchCustomersIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(fetchCustomer, customer_id, headers) for customer_id in customers_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (customers): {e}")

    print("\033[92m - Fetching customers completed ✔\033[0m")
