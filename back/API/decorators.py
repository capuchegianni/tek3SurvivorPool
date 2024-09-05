from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity

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
            current_user = get_jwt_identity()
            user_role = current_user.get('role')
            if user_role not in ADMIN_ROLES and user_role != required_role:
                return jsonify({'details': 'Access forbidden: insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator