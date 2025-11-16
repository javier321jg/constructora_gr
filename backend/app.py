import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db
from datetime import timedelta

# Cargar variables de entorno
load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configuración
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # Configuración de base de datos
    # IMPORTANTE: Siempre usar rutas absolutas para compatibilidad con Windows
    basedir = os.path.abspath(os.path.dirname(__file__))
    project_root = os.path.dirname(basedir)

    # Construir ruta absoluta para la base de datos
    database_path = os.path.join(project_root, 'database', 'constructora.db')
    database_dir = os.path.dirname(database_path)

    # Crear carpeta de base de datos si no existe
    if not os.path.exists(database_dir):
        os.makedirs(database_dir, exist_ok=True)
        print(f"✓ Directorio de base de datos creado: {database_dir}")

    # Convertir ruta a formato URI para SQLite (usar / en lugar de \)
    # En Windows: C:\path\to\db.db -> sqlite:///C:/path/to/db.db
    database_uri_path = database_path.replace('\\', '/')

    # FORZAR uso de ruta absoluta (ignorar DATABASE_URL del .env si es relativa)
    database_url = f'sqlite:///{database_uri_path}'

    print(f"📍 Ruta de base de datos: {database_path}")
    print(f"📍 URI de base de datos: {database_url}")

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configuración de uploads - usar ruta absoluta
    upload_folder_from_env = os.getenv('UPLOAD_FOLDER', 'uploads')

    # Si la ruta del .env es relativa, convertirla a absoluta
    if not os.path.isabs(upload_folder_from_env):
        upload_folder = os.path.join(basedir, upload_folder_from_env)
    else:
        upload_folder = upload_folder_from_env

    upload_folder = os.path.abspath(upload_folder)
    app.config['UPLOAD_FOLDER'] = upload_folder
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 5242880))  # 5MB

    # Crear carpeta de uploads si no existe
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder, exist_ok=True)
        print(f"✓ Directorio de uploads creado: {upload_folder}")

    for subfolder in ['projects', 'services', 'general']:
        subfolder_path = os.path.join(upload_folder, subfolder)
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path, exist_ok=True)

    # Inicializar extensiones
    db.init_app(app)
    jwt = JWTManager(app)

    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [os.getenv('FRONTEND_URL', 'http://localhost:5173')],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
        # Inicializar datos por defecto
        from models import User, HeroContent, AboutContent, Statistics, ContactInfo, SiteConfig

        # Crear usuario admin si no existe
        if not User.query.filter_by(email='admin@constructora.com').first():
            admin = User(
                email='admin@constructora.com',
                name='Administrador'
            )
            admin.set_password('Admin123!')
            db.session.add(admin)

        # Crear contenido hero por defecto
        if not HeroContent.query.first():
            hero = HeroContent(
                title="Construyendo el Futuro",
                subtitle="Experiencia, calidad y compromiso en cada proyecto de construcción",
                cta_text="Ver Proyectos"
            )
            db.session.add(hero)

        # Crear contenido about por defecto
        if not AboutContent.query.first():
            about = AboutContent(
                title="Sobre Nosotros",
                description="Somos una empresa constructora con años de experiencia en el sector, comprometidos con la calidad y la satisfacción de nuestros clientes.",
                mission="Construir proyectos de excelencia que superen las expectativas de nuestros clientes.",
                vision="Ser la empresa constructora líder en innovación y calidad en la región.",
                values='["Calidad", "Compromiso", "Innovación", "Responsabilidad", "Trabajo en equipo"]'
            )
            db.session.add(about)

        # Crear estadísticas por defecto
        if not Statistics.query.first():
            stats = Statistics(
                years_experience=15,
                projects_completed=120,
                happy_clients=200,
                square_meters=50000
            )
            db.session.add(stats)

        # Crear info de contacto por defecto
        if not ContactInfo.query.first():
            contact = ContactInfo(
                address="Av. Principal #123, Ciudad, País",
                phone_primary="+1 234 567 8900",
                email_general="info@constructora.com",
                schedule="Lunes a Viernes: 9:00 - 18:00",
                map_latitude=19.4326,
                map_longitude=-99.1332
            )
            db.session.add(contact)

        # Crear configuración del sitio por defecto
        if not SiteConfig.query.first():
            config = SiteConfig(
                company_name="Constructora GR",
                slogan="Construyendo tus sueños",
                footer_copyright="© 2024 Constructora GR. Todos los derechos reservados.",
                meta_description="Empresa constructora líder con experiencia en proyectos residenciales, comerciales e industriales.",
                meta_keywords="construcción, constructora, proyectos, arquitectura, edificación"
            )
            db.session.add(config)

        db.session.commit()

    # Registrar blueprints
    from routes.auth import auth_bp
    from routes.content import content_bp
    from routes.images import images_bp
    from routes.contact import contact_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(content_bp, url_prefix='/api/content')
    app.register_blueprint(images_bp, url_prefix='/api/images')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')

    # Ruta de salud
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'message': 'API is running'}), 200

    # Manejador de errores
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
