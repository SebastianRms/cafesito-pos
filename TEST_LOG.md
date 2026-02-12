### Historia: H8 - Seguridad de Acceso
Fase 1: Verificación de Backend

[x] POST /api/auth/register: EXITOSO (con ajuste técnico).

Incidencia encontrada: Error de validación 422 por inconsistencia de nombres entre el Model (name) y el Controller (display_name).

Acción: Se estandarizaron los campos a name en toda la capa de autenticación para asegurar la persistencia.

[x] POST /api/auth/login: EXITOSO.

Resultado: Retorna id y token (JWT) correctamente.

Pruebas de Seguridad: - Email inválido / Password inválido / Campos vacíos → Todos retornan 401 (Invalid email or password).

Se confirma que el sistema no revela si el usuario existe o no, cumpliendo con estándares de seguridad.

Fase 2: verificacion de Frontend

H8 - Control de Acceso por Roles

[x] Prueba de Login: OK (Status 200 + Token + Rol recibido).

[x] Prueba de Errores: OK (401 unificado para email/pass inválidos o vacíos).

[x] Validación de Roles: FINALIZADO.

Se implementó adminGuard y authGuard.

Se verificó que el sistema identifica correctamente el rol desde el AuthService.

[x] Prueba de Rol: Logueado como vendor, intentar entrar a /register (ruta de creación de usuarios).

Resultado obtenido: Redirección automática a /pos. El guard bloqueó el acceso manual por URL y el *ngIf ocultó el botón en el menú. (EXITOSO)

[x] Prueba de Navegación Libre: Entrar a la página principal de Login o rutas públicas sin estar logueado.

Resultado obtenido: La página de Login carga correctamente. Las rutas protegidas redirigen al Login si no hay token. (EXITOSO)

###  Historia: H2 - Registro de Ventas y Carrito
Fase 1: Verificación de Backend

[x] POST /api/sales: EXITOSO (con ajuste técnico de persistencia).

Incidencia encontrada: Error de validación de Mongoose al ejecutar product.save(). El middleware de validación bloqueaba la actualización del stock porque los productos antiguos carecían de campos obligatorios (description, created_by).

Acción: Se migró la lógica de actualización de stock a Product.updateOne utilizando el operador atómico $inc. Esto permite afectar el inventario de forma segura ignorando validaciones de campos no relacionados con la transacción.

[x] Persistencia de Snapshots: EXITOSO.

Resultado: La venta almacena product_name y unit_price de forma independiente al modelo de productos, garantizando la integridad de los reportes históricos ante futuros cambios de precio.

[x] Cálculos y Trazabilidad: FINALIZADO.

Se verificó el cálculo automático de subtotal y total en el servidor.

Se confirmó la asignación del user_id mediante el token de sesión (JWT) para auditoría de ventas.

[x] Validación de Inventario: EXITOSO.

El sistema retorna error 400 si la cantidad solicitada supera el stock disponible.

Se verificó en base de datos que el stock disminuye únicamente tras la confirmación de la venta.

Fase 2: Verificación de Integración y Frontend

[x] Interceptor y Autenticación: EXITOSO.

Acción: Se registró el authInterceptor en el appConfig de Angular mediante withInterceptors.

Resultado: Se confirmó que todas las peticiones a /api/sales incluyen el header Authorization: Bearer [token], eliminando los errores 401 (Unauthorized) detectados inicialmente.

[x] Gestión de Carrito y Mapeo de Datos: FINALIZADO.

Ajuste Técnico: Se unificó la nomenclatura de las propiedades del carrito de productId a product_id para coincidir con el esquema esperado por el Backend y evitar errores de validación 422 (Zod).

Cálculos Reactivos: Se implementó un getter de total en el componente para mostrar el monto exacto a cobrar al cajero antes de procesar el pago.

[x] Generación y Visualización de Ticket: EXITOSO.

Acción: Se integró el componente SaleTicketComponent que consume el objeto ticket generado dinámicamente por el Backend.

Resultado: El ticket se visualiza correctamente tras un código 201 Created, mostrando nombres de productos, subtotales y el método de pago elegido, cumpliendo con el contrato de API.


### 