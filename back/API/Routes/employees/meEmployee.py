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

@employees_blueprint.route('/api/employees/me', methods=['POST'])
def createMe():
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
    return jsonify(new_employee), 201

@employees_blueprint.route('/api/employees/me', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Coach')
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
        'work': employee['work']
    })

@employees_blueprint.route('/api/employees/me', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Coach')
def updateMe():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    if not employee:
        return jsonify({ 'details': 'Could not find the user.' }), 404

    data = request.get_json()
    if not data:
        return jsonify({ 'details': 'Invalid input' }), 400

    db.employees.update_one({ 'email': current_employee_email }, { '$set': data })
    return jsonify({ 'details': 'Employee updated successfully' }), 200

@employees_blueprint.route('/api/employees/me', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Coach')
def deleteMe():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    if not employee:
        return jsonify({ 'details': 'Could not find the user.' }), 404

    db.employees.delete_one({ 'email': current_employee_email })
    return jsonify({ 'details': 'Employee deleted successfully' }), 200
