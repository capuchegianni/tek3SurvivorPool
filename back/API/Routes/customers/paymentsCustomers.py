from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

payments_customers_blueprint = Blueprint('payments_customers', __name__)

@payments_customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['POST'])
@jwt_required(locations='cookies')
# @role_required('Coach')
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
        'paymentMethod': data.get('payment_method'),
        'amount': data.get('amount'),
        'comment': data.get('comment')
    }
    customer['payments_history'].append(new_payment)
    db.customers.update_one(
        { 'id': int(customer_id) },
        { '$push': { 'payments_history': new_payment } }
    )
    return jsonify(new_payment), 201

@payments_customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def getCustomerPaymentsHistory(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    return jsonify([{
        'id': payment['id'],
        'date': payment['date'],
        'paymentMethod': payment['payment_method'],
        'amount': payment['amount'],
        'comment': payment['comment']
    } for payment in customer['payments_history']])

@payments_customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['PUT'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def updateCustomerPaymentsHistory(customer_id, payment_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    updated_payment = {}
    if 'date' in data:
        updated_payment['payments_history.$.date'] = data['date']
    if 'payment_method' in data:
        updated_payment['payments_history.$.payment_method'] = data['payment_method']
    if 'amount' in data:
        updated_payment['payments_history.$.amount'] = data['amount']
    if 'comment' in data:
        updated_payment['payments_history.$.comment'] = data['comment']

    if not updated_payment:
        return jsonify({'details': 'No valid fields to update'}), 400

    result = db.customers.update_one(
        { 'id': int(customer_id), 'payments_history.id': int(payment_id) },
        { '$set': updated_payment }
    )
    if result.matched_count == 0:
        return jsonify({'details': 'Payment not found'}), 404
    return jsonify({'details': 'Payment updated successfully'})

@payments_customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def deleteCustomerPaymentsHistory(customer_id, payment_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    result = db.customers.update_one(
        { 'id': int(customer_id) },
        { '$pull': { 'payments_history': { 'id': int(payment_id) } } }
    )

    if result.modified_count == 0:
        return jsonify({'details': 'Payment not found'}), 404

    return jsonify({'details': 'Payment deleted successfully'})