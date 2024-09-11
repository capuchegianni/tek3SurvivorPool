from .Routes.customers.delCustomers import del_customers_blueprint
from .Routes.customers.getCustomers import get_customers_blueprint
from .Routes.customers.postCustomers import post_customers_blueprint
from .Routes.customers.putCustomers import put_customers_blueprint

from .Routes.employees.delEmployees import del_employees_blueprint
from .Routes.employees.getEmployees import get_employees_blueprint
from .Routes.employees.postEmployees import post_employees_blueprint
from .Routes.employees.putEmployees import put_employees_blueprint
from .Routes.employees.logEmployees import log_employees_blueprint

from .Routes.tips.delTips import del_tips_blueprint
from .Routes.tips.getTips import get_tips_blueprint
from .Routes.tips.postTips import post_tips_blueprint
from .Routes.tips.putTips import put_tips_blueprint

from flask import Flask
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


    app.register_blueprint(del_customers_blueprint)
    app.register_blueprint(get_customers_blueprint)
    app.register_blueprint(post_customers_blueprint)
    app.register_blueprint(put_customers_blueprint)

    app.register_blueprint(del_employees_blueprint)
    app.register_blueprint(get_employees_blueprint)
    app.register_blueprint(post_employees_blueprint)
    app.register_blueprint(put_employees_blueprint)
    app.register_blueprint(log_employees_blueprint)

    app.register_blueprint(del_tips_blueprint)
    app.register_blueprint(get_tips_blueprint)
    app.register_blueprint(post_tips_blueprint)
    app.register_blueprint(put_tips_blueprint)

    return app
