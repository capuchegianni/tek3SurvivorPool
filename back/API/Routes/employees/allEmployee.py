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

all_employees_blueprint = Blueprint('all_employees', __name__)

load_dotenv()

@all_employees_blueprint.route('/api/employees', methods=['GET'])
@jwt_required()
# @role_required('Admin')
def getEmployees():
    employees = db.employees.find()
    return jsonify([{
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname']
    } for employee in employees])


@all_employees_blueprint.route('/api/employees/<customer_id>', methods=['POST'])
@jwt_required()
# @role_required('Admin')
def oneEmployee(customer_id):
    employee = db.employees.find_one({ 'id': int(customer_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birth_date': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work']
    })
