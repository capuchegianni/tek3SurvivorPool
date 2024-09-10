from datetime import timedelta
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

log_employees_blueprint = Blueprint('log_employees', __name__)

load_dotenv()

@log_employees_blueprint.route('/api/employees', methods=['GET'])
@jwt_required(locations='cookies')
def getEmployees():
    employees = db.employees.find()
    return jsonify([{
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname']
    } for employee in employees])


def userConnected(email, password):
    api_key = os.getenv("API_KEY")
    if not api_key:
        return { 'details': 'An environment variable is missing.' }, 500

    url = "https://soul-connection.fr/api/employees/login"
    headers = {
        "X-Group-Authorization": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "email": email,
        "password": password
    }

    response = requests.post(url, headers=headers, json=payload)
    return response.ok, response.status_code

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

@log_employees_blueprint.route('/api/employees/login', methods=['POST'])
def login():
    token = request.cookies.get('access_token_cookie')

    if token:
        return jsonify({ 'details': 'You are already connected.' }), 200

    data = request.get_json()
    email = data['email']
    password = data['password']

    if not email or not password:
        return jsonify({ 'details': 'Please provide an email and a password.' }), 400

    employee = db.employees.find_one({ 'email': email })
    if not employee:
        return jsonify({ 'details': 'Wrong password or email.' }), 401

    if 'password' not in employee:
        isConnected, statusCode = userConnected(email, password)
        if not isConnected:
            return jsonify({ 'details': 'Could not connect to the server.' }), statusCode
        db.employees.find_one_and_update(
            { 'email': email },
            { '$set': { 'password': hash_password(password) } }
        )
        employee['password'] = hash_password(password)

    if not check_password(password, employee['password']):
        return jsonify({ 'details': 'Wrong password or email.' }), 401

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    response = make_response(jsonify({ 'details': 'Login successful' }))
    set_access_cookies(response=response, encoded_access_token=access_token, max_age=None)
    return response

@log_employees_blueprint.route('/api/employees/logout', methods=['POST'])
@jwt_required(locations='cookies')
def logout():
    token = request.cookies.get('access_token_cookie')
    if not token:
        return jsonify({ 'details': 'You are not connected.' }), 401

    try:
        decode_token(token)
    except NoAuthorizationError:
        return jsonify({'details': 'You are not connected.'}), 401
    response = make_response(jsonify({ 'details': 'Logout successful' }))
    unset_jwt_cookies(response)
    return response

@log_employees_blueprint.route('/api/employees/is_connected', methods=['GET'])
@jwt_required(locations=['headers', 'cookies'], optional=True)
def isConnected():
    try:
        identity = get_jwt_identity()
        if identity:
            return jsonify({'details': 'Connected'}), 200
        else:
            return jsonify({'details': 'Not connected'}), 401
    except NoAuthorizationError:
        return jsonify({'details': 'Not connected'}), 401


@employees_blueprint.route('/api/employees/me', methods=['GET'])
@jwt_required(locations='cookies')
def getMe():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    if not employee:
        return jsonify({ 'details': 'Could not find the user.' }), 404

    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birth_date': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work'],
        'events': employee['events']
    })


@employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
@jwt_required(locations='cookies')
def getEmployeeId(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birth_date': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work'],
        'events': employee['events']
    })


@employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
@jwt_required(locations='cookies')
def getEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    image_data = GridFS(db).get(employee['image']).read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return jsonify({ 'image': base64_image })

@employees_blueprint.route('/api/employees/has_permissions/<role>', methods=['GET'])
@jwt_required(locations='cookies')
def hasPermissions(role):
    user_email = get_jwt_identity()
    user = db.employees.find_one({ 'email': user_email })

    if not user:
        return jsonify({'details': 'User not found'}), 404

    user_role = user.get('work')
    if user_role in ADMIN_ROLES or user_role == role:
        return jsonify({ 'details': 'Access granted' }), 200
    else:
        return jsonify({ 'details': 'Access forbidden: insufficient permissions' }), 403