# Cafecito Feliz - POS & Loyalty System (MVP)

### Descripción del Proyecto
**Cafecito Feliz** es un sistema de Punto de Venta (POS) diseñado para optimizar la operación de una cafetería mediante la automatización del control de inventarios y la fidelización de clientes. Este MVP se enfoca en la seguridad de las transacciones, la integridad de los datos y una experiencia de usuario ágil para el vendedor.

El proyecto resuelve tres problemas críticos:
1. **Falta de control en stock:** Evita ventas de productos sin existencias físicas.
2. **Fidelización manual:** Automatiza la aplicación de descuentos por lealtad.
3. **Inseguridad:** Restringe funciones sensibles mediante roles (RBAC).

---

### Tech Stack
Sistema desarrollado bajo el stack **MERN** con enfoque reactivo:

* **Frontend:** Angular 18+ (Signals, Standalone Components, Tailwind CSS).
* **Backend:** Node.js & Express.
* **Base de Datos:** MongoDB (Modelado con Mongoose).
* **Seguridad:** Autenticación JWT y validaciones con Zod.

---

### Características Principales (MVP)

* **Control de Acceso (RBAC):** Roles diferenciados para **Admin** y **Vendor**.
* **POS Reactivo:** Carrito de compras con validación de stock en tiempo real.
* **Sistema de Fidelización:** Identificación de clientes mediante "Get or Create" con descuentos automáticos (5%, 10%, 15%).
* **Inventario Inteligente:** Descuento atómico de existencias y protección contra sobreventas.
* **Ticket Digital:** Resumen de compra con preservación histórica de precios (*Price Snapshots*).

---

### Gestión de Proyecto
Se implementó la metodología **Scrum** para asegurar una entrega incremental de valor:
* **Sprint 1:** Infraestructura, Seguridad (JWT) y flujo de venta core.
* **Sprint 2:** CRUD de inventario y validación de reglas de negocio.
* **Sprint 3:** Módulo de clientes, lógica de descuentos y QA final (Log de pruebas).

---

### Instalación y Ejecución Rápida

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/SebastianRms/cafesito-pos.git](https://github.com/SebastianRms/cafesito-pos.git)
Configuración de Variables de Entorno (.env):
Crea un archivo llamado .env en la carpeta /backend con el siguiente contenido:

Fragmento de código
PORT=3001
MONGO_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_para_tokens
Instalación y Arranque Automatizado:
Desde la raíz del proyecto, utiliza los scripts personalizados del package.json:

Bash
# Instala todas las dependencias (Raíz, Frontend y Backend)
npm run install:all

# Inicia Cliente (Angular) y Servidor (Node) simultáneamente
npm run dev
 Aseguramiento de Calidad (QA)
El proyecto cuenta con un Log de Pruebas de Aceptación detallado que valida:

Validación de Captura: El sistema detecta formatos incorrectos y lanza alertas preventivas (Error 422).

Búsqueda de Clientes: Manejo de Error 404 para habilitar registro inmediato de nuevos usuarios.

Persistencia Atómica: Las transacciones garantizan el descuento de stock y la creación del ticket en un solo ciclo seguro.

Desarrollado por SebastianRms 