from flask import Blueprint, jsonify
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

get_tips_blueprint = Blueprint('get_tips', __name__)

@get_tips_blueprint.route('/api/tips/<tip_id>', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getTip(tip_id):
    tip = db.tips.find_one(
        {'id': int(tip_id)},
        {'_id': 0}
    )
    if tip is None:
        return jsonify({'details': 'Tip not found'}), 404

    return jsonify(tip), 200


@get_tips_blueprint.route('/api/tips', methods=['GET'])
@jwt_required()
@role_required('Coach')
def getTips():
    tips = db.tips.find(
        {},
        {'_id': 0}
    )
    if tips is None:
        return jsonify({'details': 'No tips found'}), 404

    return jsonify(list(tips)), 200
