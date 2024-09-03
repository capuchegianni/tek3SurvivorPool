from flask import Blueprint, jsonify
from ..dbConnection import db
from bson.objectid import ObjectId

employees_blueprint = Blueprint('employees', __name__)

