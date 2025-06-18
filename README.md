README.md para despliegue en Vercel
md
Copiar código
# Red Social Empresarial – Frontend

Este proyecto es el frontend de una red social empresarial desarrollado con **React + Vite + TypeScript**, utilizando una arquitectura moderna, modular y profesional. El backend está desplegado en **Render** y se conecta automáticamente a través de `vercel.json`.

## 🛠 Tecnologías

- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Cloudinary (para gestión de imágenes)
- Vercel (despliegue)
- Render (backend)

---

## 🚀 Despliegue en Vercel

### 1. **Prepara tu repositorio en GitHub**

- Asegúrate de tener este frontend subido en un repositorio público o privado.
- Estructura recomendada:
/src
/public
vite.config.ts
vercel.json

markdown
Copiar código

### 2. **Conecta Vercel a tu GitHub**

- Ve a [https://vercel.com](https://vercel.com)
- Inicia sesión con tu cuenta de GitHub.
- Haz clic en **"Add New Project"**
- Selecciona tu repositorio del frontend.
- Configura así:
- Framework: **Vite**
- Build Command: `vite build`
- Output Directory: `dist`

### 3. **Agrega el archivo `vercel.json`**

Este archivo redirige automáticamente las llamadas API al backend:

```json
{
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://red-social-empresa-backend.onrender.com/api/:path*"
  }
]
}