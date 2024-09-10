from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers', methods=['POST'])
@jwt_required(locations='cookies')
@role_required('Admin')
def createCustomer():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    new_customer = {
        'id': data.get('id'),
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birth_date'),
        'gender': data.get['gender'],
        'description': data.get['description'],
        'astrological_sign': data.get['astrological_sign'],
        'phone_number': data.get['phone_number'],
        'address': data.get['address']
    }

@customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
@jwt_required(locations='cookies')
def getCustomerId(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    return jsonify({
        'id': customer['id'],
        'email': customer['email'],
        'name': customer['name'],
        'surname': customer['surname'],
        'birth_date': customer['birth_date'],
        'gender': customer['gender'],
        'description': customer['description'],
        'astrological_sign': customer['astrological_sign'],
        'phone_number': customer['phone_number'],
        'address': customer['address']
    })

@customers_blueprint.route('/api/customers/<customer_id>', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Admin')
def updateCustomer(customer_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_customer = {
        'email': data.get('email'),
        'name': data.get('name'),
        'surname': data.get('surname'),
        'birth_date': data.get('birth_date'),
        'gender': data.get['gender'],
        'description': data.get['description'],
        'astrological_sign': data.get['astrological_sign'],
        'phone_number': data.get['phone_number'],
        'address': data.get['address']
    }

@customers_blueprint.route('/api/customers/<customer_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Admin')
def deleteCustomer(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    db.customers.delete_one({ 'id': int(customer_id) })
    return jsonify({'details': 'Customer deleted'})
