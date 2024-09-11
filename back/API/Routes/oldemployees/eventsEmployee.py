from flask import Blueprint, jsonify, request
from dbConnection import db
from flask_jwt_extended import jwt_required
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

events_employees_blueprint = Blueprint('events_employees', __name__)

@events_employees_blueprint.route('/api/employees/<employee_id>/events', methods=['POST'])
@jwt_required()
# @role_required('Admin')
def createEmployeeEvent(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    pipeline = [
        {'$unwind': '$events'},
        {'$group': {'_id': None, 'max_event_id': {'$max': '$events.id'}}}
    ]
    result = list(db.employees.aggregate(pipeline))
    event_id = result[0]['max_event_id'] + 1 if result else 1

    try:
        new_event = {
            'id': event_id,
            'name': data.get('name'),
            'date': data.get('date'),
            'duration': data.get('duration'),
            'max_participants': data.get('max_participants'),
            'location_x': data.get('location_x'),
            'location_y': data.get('location_y'),
            'type': data.get('type'),
            'employee_id': int(employee_id),
            'location_name': data.get('location_name')
        }
    except:
        return jsonify({'details': 'Invalid input'}), 400

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$push': {'events': new_event}}
    )
    return jsonify({'details': 'Event created successfully'}), 201

@events_employees_blueprint.route('/api/employees/<employee_id>/events', methods=['GET'])
@jwt_required()
# @role_required('Admin')
def getEmployeeEvents(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})

    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    return jsonify(employee['events'])

@events_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['GET'])
@jwt_required()
# @role_required('Admin')
def getEmployeeEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})

    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    event = db.employees.find_one(
        {
            'id': int(employee_id),
            'events': {
                '$elemMatch': {
                    'id': int(event_id)
                }
            }
        },
        {'_id': 0, 'events.$': 1}
    )

    if event is None:
        return jsonify({'details': 'Event not found'}), 404
    return jsonify(event)

@events_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['PUT'])
@jwt_required()
# @role_required('Admin')
def updateEmployeeEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})

    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    result = db.employees.update_one(
        {
            'id': int(employee_id),
            'events': {
                '$elemMatch': {
                    'id': int(event_id)
                }
            }
        },
        {
            '$set': data.get('event')
        }
    )
    if result.matched_count == 0:
        return jsonify({'details': 'Event not found'}), 404
    return jsonify({'details': 'Event updated successfully'})

@events_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['DELETE'])
@jwt_required()
# @role_required('Admin')
def deleteEmployeeEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})

    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    result = db.employees.update_one(
        {'id': int(employee_id)},
        {'$pull': {'events': {'id': int(event_id)}}}
    )

    if result.modified_count == 0:
        return jsonify({'details': 'Event not found'}), 404
    return jsonify({'details': 'Event deleted successfully'}), 200

@events_employees_blueprint.route('/api/employees/events', methods=['GET'])
@jwt_required()
# @role_required('Admin')
def getAllEvents():
    pipeline = [
        {'$unwind': '$events'},
        {'$group': {'_id': None, 'events': {'$push': '$events'}}}
    ]
    result = list(db.employees.aggregate(pipeline))
    return jsonify(result[0]['events']) if result else jsonify([])
