from flask import Blueprint, jsonify, request
from dbConnection import db
from pymongo import DESCENDING
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

id_customers_blueprint = Blueprint('id_customers', __name__)

@id_customers_blueprint.route('/api/customers', methods=['POST'])
@jwt_required()
@role_required('Admin')
def createCustomer():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400
    last_customer = db.employees.find_one(sort=[("id", DESCENDING)])
    new_id = last_customer['id'] + 1 if last_customer else 1

    new_customer = {
        'id': new_id,
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birthDate'),
        'gender': data.get('gender'),
        'description': data.get('description'),
        'astrological_sign': data.get('astrologicalSign'),
        'phone_number': data.get('phoneNumber'),
        'address': data.get('address')
    }
    db.customers.insert_one(new_customer)
    return jsonify({
        'id': new_customer['id'],
        'email': new_customer['email'],
        'name': new_customer['name'],
        'surname': new_customer['surname'],
        'birthDate': new_customer['birth_date'],
        'gender': new_customer['gender'],
        'description': new_customer['description'],
        'astrologicalSign': new_customer['astrological_sign'],
        'phoneNumber': new_customer['phone_number'],
        'address': new_customer['address']
    }), 201

@id_customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerInfo(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    return jsonify({
        'id': customer['id'],
        'email': customer['email'],
        'name': customer['name'],
        'surname': customer['surname'],
        'birthDate': customer['birth_date'],
        'gender': customer['gender'],
        'description': customer['description'],
        'astrologicalSign': customer['astrological_sign'],
        'phoneNumber': customer['phone_number'],
        'address': customer['address']
    })

@id_customers_blueprint.route('/api/customers/<customer_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def updateCustomer(customer_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    update_fields = {}
    if 'email' in data:
        update_fields['email'] = data['email']
    if 'name' in data:
        update_fields['name'] = data['name']
    if 'surname' in data:
        update_fields['surname'] = data['surname']
    if 'birthDate' in data:
        update_fields['birth_date'] = data['birth_date']
    if 'gender' in data:
        update_fields['gender'] = data['gender']
    if 'description' in data:
        update_fields['description'] = data['description']
    if 'astrologicalSign' in data:
        update_fields['astrological_sign'] = data['astrological_sign']
    if 'phoneNumber' in data:
        update_fields['phone_number'] = data['phone_number']
    if 'address' in data:
        update_fields['address'] = data['address']

    print(update_fields)
    if not update_fields:
        return jsonify({'details': 'No valid fields to update'}), 400

    result = db.customers.update_one(
        {'id': int(customer_id)},
        {'$set': update_fields}
    )

    if result.matched_count == 0:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify({'details': 'Customer updated successfully'}), 200

@id_customers_blueprint.route('/api/customers/<customer_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def deleteCustomer(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    db.customers.delete_one({ 'id': int(customer_id) })
    return jsonify({'details': 'Customer deleted'})
