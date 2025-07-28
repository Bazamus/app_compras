# 🛒 APP COMPRAS INTELIGENTE

> Aplicación web inteligente para planificación optimizada de listas de compra con IA

## 📋 **Descripción**

App Compras Inteligente es una aplicación web que aprovecha la inteligencia artificial para analizar hábitos de compra, preferencias del usuario y restricciones de presupuesto, generando recomendaciones personalizadas y eficientes para la planificación de listas de compra.

### **Características Principales:**
- 🤖 **IA Integrada** - Recomendaciones inteligentes con OpenAI
- 📊 **Datos de Mercadona** - Base de datos completa de productos
- 🎯 **Personalización** - Menús y listas adaptadas a tus necesidades
- 📱 **Interfaz Moderna** - Diseño responsive y intuitivo
- 📤 **Exportación** - Listas en PDF y Excel
- 💰 **Gestión de Presupuesto** - Control de gastos inteligente

---

## 🚀 **Inicio Rápido**

### **Prerrequisitos**
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [OpenAI](https://openai.com)
- Cuenta en [Vercel](https://vercel.com) (opcional para desarrollo)

### **Instalación**

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd APP_COMPRAS
```

2. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
# Editar .env con tus credenciales
```

3. **Instalar dependencias**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

4. **Ejecutar en desarrollo**
```bash
# Backend (puerto 3001)
cd backend
npm run dev

# Frontend (puerto 3000)
cd frontend
npm run dev
```

---

## 📁 **Estructura del Proyecto**

```
APP_COMPRAS/
├── 📄 INSTRUCIONES.md              # Requerimientos originales
├── 📄 PLAN_ACCION_DESARROLLO.md    # Plan detallado de desarrollo
├── 📄 SEGUIMIENTO_PROYECTO.md      # Registro de avances
├── 📄 README.md                    # Este archivo
├── 📁 mercadata/                   # Datos de Mercadona
├── 📁 frontend/                    # React.js + TypeScript
├── 📁 backend/                     # Node.js + Express
├── 📁 database/                    # Scripts de migración
└── 📁 docs/                        # Documentación técnica
```

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework CSS
- **Vite** - Build tool
- **React Hook Form** - Gestión de formularios
- **React Query** - Gestión de estado del servidor

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **OpenAI API** - Inteligencia artificial
- **Supabase** - Base de datos y autenticación

### **Base de Datos**
- **Supabase** - PostgreSQL en la nube
- **Row Level Security** - Seguridad a nivel de fila
- **Real-time** - Suscripciones en tiempo real

---

## 📚 **Documentación**

### **Documentos Principales:**
- **[INSTRUCIONES.md](INSTRUCIONES.md)** - Requerimientos detallados del proyecto
- **[PLAN_ACCION_DESARROLLO.md](PLAN_ACCION_DESARROLLO.md)** - Plan completo de desarrollo
- **[SEGUIMIENTO_PROYECTO.md](SEGUIMIENTO_PROYECTO.md)** - Registro de avances y estado actual

### **Documentación Técnica:**
- `docs/api/` - Documentación de la API
- `docs/database/` - Esquema de base de datos
- `docs/deployment/` - Guías de despliegue

---

## 🎯 **Funcionalidades**

### **Formulario Interactivo**
- Preguntas coloquiales para recopilar información
- Validación en tiempo real
- Experiencia de usuario fluida

### **Generación Automática con IA**
- Menús personalizados basados en preferencias
- Listas de compra optimizadas
- Recomendaciones inteligentes

### **Gestión de Productos**
- Base de datos completa de Mercadona
- Búsqueda y filtrado avanzado
- Categorización automática

### **Funcionalidades Avanzadas**
- Exportación en PDF y Excel
- Historial de compras
- Comparación de precios
- Notificaciones inteligentes

### **Últimas mejoras implementadas (2025-07-09)**

- **Refactorización completa del componente `Productos.tsx`**:
  - Reconstrucción de la estructura JSX para corregir errores y mejorar la legibilidad.
  - Implementación de **React Query** para un manejo de datos asíncrono robusto.
  - Funcionalidad completa de filtros, búsqueda y selección de productos con persistencia en `localStorage`.
  - Modal para ver la selección y barra de resumen flotante.
  - Gestión explícita de estados de carga, error y datos vacíos.

#### **Problema Actual a Resolver:**
- El desplegable de categorías no recibe datos de la API. El próximo paso es depurar el endpoint `/categories` del backend.

---

### **Últimas mejoras implementadas (2025-07-04)**

- Optimización responsive y de UX en la pantalla de lista de la compra:
  - Productos como cards apiladas en móvil y tabla en escritorio.
  - Barra de acciones (total, exportar, guardar) fija en móvil y normal en escritorio.
  - Botonera inferior alineada, separada y siempre visible.
  - Botón "Modo checklist" siempre accesible y visible.
  - Botón "Volver a productos" centrado y sin solapamientos.
- Persistencia de la selección de productos en localStorage (la selección se mantiene al recargar o navegar).
- Botón "Limpiar selección" en la barra flotante y en el modal de productos seleccionados.
- Feedback visual claro para productos seleccionados y barra de resumen siempre visible.
- Búsqueda avanzada por nombre en toda la base de datos, ignorando acentos y mayúsculas/minúsculas (función RPC en Supabase y lógica en backend/frontend).
- El frontend realiza petición directa al backend para búsquedas globales por nombre, mostrando todos los resultados posibles.
- Mejorada la lógica de filtrado para búsquedas combinadas con categoría y subcategoría.
- Corregidos errores de linter y de ejecución en TypeScript.

---

## 🔧 **Configuración**

### **Variables de Entorno**

```env
# Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# OpenAI
OPENAI_API_KEY=tu_clave_de_openai

# Backend
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

---

## 🚀 **Despliegue**

### **Vercel (Recomendado)**
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### **Otros Proveedores**
- **Netlify** - Para frontend
- **Railway** - Para backend
- **Heroku** - Para backend

---

## 🤝 **Contribución**

### **Para Nuevos Desarrolladores:**
1. Leer `INSTRUCIONES.md` para entender requerimientos
2. Revisar `PLAN_ACCION_DESARROLLO.md` para el plan
3. Actualizar `SEGUIMIENTO_PROYECTO.md` con avances
4. Seguir convenciones del proyecto

### **Convenciones:**
- TypeScript en todo el proyecto
- Principios SOLID
- Testing desde el inicio
- Documentación de código
- ESLint + Prettier

---

## 📊 **Estado del Proyecto**

**Progreso General:** 5%
- **Fase 1:** 20% completada (Configuración y Análisis)
- **Fase 2:** 0% completada (Backend)
- **Fase 3:** 0% completada (Frontend)
- **Fase 4:** 0% completada (Integración)
- **Fase 5:** 0% completada (Despliegue)

**Próximos Pasos:**
1. Análisis detallado de datos de Mercadona
2. Diseño de esquema de base de datos
3. Configuración de Supabase

---

## 📞 **Contacto**

- **Proyecto:** App Compras Inteligente
- **Estado:** En desarrollo
- **Versión:** 1.0.0

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para optimizar tus compras** 