import os
import sys

print("=" * 60)
print("DIAGNÓSTICO DEL SISTEMA")
print("=" * 60)

# 1. Verificar directorio actual
print(f"\n1. Directorio actual:")
print(f"   {os.getcwd()}")

# 2. Verificar archivo app.py
basedir = os.path.abspath(os.path.dirname(__file__))
print(f"\n2. Directorio de app.py (basedir):")
print(f"   {basedir}")

# 3. Verificar directorio raíz del proyecto
project_root = os.path.dirname(basedir)
print(f"\n3. Directorio raíz del proyecto:")
print(f"   {project_root}")

# 4. Verificar ruta de la base de datos
database_path = os.path.join(project_root, 'database', 'constructora.db')
print(f"\n4. Ruta completa de la base de datos:")
print(f"   {database_path}")

# 5. Verificar carpeta database
database_dir = os.path.dirname(database_path)
print(f"\n5. Carpeta de base de datos:")
print(f"   {database_dir}")
print(f"   ¿Existe? {os.path.exists(database_dir)}")

# 6. Intentar crear la carpeta
print(f"\n6. Intentando crear carpeta database...")
try:
    if not os.path.exists(database_dir):
        os.makedirs(database_dir)
        print(f"   ✓ Carpeta creada exitosamente")
    else:
        print(f"   ✓ Carpeta ya existe")

    # Verificar permisos de escritura
    test_file = os.path.join(database_dir, 'test.txt')
    with open(test_file, 'w') as f:
        f.write('test')
    os.remove(test_file)
    print(f"   ✓ Permisos de escritura: OK")

except Exception as e:
    print(f"   ✗ Error: {e}")

# 7. Verificar Python y sistema
print(f"\n7. Información del sistema:")
print(f"   Python: {sys.version}")
print(f"   Plataforma: {sys.platform}")

# 8. Listar contenido del directorio raíz
print(f"\n8. Contenido del directorio raíz del proyecto:")
try:
    items = os.listdir(project_root)
    for item in sorted(items):
        item_path = os.path.join(project_root, item)
        item_type = "DIR" if os.path.isdir(item_path) else "FILE"
        print(f"   [{item_type}] {item}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "=" * 60)
print("FIN DEL DIAGNÓSTICO")
print("=" * 60)
