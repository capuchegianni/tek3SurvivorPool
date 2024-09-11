from datetime import timedelta
from flask import Flask
from .Routes.customers.allCustomers import all_customers_blueprint
from .Routes.customers.clothesCustomer import clothes_customers_blueprint
from .Routes.customers.idCustomer import id_customers_blueprint
from .Routes.customers.imageCustomer import image_customers_blueprint
from .Routes.customers.paymentsCustomers import payments_customers_blueprint

from .Routes.employees.allEmployee import all_employees_blueprint
from .Routes.employees.idEmployee import id_employees_blueprint
from .Routes.employees.imageEmployee import image_employees_blueprint
from .Routes.employees.logEmployee import log_employees_blueprint
from .Routes.employees.meEmployee import me_employees_blueprint
from .Routes.employees.permissionsEmployee import permissions_employees_blueprint

from .Routes.events import events_blueprint
from .Routes.tips import tips_blueprint
from flask_cors import CORS
import os
from .JWT_manager import jwt

def createAPI():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers']
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_SESSION_COOKIE'] = True
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['SAMESITE'] = 'Lax'
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})


    app.register_blueprint(all_customers_blueprint)
    app.register_blueprint(clothes_customers_blueprint)
    app.register_blueprint(id_customers_blueprint)
    app.register_blueprint(image_customers_blueprint)
    app.register_blueprint(payments_customers_blueprint)

    app.register_blueprint(all_employees_blueprint)
    app.register_blueprint(id_employees_blueprint)
    app.register_blueprint(image_employees_blueprint)
    app.register_blueprint(log_employees_blueprint)
    app.register_blueprint(me_employees_blueprint)
    app.register_blueprint(permissions_employees_blueprint)

    app.register_blueprint(events_blueprint)
    app.register_blueprint(tips_blueprint)

    return app
