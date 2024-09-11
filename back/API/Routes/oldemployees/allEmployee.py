from flask import Blueprint, jsonify, request
from dbConnection import db
from dotenv import load_dotenv
from flask_jwt_extended import jwt_required
from ...JWT_manager import jwt
from ...decorators import role_required

all_employees_blueprint = Blueprint('all_employees', __name__)

load_dotenv()

@all_employees_blueprint.route('/api/employees', methods=['GET'])
@jwt_required()
@role_required('Admin')
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
@role_required('Admin')
def oneEmployee(customer_id):
    employee = db.employees.find_one({ 'id': int(customer_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    return jsonify({
        'id': employee['id'],
        'email': employee['email'],
        'name': employee['name'],
        'surname': employee['surname'],
        'birthDate': employee['birth_date'],
        'gender': employee['gender'],
        'work': employee['work']
    })
