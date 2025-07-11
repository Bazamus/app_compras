/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

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

// React types
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
