from flask import Blueprint, jsonify
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS

fs = GridFS(db)

del_employees_blueprint = Blueprint('del_employee', __name__)

@del_employees_blueprint.route('/api/employees/<employee_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delEmployee(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    employee_image = employee.get('image')
    if employee_image:
        fs.delete(employee_image)

    db.employees.delete_one({'id': int(employee_id)})

    return jsonify({'details': 'Employee deleted'}), 200


@del_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delEmployeeImage(employee_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    employee_image = employee.get('image')
    if not employee_image:
        return jsonify({'details': 'Image not found'}), 404
    else:
        fs.delete(employee_image)

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$unset': {'image': ''}}
    )

    return jsonify({'details': 'Image deleted'}), 200


@del_employees_blueprint.route('/api/employees/<employee_id>/assigned_customers/<customer_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delAssignedCustomer(employee_id, customer_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    assigned_customers = employee.get('assigned_customers')
    if assigned_customers is None:
        return jsonify({'details': 'No assigned customers'}), 404

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$pull': {'assigned_customers': int(customer_id)}}
    )

    return jsonify({'details': 'Customer unassigned'}), 200


@del_employees_blueprint.route('/api/employees/<employee_id>/events/<event_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delEvent(employee_id, event_id):
    employee = db.employees.find_one({'id': int(employee_id)})
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    event = employee.get('events')
    if event is None:
        return jsonify({'details': 'Event not found'}), 404

    db.employees.update_one(
        {'id': int(employee_id)},
        {'$pull': {'events': {'id': int(event_id)} }}
    )

    return jsonify({'details': 'Event deleted'}), 200
