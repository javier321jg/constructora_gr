from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login para administradores"""
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Credenciales inválidas'}), 401

        # JWT requiere que identity sea string
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            'message': 'Login exitoso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Renovar access token usando refresh token"""
    try:
        current_user_id = get_jwt_identity()
        # Asegurar que sea string
        new_access_token = create_access_token(identity=str(current_user_id))

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
        current_user_id = get_jwt_identity()
        print(f"[AUTH /me] User ID del token: {current_user_id}")

        if not current_user_id:
            print(f"[AUTH /me] ERROR: No se pudo obtener el user_id del token")
            return jsonify({'error': 'Token inválido'}), 401

        # Convertir de string a int para buscar en la BD
        user = User.query.get(int(current_user_id))
        print(f"[AUTH /me] Usuario encontrado: {user.email if user else 'None'}")

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        print(f"[AUTH /me] ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
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
        user = User.query.get(int(current_user_id))

        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Contraseña actual incorrecta'}), 401

        user.set_password(data['new_password'])
        db.session.commit()

        return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
