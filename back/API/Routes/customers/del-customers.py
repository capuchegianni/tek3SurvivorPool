from flask import Blueprint, jsonify
from dbConnection import db
from ...JWT_manager import jwt
from flask_jwt_extended import jwt_required
from ...decorators import role_required
from gridfs import GridFS

fs = GridFS(db)

del_customers_blueprint = Blueprint('del_customers', __name__)

@del_customers_blueprint.route('/api/customers/<customer_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delCustomer(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    customer_image = customer.get('image')
    if customer_image:
        fs.delete(customer_image)

    customer_clothes = customer.get('clothes')
    if customer_clothes:
        for clothe in customer_clothes:
            if clothe.get('image'):
                fs.delete(clothe['image'])

    db.customers.delete_one({'id': int(customer_id)})

    return jsonify({'details': 'Customer deleted successfully'}), 200


@del_customers_blueprint.route('/api/customers/<customer_id>/image', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delCustomerImage(customer_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    customer_image = customer.get('image')
    if not customer_image:
        return jsonify({'details': 'Image not found'}), 404
    else:
        fs.delete(customer_image)

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$unset': {'image': ''}}
    )

    return jsonify({'details': 'Image deleted successfully'}), 200


@del_customers_blueprint.route('/api/customers/<customer_id>/payments_history/<payment_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delCustomerPayment(customer_id, payment_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    payment = db.customers.find_one(
        {'id': int(customer_id), 'payments_history.id': int(payment_id)},
        {'_id': 0, 'payments_history.$': 1}
    )
    if not payment:
        return jsonify({'details': 'Payment not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'payments_history': {'id': int(payment_id)} }}
    )

    return jsonify({'details': 'Payment deleted successfully'}), 200


@del_customers_blueprint.route('/api/customers/<customer_id>/clothes/<clothe_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delCustomerClothe(customer_id, clothe_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothe = db.customers.find_one(
        {'id': int(customer_id), 'clothes.id': int(clothe_id)},
        {'_id': 0, 'clothes.$': 1}
    )
    if not clothe:
        return jsonify({'details': 'Clothe not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'clothes': {'id': int(clothe_id)} }}
    )

    return jsonify({'details': 'Clothe deleted successfully'}), 200


@del_customers_blueprint.route('/api/customers/<customer_id>/saved_clothes/<clothe_id>', methods=['DELETE'])
@jwt_required()
@role_required('Admin')
def delCustomerSavedClothe(customer_id, clothe_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    clothe = db.customers.find_one(
        {'id': int(customer_id), 'saved_clothes.id': int(clothe_id)},
        {'_id': 0, 'saved_clothes.$': 1}
    )
    if not clothe:
        return jsonify({'details': 'Clothe not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'saved_clothes': {'id': int(clothe_id)} }}
    )

    return jsonify({'details': 'Clothe deleted successfully'}), 200


@del_customers_blueprint.route('/api/customers/<customer_id>/encounters/<encounter_id>', methods=['DELETE'])
@jwt_required()
@role_required('Coach')
def delCustomerEncounter(customer_id, encounter_id):
    customer = db.customers.find_one({'id': int(customer_id)})
    if customer is None:
        return jsonify({'details': 'Customer not found'}), 404

    encounter = db.customers.find_one(
        {'id': int(customer_id), 'encounters.id': int(encounter_id)},
        {'_id': 0, 'encounters.$': 1}
    )
    if not encounter:
        return jsonify({'details': 'Encounter not found'}), 404

    db.customers.update_one(
        {'id': int(customer_id)},
        {'$pull': {'encounters': {'id': int(encounter_id)} }}
    )

    return jsonify({'details': 'Encounter deleted successfully'}), 200
