"""
Script para inicializar las carpetas necesarias del proyecto
"""
import os

def create_folders():
    """Crear todas las carpetas necesarias para el proyecto"""

    # Obtener la ruta base del proyecto
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Carpetas a crear
    folders = [
        os.path.join(base_dir, 'uploads'),
        os.path.join(base_dir, 'uploads', 'services'),
        os.path.join(base_dir, 'uploads', 'projects'),
        os.path.join(base_dir, 'uploads', 'general'),
        os.path.join(base_dir, 'uploads', 'videos'),
        os.path.join(base_dir, 'uploads', 'models'),
        os.path.join(base_dir, '..', 'database'),
    ]

    print("=" * 60)
    print("🔧 Inicializando carpetas del proyecto...")
    print("=" * 60)

    for folder in folders:
        if not os.path.exists(folder):
            os.makedirs(folder)
            print(f"✅ Creada: {folder}")
        else:
            print(f"✓  Ya existe: {folder}")

    print("\n" + "=" * 60)
    print("✨ Todas las carpetas están listas!")
    print("=" * 60)
    print("\n📁 Estructura de carpetas:")
    print("  backend/")
    print("    └── uploads/")
    print("        ├── services/    (imágenes de servicios)")
    print("        ├── projects/    (imágenes de proyectos)")
    print("        ├── general/     (imágenes generales)")
    print("        ├── videos/      (videos de fondo)")
    print("        └── models/      (modelos 3D)")
    print("  database/")
    print("    └── constructora.db")
    print("\n")

if __name__ == '__main__':
    create_folders()
