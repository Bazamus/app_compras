# Solución para Despliegue en Netlify

## Problema Identificado
El error de build en Netlify se debía a un conflicto de dependencias entre `jspdf` y `jspdf-autotable`. La versión de `jspdf` (3.0.1) no era compatible con la versión de `jspdf-autotable` (3.8.2).

## Soluciones Implementadas

### 1. Actualización de Dependencias
- **jspdf**: Actualizado de `^3.0.1` a `^2.5.1`
- **jspdf-autotable**: Actualizado de `^3.8.2` a `^3.5.31`

Estas versiones son estables y completamente compatibles entre sí.

### 2. Configuración de npm
- Creado archivo `.npmrc` global con `legacy-peer-deps=true`
- Creado archivo `.npmrc` específico para el frontend
- Actualizado comando de build en `netlify.toml` para usar `--legacy-peer-deps`

### 3. Configuración de Netlify
- Añadido archivo `.nvmrc` para especificar Node.js v18
- Configurado variables de entorno en `netlify.toml`
- Añadido headers de seguridad y optimización
- Configurado cache para archivos estáticos

### 4. Scripts de Utilidad
- `npm run install:all`: Instala todas las dependencias con legacy-peer-deps
- `npm run clean`: Limpia todos los node_modules y carpetas de build (multiplataforma)
- `npm run clean:win`: Limpia todos los node_modules y carpetas de build (específico para Windows)

### 5. Corrección de Tipos TypeScript
- Agregado interfaz `AutoTableHookData` para los hooks de jspdf-autotable
- Corregidos tipos en funciones `didDrawCell` y `didParseCell`
- Eliminados errores TS7006 (parámetros implícitos con tipo 'any')

## Archivos Modificados
- `smartshop-frontend/package.json`: Versiones de dependencias
- `netlify.toml`: Configuración de build y despliegue
- `.npmrc`: Configuración global de npm
- `smartshop-frontend/.npmrc`: Configuración específica del frontend
- `.nvmrc`: Versión de Node.js
- `package.json`: Scripts adicionales
- `smartshop-frontend/src/pages/Lista.tsx`: Tipos TypeScript para jspdf-autotable
- `clean-windows.ps1`: Script de PowerShell para limpiar archivos en Windows

## Comandos para Desarrollo Local
```bash
# Limpiar todo (multiplataforma)
npm run clean

# Limpiar todo (específico para Windows)
npm run clean:win

# Instalar dependencias
npm run install:all

# Construir proyecto
npm run build

# Desarrollo
npm run dev:frontend
npm run dev:backend
```

## Verificación del Despliegue
1. ✅ Las dependencias se instalan correctamente
2. ✅ El build se ejecuta sin errores de TypeScript
3. ✅ El frontend se construye exitosamente en `smartshop-frontend/dist`
4. ✅ El backend se compila correctamente en `backend/dist`
5. ✅ Los tipos de jspdf-autotable están correctamente definidos
6. Las funciones serverless estarán disponibles desde `backend/dist`
7. La API funcionará correctamente a través de `/api/*`

## Troubleshooting
Si persisten problemas:
1. Verificar que las versiones de dependencias son compatibles
2. Limpiar caché de npm: `npm cache clean --force`
3. Eliminar node_modules y reinstalar: `npm run clean && npm run install:all`
4. Verificar logs de build en Netlify para errores específicos

### Problemas Específicos de Windows
- Si `npm run clean` no funciona, usar `npm run clean:win`
- Si persisten errores con rimraf, instalar manualmente: `npm install -g rimraf`
- Para PowerShell, puede ser necesario cambiar la política de ejecución: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Como alternativa, usar el script de PowerShell incluido: `.\clean-windows.ps1` 