# Changelog - Cafesito POS

## [2026-01-21]

### Agregado

- **Orquestación:** Configuración de `package.json` en raíz con `concurrently` para ejecución simultánea de Front y Back.
- **Backend:** Inicialización de API REST con Node.js/Express y dependencias de seguridad (JWT, bcrypt) y validación (Zod).
- **Frontend:** Creación de proyecto Angular con integración de Bootstrap 5 para estilos responsivos.
- **UX/UI:** Implementación de `bootstrap-icons` y `SweetAlert2` para notificaciones profesionales.

### Configurado

- Archivo `.gitignore` global para protección de `node_modules` y variables de entorno `.env`.
- Scripts de automatización (`install:all`, `dev`) para facilitar el despliegue local.

## [2026-01-21]

### Agregado

- Configuración de variables de entorno oficial de Angular en `src/environments/`.
- Definición de `apiUrl` para conexión con el Backend.
- Creación de archivos de variables de entorno `.env` (Backend)
- Configuración de cadena de conexión local para MongoDB y puerto del servidor (3001).
- Definición de `JWT_SECRET` para manejo de sesiones seguras.

## [2026-01-26]

### Agregado

- **Modelo de Datos:** Definición del esquema `Product` en Mongoose con validación de tipos (nombre, precio, stock, categoría).
- **Script de Seeding:** Creación de `seed.js` para automatizar el llenado de la base de datos con productos de prueba.
- **API de Productos:** Implementación de endpoint `GET /api/products` con lógica de paginación profesional (`page`, `limit`, `skip`).
- **Validación:** Integración de `express-validator` para sanear y validar parámetros de consulta en las rutas.

### Corregido

- **Arquitectura ES Modules:** Configuración de `"type": "module"` en `package.json` y ajuste de imports con extensión `.js`.
- **Orden de Inicialización:** Reestructuración de `server.js` para asegurar que `app` se inicialice antes que las rutas (solución al ReferenceError).
- **Dependencias de Raíz:** Instalación de `concurrently` en el directorio raíz para habilitar la orquestación de procesos.
- **Flujo de Git:** Vinculación del repositorio local con el remoto (`upstream`) mediante `git push -u origin main`.

### Configurado

- **Router Central:** Implementación de un router maestro en `src/routes/index.js` para delegar sub-rutas de forma escalable.
- **Middleware Global:** Configuración de CORS y `express.json()` para permitir la comunicación fluida con el Frontend.

## [2026-01-27]

### Planificación (Sprint 0 - Backlog Inicial)

- **Definición de Historias de Usuario:** Se establecieron las 8 necesidades core del negocio bajo el formato estándar. Este será el roadmap para el cumplimiento del MVP al 18 de febrero:
  1. **Gestión de Inventario:** (Admin) Registrar productos con precio/stock para el catálogo.
  2. **Registro de Ventas:** (Vendedor) Procesar pagos y registrar salida de mercancía.
  3. **Validación de Stock:** (Sistema) Impedir ventas sin existencias (prevención de errores).
  4. **Control de Clientes:** (Vendedor) Registro de clientes para trazabilidad de visitas.
  5. **Descuentos Automáticos:** (Sistema) Aplicación de reglas 5%/10%/15% según `purchasesCount`.
  6. **Trazabilidad de Almacén:** (Jefe Almacén) Registro automático de cada movimiento de stock.
  7. **Generación de Tickets:** (Cliente) Visualización de resumen de compra y descuentos.
  8. **Seguridad de Acceso:** (Admin) Restricción de funciones sensibles mediante login.

1. Como Administrador, quiero registrar productos con su precio y stock inicial para tener un catálogo disponible para la venta.
2. Como Vendedor, quiero seleccionar productos y procesar el pago para registrar la salida de mercancía y el ingreso de dinero.
3. Como Vendedor, quiero que el sistema me impida vender productos sin existencias para evitar compromisos que no puedo cumplir con el cliente.
4. Como Vendedor, quiero dar de alta a clientes con su correo o teléfono para identificarlos en futuras visitas.
5. Como Dueño de la cafetería, quiero que el sistema aplique descuentos según el número de compras del cliente para incentivar la lealtad sin errores manuales.
6. Como Jefe de Almacén, quiero un registro automático de cada movimiento de stock para detectar mermas o faltantes rápidamente.
7. Como Cliente, quiero visualizar un resumen de mi compra y el descuento aplicado para tener un comprobante de mi gasto.
8. Como Administrador, quiero restringir las funciones sensibles (como borrar productos) mediante login para que solo personal autorizado haga cambios.

**Refinación de Historias de Usuario:** Se refinaron 5 de las historias de usuario

1.  Dado que soy un administrador autenticado, cuando envío un POST /api/products con nombre, precio y stock, entonces el sistema devuelve un código 201 Created y guarda el producto.
1.  Dado que intento registrar un producto, cuando el precio es menor o igual a 0, entonces el sistema devuelve un error 422 Unprocessable Entity.
2.  Dado que tengo productos en el carrito, cuando el vendedor presiona "Cobrar" enviando un POST /api/sales, entonces el sistema genera un registro de venta y devuelve los detalles del ticket.
2.  Dado que se procesa una venta, cuando el pago es exitoso, entonces el stock de los productos involucrados disminuye automáticamente en la base de datos.
3.  Dado que un cliente pide una cantidad mayor al stock disponible, cuando se intenta procesar la venta, entonces el backend rechaza la transacción con un error 400 Bad Request indicando "Insufficient stock".
3.  Dado que el stock es insuficiente para un ítem, cuando se rechaza la venta, entonces no se debe modificar el inventario de ningún otro producto de la lista.
4.  Dado que un cliente proporciona sus datos, cuando el vendedor envía un POST /api/customers, entonces el sistema crea el registro con un purchases_count inicial de 0.
4.  Dado que se intenta registrar un cliente, cuando el email o teléfono ya existen, entonces el sistema devuelve el registro existente con un status 200 OK (para no alentar el servicio se toma como un cliente existente y aplica la venta en el purchases_count).
5.  Dado que un cliente tiene entre 4 y 7 compras previas, cuando se asocia su customer_id a la venta, entonces el backend aplica automáticamente un 10% de descuento al total.
5.  Dado que el cliente es nuevo o anónimo, cuando se realiza la venta, entonces el discountPercent debe ser 0.


### Agregado

## [2026-01-28] - Implementación de Base Robusta y H1

### Añadido
- **Infraestructura Global:** Implementación de Middleware de Error Global (Manejo de ZodError 422 y Server Error 500).
- **Seguridad:** Middleware de Autenticación JWT y Autorización de Roles (`authMiddleware`, `isAdmin`).
- **Validación:** Integración de Zod para validación de esquemas en tiempo real.
- **H1 (Completada):** Endpoint `POST /api/products` funcional con validación de datos y trazabilidad de usuario (`created_by`).
- **H3 (Avance):** Implementación de controladores de Registro y Login con cifrado de contraseñas (Bcrypt) y generación de Tokens.

### Cambios
- Migración de `express-validator` a **Zod** para una validación más robusta y centralizada.
- Reestructuración del `Pipeline` de Express en `server.js` para asegurar el orden correcto de ejecución.

### Corregido
- Error de exportación de módulos (Named vs Default exports) en el Error Handler.
- Orden de middlewares que impedía la lectura de `req.body` antes de las rutas.