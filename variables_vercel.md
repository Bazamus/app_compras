# ⚙️ Variables de Entorno para Vercel

Aquí tienes la lista completa de variables que debes configurar en la sección "Environment Variables" de tu proyecto en Vercel.

Copia la "Key" y reemplaza el "Value" con tus propias credenciales.

---

### **Variables del Backend y Supabase**

Estas son necesarias para que el servidor y la conexión a Supabase funcionen.

| Key                         | Value                                         | Descripción                               |
| --------------------------- | --------------------------------------------- | ----------------------------------------- |
| `SUPABASE_URL`              | `TU_URL_DE_PROYECTO_SUPABASE`                 | La URL de tu proyecto en Supabase.        |
| `SUPABASE_ANON_KEY`         | `TU_CLAVE_ANON_DE_SUPABASE`                   | La clave pública (anon key) de Supabase.  |
| `SUPABASE_SERVICE_ROLE_KEY` | `TU_CLAVE_DE_SERVICIO_DE_SUPABASE`            | La clave de servicio (service role key).  |
| `OPENAI_API_KEY`            | `TU_CLAVE_DE_API_DE_OPENAI`                   | Tu clave secreta de la API de OpenAI.     |
| `NODE_ENV`                  | `production`                                  | Indica que el entorno es de producción.   |
| `PORT`                      | `3001`                                        | Puerto para el servidor (Vercel lo gestiona). |

---

### **Variables del Frontend**

Estas son necesarias para que la aplicación de React (Vite) se comunique correctamente. **¡Presta especial atención a `VITE_API_URL`!**

| Key                       | Value                               | Descripción                                                                 |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `VITE_API_URL`            | `/api`                              | **Importante:** Usa `/api` para que apunte a las Serverless Functions del backend. |
| `VITE_SUPABASE_URL`       | `TU_URL_DE_PROYECTO_SUPABASE`       | La misma URL de tu proyecto en Supabase que usaste arriba.                  |
| `VITE_SUPABASE_ANON_KEY`  | `TU_CLAVE_ANON_DE_SUPABASE`         | La misma clave anónima (anon key) de Supabase que usaste arriba.            |
