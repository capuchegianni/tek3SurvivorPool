from flask import Blueprint, jsonify, request
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required

post_tips_blueprint = Blueprint('post_tips', __name__)

@post_tips_blueprint.route('/api/tips', methods=['POST'])
@jwt_required()
@role_required('Admin')
def postTip():
    data = request.get_json()
    if not data:
        return jsonify({'details': 'Invalid input'}), 400

    pipeline = [
        {'$unwind': '$tips'},
        {'$group': {'_id': None, 'max_tip_id': {'$max': '$tips.id'}}}
    ]
    result = list(db.tips.aggregate(pipeline))
    tip_id = result[0]['max_tip_id'] + 1 if result else 1
    tip = {'id': tip_id, **data}

    db.tips.insert_one(tip)
    tip.pop('_id', None)

    return jsonify(tip), 201
