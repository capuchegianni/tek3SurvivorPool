from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId

clothes_blueprint = Blueprint('clothes', __name__)

@clothes_blueprint.route('/api/clothes/<clothe_id>/image', methods=['GET'])
def getClothes(clothe_id):
    clothes = db.Clothes.find_one({'_id': ObjectId(clothe_id)})
    if clothes is None:
        return jsonify({"detail": "Clothe requested doesn't exist"}), 404
    return jsonify(clothes)