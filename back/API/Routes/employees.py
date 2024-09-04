from flask import Blueprint, jsonify, request, session
from ..dbConnection import db
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
import requests
from ..serialize import serialize_mongo_id

employees_blueprint = Blueprint('employees', __name__)

load_dotenv()

def getAccessToken():
    api_key = os.getenv("API_KEY")
    api_email = os.getenv("API_EMAIL")
    api_password = os.getenv("API_PASSWORD")

    if not api_key or not api_email or not api_password:
        print("Missing environment variables. Please check your .env file.")
        return None

    url = "https://soul-connection.fr/api/employees/login"
    headers = {
        "X-Group-Authorization": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "email": api_email,
        "password": api_password
    }
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        response_json = response.json()
        if 'access_token' in response_json:
            access_token = response_json.get('access_token')
        else:
            print(f"Login failed: {response_json.get('error', 'Unknown error')}")
            access_token = None
    else:
        print(f"Failed to login: {response.status_code}\n")

    return access_token


@employees_blueprint.route('/api/employees', methods=['GET'])
def getEmployees():
    employees = db.Employees.find()
    return jsonify([serialize_mongo_id(employee) for employee in employees])


@employees_blueprint.route('/api/employees/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    employee = db.Employees.find_one({'email': email})
    if employee and employee['password'] == password:
        session['employee_id'] = str(employee['_id'])
        request.headers.get()
        return getAccessToken(), 200
    else:
        return jsonify({"detail": "Invalid Email and Password combination."}), 401


@employees_blueprint.route('/api/employees/me', methods=['GET'])
def getMe():
    employee = db.Employees.find_one({'_id': ObjectId(session['employee_id'])})
    return jsonify(serialize_mongo_id(employee))


@employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
def getEmployeeId(employee_id):
    employee = db.Employees.find_one({'_id': ObjectId(employee_id)})
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify(serialize_mongo_id(employee))


@employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
def getEmployeeImage(employee_id):
    employee = db.Employees.find_one({'_id': ObjectId(employee_id)})
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return employee['image']
