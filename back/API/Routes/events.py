from flask import Blueprint, jsonify, request
from ..decorators import role_required
from dbConnection import db
from flask_jwt_extended import jwt_required, get_jwt_identity


events_blueprint = Blueprint('events', __name__)

@events_blueprint.route('/api/events', methods=['POST'])
@jwt_required(locations='cookies')
@role_required('Coach')
def createEvents():
    current_employee_email = get_jwt_identity()
    employee = db.employees.find_one({ 'email': current_employee_email })
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    new_event = {
        'id': data.get('id'),
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

    db.events.insert_one(new_event)
    return jsonify({'details': 'Event created successfully'}), 201


@events_blueprint.route('/api/events', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Coach')
def getEvents():
    employees = db.employees.find({}, {'_id': 0, 'events': 1})
    events = []
    for employee in employees:
        if 'events' in employee:
            events.extend(employee['events'])
    return jsonify(events), 200


@events_blueprint.route('/api/events/<event_id>', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Coach')
def updateEvents(event_id):
    if not event_id:
        return jsonify({'details': 'Invalid input'}), 400
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_event = {
        'name': data.get('name'),
        'date': data.get('date'),
        'duration': data.get('duration'),
        'max_participants': data.get('max_participants'),
        'location_x': data.get('location_x'),
        'location_y': data.get('location_y'),
        'type': data.get('type'),
        'location_name': data.get('location_name'),
    }

    db.events.update_one({ 'id': int(event_id) }, { '$set': updated_event })
    return jsonify({'details': 'Event updated successfully'}), 200

@events_blueprint.route('/api/events/<event_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Coach')
def deleteEvents(event_id):
    if not event_id:
        return jsonify({'details': 'Invalid input'}), 400
    db.events.delete_one({ 'id': int(event_id) })
    return jsonify({'details': 'Event deleted successfully'}), 200