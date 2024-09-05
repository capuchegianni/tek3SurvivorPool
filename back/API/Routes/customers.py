from flask import Blueprint, jsonify
from dbConnection import db
from gridfs import GridFS
import base64

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers', methods=['GET'])
def getCustomers():
    customers = db.customers.find()
    return jsonify([{
        'id': customer['id'],
        'email': customer['email'],
        'name': customer['name'],
        'surname': customer['surname']
    } for customer in customers])


@customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
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


@customers_blueprint.route('/api/customers/<customer_id>/image', methods=['GET'])
def getCustomerImage(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    image_data = GridFS(db).get(customer['image']).read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return jsonify({ 'image': base64_image })


@customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['GET'])
def getCustomerPaymentsHistory(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    return jsonify([{
        'id': payment['id'],
        'date': payment['date'],
        'payment_method': payment['payment_method'],
        'amount': payment['amount'],
        'comment': payment['comment']
    } for payment in customer['payments_history']])


@customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['GET'])
def getCustomerClothes(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    return jsonify([{
        'id': clothes['id'],
        'type': clothes['type']
    } for clothes in customer['clothes']])
