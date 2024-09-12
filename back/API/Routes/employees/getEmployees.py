from flask import Blueprint, jsonify
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required
from gridfs import GridFS
from base64 import b64encode

fs = GridFS(db)

get_employees_blueprint = Blueprint('get_employee', __name__)

@get_employees_blueprint.route('/api/employees/<employee_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEmployee(employee_id):
    employee = db.employees.find_one(
        {'id': int(employee_id)},
        {'_id': 0, 'events': 0, 'image': 0, 'assigned_customers': 0, 'password': 0}
    )
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    return jsonify(employee), 200


@get_employees_blueprint.route('/api/employees', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEmployees():
    employees = db.employees.find(
        {},
        {'_id': 0, 'events': 0, 'image': 0, 'assigned_customers': 0, 'password': 0}
    )
    if employees is None:
        return jsonify({'details': 'No employees found'}), 404

    return jsonify(list(employees)), 200


@get_employees_blueprint.route('/api/employees/me', methods=['GET'])
@jwt_required()
def getMe():
    user_email = get_jwt_identity()
    user = db.employees.find_one(
        {'email': user_email},
        {'_id': 0, 'events': 0, 'image': 0, 'assigned_customers': 0, 'password': 0}
    )
    if user is None:
        return jsonify({'details': 'User not found'}), 404

    return jsonify(user), 200


@get_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEmployeeImage(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    image_data = fs.get(employee['image']).read()
    base64_image = b64encode(image_data).decode('utf-8')

    return jsonify({'image': base64_image}), 200


@get_employees_blueprint.route('/api/employees/<employee_id>/assigned_customers', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getAssignedCustomers(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    employee_assigned_customers = employee.get('assigned_customers')
    if employee_assigned_customers is None:
        return jsonify({'details': 'No assigned customers found'}), 404

    return jsonify(employee_assigned_customers), 200


@get_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    events = employee.get('events')
    if events is None:
        return jsonify({'details': 'Event not found'}), 404

    event = next((event for event in events if event['id'] == int(event_id)), None)
    if event is None:
        return jsonify({'details': 'Event not found'}), 404

    return jsonify(event), 200


@get_employees_blueprint.route('/api/employees/<employee_id>/events', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEvents(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    events = employee.get('events')
    if events is None:
        return jsonify({'details': 'No events found'}), 404

    return jsonify(events), 200


@get_employees_blueprint.route('/api/employees/events', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getAllEvents():
    pipeline = [
        {'$unwind': '$events'},
        {'$group': {'_id': None, 'events': {'$push': '$events'}}}
    ]
    result = list(db.employees.aggregate(pipeline))

    return jsonify(result[0]['events']) if result else jsonify([]), 200


@get_employees_blueprint.route('/api/employees/events/<event_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getEventByID(event_id):
    pipeline = [
        {'$unwind': '$events'},
        {'$match': {'events.id': int(event_id)}}
    ]
    result = list(db.employees.aggregate(pipeline))

    return jsonify(result[0]['events']) if result else jsonify([]), 200
