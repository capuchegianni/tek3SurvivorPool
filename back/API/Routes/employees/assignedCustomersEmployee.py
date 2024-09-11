from flask import Blueprint, jsonify, request
from dbConnection import db
from flask_jwt_extended import jwt_required
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

assigned_customers_employee_blueprint = Blueprint('assigned_customers_employee', __name__)

@assigned_customers_employee_blueprint.route('/api/employees/<employee_id>/assignedCustomers', methods=['GET'])
@jwt_required()
# @role_required('Coach')
def getAssignedCustomers(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify(employee['assigned_customers'])

@assigned_customers_employee_blueprint.route('/api/employees/<employee_id>/assignedCustomers', methods=['POST'])
@jwt_required()
# @role_required('Coach')
def assignCustomer(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    data = request.json
    customer_id = data.get('customer_id')

    if not customer_id:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    if customer_id in employee['assigned_customers']:
        return jsonify({'details': 'Customer already assigned'}), 400

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$push': {'assigned_customers': customer_id}}
    )

    return jsonify({'details': 'Customer assigned successfully'}), 201

@assigned_customers_employee_blueprint.route('/api/employees/<employee_id>/assignedCustomers/<customer_id>', methods=['DELETE'])
@jwt_required()
# @role_required('Coach')
def unassignCustomer(employee_id, customer_id):
    employee = db.employees.find_one({'id': int(employee_id)})

    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    if customer_id not in employee['assigned_customers']:
        return jsonify({'details': 'Customer not assigned'}), 400

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$pull': {'assigned_customers': customer_id}}
    )

    return jsonify({'details': 'Customer unassigned successfully'}), 200
