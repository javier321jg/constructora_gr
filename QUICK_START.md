# 🚀 Guía de Inicio Rápido - Constructora GR

## Instalación en 5 minutos

### 1️⃣ Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
python app.py
```

✅ Backend corriendo en: **http://localhost:5000**

### 2️⃣ Frontend (React)

```bash
# Nueva terminal
cd frontend
npm install
npm run dev
```

✅ Frontend corriendo en: **http://localhost:5173**

## 🎯 Acceso Rápido

### Sitio Web Público
- URL: http://localhost:5173
- Navega por las secciones con animaciones 3D

### Panel de Administración
- URL: http://localhost:5173/admin/login
- Email: `admin@constructora.com`
- Contraseña: `Admin123!`

## 📋 Verificar que todo funciona

1. ✅ Sitio web se carga con animaciones 3D
2. ✅ Puedes ver servicios y proyectos
3. ✅ Puedes enviar mensaje de contacto
4. ✅ Puedes iniciar sesión en el admin
5. ✅ Puedes ver el dashboard

## 🛠️ Solución Rápida de Problemas

### Backend no inicia
```bash
cd backend
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-bcrypt pillow python-dotenv werkzeug
python seed_data.py
```

### Frontend no inicia
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Base de datos vacía
```bash
cd backend
python seed_data.py
```

## 📚 Recursos

- **README completo**: Ver `README.md`
- **API Docs**: Ver endpoints en `README.md`
- **Soporte**: Abrir issue en GitHub

---

**¡Listo! Ya tienes tu sitio con animaciones 3D funcionando** 🎉
