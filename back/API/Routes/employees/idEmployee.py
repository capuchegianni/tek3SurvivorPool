from flask import Blueprint, jsonify, request, make_response
from dbConnection import db
from pymongo import DESCENDING
import os
from dotenv import load_dotenv
import requests
from gridfs import GridFS
from flask_jwt_extended import create_access_token, decode_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from ...JWT_manager import jwt
from ...decorators import role_required

id_employees_blueprint = Blueprint('id_employees', __name__)

load_dotenv()

@id_employees_blueprint.route('/api/employees', methods=['POST'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def createEmployee():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400
    last_employee = db.employees.find_one(sort=[("id", DESCENDING)])
    new_id = last_employee['id'] + 1 if last_employee else 1

    new_employee = {
        'id': new_id,
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birth_date'),
        'gender': data.get('gender'),
        'work': data.get('work')
    }
    db.employees.insert_one(new_employee)
    return jsonify({'details': 'Employee created successfully'}), 201

@id_employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Admin')
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
        'work': employee['work']
    })

@id_employees_blueprint.route('/api/employees/<employee_id>', methods=['PUT'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def updateEmployee(employee_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_employee = {}
    if data.get('email'):
        updated_employee['email'] = data.get('email')
    if data.get('name'):
        updated_employee['name'] = data.get('name')
    if data.get('surname'):
        updated_employee['surname'] = data.get('surname')
    if data.get('birth_date'):
        updated_employee['birth_date'] = data.get('birth_date')
    if data.get('gender'):
        updated_employee['gender'] = data.get('gender')
    if data.get('work'):
        updated_employee['work'] = data.get('work')

    result = db.employees.update_one(
        { 'id': int(employee_id) },
        { '$set': updated_employee }
    )
    if result.matched_count == 0:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify({'details': 'Employee updated successfully'}), 200

@id_employees_blueprint.route('/api/employees/<employee_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def deleteEmployee(employee_id):
    result = db.employees.delete_one({ 'id': int(employee_id) })
    if result.deleted_count == 0:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify({'details': 'Employee deleted successfully'}), 200
