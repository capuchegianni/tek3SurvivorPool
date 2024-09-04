from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId
from ..serialize import serialize_mongo_id

encounters_blueprint = Blueprint('encounters', __name__)

@encounters_blueprint.route('/api/encounters', methods=['GET'])
def getEncounters():
    encounters = db.Encounters.find()
    return jsonify([serialize_mongo_id(encounter) for encounter in encounters])

@encounters_blueprint.route('/api/encounters/<encounter_id>', methods=['GET'])
def getEncounterId(encounter_id):
    encounter = db.Encounters.find_one({'_id': ObjectId(encounter_id)})
    if encounter is None:
        return jsonify({'error': 'Encounter not found'}), 404
    return jsonify(serialize_mongo_id(encounter))

@encounters_blueprint.route('/api/encounters/customer/<customer_id>', methods=['GET'])
def getEncountersCustomerId(customer_id):
    encounters = db.Encounters.find({'customer_id': ObjectId(customer_id)})
    return jsonify([serialize_mongo_id(encounter) for encounter in encounters])