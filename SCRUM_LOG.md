# ☕ Cafecito POS - Registro de Scrum (Scrum Log)

Este registro documenta el ciclo de vida ágil del desarrollo de **Cafecito POS**, desde la definición del Product Backlog hasta la fase final de pulido estético, optimización de layouts de pantalla y robustecimiento del backend.

---

## 📋 Planificación Inicial (Sprint 0 - Backlog de Producto)

Se establecieron las necesidades core del negocio bajo el formato estándar de historias de usuario (User Stories), actuando como la hoja de ruta para la entrega incremental de valor.

### Historias de Usuario (Backlog Original)
1. **H1: Gestión de Catálogo (CRUD)**: Como Administrador, quiero crear, editar y eliminar productos en el inventario para mantener el menú actualizado.
2. **H2: Registro de Ventas y Carrito**: Como Vendedor, quiero armar un pedido interactivo y registrar la venta para consolidar transacciones y descontar stock.
3. **H3: Validación de Existencias**: Como Sistema, quiero impedir la venta de productos agotados para evitar faltas de compromiso con los clientes.
4. **H4: Registro de Clientes**: Como Vendedor, quiero afiliar clientes con su teléfono/correo para identificarlos y darles seguimiento.
5. **H5: Reglas de Fidelización (Descuentos)**: Como Sistema, quiero aplicar descuentos automáticos del 5%, 10% o 15% basados en las compras acumuladas de los clientes.
6. **H6: Trazabilidad de Almacén**: Como Jefe de Almacén, quiero registrar de forma inmutable cada movimiento de stock para auditorías de merma.
7. **H7: Resumen Visual (Ticket)**: Como Cliente, quiero un ticket detallado de mi compra con los descuentos e impuestos para mi comprobante personal.
8. **H8: Seguridad y Roles**: Como Administrador, quiero proteger las rutas y endpoints del sistema mediante autenticación basada en JWT para restringir operaciones de admin.

---

## 🚀 Sprint 1: El Núcleo Operativo (Infraestructura y Venta)
* **Objetivo**: Desarrollar el "Walking Skeleton" funcional del POS: base de datos, login y flujo básico de cobro.
* **Capacidad Planeada**: 18 SP

### Tareas Completadas
* `[x]` **H0 - Setup General**: Configuración de Express, Mongoose, Angular 19 y TailwindCSS.
* `[x]` **H8 - Seguridad de Acceso (5 SP)**: Autenticación con JWT, bcrypt para contraseñas y `authGuard` / `adminGuard` en el cliente.
* `[x]` **H2 - Registro de Ventas y Carrito (8 SP)**: Lógica del carrito de compras, cálculo de subtotales en el frontend y controlador de ventas en el backend.
* `[x]` **H7 - Resumen Visual - Ticket (2 SP)**: Estructura HTML/CSS del ticket para previsualización post-venta.

---

## 📦 Sprint 2: Gestión y Reglas de Negocio
* **Objetivo**: Controlar el catálogo y blindar la integridad lógica del inventario.
* **Capacidad Planeada**: 11 SP

### Tareas Completadas
* `[x]` **H1 - CRUD de Catálogo (3 SP)**: Panel de administración en Angular y API REST protegida para gestión de café y repostería.
* `[x]` **H3 - Validación de Stock (3 SP)**: Bloqueo transaccional de ventas que superen el stock y deshabilitación visual de productos agotados.
* `[x]` **H5 - Reglas de Fidelización (5 SP)**: Aplicación automatizada de descuentos según el historial del socio en la base de datos.

---

## 👥 Sprint 3: Experiencia del Cliente y Cierre de MVP
* **Objetivo**: Conectar la fidelización de clientes y la auditoría de almacén en una experiencia unificada.
* **Capacidad Planeada**: 11 SP

### Tareas Completadas
* `[x]` **H4 - Registro de Socios (3 SP)**: Endpoint "Get or Create" de clientes, búsqueda fluida por teléfono/email.
* `[x]` **H6 - Auditoría de Almacén (5 SP)**: Bitácora inmutable en base de datos de los movimientos de entrada y salida de mercancía.
* `[x]` **QA e Integración Final (3 SP)**: QA manual y resolución de casos límite de precios e identificaciones mal formadas.

---

## 🎨 Sprint 4: Profesionalización, UI/UX Premium y Robustez (Actualidad)
* **Objetivo**: Transformar el MVP técnico básico en un producto digital altamente refinado, estéticamente impactante para portafolio, con cero alertas nativas de navegador, cuadrícula de POS optimizada a 4x3 y carga de productos masiva para facilitar la gestión.
* **Capacidad Planeada**: 21 SP

### Historias de Usuario Refinadas (Sprint 4)

#### **H9: Modernización Estética Premium (8 SP)**
* **Historia**: Como Usuario del POS, quiero interactuar con una interfaz oscura limpia, con efectos de glassmorphism y micro-animaciones fluidas para reducir la fatiga visual durante turnos de trabajo prolongados.
* **Criterios de Aceptación**:
  - Uso de tipografías premium (*Outfit* para títulos y *Inter* para el cuerpo) cargadas dinámicamente.
  - Paleta HSL consistente implementada mediante TailwindCSS v4 (`glass` y `glass-dark`).
  - Tarjetas del catálogo con transacciones suaves en hover.

#### **H10: Sistema Centralizado de Notificaciones (Toasts) (3 SP)**
* **Historia**: Como Operador del POS, quiero que los avisos del sistema (éxitos, errores y advertencias) se muestren de forma no intrusiva mediante Toasts animados, erradicando por completo los `alert()` y `confirm()` del navegador.
* **Criterios de Aceptación**:
  - `ToastService` inyectable basado en Signals para lanzar eventos temporales de tipo `success`, `error`, `warning` e `info`.
  - Contenedor dinámico posicionado fijamente con desvanecimiento automático tras 3 segundos.

#### **H11: Optimización de Cuadrícula POS 4x3 y Pantalla Fija (5 SP)**
* **Historia**: Como Cajero, quiero que la interfaz del POS ocupe exactamente la altura del monitor (`h-screen`) y organice los productos en una cuadrícula compacta de 4x3 (12 por página) para evitar hacer scroll general y agilizar la operación.
* **Criterios de Aceptación**:
  - Cuadrícula de productos de `4 columnas` por `3 filas` en pantallas medianas/grandes.
  - Contenedor principal ajustado dinámicamente a la altura restante (`h-[calc(100vh-80px)]`) sin barras de scroll en el cuerpo de la página.
  - Lista de compras del carrito con scroll interno independiente para soportar pedidos extensos sin deformar el panel.
  - Botones de navegación Anterior/Siguiente perfectamente visibles en la parte inferior.

#### **H12: Soporte para Creación Masiva de Productos (3 SP)**
* **Historia**: Como Administrador de Sistema, quiero poder enviar un array de productos en una sola petición POST para inicializar el catálogo de forma masiva (bulk insert) sin perder compatibilidad con registros individuales.
* **Criterios de Aceptación**:
  - Validador Zod extendido para aceptar tanto un esquema simple de producto como un array usando `z.union`.
  - Controlador polimórfico en el backend que utiliza `Product.insertMany` si recibe un array, y realiza guardados tradicionales si es un objeto.

#### **H13: Resiliencia a Base de Datos Standalone (2 SP)**
* **Historia**: Como Desarrollador, quiero que el backend detecte dinámicamente si MongoDB está configurado como replica set y bypassar las transacciones ACID en modo standalone de forma transparente para simplificar despliegues locales.
* **Criterios de Aceptación**:
  - Captura inteligente del fallo de inicio de sesión de sesión de Mongoose.
  - Conmutación automática a modo de guardado local sin sesión si no hay réplica.

### Monitoreo del Flujo de Trabajo (Sprint 4)

* **To Do**:
  * Ninguna (Sprint completado con éxito).
* **In Progress**:
  * Ninguna.
* **In Review**:
  * Ninguna.
* **Done**:
  * `[x]` Implementar variables CSS de tema oscuro y utilidades glassmorphic en [styles.css](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/frontend/src/styles.css).
  * `[x]` Crear el `ToastService` reactivo y el componente `ToastContainer` e integrarlo en la cabecera.
  * `[x]` Reestructurar la página POS para la cuadrícula 4x3 de pantalla completa fija.
  * `[x]` Habilitar el validador Zod polimórfico en [productValidator.js](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/backend/src/validators/productValidator.js).
  * `[x]` Modificar el servicio y controlador del catálogo de productos en el backend para bulk insert.
  * `[x]` Configurar el fallback dinámico de transacciones Mongoose en [saleService.js](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/backend/src/services/saleService.js).
  * `[x]` Desarrollar y certificar las suites de pruebas unitarias completas tanto en Jest (Backend) como en Jasmine/Karma (Frontend).

---

## 📈 Reflexión de Ingeniería de Software (Retrospectiva del Proyecto)

1. **Diseño de Arquitectura Limpia**: El desacoplamiento de componentes tontos (Dumb Components) como `SaleFormComponent` del consumo directo de servicios HTTP (delegando eventos al Smart Component `PosPageComponent`) simplificó drásticamente la mantenibilidad y permitió mockear dependencias fácilmente en la suite de pruebas.
2. **Mentalidad de Calidad**: El establecimiento temprano de una *Definition of Done (DoD)* rigurosa evitó la acumulación de deuda técnica. Haber priorizado la validación de transacciones y el snapshot de precios garantizó la inmutabilidad histórica frente a cambios en el catálogo.
3. **Optimización Estética**: La transición de layouts fluidos a pantallas contenidas fijas (`viewport-height aligned`) es crítica para aplicaciones industriales tipo POS. Esto agiliza la toma de pedidos y reduce la fricción de uso al minimizar la cantidad de scrolls requeridos.
