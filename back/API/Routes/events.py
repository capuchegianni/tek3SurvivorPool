from flask import Blueprint, jsonify
from dbConnection import db
from bson.objectid import ObjectId

events_blueprint = Blueprint('events', __name__)

