from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId

clothes_blueprint = Blueprint('clothes', __name__)

