from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import request, jsonify
from dbConnection import db

ADMIN_ROLES = [
    'CTO',
    'Marketing Specialist',
    'Finance Manager',
    'Financial Analyst',
    'Marketing Manager',
    'Coach',
    'COO',
    'Sales Representative',
    'CEO',
    'Sales Manager',
    'VP of Marketing'
]

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_employee_email = get_jwt_identity()
            user_role = db.employees.find_one({'email': current_employee_email })
            if user_role not in ADMIN_ROLES or user_role is not "Coach":
                return jsonify({'details': 'Access forbidden: insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator