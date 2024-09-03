from flask import Blueprint, jsonify
from ..dbConnection import db

tips_blueprint = Blueprint('tips', __name__)

@tips_blueprint.route('/api/tips', methods=['GET'])
def getTips():
    tips = db.Tips.find()
    return jsonify(list(tips))
