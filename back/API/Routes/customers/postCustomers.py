from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS

fs = GridFS(db)

post_customers_blueprint = Blueprint('post_customers', __name__)

@post_customers_blueprint.route('/api/customers', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomer():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    max_customer = db.customers.find_one(sort=[("id", -1)], projection={"id": 1})
    customer_id = max_customer['id'] + 1 if max_customer else 1
    customer = {'id': customer_id, **data}

    db.customers.insert_one(customer)
    customer.pop('_id', None)

    return jsonify(customer), 201


@post_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomerImage(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    image = request.get_json().get('image')
    if image is None:
        return jsonify({'details': 'Invalid input'}), 400

    image_id = fs.put(image.encode(), filename=f"customer_{customer_id}.jpg")
    db.customers.update_one(
        {'id': int(customer_id)},
        {'$set': {'image': image_id}}
    )

    return jsonify({'details': 'Image uploaded successfully'}), 201


@post_customers_blueprint.route('/api/customers/<customer_id>/payments', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomerPayment(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    pipeline = [
        {'$unwind': '$payments'},
        {'$group': {'_id': None, 'max_payment_id': {'$max': '$payments.id'}}}
    ]
    result = list(db.customers.aggregate(pipeline))
    payment_id = result[0]['max_payment_id'] + 1 if result else 1
    payment = {'id': payment_id, **data}

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'payments': payment}}
    )
    payment.pop('_id', None)

    return jsonify(payment), 201

@post_customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomerClothe(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    pipeline = [
        {'$unwind': '$clothes'},
        {'$group': {'_id': None, 'max_clothe_id': {'$max': '$clothes.id'}}}
    ]
    result = list(db.customers.aggregate(pipeline))
    clothe_id = result[0]['max_clothe_id'] + 1 if result else 1
    clothe = {'id': clothe_id, **data}

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'clothes': clothe}}
    )
    clothe.pop('_id', None)

    return jsonify(clothe), 201


@post_customers_blueprint.route('/api/customers/<customer_id>/saved_clothes', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomerSavedClothe(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'saved_clothes': data}}
    )

    return jsonify({'details': "Clothe saved successfully"}), 201

@post_customers_blueprint.route('/api/customers/<customer_id>/encounters', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postCustomerEncounter(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    pipeline = [
        {'$unwind': '$encounters'},
        {'$group': {'_id': None, 'max_encounter_id': {'$max': '$encounters.id'}}}
    ]
    result = list(db.customers.aggregate(pipeline))
    encounter_id = result[0]['max_encounter_id'] + 1 if result else 1
    encounter = {'id': encounter_id, **data}

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'encounters': encounter}}
    )
    encounter.pop('_id', None)

    return jsonify(encounter), 201
