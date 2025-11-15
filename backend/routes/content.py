from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, HeroContent, AboutContent, Statistics, Service, Project, ProjectImage, SiteConfig
import json
from datetime import datetime

content_bp = Blueprint('content', __name__)

# ============= HERO CONTENT =============
@content_bp.route('/hero', methods=['GET'])
def get_hero():
    """Obtener contenido de la sección Hero"""
    try:
        hero = HeroContent.query.first()
        if not hero:
            return jsonify({'error': 'Contenido hero no encontrado'}), 404
        return jsonify(hero.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/hero', methods=['PUT'])
@jwt_required()
def update_hero():
    """Actualizar contenido de la sección Hero"""
    try:
        data = request.get_json()
        hero = HeroContent.query.first()

        if not hero:
            hero = HeroContent()
            db.session.add(hero)

        if 'title' in data:
            hero.title = data['title']
        if 'subtitle' in data:
            hero.subtitle = data['subtitle']
        if 'cta_text' in data:
            hero.cta_text = data['cta_text']
        if 'background_image' in data:
            hero.background_image = data['background_image']
        if 'background_video' in data:
            hero.background_video = data['background_video']
        if 'overlay_color' in data:
            hero.overlay_color = data['overlay_color']
        if 'overlay_opacity' in data:
            hero.overlay_opacity = data['overlay_opacity']

        db.session.commit()
        return jsonify({'message': 'Contenido hero actualizado', 'data': hero.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= ABOUT CONTENT =============
@content_bp.route('/about', methods=['GET'])
def get_about():
    """Obtener contenido de la sección Nosotros"""
    try:
        about = AboutContent.query.first()
        if not about:
            return jsonify({'error': 'Contenido about no encontrado'}), 404
        return jsonify(about.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/about', methods=['PUT'])
@jwt_required()
def update_about():
    """Actualizar contenido de la sección Nosotros"""
    try:
        data = request.get_json()
        about = AboutContent.query.first()

        if not about:
            about = AboutContent()
            db.session.add(about)

        if 'title' in data:
            about.title = data['title']
        if 'description' in data:
            about.description = data['description']
        if 'mission' in data:
            about.mission = data['mission']
        if 'vision' in data:
            about.vision = data['vision']
        if 'values' in data:
            about.values = json.dumps(data['values'])
        if 'main_image' in data:
            about.main_image = data['main_image']

        db.session.commit()
        return jsonify({'message': 'Contenido about actualizado', 'data': about.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= STATISTICS =============
@content_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """Obtener estadísticas"""
    try:
        stats = Statistics.query.first()
        if not stats:
            return jsonify({'error': 'Estadísticas no encontradas'}), 404
        return jsonify(stats.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/statistics', methods=['PUT'])
@jwt_required()
def update_statistics():
    """Actualizar estadísticas"""
    try:
        data = request.get_json()
        stats = Statistics.query.first()

        if not stats:
            stats = Statistics()
            db.session.add(stats)

        if 'years_experience' in data:
            stats.years_experience = data['years_experience']
        if 'projects_completed' in data:
            stats.projects_completed = data['projects_completed']
        if 'happy_clients' in data:
            stats.happy_clients = data['happy_clients']
        if 'square_meters' in data:
            stats.square_meters = data['square_meters']

        db.session.commit()
        return jsonify({'message': 'Estadísticas actualizadas', 'data': stats.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= SERVICES =============
@content_bp.route('/services', methods=['GET'])
def get_services():
    """Obtener todos los servicios (solo activos para público)"""
    try:
        show_all = request.args.get('all', 'false').lower() == 'true'

        if show_all:
            services = Service.query.order_by(Service.order).all()
        else:
            services = Service.query.filter_by(is_active=True).order_by(Service.order).all()

        return jsonify([service.to_dict() for service in services]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """Obtener un servicio específico"""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Servicio no encontrado'}), 404
        return jsonify(service.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    """Crear un nuevo servicio"""
    try:
        data = request.get_json()

        if not data.get('name') or not data.get('short_description') or not data.get('full_description'):
            return jsonify({'error': 'Nombre, descripción corta y descripción completa son requeridos'}), 400

        service = Service(
            name=data['name'],
            short_description=data['short_description'],
            full_description=data['full_description'],
            icon=data.get('icon'),
            image=data.get('image'),
            color=data.get('color', '#FF6B35'),
            order=data.get('order', 0),
            is_active=data.get('is_active', True)
        )

        db.session.add(service)
        db.session.commit()

        return jsonify({'message': 'Servicio creado', 'data': service.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@content_bp.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    """Actualizar un servicio"""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Servicio no encontrado'}), 404

        data = request.get_json()

        if 'name' in data:
            service.name = data['name']
        if 'short_description' in data:
            service.short_description = data['short_description']
        if 'full_description' in data:
            service.full_description = data['full_description']
        if 'icon' in data:
            service.icon = data['icon']
        if 'image' in data:
            service.image = data['image']
        if 'color' in data:
            service.color = data['color']
        if 'order' in data:
            service.order = data['order']
        if 'is_active' in data:
            service.is_active = data['is_active']

        db.session.commit()
        return jsonify({'message': 'Servicio actualizado', 'data': service.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@content_bp.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    """Eliminar un servicio"""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Servicio no encontrado'}), 404

        db.session.delete(service)
        db.session.commit()

        return jsonify({'message': 'Servicio eliminado'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= PROJECTS =============
@content_bp.route('/projects', methods=['GET'])
def get_projects():
    """Obtener todos los proyectos"""
    try:
        category = request.args.get('category')
        status = request.args.get('status')
        featured = request.args.get('featured', 'false').lower() == 'true'

        query = Project.query

        if category:
            query = query.filter_by(category=category)
        if status:
            query = query.filter_by(status=status)
        if featured:
            query = query.filter_by(is_featured=True)

        projects = query.order_by(Project.order, Project.created_at.desc()).all()
        return jsonify([project.to_dict() for project in projects]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Obtener un proyecto específico"""
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Proyecto no encontrado'}), 404
        return jsonify(project.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Crear un nuevo proyecto"""
    try:
        data = request.get_json()

        if not data.get('name') or not data.get('category') or not data.get('description'):
            return jsonify({'error': 'Nombre, categoría y descripción son requeridos'}), 400

        project = Project(
            name=data['name'],
            client=data.get('client'),
            location=data.get('location'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            category=data['category'],
            status=data.get('status', 'Completado'),
            description=data['description'],
            main_image=data.get('main_image'),
            square_meters=data.get('square_meters'),
            budget=data.get('budget'),
            youtube_video=data.get('youtube_video'),
            is_featured=data.get('is_featured', False),
            order=data.get('order', 0)
        )

        db.session.add(project)
        db.session.commit()

        # Agregar imágenes si se proporcionan
        if data.get('images'):
            for idx, img_url in enumerate(data['images']):
                img = ProjectImage(
                    project_id=project.id,
                    image_url=img_url,
                    order=idx
                )
                db.session.add(img)
            db.session.commit()

        return jsonify({'message': 'Proyecto creado', 'data': project.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@content_bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Actualizar un proyecto"""
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Proyecto no encontrado'}), 404

        data = request.get_json()

        if 'name' in data:
            project.name = data['name']
        if 'client' in data:
            project.client = data['client']
        if 'location' in data:
            project.location = data['location']
        if 'start_date' in data:
            project.start_date = datetime.fromisoformat(data['start_date']) if data['start_date'] else None
        if 'end_date' in data:
            project.end_date = datetime.fromisoformat(data['end_date']) if data['end_date'] else None
        if 'category' in data:
            project.category = data['category']
        if 'status' in data:
            project.status = data['status']
        if 'description' in data:
            project.description = data['description']
        if 'main_image' in data:
            project.main_image = data['main_image']
        if 'square_meters' in data:
            project.square_meters = data['square_meters']
        if 'budget' in data:
            project.budget = data['budget']
        if 'youtube_video' in data:
            project.youtube_video = data['youtube_video']
        if 'is_featured' in data:
            project.is_featured = data['is_featured']
        if 'order' in data:
            project.order = data['order']

        db.session.commit()
        return jsonify({'message': 'Proyecto actualizado', 'data': project.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@content_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Eliminar un proyecto"""
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Proyecto no encontrado'}), 404

        db.session.delete(project)
        db.session.commit()

        return jsonify({'message': 'Proyecto eliminado'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= PROJECT IMAGES =============
@content_bp.route('/projects/<int:project_id>/images', methods=['POST'])
@jwt_required()
def add_project_image(project_id):
    """Agregar imagen a un proyecto"""
    try:
        project = Project.query.get(project_id)
        if not project:
            return jsonify({'error': 'Proyecto no encontrado'}), 404

        data = request.get_json()
        if not data.get('image_url'):
            return jsonify({'error': 'URL de imagen requerida'}), 400

        image = ProjectImage(
            project_id=project_id,
            image_url=data['image_url'],
            caption=data.get('caption'),
            order=data.get('order', 0)
        )

        db.session.add(image)
        db.session.commit()

        return jsonify({'message': 'Imagen agregada', 'data': image.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@content_bp.route('/projects/<int:project_id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_project_image(project_id, image_id):
    """Eliminar imagen de un proyecto"""
    try:
        image = ProjectImage.query.filter_by(id=image_id, project_id=project_id).first()
        if not image:
            return jsonify({'error': 'Imagen no encontrada'}), 404

        db.session.delete(image)
        db.session.commit()

        return jsonify({'message': 'Imagen eliminada'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============= SITE CONFIG =============
@content_bp.route('/config', methods=['GET'])
def get_config():
    """Obtener configuración del sitio"""
    try:
        config = SiteConfig.query.first()
        if not config:
            return jsonify({'error': 'Configuración no encontrada'}), 404
        return jsonify(config.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@content_bp.route('/config', methods=['PUT'])
@jwt_required()
def update_config():
    """Actualizar configuración del sitio"""
    try:
        data = request.get_json()
        config = SiteConfig.query.first()

        if not config:
            config = SiteConfig()
            db.session.add(config)

        # Actualizar todos los campos posibles
        fields = [
            'company_name', 'logo_main', 'logo_footer', 'favicon', 'slogan',
            'primary_color', 'secondary_color', 'accent_color', 'footer_copyright',
            'cookie_message', 'meta_description', 'meta_keywords',
            'enable_3d_animations', 'particle_speed', 'particle_color'
        ]

        for field in fields:
            if field in data:
                setattr(config, field, data[field])

        db.session.commit()
        return jsonify({'message': 'Configuración actualizada', 'data': config.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
