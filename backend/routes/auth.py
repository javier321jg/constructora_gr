from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login para administradores"""
    try:
        print("\n========== LOGIN REQUEST ==========")
        data = request.get_json()
        print(f"📥 Datos recibidos: {data}")

        if not data or not data.get('email') or not data.get('password'):
            print("❌ Error: Faltan email o contraseña")
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400

        print(f"🔍 Buscando usuario con email: {data['email']}")
        user = User.query.filter_by(email=data['email']).first()

        if not user:
            print("❌ Error: Usuario no encontrado")
            return jsonify({'error': 'Credenciales inválidas'}), 401

        print(f"✅ Usuario encontrado: {user.email}")

        if not user.check_password(data['password']):
            print("❌ Error: Contraseña incorrecta")
            return jsonify({'error': 'Credenciales inválidas'}), 401

        print("✅ Contraseña correcta")
        print("🔐 Generando tokens...")

        # IMPORTANTE: identity debe ser STRING
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        print(f"✅ Access token generado: {access_token[:50]}...")
        print(f"✅ Refresh token generado: {refresh_token[:50]}...")
        print("========== LOGIN EXITOSO ==========\n")

        return jsonify({
            'message': 'Login exitoso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        print(f"❌❌❌ ERROR EN LOGIN: {str(e)}")
        import traceback
        traceback.print_exc()
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
def get_current_user():
    """Obtener información del usuario actual"""
    try:
        print("\n========== /ME REQUEST ==========")
        print(f"🔐 Headers completos: {dict(request.headers)}")

        auth_header = request.headers.get('Authorization', None)
        print(f"🔐 Authorization header: {auth_header}")

        if not auth_header:
            print("⚠️ No hay Authorization header - usuario no autenticado")
            return jsonify({'error': 'No autenticado'}), 401

        try:
            # Verificar JWT manualmente
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
            print(f"🆔 User ID del token (string): {current_user_id}")
            # Convertir a int para buscar en la BD
            current_user_id = int(current_user_id) if current_user_id else None
            print(f"🆔 User ID convertido a int: {current_user_id}")
        except Exception as jwt_error:
            print(f"❌ Error verificando JWT: {str(jwt_error)}")
            return jsonify({'error': 'Token inválido', 'details': str(jwt_error)}), 401

        if not current_user_id:
            print("⚠️ Token válido pero sin user_id")
            return jsonify({'error': 'No autenticado'}), 401

        user = User.query.get(current_user_id)

        if not user:
            print(f"❌ Usuario con ID {current_user_id} no encontrado en BD")
            return jsonify({'error': 'Usuario no encontrado'}), 404

        print(f"✅ Usuario encontrado: {user.email}")
        print("========== /ME EXITOSO ==========\n")
        return jsonify(user.to_dict()), 200

    except Exception as e:
        print(f"❌❌❌ ERROR EN /ME: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e), 'type': type(e).__name__}), 500


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """Cambiar contraseña del usuario actual"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Contraseña actual y nueva contraseña son requeridas'}), 400

        user = User.query.get(current_user_id)

        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Contraseña actual incorrecta'}), 401

        user.set_password(data['new_password'])
        db.session.commit()

        return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
