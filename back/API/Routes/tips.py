from flask import Blueprint, jsonify, request
from dbConnection import db
from flask_jwt_extended import jwt_required
from ..decorators import role_required
from pymongo import DESCENDING

tips_blueprint = Blueprint('tips', __name__)

@tips_blueprint.route('/api/tips', methods=['POST'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def createTip():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    last_tip = db.tips.find_one(sort=[("id", DESCENDING)])
    new_id = last_tip['id'] + 1 if last_tip else 1

    new_tip = {
        'id': new_id,
        'title': data.get('title'),
        'tip': data.get('tip')
    }

    db.tips.insert_one(new_tip)
    return jsonify({'details': 'Tip created successfully'}), 201

@tips_blueprint.route('/api/tips', methods=['GET'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def getTips():
    tips = db.tips.find()
    return jsonify([{
        'id': tip['id'],
        'title': tip['title'],
        'tip': tip['tip']
    } for tip in tips])

@tips_blueprint.route('/api/tips/<tip_id>', methods=['PUT'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def updateTip(tip_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    updated_tip = {}
    if data.get('title'):
        updated_tip['title'] = data.get('title')
    if data.get('tip'):
        updated_tip['tip'] = data.get('tip')

    if not updated_tip:
        return jsonify({'details': 'No fields to update'}), 400

    db.tips.update_one({ 'id': int(tip_id) }, { '$set': updated_tip })
    return jsonify({'details': 'Tip updated successfully'}), 200

@tips_blueprint.route('/api/tips/<tip_id>', methods=['DELETE'])
@jwt_required(locations='cookies')
# @role_required('Coach')
def deleteTip(tip_id):
    db.tips.delete_one({ 'id': int(tip_id) })
    return jsonify({'details': 'Tip deleted successfully'})
