**Objetivo del proyecto:**  
Diseña y desarrolla una aplicación inteligente para la planificación optimizada de listas de compra. La aplicación debe aprovechar inteligencia artificial para analizar hábitos de compra, preferencias del usuario y restricciones de presupuesto, generando recomendaciones personalizadas y eficientes. Debe integrarse con una base de datos de productos actualizada creada en SupaBase que se creará desde un archivo. 
Permitir la categorización automática de artículos, ofrecer sugerencias inteligentes basadas en patrones de consumo y proporcionar funciones interactivas que mejoren la experiencia del usuario, como historial de compras, comparación de precios y notificaciones sobre descuentos o productos recurrentes.
El frontend de la aplicacion debe ser sencillo pero bien diseñado, contendra de inicio un formulario interactivo con una serie preguntas que el usuario deberá responder para elaborar menus y lista de compra de articulos a medida.

Estas preguntas deberan estar un tono coloquial tal como:
 
"Para cuantos dias quieres el Menu y la lista de la compra"

"Cuantas personas sois en casa"

"Con que prepuesto contamos"

"Que tipo de alimentos soléis tomar en:

- Desayuno

- Comida

- Cena"

"Que alimentos básicos debemos incluir en los menus y en la lista de la compra"

"Aparte de Alimentos, necesitamos comprar algo mas( Detergente, Papel de Cocina, Limpieza, etc"
 
 Aparte de estas preguntas incluye las que tu consideres necesarias para elaborar los menus y la lista de la compra lo mas detallada y exacta posible


---

### **Instrucciones para el Asistente de Código**  

#### **1️⃣ Estructura del Proyecto**  
- Utilizar un framework adecuado para el desarrollo web o móvil, como **React.js, Vue.js o Flutter para frontend** y **Node.js con Express, FastAPI o Django para backend**.  
- Seguir principios **SOLID** y arquitectura **MVC** para mantener un código limpio y escalable.  
- La aplicación será **para un solo usuario**, por lo que **no se requiere autenticación**.  

---

#### **2️⃣ Base de Datos**  
- Implementar una base de datos estructurada
-La base de datos se creará en SupaBase
- Para Crear la base de datos usa los datos contenidos en archivos de carpeta "mercadata", tienes estos datos en diferentes formatos usa el que consideres mas adecuado para el proyecto

---

#### **3️⃣ Funcionalidades Clave**  

🔹 **Creación y Gestión de Listas de Compra:**  
- Los usuarios pueden **seleccionar productos** desde la base de datos.  
- Generación automática de **listas en base a**:  
  - **Número de personas** (Ej: lista de compras para 2 personas por 1 semana).  
  - **Periodo de tiempo** (días, semanas, meses).  
  - **Presupuesto** (semanal, mensual o anual).  
- Generación automática de **menús** basada en ingredientes disponibles y cantidades seleccionadas.  
- **Edición manual** de listas para modificar cantidades o añadir productos personalizados.  
- **Almacenamiento de listas recurrentes** para facilitar futuras compras.  

🔹 **Recomendaciones Inteligentes con IA con ayuda de la API de OpenAi:**  
- La IA generará automáticamente listas de la compra y menús según los **requerimientos del usuario**.  
- Sugerencias automáticas basadas en **compras previas** y preferencias.  
- Opcional: Implementar recomendaciones avanzadas con **filtrado colaborativo** o modelos de **Machine Learning**.  

🔹 **Búsqueda y Filtrado:**  
- **Búsqueda rápida** por nombre o precio.  
- Filtros por **precio, nombre** para encontrar productos fácilmente.  

🔹 **Exportación y Compartición:**  
- Opción para **exportar la lista de la compra** en **PDF** o **Excel**.  
- Posibilidad de **compartir la lista** mediante un enlace generado automáticamente.  

---

#### **4️⃣ Tecnologías Sugeridas**  
- **Frontend:** React.js, Vue.js o Flutter  
- **Backend:** Node.js con Express, Django o FastAPI  
- **Base de Datos:** PostgreSQL, MongoDB o SQLite  
- **Extras:**  
  - **TailwindCSS** o **Material UI** para UI.  
  - **Algoritmos de IA** para generación automática de listas y recomendaciones.  

---

#### **5️⃣ Despliegue y Hosting**  
- **Backend:** Vercel.  
- **Base de datos:**  Supabase.  
- **Frontend:** Vercel.  

---

📌 **Salida esperada:**  
Código **limpio y bien documentado**, con README explicativo, instrucciones de instalación y despliegue, ejemplos de uso y estructura modular para fácil mantenimiento. 
Crea en la carpeta raiz del proyecto un documento para ir registrando todo el desarrollo y avance del proyecto.

---

 🚀 **Analiza con detenimiento estas instrucciones, antes de ejecutar codigo implementa un plan de accion y desarrrollo para su aprobacion, Si necesitas instrucciones adicionales, dime y lo perfeccionamos aún más.** 😊