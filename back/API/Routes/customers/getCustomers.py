from base64 import b64encode
from flask import Blueprint, jsonify
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS

fs = GridFS(db)

get_customers_blueprint = Blueprint('get_customers', __name__)

@get_customers_blueprint.route('/api/customers/<customer_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomer(customer_id):
    customer = db.customers.find_one(
        {'id': int(customer_id)},
        {'_id': 0, 'paymentsHistory': 0, 'clothes': 0, 'saved_clothes': 0, 'encounters': 0, 'image': 0}
    )
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify(customer), 200


@get_customers_blueprint.route('/api/customers', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomers():
    customers = db.customers.find(
        {},
        {'_id': 0, 'paymentsHistory': 0, 'clothes': 0, 'saved_clothes': 0, 'encounters': 0, 'image': 0}
    )
    if customers is None:
        return jsonify({'details': 'No customers found'}), 404

    return jsonify(list(customers)), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerImage(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)}, {'_id': 0, 'image': 1})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    image_data = fs.get(customer['image']).read()
    base64_image = b64encode(image_data).decode('utf-8')
    if image_data is None:
        return jsonify({'details': 'Image not found'}), 404

    return jsonify({ 'image': base64_image }), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerPayment(customer_id, payment_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    payment = db.customers.find_one(
        {'id': int(customer_id), 'payments_history.id': int(payment_id)},
        {'_id': 0, 'payments_history.$': 1}
    )
    if payment is None:
        return jsonify({'details': 'Payment not found'}), 404

    return jsonify(payment), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/payments_history', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerPayments(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify(customer.get('payments_history', [])), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/clothes/<clothe_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerClothe(customer_id, clothe_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothe = db.customers.find_one(
        {'id': int(customer_id), 'clothes.id': int(clothe_id)},
        {'_id': 0, 'clothes.$': 1}
    )
    if clothe is None:
        return jsonify({'details': 'Clothe not found'}), 404

    image_data = fs.get(customer['image']).read()
    base64_image = b64encode(image_data).decode('utf-8')
    return jsonify({
        'id': clothe['id'],
        'type': clothe['type'],
        'image': base64_image
    }), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerClothes(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    clothes_with_images = []
    for clothe in customer['clothes']:
        image_data = GridFS(db).get(clothe['image']).read()
        base64_image = b64encode(image_data).decode('utf-8')
        clothes_with_images.append({
            'id': clothe['id'],
            'type': clothe['type'],
            'image': base64_image
        })
    return jsonify(clothes_with_images)


@get_customers_blueprint.route('/api/customers/<customer_id>/saved_clothes', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerSavedClothes(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    clothes_with_images = []
    for clothe in customer['saved_clothes']:
        image_data = GridFS(db).get(clothe['image']).read()
        base64_image = b64encode(image_data).decode('utf-8')
        clothes_with_images.append({
            'id': clothe['id'],
            'type': clothe['type'],
            'image': base64_image
        })
    return jsonify(clothes_with_images)


@get_customers_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    encounter = db.customers.find_one(
        {'id': int(customer_id), 'encounters.id': int(encounter_id)},
        {'_id': 0, 'encounters.$': 1}
    )
    if encounter is None:
        return jsonify({'details': 'Encounter not found'}), 404

    return jsonify(encounter), 200


@get_customers_blueprint.route('/api/customers/<customer_id>/encounters', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getCustomerEncounters(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify(customer.get('encounters', [])), 200
