from flask import Blueprint, jsonify
from ..dbConnection import db
from bson.objectid import ObjectId
from ..serialize import serialize_mongo_id

events_blueprint = Blueprint('events', __name__)

@events_blueprint.route('/api/events', methods=['GET'])
def getEvents():
    events = db.Events.find()
    return jsonify([serialize_mongo_id(event) for event in events])

@events_blueprint.route('/api/events/<event_id>', methods=['GET'])
def getEventId(event_id):
    event = db.Events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return jsonify({'error': 'Event not found'}), 404
    return jsonify(serialize_mongo_id(event))