from flask import Blueprint, jsonify, request, make_response
from dbConnection import db
import os
from dotenv import load_dotenv
import requests
from gridfs import GridFS
import base64
from flask_jwt_extended import create_access_token, decode_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_jwt_extended.exceptions import NoAuthorizationError
import bcrypt
from ...JWT_manager import jwt
from datetime import timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...decorators import role_required
from ...decorators import ADMIN_ROLES

permissions_employees_blueprint = Blueprint('permissions_employees', __name__)

load_dotenv()

@permissions_employees_blueprint.route('/api/employees/has_permissions/<role>', methods=['GET'])
@jwt_required()
def hasPermissions(role):
    user_email = get_jwt_identity()
    user = db.employees.find_one({ 'email': user_email })

    if not user:
        return jsonify({'details': 'User not found'}), 404

    user_role = user.get('work')
    if user_role in ADMIN_ROLES or user_role == role:
        return jsonify({ 'details': 'Access granted' }), 200
    else:
        return jsonify({ 'details': 'Access forbidden: insufficient permissions' }), 403

