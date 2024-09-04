from API.API import createAPI
from DB_Migration.dbMigration import migrationLoop, signalHandler, stop_event
import threading
import signal

api = createAPI()

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signalHandler)

    migration_thread = threading.Thread(target=migrationLoop)
    migration_thread.start()

    try:
        api.run(debug=False)
    finally:
        stop_event.set()
        migration_thread.join()
