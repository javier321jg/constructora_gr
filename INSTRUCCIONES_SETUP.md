# 🚀 Instrucciones de Configuración Inicial

## 📋 Pasos para Configurar el Proyecto

### 1️⃣ Inicializar Carpetas (IMPORTANTE - Hacer Primero)

Antes de ejecutar el servidor, crea las carpetas necesarias:

**En Windows (PowerShell):**
```powershell
cd backend
python init_folders.py
```

**En Linux/Mac:**
```bash
cd backend
python3 init_folders.py
```

Esto creará:
```
backend/
  └── uploads/
      ├── services/    # Imágenes de servicios
      ├── projects/    # Imágenes de proyectos
      ├── general/     # Imágenes generales
      ├── videos/      # Videos de fondo para Hero
      └── models/      # Modelos 3D

database/
  └── constructora.db  # Base de datos SQLite
```

### 2️⃣ Instalar Dependencias

**Backend:**
```powershell
cd backend
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
npm install
```

### 3️⃣ Ejecutar el Proyecto

**Terminal 1 - Backend:**
```powershell
cd backend
python app.py
```

Deberías ver:
```
==================================================
🚀 Servidor iniciado en http://localhost:5000
📊 Estado de APIs disponible en /api/health
==================================================
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### 4️⃣ Acceder a la Aplicación

- **Sitio público:** http://localhost:5173
- **Panel de admin:** http://localhost:5173/admin/login

**Credenciales de admin:**
- Email: `admin@constructora.com`
- Password: `Admin123!`

## 📁 Estructura de Archivos Soportados

### Imágenes
- **Formatos:** PNG, JPG, JPEG, GIF, WEBP, SVG
- **Tamaño máximo:** 50MB
- **Uso:** Servicios, proyectos, Hero (imagen de fondo)

### Videos
- **Formatos:** MP4, WEBM, MOV
- **Tamaño máximo:** 50MB
- **Uso:** Hero (video de fondo)

### Modelos 3D
- **Formatos:** GLB, GLTF, OBJ, FBX
- **Tamaño máximo:** 50MB
- **Uso:** Futuras implementaciones

## 🔧 Solución de Problemas

### Error 404 al cargar imágenes
1. Verifica que ejecutaste `python init_folders.py`
2. Revisa que la carpeta `backend/uploads` exista
3. Comprueba los logs del servidor para ver la ruta donde se guardan

### Error de autenticación (401/422)
1. Limpia el localStorage del navegador (DevTools > Application > Storage > Clear)
2. Usa modo incógnito
3. Verifica que el backend esté corriendo

### Base de datos no se crea
1. Ejecuta `python init_folders.py` para crear la carpeta database
2. El backend creará automáticamente la base de datos al iniciar

## 📝 Notas

- Las imágenes se optimizan automáticamente al subirlas
- Los videos y modelos 3D no se optimizan, solo se almacenan
- La carpeta `uploads/` está en `.gitignore` y no se sube a Git
- Haz backup de la carpeta `uploads/` y `database/` regularmente
