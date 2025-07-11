/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly MODE: string
  readonly PROD: boolean
  readonly DEV: boolean
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css';
declare module 'jspdf-autotable';
