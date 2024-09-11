from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

all_customers_blueprint = Blueprint('all_customers', __name__)

@all_customers_blueprint.route('/api/customers', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def getCustomers():

    customers = db.customers.find()
    return jsonify([{
        'id': customer['id'],
        'email': customer['email'],
        'name': customer['name'],
        'surname': customer['surname']
    } for customer in customers])

@all_customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def oneCustomer(customer_id):
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