from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

put_tips_blueprint = Blueprint('put_tips', __name__)

@put_tips_blueprint.route('/api/tips/<tip_id>', methods=['PUT'])
@jwt_required()
@role_required('Admin')
def putTip(tip_id):
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    tip = db.tips.find_one({'id': int(tip_id)})
    if tip is None:
        return jsonify({'details': 'Tip not found'}), 404

    db.tips.update_one(
        {'id': int(tip_id)},
        {'$set': data}
    )
    data.pop('_id', None)

    return jsonify(data), 200
