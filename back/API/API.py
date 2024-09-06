from datetime import timedelta
from flask import Flask
from .Routes.customers import customers_blueprint
from .Routes.employees import employees_blueprint
from .Routes.tips import tips_blueprint
from flask_cors import CORS
import os
from .JWT_manager import jwt

def createAPI():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_SESSION_COOKIE'] = True
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['SAMESITE'] = 'Lax'
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

    app.register_blueprint(customers_blueprint)
    app.register_blueprint(employees_blueprint)
    app.register_blueprint(tips_blueprint)

    return app
