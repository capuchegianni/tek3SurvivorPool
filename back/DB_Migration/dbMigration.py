import time
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from .accessToken import getAccessToken
from .dataFetch.clothes import fetchClothes
from .dataFetch.customers import fetchCustomers
from .dataFetch.employees import fetchEmployees
from .dataFetch.encounters import fetchEncounters
from .dataFetch.events import fetchEvents
from .dataFetch.tips import fetchTips

stop_event = threading.Event()

def countdown(minutes):
    total_seconds = minutes * 60

    while total_seconds > 0 and not stop_event.is_set():
        mins, secs = divmod(total_seconds, 60)
        timer = f"{mins:02d}:{secs:02d}"
        print(f"\033[1;93mRetrieve data in: {timer}\033[0m", end='\r')
        time.sleep(1)
        total_seconds -= 1

    print("\033[1;93mRetrieve data in: 00:00\033[0m", end='\r')
    print(" " * 30, end='\r')

def clearAndExit():
    print("\r\033[KExiting...")
    sys.exit(0)

def retrieveData():
    access_token = getAccessToken()

    if not access_token:
        print("Failed to retrieve access token. Exiting...")
        sys.exit(0)

    initial_fetch_functions = [
        fetchEmployees,
        fetchCustomers
    ]

    subsequent_fetch_functions = [
        fetchEvents,
        fetchEncounters,
        fetchClothes,
        fetchTips
    ]

    start_time = time.time()

    with ThreadPoolExecutor(max_workers=len(initial_fetch_functions)) as executor:
        futures = [executor.submit(func, access_token) for func in initial_fetch_functions]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred: {e}")

    with ThreadPoolExecutor(max_workers=len(subsequent_fetch_functions)) as executor:
        futures = [executor.submit(func, access_token) for func in subsequent_fetch_functions]
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error occurred: {e}")

    total_time = time.time() - start_time
    print(f"\033[1;94m\nTotal time to fetch all data: {total_time:.2f} seconds\n\033[0m")

def migrationLoop():
    while not stop_event.is_set():
        try:
            retrieveData()
            countdown(minutes=30)
        except EOFError:
            clearAndExit()
