import time
import sys
import threading
from .accessToken import getAccessToken
from .dataFetch.customers import fetchCustomers
from .dataFetch.employees import fetchEmployees
from .dataFetch.encounters import fetchEncounters
from .dataFetch.events import fetchEvents
from .dataFetch.tips import fetchTips

stop_event = threading.Event()

def countdown(minutes):
    total_seconds = minutes * 60

    while total_seconds > 0 and not stop_event.is_set():
        minutes, seconds = divmod(total_seconds, 60)
        print(f"Retrieve data in: {minutes:02d}:{seconds:02d}", end='\r')
        time.sleep(1)
        total_seconds -= 1

def clearAndExit():
    print("\r\033[KExiting...")
    sys.exit(0)

def signalHandler(sig, frame):
    stop_event.set()
    clearAndExit()

def retrieveData():
    access_token = getAccessToken()

    if not access_token:
        print("Failed to retrieve access token. Exiting...")
        sys.exit(0)

    fetchCustomers(access_token)
    fetchEmployees(access_token)
    fetchEncounters(access_token)
    fetchEvents(access_token)
    fetchTips(access_token)

    return True

def migrationLoop():
    while not stop_event.is_set():
        try:
            if retrieveData():
                countdown(minutes=30)
        except EOFError:
            clearAndExit()
