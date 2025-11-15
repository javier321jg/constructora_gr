# 🪟 Guía de Instalación para Windows

## ✅ Problema Resuelto

El error `unable to open database file` ha sido corregido. Las rutas ahora funcionan correctamente en Windows.

---

## 📋 Requisitos Previos

- ✅ Python 3.8+ instalado
- ✅ Node.js 16+ instalado
- ✅ Git instalado

### Verificar instalaciones:

```cmd
python --version
node --version
npm --version
git --version
```

---

## 🚀 Instalación Paso a Paso

### 1️⃣ Backend (Flask)

Abre **Command Prompt** o **PowerShell** en la carpeta del proyecto:

```cmd
cd backend
```

#### Crear entorno virtual:

```cmd
python -m venv venv
```

#### Activar entorno virtual:

**Command Prompt:**
```cmd
venv\Scripts\activate
```

**PowerShell:**
```powershell
venv\Scripts\Activate.ps1
```

> **Nota:** Si tienes error de permisos en PowerShell, ejecuta:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

#### Instalar dependencias:

```cmd
pip install -r requirements.txt
```

#### Inicializar base de datos con datos de ejemplo:

```cmd
python seed_data.py
```

Deberías ver algo como:

```
=== Inicializando datos de ejemplo ===

Creando servicios...
✓ Servicio creado: Construcción Residencial
✓ Servicio creado: Construcción Comercial
✓ Servicio creado: Construcción Industrial
✓ Servicio creado: Remodelaciones
✓ Servicio creado: Diseño y Arquitectura

5 servicios inicializados

Creando proyectos...
✓ Proyecto creado: Residencial Los Robles
✓ Proyecto creado: Centro Comercial Plaza Norte
...

=== ¡Datos de ejemplo creados exitosamente! ===
```

#### Iniciar el servidor backend:

```cmd
python app.py
```

✅ **Backend corriendo en:** `http://localhost:5000`

---

### 2️⃣ Frontend (React + Vite)

Abre **OTRA TERMINAL** (nueva ventana de Command Prompt/PowerShell):

```cmd
cd frontend
```

#### Instalar dependencias:

```cmd
npm install
```

Esto puede tomar unos minutos la primera vez.

#### Iniciar el servidor de desarrollo:

```cmd
npm run dev
```

✅ **Frontend corriendo en:** `http://localhost:5173`

---

## 🎯 Acceder a la Aplicación

### Sitio Web Público
Abre tu navegador en: **http://localhost:5173**

### Panel de Administración
1. Ve a: **http://localhost:5173/admin/login**
2. Credenciales:
   - **Email:** `admin@constructora.com`
   - **Contraseña:** `Admin123!`

---

## 🔍 Verificar que todo funciona

### Checklist de Verificación:

- [ ] Backend inicia sin errores en puerto 5000
- [ ] Frontend inicia sin errores en puerto 5173
- [ ] Se ve la página con animaciones 3D
- [ ] Puedes navegar por las secciones
- [ ] Puedes ver servicios y proyectos
- [ ] Puedes iniciar sesión en admin
- [ ] Dashboard de admin se carga correctamente

---

## 🛠️ Solución de Problemas Comunes

### ❌ Error: "python no se reconoce"

**Solución:** Agrega Python al PATH de Windows

1. Busca "Variables de entorno" en Windows
2. Edita las variables de entorno del sistema
3. En "Variables del sistema", busca "Path"
4. Agrega la ruta de instalación de Python (ej: `C:\Python311\`)

### ❌ Error: "npm no se reconoce"

**Solución:** Reinstala Node.js desde https://nodejs.org/

### ❌ Error: Puerto 5000 en uso

**Solución:** Cambia el puerto en `backend/app.py`:

```python
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)  # Cambiar a 5001
```

### ❌ Error: Puerto 5173 en uso

**Solución:** Cambia el puerto en `frontend/vite.config.ts`:

```typescript
server: {
  port: 3000,  // Cambiar a otro puerto
  ...
}
```

### ❌ Error al instalar Pillow

**Solución:** Instala manualmente:

```cmd
pip install Pillow
```

### ❌ Módulos de npm no se instalan

**Solución:**

```cmd
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

---

## 📂 Estructura de Carpetas Creadas

Después de la instalación, deberías tener:

```
constructora_gr/
├── backend/
│   ├── venv/               ← Entorno virtual de Python
│   ├── uploads/            ← Carpeta para imágenes (creada automáticamente)
│   └── ...
├── database/
│   └── constructora.db     ← Base de datos SQLite (creada automáticamente)
└── frontend/
    ├── node_modules/       ← Dependencias de Node.js
    └── ...
```

---

## 🔄 Reiniciar el Proyecto

### Detener los servidores:

- Presiona `Ctrl + C` en ambas terminales

### Volver a iniciar:

**Terminal 1 - Backend:**
```cmd
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

---

## 🗑️ Limpiar y Reiniciar Desde Cero

Si quieres empezar de nuevo:

### Backend:

```cmd
cd backend
rmdir /s /q venv
del ..\database\constructora.db
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py
python app.py
```

### Frontend:

```cmd
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

---

## 🎓 Tips para Windows

1. **Usa Windows Terminal** (disponible en Microsoft Store) para mejor experiencia
2. **Ejecuta como Administrador** si tienes problemas de permisos
3. **Cierra antivirus temporalmente** si bloquea la instalación de paquetes
4. **Verifica Firewall** si el frontend no puede conectarse al backend

---

## 📞 Soporte

Si sigues teniendo problemas:

1. Verifica que Python y Node.js estén en el PATH
2. Asegúrate de estar en las carpetas correctas
3. Revisa que los puertos 5000 y 5173 estén libres
4. Intenta reiniciar tu computadora

---

## ✅ ¡Todo Listo!

Ahora deberías tener el proyecto funcionando correctamente en Windows.

**¡Disfruta tu sitio web con animaciones 3D! 🏗️✨**
