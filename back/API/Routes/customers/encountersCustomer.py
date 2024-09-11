from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

encounters_customer_blueprint = Blueprint('encounters_customer', __name__)

@encounters_customer_blueprint.route('/api/customers/<customer_id>/encounters', methods=['GET'])
@jwt_required()
# @role_required('Coach')
def getCustomerEncounters(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    return jsonify([{
        'id': encounter.get('id'),
        'customer_id': encounter.get('customer_id'),
        'date': encounter.get('date'),
        'rating': encounter.get('rating')
    } for encounter in customer.get('encounters', [])])


@encounters_customer_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['GET'])
@jwt_required()
# @role_required('Coach')
def getCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    encounter = db.customers.find_one({'id': int(customer_id), 'encounters.id': int(encounter_id)})

    if encounter is None:
        return jsonify({'details': 'Encounter not found'}), 404

    return jsonify(encounter)

@encounters_customer_blueprint.route('/api/customers/<customer_id>/encounters', methods=['POST'])
@jwt_required()
# @role_required('Coach')
def createCustomerEncounter(customer_id):
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

    try:
        new_encounter = {
            'id': encounter_id,
            'customer_id': int(customer_id),
            'date': data.get('date'),
            'rating': data.get('rating'),
            'comment': data.get('comment'),
            'source': data.get('source')
        }
    except:
        return jsonify({'details': 'Invalid input'}), 400

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$push': {'encounters': new_encounter}}
    )
    return jsonify({'details': 'Encounter created successfully'}), 201

@encounters_customer_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['PUT'])
@jwt_required()
# @role_required('Coach')
def updateCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    encounter = db.customers.find_one({'id': int(customer_id), 'encounters.id': int(encounter_id)})

    if encounter is None:
        return jsonify({'details': 'Encounter not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id), 'encounters.id': int(encounter_id)},
        {'$set': data.get('encounter')}
    )
    return jsonify({'details': 'Encounter updated successfully'}), 200

@encounters_customer_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['DELETE'])
@jwt_required()
# @role_required('Coach')
def deleteCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})

    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    encounter = db.customers.find_one({'id': int(customer_id), 'encounters.id': int(encounter_id)})

    if encounter is None:
        return jsonify({'details': 'Encounter not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'encounters': {'id': int(encounter_id)}}}
    )
    return jsonify({'details': 'Encounter deleted successfully'}), 200
