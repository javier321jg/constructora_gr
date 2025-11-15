"""
Script para inicializar datos de ejemplo en la base de datos
"""
from app import create_app
from models import db, Service, Project, ProjectImage
from datetime import date

def seed_services():
    """Crear servicios de ejemplo"""
    services = [
        Service(
            name="Construcción Residencial",
            short_description="Casas y desarrollos habitacionales de alta calidad con diseños personalizados.",
            full_description="Especializados en la construcción de viviendas unifamiliares, desarrollos residenciales y condominios. Ofrecemos diseños personalizados, materiales de primera calidad y acabados de lujo.",
            icon="Home",
            color="#FF6B35",
            order=1,
            is_active=True
        ),
        Service(
            name="Construcción Comercial",
            short_description="Espacios comerciales funcionales, modernos y adaptados a tu negocio.",
            full_description="Construcción de oficinas, locales comerciales, centros comerciales y edificios corporativos. Diseños funcionales que maximizan el espacio y la productividad.",
            icon="Building2",
            color="#004E89",
            order=2,
            is_active=True
        ),
        Service(
            name="Construcción Industrial",
            short_description="Infraestructura industrial robusta, eficiente y de gran escala.",
            full_description="Naves industriales, almacenes, plantas de producción y centros logísticos. Estructuras diseñadas para soportar operaciones de alto rendimiento.",
            icon="Warehouse",
            color="#F7B801",
            order=3,
            is_active=True
        ),
        Service(
            name="Remodelaciones",
            short_description="Transformamos y modernizamos espacios existentes con creatividad.",
            full_description="Servicios integrales de remodelación para hogares y negocios. Renovamos cocinas, baños, fachadas y espacios completos con diseños contemporáneos.",
            icon="Wrench",
            color="#06D6A0",
            order=4,
            is_active=True
        ),
        Service(
            name="Diseño y Arquitectura",
            short_description="Proyectos arquitectónicos innovadores y funcionales a medida.",
            full_description="Diseño arquitectónico completo desde el concepto hasta los planos ejecutivos. Creamos espacios que combinan estética, funcionalidad y sostenibilidad.",
            icon="Ruler",
            color="#9B59B6",
            order=5,
            is_active=True
        ),
    ]

    for service in services:
        existing = Service.query.filter_by(name=service.name).first()
        if not existing:
            db.session.add(service)
            print(f"✓ Servicio creado: {service.name}")

    db.session.commit()
    print(f"\n{len(services)} servicios inicializados")


def seed_projects():
    """Crear proyectos de ejemplo"""
    projects = [
        {
            'project': Project(
                name="Residencial Los Robles",
                client="Inmobiliaria Del Valle",
                location="Ciudad de México, CDMX",
                start_date=date(2022, 1, 15),
                end_date=date(2023, 6, 30),
                category="Residencial",
                status="Completado",
                description="Desarrollo residencial de lujo con 45 unidades habitacionales. Incluye áreas verdes, alberca, gimnasio y seguridad 24/7. Diseño contemporáneo con acabados de primera calidad y tecnología sustentable.",
                square_meters=12500,
                budget=45000000,
                is_featured=True,
                order=1
            ),
            'images': []
        },
        {
            'project': Project(
                name="Centro Comercial Plaza Norte",
                client="Grupo Comercial MX",
                location="Monterrey, Nuevo León",
                start_date=date(2021, 3, 1),
                end_date=date(2022, 11, 15),
                category="Comercial",
                status="Completado",
                description="Centro comercial de 3 niveles con 120 locales comerciales, cines, zona de restaurantes y estacionamiento para 500 vehículos. Diseño moderno con amplios espacios y excelente iluminación natural.",
                square_meters=35000,
                budget=120000000,
                is_featured=True,
                order=2
            ),
            'images': []
        },
        {
            'project': Project(
                name="Planta Industrial TechPro",
                client="TechPro Manufacturing",
                location="Querétaro, Querétaro",
                start_date=date(2022, 6, 1),
                end_date=date(2023, 12, 20),
                category="Industrial",
                status="Completado",
                description="Planta de manufactura de alta tecnología con instalaciones para producción, almacenamiento y oficinas administrativas. Infraestructura de primera clase con sistemas automatizados.",
                square_meters=28000,
                budget=95000000,
                is_featured=False,
                order=3
            ),
            'images': []
        },
        {
            'project': Project(
                name="Torre Corporativa Skyline",
                client="Corporativo Internacional",
                location="Guadalajara, Jalisco",
                start_date=date(2023, 2, 1),
                end_date=None,
                category="Comercial",
                status="En curso",
                description="Edificio corporativo de 20 pisos con oficinas premium, helipuerto y áreas comunes de lujo. Diseño sustentable con certificación LEED. Avance actual: 65%",
                square_meters=45000,
                budget=180000000,
                is_featured=True,
                order=4
            ),
            'images': []
        },
        {
            'project': Project(
                name="Conjunto Habitacional Villa Verde",
                client="Desarrollos Habitacionales SA",
                location="Puebla, Puebla",
                start_date=date(2022, 8, 15),
                end_date=date(2023, 10, 30),
                category="Residencial",
                status="Completado",
                description="Conjunto de 80 viviendas de interés social con áreas recreativas, parques infantiles y servicios comunitarios. Construcción sustentable y accesible.",
                square_meters=18000,
                budget=32000000,
                is_featured=False,
                order=5
            ),
            'images': []
        },
        {
            'project': Project(
                name="Centro Logístico CargoHub",
                client="LogiTrans México",
                location="Estado de México",
                start_date=date(2023, 1, 10),
                end_date=None,
                category="Industrial",
                status="En curso",
                description="Centro de distribución y logística con bodegas de última generación, oficinas administrativas y patio de maniobras para tractocamiones. Avance: 40%",
                square_meters=52000,
                budget=145000000,
                is_featured=False,
                order=6
            ),
            'images': []
        },
    ]

    for project_data in projects:
        project = project_data['project']
        existing = Project.query.filter_by(name=project.name).first()

        if not existing:
            db.session.add(project)
            db.session.flush()  # Para obtener el ID del proyecto
            print(f"✓ Proyecto creado: {project.name}")

            # Agregar imágenes de ejemplo si se proporcionan
            for img_data in project_data['images']:
                img = ProjectImage(
                    project_id=project.id,
                    image_url=img_data['url'],
                    caption=img_data.get('caption'),
                    order=img_data.get('order', 0)
                )
                db.session.add(img)

    db.session.commit()
    print(f"\n{len(projects)} proyectos inicializados")


def main():
    """Ejecutar seed de datos"""
    app = create_app()

    with app.app_context():
        print("=== Inicializando datos de ejemplo ===\n")

        print("Creando servicios...")
        seed_services()

        print("\nCreando proyectos...")
        seed_projects()

        print("\n=== ¡Datos de ejemplo creados exitosamente! ===")
        print("\nPuedes iniciar sesión con:")
        print("  Email: admin@constructora.com")
        print("  Contraseña: Admin123!")


if __name__ == '__main__':
    main()
