# SmartShop Frontend - React + TypeScript + Vite

Este proyecto utiliza React con TypeScript y Vite para crear una aplicación web moderna.

## Configuración de Tailwind CSS

**IMPORTANTE**: Este proyecto utiliza Tailwind CSS a través de CDN en lugar de una instalación local para evitar problemas de compatibilidad.

### Integración actual:

1. **Tailwind CSS vía CDN**: La integración se realiza directamente en `index.html` mediante el script CDN de Tailwind.
2. **Configuración personalizada**: Los colores y temas personalizados están definidos en el objeto `tailwind.config` dentro del script en `index.html`.
3. **Sin directivas locales**: No se utilizan directivas de Tailwind (`@tailwind`) en los archivos CSS locales para evitar conflictos con PostCSS.

### Notas para desarrolladores:

- No intentes añadir directivas de Tailwind (`@tailwind base`, etc.) en archivos CSS locales.
- Si necesitas personalizar más la configuración, modifica el objeto `tailwind.config` en `index.html`.
- Para usar plugins de Tailwind que no están disponibles en la CDN, consulta con el equipo antes de intentar una integración local.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
