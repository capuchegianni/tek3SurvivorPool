from flask import Blueprint, jsonify
from dbConnection import db

tips_blueprint = Blueprint('tips', __name__)

@tips_blueprint.route('/api/tips', methods=['GET'])
def getTips():
    tips = db.tips.find()
    return jsonify([{
        'id': tip['id'],
        'title': tip['title'],
        'tip': tip['tip']
    } for tip in tips])
