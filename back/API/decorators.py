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
            user = db.employees.find_one({'email': current_employee_email}, {'_id': 0, 'work': 1})
            if not user:
                return jsonify({'details': 'User not found'}), 404

            user_role = user.get('work')

            if required_role == 'Coach':
                return f(*args, **kwargs)
            elif required_role == 'Admin':
                if user_role == 'Coach':
                    return jsonify({'details': 'Access forbidden: insufficient permissions'}), 403
                return f(*args, **kwargs)
            else:
                if user_role not in ADMIN_ROLES and user_role != required_role:
                    return jsonify({'details': 'Access forbidden: insufficient permissions'}), 403
                return f(*args, **kwargs)

        return decorated_function
    return decorator