import os
from dotenv import load_dotenv
import requests
from dbConnection import db
from gridfs import GridFS
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

def fetchClothesIDsFromCustomer(customer_id):
    customers_collection = db['customers']
    customer_clothes = customers_collection.find_one({"id": customer_id}, {"clothes": 1})
    clothes_ids = []

    for clothe in customer_clothes['clothes']:
        clothes_ids.append(clothe['id'])

    return clothes_ids

def fetchCustomersIDs():
    customers_collection = db['customers']
    customer_ids = customers_collection.find({}, {"id": 1})

    return [customer['id'] for customer in customer_ids]

def fetchClotheImage(clothe_id, customer_id, headers):
    url = f"https://soul-connection.fr/api/clothes/{clothe_id}/image"

    if not db.customers.find_one({"id": customer_id, "clothes.id": clothe_id}, {"clothes.$": 1})["clothes"][0].get("image"):
        response = requests.get(url, headers=headers)

        if response and response.status_code == 200:
            image_id = GridFS(db).put(response.content, filename=f"clothe_{clothe_id}.jpg")
            db.customers.update_one(
                {"id": customer_id, "clothes.id": clothe_id},
                {"$set": {"clothes.$.image": image_id}}
            )

def fetchClothes(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Group-Authorization": os.getenv("API_KEY")
    }
    customers_ids = fetchCustomersIDs()

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for customer_id in customers_ids:
            clothes_ids = fetchClothesIDsFromCustomer(customer_id)
            for clothe_id in clothes_ids:
                futures.append(executor.submit(fetchClotheImage, clothe_id, customer_id, headers))

        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred (clothes): {e}")

    print("\033[92m - Fetching clothes completed ✔\033[0m")
