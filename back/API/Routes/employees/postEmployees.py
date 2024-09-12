from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS

fs = GridFS(db)

post_employees_blueprint = Blueprint('post_employee', __name__)

@post_employees_blueprint.route('/api/employees', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postEmployee():
    data = request.json
    employee = db.employees.find_one({'email': data.get('email')})
    if employee:
        return jsonify({'details': 'Employee already exists'}), 409

    max_employee = db.employees.find_one(sort=[("id", -1)], projection={"id": 1})
    employee_id = max_employee['id'] + 1 if max_employee else 1
    employee = {'id': employee_id, **data}

    db.employees.insert_one(employee)
    employee.pop('_id', None)

    return jsonify(employee), 201


@post_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postEmployeeImage(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    image = request.get_json().get('image')
    if image is None:
        return jsonify({'details': 'No image provided'}), 400

    image_id = fs.put(image.encode())

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$set': {'image': image_id}}
    )

    return jsonify({'details': 'Image uploaded successfully'}), 201


@post_employees_blueprint.route('/api/employees/<employee_id>/assigned_customers', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postAssignedCustomer(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    data = request.get_json()
    customer = db.customers.find_one({'id': data.get('customer_id')})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$push': {'assigned_customers': data}}
    )

    return jsonify({'details': 'Customer assigned successfully'}), 201


@post_employees_blueprint.route('/api/employees/<employee_id>/events', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postEmployeeEvent(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
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
    event = {'id': event_id, **data}

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$push': {'events': event}}
    )
    event.pop('_id', None)

    return jsonify(event), 201
