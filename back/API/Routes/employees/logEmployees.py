from datetime import timedelta
from flask import Blueprint, jsonify, request, make_response
from dbConnection import db
import os
from dotenv import load_dotenv
import requests
from flask_jwt_extended import create_access_token, decode_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_jwt_extended.exceptions import NoAuthorizationError
import bcrypt
from ...JWT_manager import jwt
from datetime import timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity

log_employees_blueprint = Blueprint('log_employees', __name__)

load_dotenv()

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
    response = make_response(jsonify({ 'details': 'Login successful', 'token': access_token }))
    set_access_cookies(response=response, encoded_access_token=access_token, max_age=None)

    return response


@log_employees_blueprint.route('/api/employees/logout', methods=['POST'])
@jwt_required()
def logout():
    token = request.cookies.get('access_token_cookie')
    if not token:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'details': 'You are not connected.'}), 401
        token = auth_header.split(' ')[1]

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
