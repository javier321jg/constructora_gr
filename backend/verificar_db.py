"""
Script para verificar y reparar la base de datos
Verifica si la base de datos existe y si el usuario admin está configurado correctamente
"""
import os
import sys
from app import create_app
from models import db, User

def main():
    print("=" * 70)
    print("🔍 VERIFICACIÓN Y REPARACIÓN DE BASE DE DATOS")
    print("=" * 70)

    # Crear aplicación
    print("\n1️⃣ Creando aplicación Flask...")
    try:
        app = create_app()
        print("   ✅ Aplicación creada exitosamente")
    except Exception as e:
        print(f"   ❌ Error al crear aplicación: {e}")
        sys.exit(1)

    with app.app_context():
        # Verificar ruta de base de datos
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        print(f"\n2️⃣ URI de base de datos:")
        print(f"   {db_uri}")

        # Extraer ruta del archivo de la URI
        if db_uri.startswith('sqlite:///'):
            db_path = db_uri.replace('sqlite:///', '').replace('/', os.sep)
            # En Windows, la URI es sqlite:///C:/path/to/db
            # Necesitamos manejar el caso de drive letters
            if len(db_path) > 1 and db_path[1] == ':':
                # Ya tiene formato de Windows correcto
                pass
            print(f"\n3️⃣ Archivo de base de datos:")
            print(f"   {db_path}")
            print(f"   ¿Existe? {'✅ SÍ' if os.path.exists(db_path) else '❌ NO'}")

            if os.path.exists(db_path):
                size = os.path.getsize(db_path)
                print(f"   Tamaño: {size} bytes")

        # Intentar crear todas las tablas
        print("\n4️⃣ Creando/verificando tablas...")
        try:
            db.create_all()
            print("   ✅ Tablas creadas/verificadas exitosamente")
        except Exception as e:
            print(f"   ❌ Error al crear tablas: {e}")
            sys.exit(1)

        # Verificar si existe el usuario admin
        print("\n5️⃣ Verificando usuario admin...")
        admin_email = 'admin@constructora.com'
        admin_password = 'Admin123!'

        try:
            admin = User.query.filter_by(email=admin_email).first()

            if admin:
                print(f"   ✅ Usuario admin encontrado")
                print(f"      Email: {admin.email}")
                print(f"      Nombre: {admin.name}")
                print(f"      ID: {admin.id}")
                print(f"      Creado: {admin.created_at}")

                # Probar verificación de contraseña
                print("\n6️⃣ Probando verificación de contraseña...")
                if admin.check_password(admin_password):
                    print(f"   ✅ La contraseña '{admin_password}' es CORRECTA")
                else:
                    print(f"   ⚠️  La contraseña '{admin_password}' NO coincide")
                    print(f"   🔧 Actualizando contraseña a '{admin_password}'...")
                    admin.set_password(admin_password)
                    db.session.commit()
                    print(f"   ✅ Contraseña actualizada exitosamente")
            else:
                print(f"   ⚠️  Usuario admin NO encontrado")
                print(f"\n6️⃣ Creando usuario admin...")
                admin = User(
                    email=admin_email,
                    name='Administrador'
                )
                admin.set_password(admin_password)
                db.session.add(admin)
                db.session.commit()
                print(f"   ✅ Usuario admin creado exitosamente")
                print(f"      Email: {admin_email}")
                print(f"      Contraseña: {admin_password}")

        except Exception as e:
            print(f"   ❌ Error: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

        # Mostrar todos los usuarios
        print("\n7️⃣ Listado de todos los usuarios en la base de datos:")
        try:
            all_users = User.query.all()
            if all_users:
                for user in all_users:
                    print(f"   - ID: {user.id} | Email: {user.email} | Nombre: {user.name}")
            else:
                print("   ⚠️  No hay usuarios en la base de datos")
        except Exception as e:
            print(f"   ❌ Error al listar usuarios: {e}")

    print("\n" + "=" * 70)
    print("✅ VERIFICACIÓN COMPLETADA")
    print("=" * 70)
    print("\n📋 Credenciales de acceso:")
    print(f"   Email: {admin_email}")
    print(f"   Contraseña: {admin_password}")
    print("\n🚀 Puedes iniciar la aplicación con: python app.py")
    print("=" * 70)

if __name__ == '__main__':
    main()
