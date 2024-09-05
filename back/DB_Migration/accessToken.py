import os
from dotenv import load_dotenv
import requests

load_dotenv()

def getAccessToken():
    api_key = os.getenv("API_KEY")
    api_email = os.getenv("API_EMAIL")
    api_password = os.getenv("API_PASSWORD")

    if not api_key or not api_email or not api_password:
        print("Missing environment variables. Please check your .env file.")
        return None

    url = "https://soul-connection.fr/api/employees/login"
    headers = {
        "X-Group-Authorization": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "email": api_email,
        "password": api_password
    }
    response = requests.post(url, headers=headers, json=payload)

    try:
        if response.status_code == 200:
            access_token = response.json().get("access_token")
        else:
            print(f"Failed to login: {response.status_code}")
            access_token = None
    except Exception as e:
        print(f"An error occurred: {e}")

    return access_token
