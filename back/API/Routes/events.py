from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId

events_blueprint = Blueprint('events', __name__)

@events_blueprint.route('/api/events', methods=['GET'])
def getEvents():
    events = db.Events.find()
    return jsonify(list(events))

@events_blueprint.route('/api/events/<event_id>', methods=['GET'])
def getEventId(event_id):
    event = db.Events.find_one({'_id': ObjectId(event_id)})
    if event is None:
        return jsonify({'error': 'Event not found'}), 404
    return jsonify(event)