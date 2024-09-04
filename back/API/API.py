from flask import Flask
from .Routes.clothes import clothes_blueprint
from .Routes.customers import customers_blueprint
from .Routes.employees import employees_blueprint
from .Routes.encounters import encounters_blueprint
from .Routes.events import events_blueprint
from .Routes.tips import tips_blueprint
from .dbConnection import dbConnection
from flask_cors import CORS

def createAPI():
    app = Flask(__name__)
    CORS(app, origins=['http://localhost:3000'])

    dbConnection()

    app.register_blueprint(clothes_blueprint)
    app.register_blueprint(customers_blueprint)
    app.register_blueprint(employees_blueprint)
    app.register_blueprint(encounters_blueprint)
    app.register_blueprint(events_blueprint)
    app.register_blueprint(tips_blueprint)

    return app
