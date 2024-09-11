from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

image_customers_blueprint = Blueprint('image_customers', __name__)

@image_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['POST'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def createCustomerImage(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    image = request.files.get('image')
    if image is None:
        return jsonify({'details': 'Invalid input'}), 400
    image_id = GridFS(db).put(image)
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'image': image_id } })
    return jsonify({ 'details': 'Image uploaded' })

@image_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def getCustomerImage(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    image_data = GridFS(db).get(customer['image']).read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    return jsonify({ 'image': base64_image })

@image_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['PUT'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def updateCustomerImage(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    image = request.files.get('image')
    if image is None:
        return jsonify({'details': 'Invalid input'}), 400

    fs = GridFS(db)
    if 'image' in customer and customer['image']:
        fs.delete(customer['image'])

    image_id = fs.put(image)
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'image': image_id } })
    return jsonify({ 'details': 'Image updated' })

@image_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['DELETE'])
@jwt_required(locations='cookies')
# @role_required('Admin')
def deleteCustomerImage(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    if 'image' not in customer:
        return jsonify({'details': 'No image found'}), 404
    GridFS(db).delete(customer['image'])
    db.customers.update_one({ 'id': int(customer_id) }, { '$unset': { 'image': '' } })
    return jsonify({ 'details': 'Image deleted' })