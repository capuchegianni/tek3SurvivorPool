from flask import Blueprint, jsonify
from ..dbConnection import db
from ..serialize import serialize_mongo_id

tips_blueprint = Blueprint('tips', __name__)

@tips_blueprint.route('/api/tips', methods=['GET'])
def getTips():
    tips = db.Tips.find()
    return jsonify([serialize_mongo_id(tip) for tip in tips])
