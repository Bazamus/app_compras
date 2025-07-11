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
- Agregada interfaz `ImportMetaEnv` e `ImportMeta` para resolver errores con `import.meta.env`

### 6. Corrección de Dependencias para Netlify
- Agregado TypeScript y @types/node como dependencias de desarrollo en package.json raíz
- Modificado comando de build para instalar dependencias del directorio raíz primero
- Agregado comando `netlify:build` para testing del proceso de build

## Archivos Modificados
- `smartshop-frontend/package.json`: Versiones de dependencias y configuración TypeScript
- `netlify.toml`: Configuración de build y despliegue optimizada
- `.npmrc`: Configuración global de npm
- `smartshop-frontend/.npmrc`: Configuración específica del frontend
- `.nvmrc` y `.node-version`: Versión de Node.js especificada
- `package.json`: Scripts adicionales y dependencias TypeScript
- `smartshop-frontend/src/pages/Lista.tsx`: Tipos TypeScript para jspdf-autotable
- `smartshop-frontend/src/vite-env.d.ts`: Tipos para ImportMeta y variables de entorno
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
1. ✅ Las dependencias se instalan correctamente en todos los directorios
2. ✅ TypeScript está disponible tanto en raíz como en subdirectorios
3. ✅ El build se ejecuta sin errores de TypeScript
4. ✅ Los tipos `ImportMeta` y `ImportMetaEnv` están correctamente definidos
5. ✅ El frontend se construye exitosamente en `smartshop-frontend/dist`
6. ✅ El backend se compila correctamente en `backend/dist`
7. ✅ Los tipos de jspdf-autotable están correctamente definidos
8. ✅ Comando `netlify:build` probado y funcionando localmente
9. Las funciones serverless estarán disponibles desde `backend/dist`
10. La API funcionará correctamente a través de `/api/*`

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