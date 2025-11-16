import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login para administradores"""
    try:
        data = request.get_json()
        logger.info(f'📝 Intento de login con email: {data.get("email") if data else "N/A"}')

        if not data or not data.get('email') or not data.get('password'):
            logger.warning('⚠️  Login fallido - Datos incompletos')
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            logger.warning(f'⚠️  Login fallido - Credenciales inválidas para {data.get("email")}')
            return jsonify({'error': 'Credenciales inválidas'}), 401

        # Flask-JWT-Extended requiere que identity sea un string
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        logger.info(f'✅ Login exitoso para {user.email} (ID: {user.id})')
        logger.debug(f'🔑 Token generado (primeros 50 chars): {access_token[:50]}...')

        return jsonify({
            'message': 'Login exitoso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        logger.error(f'❌ Error en login: {str(e)}')
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Renovar access token usando refresh token"""
    try:
        current_user_id = get_jwt_identity()
        # El identity ya es string, mantenerlo así
        new_access_token = create_access_token(identity=current_user_id)

        return jsonify({
            'access_token': new_access_token
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obtener información del usuario actual"""
    try:
        logger.info('👤 Obteniendo usuario actual...')
        current_user_id = get_jwt_identity()
        logger.debug(f'   User ID del token (string): {current_user_id}')

        # Convertir de string a int
        user_id = int(current_user_id)
        logger.debug(f'   User ID convertido (int): {user_id}')

        user = User.query.get(user_id)

        if not user:
            logger.error(f'❌ Usuario no encontrado con ID: {current_user_id}')
            return jsonify({'error': 'Usuario no encontrado'}), 404

        logger.info(f'✅ Usuario encontrado: {user.email}')
        return jsonify(user.to_dict()), 200

    except Exception as e:
        logger.error(f'❌ Error en /me: {str(e)}')
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Cambiar contraseña del usuario actual"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Contraseña actual y nueva contraseña son requeridas'}), 400

        # Convertir de string a int
        user_id = int(current_user_id)
        user = User.query.get(user_id)

        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Contraseña actual incorrecta'}), 401

        user.set_password(data['new_password'])
        db.session.commit()

        return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
