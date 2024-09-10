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

def fetchClothesIDsFromCustomer(customer_id):
    customer_clothes_ids = db.customers.find_one(
        {"id": customer_id},
        {"_id": 0, "clothes.id": 1}
    )

    if not customer_clothes_ids:
        return []

    customer_clothes_ids = customer_clothes_ids.get("clothes")

    return [clothe["id"] for clothe in customer_clothes_ids]


def fetchCustomersIDs():
    customers_ids = db.customers.find(
        {},
        {"_id": 0, "id": 1}
    )

    if not customers_ids:
        return []

    return [customer["id"] for customer in customers_ids]


def fetchClotheImage(clothe_id, headers, backoff_factor=0.3):
    url = f"https://soul-connection.fr/api/clothes/{clothe_id}/image"
    attempt = 0

    while True:
        try:
            response = requests.get(url, headers=headers)
            if response and response.status_code == 200:
                return response.content
            return None
        except (RequestException, IncompleteRead) as e:
            attempt += 1
            time.sleep(backoff_factor * (2 ** attempt))
            print(f"Retrying to fetch image for clothe {clothe_id} (attempt {attempt}): {e}")


def updateClotheImage(clothe_id, customer_id, headers):
    customer_clothe = db.customers.find_one(
        {"id": customer_id, "clothes.id": clothe_id},
        {"_id": 0, "clothes.$": 1}
    )
    if not customer_clothe or not customer_clothe["clothes"]:
        return
    old_image = customer_clothe["clothes"][0].get("image")
    clothe_image = fetchClotheImage(clothe_id, headers)

    if not clothe_image:
        return

    fs = GridFS(db)

    if old_image:
        existing_image = fs.get(ObjectId(old_image)).read()
        if existing_image == clothe_image:
            return
        fs.delete(ObjectId(old_image))

    image_id = fs.put(clothe_image, filename=f"clothe_{clothe_id}.jpg")
    db.customers.update_one(
        {"id": customer_id, "clothes.id": clothe_id},
        {"$set": {"clothes.$.image": image_id}}
    )
    debugPrint(f"Updated image for clothe {clothe_id}")


def fetchClothes(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    customers_ids = fetchCustomersIDs()

    with ThreadPoolExecutor(max_workers=10) as executor:
        for customer_id in customers_ids:
            customer_clothes_ids = fetchClothesIDsFromCustomer(customer_id)
            futures = [executor.submit(updateClotheImage, clothe_id, customer_id, headers) for clothe_id in customer_clothes_ids]
            for future in futures:
                try:
                    future.result()
                except Exception as e:
                    print(f"Error occurred (clothes): {e}")

    print("\033[92m - Fetching clothes completed ✔\033[0m")
