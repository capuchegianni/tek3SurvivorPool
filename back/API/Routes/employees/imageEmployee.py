from flask import Blueprint, jsonify, request
from dbConnection import db
from dotenv import load_dotenv
from gridfs import GridFS
import base64
from flask_jwt_extended import jwt_required
from ...JWT_manager import jwt
from ...decorators import role_required

image_employees_blueprint = Blueprint('image_employees', __name__)

load_dotenv()

@image_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['POST'])
@jwt_required()
@role_required('Admin')
def createEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    image = request.files.get('image')
    if image is None:
        return jsonify({'details': 'No image provided'}), 400

    image_id = GridFS(db).put(image)
    db.employees.update_one({ 'id': int(employee_id) }, { '$set': { 'image': image_id } })
    return jsonify({'details': 'Image uploaded successfully'}), 200

@image_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['GET'])
@jwt_required()
@role_required('Admin')
def getEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    image_data = GridFS(db).get(employee['image']).read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return jsonify({ 'image': base64_image })

@image_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def updateEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404

    image = request.files.get('image')
    if image is None:
        return jsonify({'details': 'No image provided'}), 400

    fs = GridFS(db)

    if 'image' in employee and employee['image']:
        fs.delete(employee['image'])

    image_id = fs.put(image)

    db.employees.update_one(
        { 'id': int(employee_id) },
        { '$set': { 'image': image_id } }
    )
    return jsonify({'details': 'Image updated successfully'})

@image_employees_blueprint.route('/api/employees/<employee_id>/image', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def deleteEmployeeImage(employee_id):
    employee = db.employees.find_one({ 'id': int(employee_id) })
    if employee is None:
        return jsonify({'details': 'Employee not found'}), 404
    if 'image' not in employee:
        return jsonify({'details': 'No image found'}), 404

    GridFS(db).delete(employee['image'])
    db.employees.update_one({ 'id': int(employee_id) }, { '$unset': { 'image': '' } })
    return jsonify({'details': 'Image deleted successfully'}), 200