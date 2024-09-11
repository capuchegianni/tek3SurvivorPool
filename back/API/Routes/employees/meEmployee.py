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

me_employees_blueprint = Blueprint('me_employees', __name__)

load_dotenv()

@me_employees_blueprint.route('/api/employees/me', methods=['GET'])
@jwt_required(locations='cookies')
# # @role_required('Coach')
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

@me_employees_blueprint.route('/api/employees/me', methods=['PUT'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def updateMe():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    if not employee:
        return jsonify({ 'details': 'Could not find the user.' }), 404

    data = request.get_json()
    if not data:
        return jsonify({ 'details': 'Invalid input' }), 400

    allowed_properties = {'email', 'name', 'surname', 'birth_date', 'gender', 'work'}

    for key in data.keys():
        if key not in allowed_properties:
            return jsonify({ 'details': f'Invalid property: {key}' }), 400
    new_email = data.get('email')
    if new_email and new_email != current_employee_email:
        existing_employee = db.employees.find_one({ 'email': new_email })
        if existing_employee:
            return jsonify({ 'details': 'Email already in use' }), 400

    db.employees.update_one({ 'email': current_employee_email }, { '$set': data })
    return jsonify({ 'details': 'Employee updated successfully' }), 200

@me_employees_blueprint.route('/api/employees/me', methods=['DELETE'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def deleteMe():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    if not employee:
        return jsonify({ 'details': 'Could not find the user.' }), 404

    db.employees.delete_one({ 'email': current_employee_email })
    return jsonify({ 'details': 'Employee deleted successfully' }), 200
