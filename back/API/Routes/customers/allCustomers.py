from flask import Blueprint, jsonify, request
from dbConnection import db
from gridfs import GridFS
import base64
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required

customers_blueprint = Blueprint('customers', __name__)

@customers_blueprint.route('/api/customers', methods=['GET'])
@jwt_required(locations='cookies')
def getCustomers():
    customers = db.customers.find()
    return jsonify([{
        'id': customer['id'],
        'email': customer['email'],
        'name': customer['name'],
        'surname': customer['surname']
    } for customer in customers])
