from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS
from pymongo import ReturnDocument

fs = GridFS(db)

put_employees_blueprint = Blueprint('put_employee', __name__)

@put_employees_blueprint.route('/api/employees/<employee_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putEmployee(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    data = request.json
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_employee = db.employees.find_one_and_update(
        {'id': int(employee_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )
    updated_employee.pop('_id', None)

    return jsonify(updated_employee), 200


@put_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putEmployeeImage(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    image = request.get_json().get('image')
    if image is None:
        return jsonify({'details': 'No image provided'}), 400

    if employee.get('image'):
        fs.delete(employee['image'])

    image_id = fs.put(image.encode())

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$set': {'image': image_id}}
    )

    return jsonify({'details': 'Image uploaded successfully'}), 201


@put_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putEmployeeEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    event = db.employees.find_one({'id': int(employee_id), 'events.id': int(event_id)})
    if event is None:
        return jsonify({'details': 'Event not found'}), 404

    data = request.json
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_event = db.employees.find_one_and_update(
        {'id': int(employee_id), 'events.id': int(event_id)},
        {'$set': data},
        return_document=ReturnDocument.AFTER
    )
    updated_event.pop('_id', 'None')

    return jsonify(updated_event), 200
