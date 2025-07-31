import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Asegurar que las variables de entorno estén disponibles
    'process.env': process.env,
    // Inyectar variables de entorno específicas
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '/.netlify/functions'),
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'import.meta.env.MODE': JSON.stringify(process.env.MODE || 'production')
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    hmr: {
      host: '127.0.0.1',
      port: 5173,
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    }
  }
})
