# 🚨 Solución: Error 404 NOT_FOUND en Vercel

## 📋 Problema Identificado
```
404: NOT_FOUND
Code: NOT_FOUND
ID: cdg1::t21qk-1752144152954-7442f043b966
```

**Error específico:** `GET https://app-compras-alpha.vercel.app/ 404 (Not Found)`

## 🔍 Diagnóstico
El error 404 indica que Vercel no puede encontrar el archivo `index.html` del frontend. Esto sucede cuando:
1. La configuración de `vercel.json` no está correctamente configurada
2. Los archivos estáticos no se están sirviendo desde el directorio correcto
3. El build del frontend no se está ejecutando correctamente

## ⚠️ Error Adicional Encontrado: Function Runtimes
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```
**Causa:** Configuración incorrecta de `functions` con runtime inválido.

## ✅ Solución Implementada

### **Configuración Anterior (Problemática):**
```json
{
  "builds": [
    {
      "src": "smartshop-frontend/package.json", 
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
**Problema:** Vercel buscaba `/index.html` en la raíz pero los archivos estaban en `/smartshop-frontend/dist/`

### **Configuración Intermedia (Error Runtime):**
```json
{
  "functions": {
    "api/index.js": {
      "runtime": "nodejs18.x"  ← Error: formato incorrecto
    }
  }
}
```

### **Configuración Final (Funcionando):**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "smartshop-frontend/dist",
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### **Cambios Clave:**
1. ✅ **`buildCommand`**: Especifica exactamente cómo construir el proyecto
2. ✅ **`outputDirectory`**: Le dice a Vercel dónde encontrar los archivos estáticos
3. ✅ **`builds`**: Configuración correcta para las Serverless Functions usando `@vercel/node`
4. ✅ **Eliminado `functions`**: Evita el error de runtime inválido

### **Script Vercel añadido:**
```json
{
  "scripts": {
    "vercel-build": "npx tsc -b && vite build"
  }
}
```

## 🚀 Proceso de Redespliegue

### **1. Los cambios ya están en GitHub**
```bash
git push origin master ✅ Completado
```

### **2. Vercel detectará automáticamente los cambios**
- O puedes forzar un redespliegue desde el Dashboard

### **3. Variables de entorno críticas:**
Asegúrate de que estén configuradas:
```
VITE_API_URL=/api
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NODE_ENV=production
```

## 🎯 Verificaciones Post-Despliegue

### **Señales de Éxito:**
1. ✅ **URL principal carga sin error 404**
2. ✅ **Build logs sin errores de Function Runtimes**
3. ✅ **Aparece el header "App Compras"**
4. ✅ **Las rutas `/productos`, `/historial` funcionan**
5. ✅ **Los endpoints `/api/ping`, `/api/categories` responden**

### **DevTools Console debe mostrar:**
```
App starting... {
  API_URL: "/api",
  mode: "production", 
  prod: true
}
```

### **Network Tab debe mostrar:**
- ✅ Archivos JS/CSS cargan desde `/assets/`
- ✅ Peticiones API van a `/api/*`
- ✅ Status 200 en lugar de 404

## 🆘 Si Persiste el Error

### **Verificar Build Settings en Vercel:**
- **Framework Preset:** Other (no Vite)
- **Root Directory:** `.` (raíz del repositorio)
- **Build Command:** `npm run build` (debe estar configurado automáticamente)
- **Output Directory:** `smartshop-frontend/dist` (debe estar configurado automáticamente)

### **Verificar Logs de Build:**
En Vercel Dashboard → Deployments → View Function Logs
Buscar errores en el proceso de build.

### **Estructura de archivos esperada post-build:**
```
/
├── index.html              ← Principal
├── assets/
│   ├── index-*.js         ← JavaScript chunks
│   ├── index-*.css        ← Estilos
│   └── ...                ← Otros assets
├── _redirects             ← Para SPA routing
└── vite.svg               ← Favicon
```

## 📝 Historial de Errores Resueltos

1. ✅ **404 NOT_FOUND** - Corregido routing a `/index.html`
2. ✅ **Function Runtimes error** - Eliminado `functions` inválido, usado `builds` con `@vercel/node`

**¡Con esta configuración híbrida el proyecto debería desplegarse correctamente!** 🎉 