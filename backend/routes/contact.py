from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, ContactInfo, ContactMessage

contact_bp = Blueprint('contact', __name__)

# ============= CONTACT INFO =============
@contact_bp.route('/info', methods=['GET'])
def get_contact_info():
    """Obtener información de contacto"""
    try:
        info = ContactInfo.query.first()
        if not info:
            return jsonify({'error': 'Información de contacto no encontrada'}), 404
        return jsonify(info.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/info', methods=['PUT'])
@jwt_required()
def update_contact_info():
    """Actualizar información de contacto"""
    try:
        data = request.get_json()
        info = ContactInfo.query.first()

        if not info:
            info = ContactInfo()
            db.session.add(info)

        # Actualizar todos los campos posibles
        fields = [
            'address', 'phone_primary', 'phone_secondary', 'email_general',
            'email_sales', 'whatsapp', 'schedule', 'map_latitude', 'map_longitude',
            'facebook_url', 'instagram_url', 'linkedin_url', 'youtube_url'
        ]

        for field in fields:
            if field in data:
                setattr(info, field, data[field])

        db.session.commit()
        return jsonify({'message': 'Información de contacto actualizada', 'data': info.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= CONTACT MESSAGES =============
@contact_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Obtener todos los mensajes de contacto"""
    try:
        unread_only = request.args.get('unread', 'false').lower() == 'true'

        if unread_only:
            messages = ContactMessage.query.filter_by(is_read=False).order_by(ContactMessage.created_at.desc()).all()
        else:
            messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()

        return jsonify([msg.to_dict() for msg in messages]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/messages/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Obtener un mensaje específico"""
    try:
        message = ContactMessage.query.get(message_id)
        if not message:
            return jsonify({'error': 'Mensaje no encontrado'}), 404
        return jsonify(message.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/messages', methods=['POST'])
def create_message():
    """Crear un nuevo mensaje de contacto (público)"""
    try:
        data = request.get_json()

        if not data.get('name') or not data.get('email') or not data.get('subject') or not data.get('message'):
            return jsonify({'error': 'Nombre, email, asunto y mensaje son requeridos'}), 400

        message = ContactMessage(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            subject=data['subject'],
            message=data['message']
        )

        db.session.add(message)
        db.session.commit()

        return jsonify({'message': 'Mensaje enviado exitosamente', 'data': message.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/messages/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(message_id):
    """Marcar mensaje como leído"""
    try:
        message = ContactMessage.query.get(message_id)
        if not message:
            return jsonify({'error': 'Mensaje no encontrado'}), 404

        message.is_read = True
        db.session.commit()

        return jsonify({'message': 'Mensaje marcado como leído', 'data': message.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@contact_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Eliminar un mensaje"""
    try:
        message = ContactMessage.query.get(message_id)
        if not message:
            return jsonify({'error': 'Mensaje no encontrado'}), 404

        db.session.delete(message)
        db.session.commit()

        return jsonify({'message': 'Mensaje eliminado'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
