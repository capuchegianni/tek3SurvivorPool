from flask import Blueprint, jsonify
from ..dbConnection import db
from bson.objectid import ObjectId

encounters_blueprint = Blueprint('encounters', __name__)

