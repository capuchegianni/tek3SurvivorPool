from flask import Blueprint, jsonify, request, session
from dbConnection import db
from bson.objectid import ObjectId

employees_blueprint = Blueprint('employees', __name__)


@employees_blueprint.route('/api/employees', methods=['GET'])
def getEmployees():
    employees = db.Employees.find()
    return jsonify(list(employees))


@employees_blueprint.route('/api/employees/login', methods=['POST'])
def login():
    #might change the get of email and password
    data = request.get_json()
    email = data['email']
    password = data['password']

    employee = db.Employees.find_one({'email': email})
    if employee and employee['password'] == password:
        session['employee_id'] = str(employee['_id'])
        return jsonify(employee), 200
    else:
        return jsonify({"detail": "Invalid Email and Password combination."}), 401


@employees_blueprint.route('/api/employees/me', methods=['GET'])
def getMe():
    employee = db.Employees.find_one({'_id': ObjectId(session['employee_id'])})
    return jsonify(employee)


@employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
def getEmployeeId(employee_id):
    employee = db.Employees.find_one({'_id': ObjectId(employee_id)})
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return jsonify(employee)


@employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
def getEmployeeImage(employee_id):
    employee = db.Employees.find_one({'_id': ObjectId(employee_id)})
    if employee is None:
        return jsonify({'error': 'Employee not found'}), 404
    return employee['image']