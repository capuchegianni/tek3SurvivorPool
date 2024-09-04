from flask import Blueprint, jsonify, request, session
from dbConnection import db
import os
from dotenv import load_dotenv
import requests
from gridfs import GridFS
import base64

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

    return jsonify({ 'token': access_token })


@employees_blueprint.route('/api/employees', methods=['GET'])
def getEmployees():
    employees = db.employees.find()
    return jsonify([{
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname']
    } for employee in employees])


@employees_blueprint.route('/api/employees/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    employee = db.employees.find_one({ 'email': email })
    if employee and employee['password'] == password:
        session['employee_id'] = employee['id']
        request.headers.get()
        return getAccessToken(), 200
    else:
        return jsonify({"detail": "Invalid Email and Password combination."}), 401


@employees_blueprint.route('/api/employees/me', methods=['GET'])
def getMe():
    if 'employee_id' not in session:
        return jsonify({ 'details': 'User not connected' }), 401
    employee = db.employees.find_one({ 'id': session['employee_id'] })
    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birth_date': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work']
    })


@employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
def getEmployeeId(employee_id):
    print(employee_id)
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birth_date': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work']
    })


@employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
def getEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    image_data = GridFS(db).get(employee['image']).read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return jsonify({ 'image': base64_image })
