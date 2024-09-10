from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['POST'])
@jwt_required(locations='cookies')
@role_required('Coach')
def createCustomerClothes(customer_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    new_clothes = {
        'id': data.get('id'),
        'type': data.get('type')
    }
    customer['clothes'].append(new_clothes)
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'clothes': customer['clothes'] } })
    return jsonify(new_clothes)


@customers_blueprint.route('/api/customers/<customer_id>/clothes', methods=['GET'])
@jwt_required(locations='cookies')
@role_required('Coach')
def getCustomerClothes(customer_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404
    clothes_with_images = []
    for clothe in customer['clothes']:
        image_data = GridFS(db).get(clothe['image']).read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        clothes_with_images.append({
            'id': clothe['id'],
            'type': clothe['type'],
            'image': base64_image
        })
    return jsonify(clothes_with_images)

@customers_blueprint.route('/api/customers/<customer_id>/clothes/<clothes_id>', methods=['PUT'])
@jwt_required(locations='cookies')
@role_required('Coach')
def updateCustomerClothes(customer_id, clothes_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothes = next((clothes for clothes in customer['clothes'] if clothes['id'] == int(clothes_id)), None)
    if clothes is None:
        return jsonify({'details': 'Clothes not found'}), 404

    clothes['type'] = data.get('type')
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'clothes': customer['clothes'] } })
    return jsonify(clothes)

@customers_blueprint.route('/api/customers/<customer_id>/clothes/<clothes_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
@role_required('Coach')
def deleteCustomerClothes(customer_id, clothes_id):
    customer = db.customers.find_one({ 'id': int(customer_id) })
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothes = next((clothes for clothes in customer['clothes'] if clothes['id'] == int(clothes_id)), None)
    if clothes is None:
        return jsonify({'details': 'Clothes not found'}), 404

    customer['clothes'].remove(clothes)
    db.customers.update_one({ 'id': int(customer_id) }, { '$set': { 'clothes': customer['clothes'] } })
    return jsonify({'details': 'Clothes deleted'})