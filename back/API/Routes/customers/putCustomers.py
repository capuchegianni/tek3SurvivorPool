from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS
from pymongo import ReturnDocument

fs = GridFS(db)

put_customers_blueprint = Blueprint('put_customers', __name__)

@put_customers_blueprint.route('/api/customers/<customer_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putCustomer(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.json
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_customer = db.customers.find_one_and_update(
        {'id': int(customer_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )

    return jsonify(updated_customer), 200


@put_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putCustomerImage(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    image = request.get_json().get('image')
    if image is None:
        return jsonify({'details': 'No image provided'}), 400

    if 'image' in customer and customer['image']:
        fs.delete(customer['image'])

    image_id = fs.put(image)

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$set': {'image': image_id}}
    )

    return jsonify({'details': 'Image uploaded successfully'}), 200


@put_customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putCustomerPayment(customer_id, payment_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    payment = db.customers.find_one({'id': int(customer_id), 'payments_history.id': int(payment_id)})
    if payment is None:
        return jsonify({'details': 'Payment not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_payment = db.customers.find_one_and_update(
        {'id': int(customer_id), 'payments_history.id': int(payment_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )

    return jsonify(updated_payment), 200


@put_customers_blueprint.route('/api/customers/<customer_id>/clothes/<clothe_id>', methods=['PUT'])
@jwt_required()
@role_required('Coach')
def putCustomerClothe(customer_id, clothe_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothe = db.customers.find_one({'id': int(customer_id), 'clothes.id': int(clothe_id)})
    if clothe is None:
        return jsonify({'details': 'Clothe not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_clothe = db.customers.find_one_and_update(
        {'id': int(customer_id), 'clothes.id': int(clothe_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )

    return jsonify(updated_clothe), 200


@put_customers_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['PUT'])
@jwt_required()
@role_required('Coach')
def putCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    encounter = db.customers.find_one({'id': int(customer_id), 'encounters.id': int(encounter_id)})
    if encounter is None:
        return jsonify({'details': 'Encounter not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_encounter = db.customers.find_one_and_update(
        {'id': int(customer_id), 'encounters.id': int(encounter_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )

    return jsonify(updated_encounter), 200
