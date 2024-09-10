from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['POST'])
@jwt_required(locations='cookies')
@role_required('Coach')
def createCustomerPaymentsHistory(customer_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    new_payment = {
        'id': data.get('id'),
        'date': data.get('date'),
        'payment_method': data.get('payment_method'),
        'amount': data.get('amount'),
        'comment': data.get('comment')
    }
    customer['payments_history'].append(new_payment)
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'payments_history': customer['payments_history'] } })
    return jsonify(new_payment)

@customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Coach')
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

@customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Coach')
def updateCustomerPaymentsHistory(customer_id, payment_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    updated_payment = {
        'date': data.get('date'),
        'payment_method': data.get('payment_method'),
        'amount': data.get('amount'),
        'comment': data.get('comment')
    }

    for payment in customer['payments_history']:
        if payment['id'] == int(payment_id):
            payment.update(updated_payment)
            break
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'payments_history': customer['payments_history'] } })
    return jsonify({'details': 'Payment updated successfully'})

@customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Coach')
def deleteCustomerPaymentsHistory(customer_id, payment_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    for payment in customer['payments_history']:
        if payment['id'] == int(payment_id):
            customer['payments_history'].remove(payment)
            db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'payments_history': customer['payments_history'] } })
            return jsonify({'details': 'Payment deleted successfully'})
    return jsonify({'details': 'Payment not found'}), 404