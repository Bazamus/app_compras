# ⚙️ Variables de Entorno para Netlify

Aquí tienes la lista completa de variables que debes configurar en la sección "Environment Variables" de tu proyecto en Netlify.

**🚨 IMPORTANTE**: Configura estas variables ANTES de hacer el despliegue inicial.

---

## **Variables del Backend (Netlify Functions)**

Estas son necesarias para que las Netlify Functions del backend funcionen correctamente.

| Key                         | Value                                         | Descripción                               |
| --------------------------- | --------------------------------------------- | ----------------------------------------- |
| `SUPABASE_URL`              | `https://tu-proyecto.supabase.co`             | La URL de tu proyecto en Supabase.        |
| `SUPABASE_ANON_KEY`         | `eyJhbGciOiJIUzI1NiIsI...`                    | La clave pública (anon key) de Supabase.  |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsI...`                    | La clave de servicio (service role key).  |
| `NODE_ENV`                  | `production`                                  | Indica que el entorno es de producción.   |

---

## **Variables del Frontend (React/Vite)**

Estas son necesarias para que la aplicación de React se comunique correctamente con el backend.

**⚠️ CRÍTICO**: Las variables de Vite deben empezar con `VITE_`

| Key                       | Value                               | Descripción                                                                 |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL`            | `/.netlify/functions`               | **FUNDAMENTAL:** Usa `/.netlify/functions` para que apunte a las Netlify Functions.    |
| `VITE_SUPABASE_URL`       | `https://tu-proyecto.supabase.co`   | La URL de tu proyecto en Supabase (la misma que arriba).                   |
| `VITE_SUPABASE_ANON_KEY`  | `eyJhbGciOiJIUzI1NiIsI...`          | La clave anónima de Supabase (la misma que arriba).                        |

---

## **📋 Pasos para Configurar en Netlify**

1. Ve a tu proyecto en Netlify Dashboard
2. Dirígete a **Site settings** → **Environment variables**
3. Agrega **TODAS** las variables listadas arriba
4. Haz un nuevo despliegue desde **Deployments** → **Trigger deploy**

---

## **🔍 Cómo Obtener las Credenciales de Supabase**

1. Ve a [supabase.com](https://supabase.com) y entra a tu proyecto
2. En el panel lateral, ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `SUPABASE_URL` y `VITE_SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY` y `VITE_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

---

## **🚨 Notas Importantes**

- **NO** pongas las credenciales reales aquí en el archivo
- Las variables `VITE_*` son públicas y estarán en el bundle del frontend
- La `SERVICE_ROLE_KEY` es privada y solo debe usarse en el backend
- Si cambias alguna variable, **redespliega** el proyecto completo
- **DIFERENCIA CLAVE CON VERCEL**: `VITE_API_URL` debe ser `/.netlify/functions` en lugar de `/api`

---

## **🔧 Configuración Específica para Netlify**

### **Estructura de URLs en Netlify:**
- **Frontend:** `https://tu-sitio.netlify.app/`
- **API:** `https://tu-sitio.netlify.app/.netlify/functions/netlify-function/`
- **Ejemplo:** `https://tu-sitio.netlify.app/.netlify/functions/netlify-function/categories`

### **Variables de Entorno Completas:**
```env
# Backend (Netlify Functions)
SUPABASE_URL=https://kgoefkwzesmimrwhgxxo.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NODE_ENV=production

# Frontend (React/Vite)
VITE_API_URL=/.netlify/functions
VITE_SUPABASE_URL=https://kgoefkwzesmimrwhgxxo.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
``` 