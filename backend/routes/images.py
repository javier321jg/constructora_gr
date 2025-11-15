import os
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from PIL import Image
import uuid

images_bp = Blueprint('images', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}
UPLOAD_FOLDER = './uploads'

def allowed_file(filename):
    """Verificar si el archivo tiene una extensión permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def optimize_image(file_path, max_size=(1920, 1080), quality=85):
    """Optimizar imagen: redimensionar y comprimir"""
    try:
        # No optimizar SVGs
        if file_path.lower().endswith('.svg'):
            return

        with Image.open(file_path) as img:
            # Convertir RGBA a RGB si es necesario
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            # Redimensionar si es más grande que max_size
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Guardar con compresión
            img.save(file_path, optimize=True, quality=quality)

    except Exception as e:
        print(f"Error optimizando imagen: {e}")


@images_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    """Subir una imagen"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se proporcionó ningún archivo'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'Nombre de archivo vacío'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Tipo de archivo no permitido'}), 400

        # Generar nombre único para el archivo
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"

        # Determinar carpeta de destino
        folder = request.form.get('folder', 'general')
        upload_path = os.path.join(UPLOAD_FOLDER, folder)
        os.makedirs(upload_path, exist_ok=True)

        # Guardar archivo
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)

        # Optimizar imagen
        optimize_image(file_path)

        # URL relativa del archivo
        file_url = f"/api/images/serve/{folder}/{unique_filename}"

        return jsonify({
            'message': 'Imagen subida exitosamente',
            'filename': unique_filename,
            'url': file_url,
            'folder': folder
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@images_bp.route('/upload-multiple', methods=['POST'])
@jwt_required()
def upload_multiple_images():
    """Subir múltiples imágenes"""
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No se proporcionaron archivos'}), 400

        files = request.files.getlist('files')
        folder = request.form.get('folder', 'general')
        upload_path = os.path.join(UPLOAD_FOLDER, folder)
        os.makedirs(upload_path, exist_ok=True)

        uploaded_files = []

        for file in files:
            if file.filename == '':
                continue

            if not allowed_file(file.filename):
                continue

            filename = secure_filename(file.filename)
            name, ext = os.path.splitext(filename)
            unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"

            file_path = os.path.join(upload_path, unique_filename)
            file.save(file_path)

            # Optimizar imagen
            optimize_image(file_path)

            file_url = f"/api/images/serve/{folder}/{unique_filename}"

            uploaded_files.append({
                'filename': unique_filename,
                'url': file_url,
                'folder': folder
            })

        return jsonify({
            'message': f'{len(uploaded_files)} imágenes subidas exitosamente',
            'files': uploaded_files
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@images_bp.route('/serve/<folder>/<filename>', methods=['GET'])
def serve_image(folder, filename):
    """Servir una imagen"""
    try:
        upload_path = os.path.join(UPLOAD_FOLDER, folder)
        return send_from_directory(upload_path, filename)
    except Exception as e:
        return jsonify({'error': 'Imagen no encontrada'}), 404


@images_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_image():
    """Eliminar una imagen"""
    try:
        data = request.get_json()
        if not data.get('url'):
            return jsonify({'error': 'URL de imagen requerida'}), 400

        # Extraer folder y filename del URL
        url_parts = data['url'].split('/')
        if len(url_parts) < 2:
            return jsonify({'error': 'URL inválida'}), 400

        folder = url_parts[-2]
        filename = url_parts[-1]

        file_path = os.path.join(UPLOAD_FOLDER, folder, filename)

        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'message': 'Imagen eliminada'}), 200
        else:
            return jsonify({'error': 'Imagen no encontrada'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@images_bp.route('/list/<folder>', methods=['GET'])
@jwt_required()
def list_images(folder):
    """Listar imágenes de una carpeta"""
    try:
        upload_path = os.path.join(UPLOAD_FOLDER, folder)

        if not os.path.exists(upload_path):
            return jsonify([]), 200

        files = []
        for filename in os.listdir(upload_path):
            if allowed_file(filename):
                file_path = os.path.join(upload_path, filename)
                file_stat = os.stat(file_path)
                files.append({
                    'filename': filename,
                    'url': f"/api/images/serve/{folder}/{filename}",
                    'size': file_stat.st_size,
                    'modified': file_stat.st_mtime
                })

        # Ordenar por fecha de modificación (más reciente primero)
        files.sort(key=lambda x: x['modified'], reverse=True)

        return jsonify(files), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
