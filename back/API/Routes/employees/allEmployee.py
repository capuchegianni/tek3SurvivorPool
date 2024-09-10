from flask import Blueprint, jsonify, request, make_response
from dbConnection import db
import os
from dotenv import load_dotenv
import requests
from gridfs import GridFS
import base64
from flask_jwt_extended import create_access_token, decode_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_jwt_extended.exceptions import NoAuthorizationError
import bcrypt
from ...JWT_manager import jwt
from datetime import timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required
from ...decorators import ADMIN_ROLES

employees_blueprint = Blueprint('employees', __name__)

load_dotenv()

@employees_blueprint.route('/api/employees', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Admin')
def getEmployees():
    employees = db.employees.find()
    return jsonify([{
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname']
    } for employee in employees])

