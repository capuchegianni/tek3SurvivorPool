from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers', methods=['GET'])
def getCustomers():
    customers = db.Customers.find()
    return jsonify(list(customers))


@customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
def getCustomerId(customer_id):
    customer = db.Customers.find_one({'_id': ObjectId(customer_id)})
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(customer)


@customers_blueprint.route('/api/customers/<customer_id>/image', methods=['GET'])
def getCustomerImage(customer_id):
    customer = db.Customers.find_one({'_id': ObjectId(customer_id)})
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    return customer['image']


@customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['GET'])
def getCustomerPaymentsHistory(customer_id):
    customer = db.Customers.find_one({'_id': ObjectId(customer_id)})
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(list(customer['payments_history']))


@customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['GET'])
def getCustomerClothes(customer_id):
    customer = db.Customers.find_one({'_id': ObjectId(customer_id)})
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(list(customer['clothes']))
