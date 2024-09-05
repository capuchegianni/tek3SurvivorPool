from API.API import createAPI
from dbConnection import dbConnection
from DB_Migration.dbMigration import migrationLoop, stop_event
import threading
import signal
import os

dbConnection()

api = createAPI()

def signalHandler(sig, frame):
    print("\r\033[KExiting...")
    os._exit(0)

def main():
    signal.signal(signal.SIGINT, signalHandler)

    migration_thread = threading.Thread(target=migrationLoop)
    migration_thread.start()

    try:
        api.run(debug=False)
    finally:
        stop_event.set()
        migration_thread.join()

if __name__ == '__main__':
    main()
