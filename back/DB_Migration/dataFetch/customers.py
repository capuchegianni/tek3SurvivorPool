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

def fetchCustomersIDs(headers, backoff_factor=0.3):
    url = "https://soul-connection.fr/api/customers"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                if data:
                    return [customer["id"] for customer in data]
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch customer IDs (attempt {attempt}): {e}")


def fetchCustomerImage(customer_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/image"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.content
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch image for customer {customer_id} (attempt {attempt}): {e}")


def fetchCustomerPaymentsHistory(customer_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/payments_history"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.json()
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch payments history for customer {customer_id} (attempt {attempt}): {e}")


def fetchCustomerClothes(customer_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/customers/{customer_id}/clothes"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.json()
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch clothes for customer {customer_id} (attempt {attempt}): {e}")


def updateCustomerImage(customer_id, headers):
    old_image = db.customers.find_one(
        {"id": customer_id},
        {"_id": 0, "image": 1}
    )
    customer_image = fetchCustomerImage(customer_id, headers)

    if not customer_image:
        return

    fs = GridFS(db)

    if old_image:
        old_image = old_image.get("image")
        existing_image = fs.get(ObjectId(old_image)).read()
        if existing_image == customer_image:
            return
        fs.delete(ObjectId(old_image))

    image_id = fs.put(customer_image, filename=f"customer_{customer_id}.jpg")
    db.customers.update_one(
        {"id": customer_id},
        {"$set": {"image": image_id}}
    )
    debugPrint(f"Updated image for customer {customer_id}")


def updateCustomerPaymentsHistory(customer_id, headers):
    old_ph = db.customers.find_one(
        {"id": customer_id},
        {"_id": 0, "payments_history": 1}
    )
    customer_ph = fetchCustomerPaymentsHistory(customer_id, headers)
    find_ph_by_id = lambda id: next((ph for ph in old_ph if ph.get('id') == id), None)

    if old_ph:
        old_ph = old_ph.get("payments_history")
        for payment in customer_ph:
            existing_payment = find_ph_by_id(payment["id"])
            if existing_payment:
                if existing_payment != payment:
                    db.customers.update_one(
                        {"id": customer_id, "payments_history.id": payment["id"]},
                        {"$set": {"payments_history.$": payment}}
                    )
                    debugPrint(f"Updated payment {payment.get('id')} for customer {customer_id}")
            else:
                db.customers.update_one(
                    {"id": customer_id},
                    {"$push": {"payments_history": payment}}
                )
                debugPrint(f"Inserted payment {payment.get('id')} for customer {customer_id}")
    else:
        db.customers.update_one(
            {"id": customer_id},
            {"$set": {"payments_history": customer_ph}}
        )
        debugPrint(f"Inserted payments for customer {customer_id}")


def updateCustomerClothes(customer_id, headers):
    old_clothes = db.customers.find_one(
        {"id": customer_id},
        {"_id": 0, "clothes": 1}
    )
    customer_clothes = fetchCustomerClothes(customer_id, headers)
    find_cloth_by_id = lambda id: next((clothe for clothe in old_clothes if clothe.get('id') == id), None)

    if old_clothes:
        old_clothes = old_clothes.get("clothes")
        for clothe in customer_clothes:
            existing_clothe = find_cloth_by_id(clothe["id"])
            image = existing_clothe.pop("image", None)
            if existing_clothe:
                if existing_clothe != clothe:
                    clothe = {**clothe, "image": image}
                    db.customers.update_one(
                        {"id": customer_id, "clothes.id": clothe["id"]},
                        {"$set": {"clothes.$": clothe}}
                    )
                    debugPrint(f"Updated clothe {clothe.get('id')} for customer {customer_id}")
            else:
                db.customers.update_one(
                    {"id": customer_id},
                    {"$push": {"clothes": clothe}}
                )
                debugPrint(f"Inserted clothe {clothe.get('id')} for customer {customer_id}")
    else:
        db.customers.update_one(
            {"id": customer_id},
            {"$set": {"clothes": customer_clothes}}
        )
        debugPrint(f"Inserted clothes for customer {customer_id}")


def updateCustomer(customer_id, headers):
    url = f"https://soul-connection.fr/api/customers/{customer_id}"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                data = response.json()
                old_data = db.customers.find_one(
                    {"id": customer_id},
                    {"_id": 0, "image": 0, "payments_history": 0, "clothes": 0, "encounters": 0}
                )

                if old_data:
                    for key in data:
                        if key in old_data:
                            if old_data[key] == data[key]:
                                continue
                        db.customers.update_one(
                            {"id": customer_id},
                            {"$set": {key: data[key]}}
                        )
                        debugPrint(f"Updated {key} for customer {customer_id}")
                else:
                    db.customers.insert_one(data)
                    debugPrint(f"Inserted customer {customer_id}")

                updateCustomerImage(customer_id, headers)
                updateCustomerPaymentsHistory(customer_id, headers)
                updateCustomerClothes(customer_id, headers)
                return
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(0.3 * (2 ** attempt))
            print(f"Retrying to update customer {customer_id} (attempt {attempt}): {e}")


def fetchCustomers(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    customers_ids = fetchCustomersIDs(headers)

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(updateCustomer, customer_id, headers) for customer_id in customers_ids]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (customers): {e}")

    print("\033[92m - Fetching customers completed ✔\033[0m")
