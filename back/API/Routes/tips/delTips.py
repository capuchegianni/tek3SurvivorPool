from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

del_tips_blueprint = Blueprint('del_tips', __name__)

@del_tips_blueprint.route('/api/tips/<tip_id>', methods=['DELETE'])
@jwt_required()
@role_required('Coach')
def delTip(tip_id):
    tip = db.tips.find_one({'id': int(tip_id)})
    if tip is None:
        return jsonify({'details': 'Tip not found'}), 404

    db.tips.delete_one({'id': int(tip_id)})

    return jsonify({'details': 'Tip deleted'}), 200
