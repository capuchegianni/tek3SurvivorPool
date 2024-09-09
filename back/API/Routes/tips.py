from flask import Blueprint, jsonify
from dbConnection import db
from ..JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ..decorators import role_required

tips_blueprint = Blueprint('tips', __name__)

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
