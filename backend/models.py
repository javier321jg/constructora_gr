from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    """Modelo para usuarios administradores"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }


class HeroContent(db.Model):
    """Contenido de la sección Hero"""
    __tablename__ = 'hero_content'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, default="Construyendo el Futuro")
    subtitle = db.Column(db.Text, nullable=False, default="Experiencia y calidad en cada proyecto")
    cta_text = db.Column(db.String(50), nullable=False, default="Ver Proyectos")
    background_image = db.Column(db.String(255))
    background_video = db.Column(db.String(255))
    overlay_color = db.Column(db.String(20), default="#1A1A2E")
    overlay_opacity = db.Column(db.Float, default=0.6)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'cta_text': self.cta_text,
            'background_image': self.background_image,
            'background_video': self.background_video,
            'overlay_color': self.overlay_color,
            'overlay_opacity': self.overlay_opacity,
            'updated_at': self.updated_at.isoformat()
        }


class AboutContent(db.Model):
    """Contenido de la sección Nosotros"""
    __tablename__ = 'about_content'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, default="Sobre Nosotros")
    description = db.Column(db.Text, nullable=False)
    mission = db.Column(db.Text, nullable=False)
    vision = db.Column(db.Text, nullable=False)
    values = db.Column(db.Text, nullable=False)  # JSON array
    main_image = db.Column(db.String(255))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'mission': self.mission,
            'vision': self.vision,
            'values': json.loads(self.values) if self.values else [],
            'main_image': self.main_image,
            'updated_at': self.updated_at.isoformat()
        }


class Statistics(db.Model):
    """Estadísticas de la empresa"""
    __tablename__ = 'statistics'

    id = db.Column(db.Integer, primary_key=True)
    years_experience = db.Column(db.Integer, default=10)
    projects_completed = db.Column(db.Integer, default=50)
    happy_clients = db.Column(db.Integer, default=100)
    square_meters = db.Column(db.Integer, default=10000)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'years_experience': self.years_experience,
            'projects_completed': self.projects_completed,
            'happy_clients': self.happy_clients,
            'square_meters': self.square_meters,
            'updated_at': self.updated_at.isoformat()
        }


class Service(db.Model):
    """Servicios ofrecidos"""
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    short_description = db.Column(db.String(200), nullable=False)
    full_description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(255))  # URL o nombre del ícono
    image = db.Column(db.String(255))
    color = db.Column(db.String(20), default="#FF6B35")
    order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'short_description': self.short_description,
            'full_description': self.full_description,
            'icon': self.icon,
            'image': self.image,
            'color': self.color,
            'order': self.order,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Project(db.Model):
    """Proyectos realizados"""
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    client = db.Column(db.String(200))
    location = db.Column(db.String(200))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    category = db.Column(db.String(50), nullable=False)  # Residencial, Comercial, Industrial
    status = db.Column(db.String(50), nullable=False, default="Completado")  # En curso, Completado
    description = db.Column(db.Text, nullable=False)
    main_image = db.Column(db.String(255))
    square_meters = db.Column(db.Integer)
    budget = db.Column(db.Float)
    youtube_video = db.Column(db.String(255))
    is_featured = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = db.relationship('ProjectImage', backref='project', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_images=True):
        data = {
            'id': self.id,
            'name': self.name,
            'client': self.client,
            'location': self.location,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'category': self.category,
            'status': self.status,
            'description': self.description,
            'main_image': self.main_image,
            'square_meters': self.square_meters,
            'budget': self.budget,
            'youtube_video': self.youtube_video,
            'is_featured': self.is_featured,
            'order': self.order,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        if include_images:
            data['images'] = [img.to_dict() for img in self.images]
        return data


class ProjectImage(db.Model):
    """Imágenes de proyectos"""
    __tablename__ = 'project_images'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(200))
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'image_url': self.image_url,
            'caption': self.caption,
            'order': self.order,
            'created_at': self.created_at.isoformat()
        }


class ContactInfo(db.Model):
    """Información de contacto"""
    __tablename__ = 'contact_info'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(300), nullable=False)
    phone_primary = db.Column(db.String(50), nullable=False)
    phone_secondary = db.Column(db.String(50))
    email_general = db.Column(db.String(100), nullable=False)
    email_sales = db.Column(db.String(100))
    whatsapp = db.Column(db.String(50))
    schedule = db.Column(db.String(200), default="Lunes a Viernes: 9:00 - 18:00")
    map_latitude = db.Column(db.Float)
    map_longitude = db.Column(db.Float)
    facebook_url = db.Column(db.String(255))
    instagram_url = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    youtube_url = db.Column(db.String(255))
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'address': self.address,
            'phone_primary': self.phone_primary,
            'phone_secondary': self.phone_secondary,
            'email_general': self.email_general,
            'email_sales': self.email_sales,
            'whatsapp': self.whatsapp,
            'schedule': self.schedule,
            'map_latitude': self.map_latitude,
            'map_longitude': self.map_longitude,
            'facebook_url': self.facebook_url,
            'instagram_url': self.instagram_url,
            'linkedin_url': self.linkedin_url,
            'youtube_url': self.youtube_url,
            'updated_at': self.updated_at.isoformat()
        }


class SiteConfig(db.Model):
    """Configuración general del sitio"""
    __tablename__ = 'site_config'

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False, default="Constructora GR")
    logo_main = db.Column(db.String(255))
    logo_footer = db.Column(db.String(255))
    favicon = db.Column(db.String(255))
    slogan = db.Column(db.String(200), default="Construyendo tus sueños")
    primary_color = db.Column(db.String(20), default="#FF6B35")
    secondary_color = db.Column(db.String(20), default="#004E89")
    accent_color = db.Column(db.String(20), default="#F7B801")
    footer_copyright = db.Column(db.String(200))
    cookie_message = db.Column(db.Text)
    meta_description = db.Column(db.Text)
    meta_keywords = db.Column(db.Text)
    enable_3d_animations = db.Column(db.Boolean, default=True)
    particle_speed = db.Column(db.Float, default=1.0)
    particle_color = db.Column(db.String(20), default="#FF6B35")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'logo_main': self.logo_main,
            'logo_footer': self.logo_footer,
            'favicon': self.favicon,
            'slogan': self.slogan,
            'primary_color': self.primary_color,
            'secondary_color': self.secondary_color,
            'accent_color': self.accent_color,
            'footer_copyright': self.footer_copyright,
            'cookie_message': self.cookie_message,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'enable_3d_animations': self.enable_3d_animations,
            'particle_speed': self.particle_speed,
            'particle_color': self.particle_color,
            'updated_at': self.updated_at.isoformat()
        }


class ContactMessage(db.Model):
    """Mensajes de contacto recibidos"""
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50))
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }
