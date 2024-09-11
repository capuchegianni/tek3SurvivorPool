from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

saved_clothes_customer_blueprint = Blueprint('saved_clothes_customer', __name__)

@saved_clothes_customer_blueprint.route('/api/customers/<customer_id>/saved_clothes', methods=['GET'])
@jwt_required()
# @role_required('Customer')
def getCustomerSavedClothes(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify(customer.get('saved_clothes', []))

@saved_clothes_customer_blueprint.route('/api/customers/<customer_id>/saved_clothes', methods=['POST'])
@jwt_required()
# @role_required('Customer')
def addCustomerSavedClothe(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'saved_clothes': data.get('clothe_id')}}
    )
    return jsonify({'details': 'Clothe added successfully'}), 201

@saved_clothes_customer_blueprint.route('/api/customers/<customer_id>/saved_clothes/<clothe_id>', methods=['DELETE'])
@jwt_required()
# @role_required('Customer')
def deleteCustomerSavedClothe(customer_id, clothe_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    if clothe_id not in customer.get('saved_clothes', []):
        return jsonify({'details': 'Clothe not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'saved_clothes': clothe_id}}
    )
    return jsonify({'details': 'Clothe deleted successfully'}), 200
