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

@employees_blueprint.route('/api/employees', methods=['POST'])
@jwt_required(locations='cookies')
@role_required('Admin')
def createEmployee():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    new_employee = {
        'id': data.get('id'),
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birth_date'),
        'gender': data.get('gender'),
        'work': data.get('work')
    }


@employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Admin')
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

@employees_blueprint.route('/api/employees/<employee_id>', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Admin')
def updateEmployee(employee_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_employee = {
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birth_date'),
        'gender': data.get('gender'),
        'work': data.get('work')
    }

    result = db.employees.update_one({ 'id': int(employee_id) }, { '$set': updated_employee })
    if result.matched_count == 0:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify({'details': 'Employee updated successfully'}), 200

@employees_blueprint.route('/api/employees/<employee_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Admin')
def deleteEmployee(employee_id):
    result = db.employees.delete_one({ 'id': int(employee_id) })
    if result.deleted_count == 0:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify({'details': 'Employee deleted successfully'}), 200
