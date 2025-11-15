# 🏗️ Constructora GR - Sitio Web con Animaciones 3D

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Página web moderna y profesional para empresa constructora con **animaciones 3D ultra avanzadas** y panel de administración completo.

> **🪟 ¿Usas Windows?** Lee la [Guía de Instalación para Windows](INSTALACION_WINDOWS.md) para instrucciones específicas paso a paso.

## ✨ Características Principales

### Frontend
- ⚛️ **React 18** + **Vite** + **TypeScript**
- 🎨 **Tailwind CSS** para estilos modernos
- 🎭 **Three.js** + **React Three Fiber** para animaciones 3D espectaculares
- 🎬 **Framer Motion** para transiciones fluidas
- 📱 **100% Responsive** - Mobile First
- ⚡ **Optimización de performance** con lazy loading y code splitting

### Backend
- 🐍 **Flask** - Framework web Python
- 🗄️ **SQLAlchemy** - ORM para base de datos
- 🔐 **JWT** - Autenticación segura
- 📤 **Upload de imágenes** con optimización automática
- 🔄 **API RESTful** completa

### Secciones del Sitio
1. **Hero 3D** - Modelo de edificio 3D con sistema de partículas
2. **Servicios** - Cards animadas con efectos 3D al hover
3. **Proyectos** - Galería filtrable con modal interactivo
4. **Nosotros** - Timeline y estadísticas con contadores animados
5. **Contacto** - Formulario con validación y animaciones

### Panel de Administración
- 🔑 Login seguro con JWT
- 📝 Editor de contenido (Hero, Nosotros, Estadísticas)
- 🛠️ Gestor de Servicios (CRUD completo)
- 🏗️ Gestor de Proyectos con galería múltiple
- 📧 Visualizador de mensajes de contacto
- ⚙️ Configuración del sitio
- 🖼️ Gestor de imágenes con optimización

---

## 📋 Requisitos Previos

- **Python 3.8+**
- **Node.js 16+** y **npm/yarn**
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/constructora_gr.git
cd constructora_gr
```

### 2. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración
cp .env.example .env

# Inicializar base de datos y crear datos de ejemplo
python seed_data.py
```

### 3. Configurar Frontend

```bash
# Navegar a la carpeta frontend
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env
```

---

## 🎮 Ejecutar el Proyecto

### Opción 1: Ejecutar ambos servidores manualmente

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
python app.py
```
El backend estará disponible en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### Opción 2: Script de inicio rápido (Linux/Mac)

```bash
# Crear script de inicio
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando Constructora GR..."

# Iniciar backend en segundo plano
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Iniciar frontend
cd ../frontend
npm run dev

# Cleanup al salir
trap "kill $BACKEND_PID" EXIT
EOF

chmod +x start.sh
./start.sh
```

---

## 👤 Credenciales de Acceso

### Panel de Administración

```
URL: http://localhost:5173/admin/login
Email: admin@constructora.com
Contraseña: Admin123!
```

---

## 📁 Estructura del Proyecto

```
constructora_gr/
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── 3D/        # Componentes Three.js
│   │   │   ├── public/    # Componentes públicos
│   │   │   ├── admin/     # Componentes del admin
│   │   │   └── shared/    # Componentes compartidos
│   │   ├── pages/         # Páginas principales
│   │   ├── context/       # Estado global (Zustand)
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Estilos CSS
│   ├── public/            # Archivos estáticos
│   └── package.json
│
├── backend/               # API Flask
│   ├── routes/           # Endpoints de la API
│   │   ├── auth.py      # Autenticación
│   │   ├── content.py   # Contenido del sitio
│   │   ├── images.py    # Upload de imágenes
│   │   └── contact.py   # Contacto
│   ├── uploads/          # Imágenes subidas
│   ├── models.py         # Modelos de base de datos
│   ├── app.py           # Aplicación principal
│   ├── seed_data.py     # Script de datos de ejemplo
│   └── requirements.txt  # Dependencias Python
│
└── database/             # Base de datos SQLite
    └── constructora.db
```

---

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/change-password` - Cambiar contraseña

### Contenido
- `GET /api/content/hero` - Obtener contenido Hero
- `PUT /api/content/hero` - Actualizar Hero (requiere auth)
- `GET /api/content/about` - Obtener sección Nosotros
- `PUT /api/content/about` - Actualizar Nosotros (requiere auth)
- `GET /api/content/statistics` - Obtener estadísticas
- `PUT /api/content/statistics` - Actualizar estadísticas (requiere auth)

### Servicios
- `GET /api/content/services` - Listar servicios
- `GET /api/content/services/:id` - Obtener servicio
- `POST /api/content/services` - Crear servicio (requiere auth)
- `PUT /api/content/services/:id` - Actualizar servicio (requiere auth)
- `DELETE /api/content/services/:id` - Eliminar servicio (requiere auth)

### Proyectos
- `GET /api/content/projects` - Listar proyectos
- `GET /api/content/projects/:id` - Obtener proyecto
- `POST /api/content/projects` - Crear proyecto (requiere auth)
- `PUT /api/content/projects/:id` - Actualizar proyecto (requiere auth)
- `DELETE /api/content/projects/:id` - Eliminar proyecto (requiere auth)

### Imágenes
- `POST /api/images/upload` - Subir imagen (requiere auth)
- `POST /api/images/upload-multiple` - Subir múltiples (requiere auth)
- `DELETE /api/images/delete` - Eliminar imagen (requiere auth)
- `GET /api/images/serve/:folder/:filename` - Servir imagen

### Contacto
- `GET /api/contact/info` - Obtener información de contacto
- `PUT /api/contact/info` - Actualizar info (requiere auth)
- `POST /api/contact/messages` - Enviar mensaje
- `GET /api/contact/messages` - Listar mensajes (requiere auth)
- `DELETE /api/contact/messages/:id` - Eliminar mensaje (requiere auth)

---

## 🎨 Personalización

### Colores del Sitio

Edita `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#FF6B35',  // Naranja construcción
    dark: '#E5622F',
    light: '#FF8C66',
  },
  secondary: {
    DEFAULT: '#004E89',  // Azul profesional
    dark: '#003D6B',
    light: '#0066B2',
  },
  accent: {
    DEFAULT: '#F7B801',  // Amarillo advertencia
    dark: '#D49F01',
    light: '#F9C933',
  },
}
```

### Contenido del Sitio

Todo el contenido se puede editar desde el panel de administración o directamente en la base de datos.

---

## 📦 Build para Producción

### Frontend

```bash
cd frontend
npm run build
```

Los archivos compilados estarán en `frontend/dist/`

### Backend

El backend de Flask está listo para producción. Para deploy:

1. Cambiar a PostgreSQL en producción
2. Configurar variables de entorno
3. Usar Gunicorn como servidor WSGI

```bash
pip install gunicorn
gunicorn -w 4 app:app
```

---

## 🌐 Deploy

### Opciones recomendadas:

**Frontend:**
- Vercel (recomendado)
- Netlify
- GitHub Pages

**Backend:**
- Railway
- Render
- Heroku
- DigitalOcean

**Base de datos:**
- PostgreSQL (Supabase, Railway)
- MySQL

---

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

### Error: "Port already in use"
```bash
# Cambiar puerto en vite.config.ts (frontend)
server: { port: 3000 }

# Cambiar puerto en app.py (backend)
app.run(port=5001)
```

### Error: "Database not found"
```bash
cd backend
python seed_data.py
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Desarrollado por

**Constructora GR Development Team**

- Sitio Web: [www.constructoragr.com](https://www.constructoragr.com)
- Email: info@constructoragr.com

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@constructoragr.com
- 💬 Issues: [GitHub Issues](https://github.com/tuusuario/constructora_gr/issues)

---

## 🎯 Roadmap

- [x] Sitio web público con animaciones 3D
- [x] Panel de administración básico
- [x] Sistema de autenticación
- [x] CRUD de servicios y proyectos
- [ ] Editor WYSIWYG para contenido
- [ ] Gestor avanzado de imágenes
- [ ] Sistema de notificaciones por email
- [ ] Dashboard con analytics
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Integración con CMS headless

---

## ⭐ Características Destacadas

### Animaciones 3D

- **BuildingModel**: Modelo 3D de edificio con ventanas iluminadas
- **ParticleSystem**: Sistema de partículas con física realista
- **Scroll Animations**: Animaciones activadas por scroll
- **Hover Effects**: Efectos 3D interactivos
- **Smooth Transitions**: Transiciones fluidas entre secciones

### Performance

- Lazy loading de componentes
- Code splitting automático
- Imágenes optimizadas (compresión automática)
- Caché de API responses
- Minificación de assets

### SEO Optimizado

- Meta tags dinámicos
- Sitemap generado automáticamente
- Schema.org markup
- Open Graph tags
- Canonical URLs

---

## 🙏 Agradecimientos

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Animaciones 3D
- [Framer Motion](https://www.framer.com/motion/) - Animaciones
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Lucide Icons](https://lucide.dev/) - Íconos
- [Flask](https://flask.palletsprojects.com/) - Backend

---

**¡Gracias por usar Constructora GR! 🏗️✨**
