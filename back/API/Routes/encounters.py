from flask import Blueprint, jsonify
from ..dbConnection import db
from bson.objectid import ObjectId

encounters_blueprint = Blueprint('encounters', __name__)

@encounters_blueprint.route('/api/encounters', methods=['GET'])
def getEncounters():
    encounters = db.Encounters.find()
    return jsonify(list(encounters))

@encounters_blueprint.route('/api/encounters/<encounter_id>', methods=['GET'])
def getEncounterId(encounter_id):
    encounter = db.Encounters.find_one({'_id': ObjectId(encounter_id)})
    if encounter is None:
        return jsonify({'error': 'Encounter not found'}), 404
    return jsonify(encounter)

@encounters_blueprint.route('/api/encounters/customer/<customer_id>', methods=['GET'])
def getEncountersCustomerId(customer_id):
    encounters = db.Encounters.find({'customer_id': ObjectId(customer_id)})
    return jsonify(list(encounters))