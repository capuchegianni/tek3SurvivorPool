from flask import Blueprint, jsonify
from ..dbConnection import db
from bson.objectid import ObjectId

customers_blueprint = Blueprint('customers', __name__)

