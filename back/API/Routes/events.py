from flask import Blueprint, jsonify, request
from ..decorators import role_required
from dbConnection import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import DESCENDING


events_blueprint = Blueprint('events', __name__)

@events_blueprint.route('/api/events', methods=['POST'])
@jwt_required()
# @role_required('Coach')
def createEvents():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    last_event = db.events.find_one(sort=[("id", DESCENDING)])
    new_id = last_event['id'] + 1 if last_event else 1

    new_event = {
        'id': new_id,
        'name': data.get('name'),
        'date': data.get('date'),
        'duration': data.get('duration'),
        'max_participants': data.get('max_participants'),
        'location_x': data.get('location_x'),
        'location_y': data.get('location_y'),
        'type': data.get('type'),
        'employees': employee['id'],
        'location_name': data.get('location_name'),
    }

    db.employees.update_one(
        { 'email': current_employee_email },
        { '$push': { 'events': new_event } }
    )
    return jsonify({'details': 'Event created successfully'}), 201

@events_blueprint.route('/api/events/<int:employee_id>', methods=['GET'])
@jwt_required()
# @role_required('Coach')
def getEvents(employee_id):
    employee = db.employees.find_one({ 'id': employee_id }, { '_id': 0, 'events': 1 })
    if not employee or 'events' not in employee:
        return jsonify({'details': 'No events found for this employee'}), 404

    return jsonify(employee['events']), 200

@events_blueprint.route('/api/events/<event_id>', methods=['PUT'])
@jwt_required()
# @role_required('Coach')
def updateEvents(event_id):
    if not event_id:
        return jsonify({'details': 'Invalid input'}), 400
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_event = {}
    if data.get('name'):
        updated_event['name'] = data.get('name')
    if data.get('date'):
        updated_event['date'] = data.get('date')
    if data.get('duration'):
        updated_event['duration'] = data.get('duration')
    if data.get('max_participants'):
        updated_event['max_participants'] = data.get('max_participants')
    if data.get('location_x'):
        updated_event['location_x'] = data.get('location_x')
    if data.get('location_y'):
        updated_event['location_y'] = data.get('location_y')
    if data.get('type'):
        updated_event['type'] = data.get('type')
    if data.get('location_name'):
        updated_event['location_name'] = data.get('location_name')

    if not updated_event:
        return jsonify({'details': 'No fields to update'}), 400

    db.events.update_one(
        { 'id': int(event_id) },
        { '$set': updated_event }
    )
    return jsonify({'details': 'Event updated successfully'}), 200

@events_blueprint.route('/api/events/<event_id>', methods=['DELETE'])
@jwt_required()
# @role_required('Coach')
def deleteEvents(event_id):
    if not event_id:
        return jsonify({'details': 'Invalid input'}), 400
    db.events.delete_one({ 'id': int(event_id) })
    return jsonify({'details': 'Event deleted successfully'}), 200