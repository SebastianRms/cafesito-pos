### Log de Pruebas de Aceptación - MVP Cafecito Feliz


### Historia: H8 - Seguridad de Acceso
Fase 1: Verificación de Backend

[x] POST /api/auth/register: EXITOSO (con ajuste técnico).

Incidencia: Error 422 por inconsistencia entre Model (name) y Controller (display_name).

Acción: Estandarización total a campo name.

[x] POST /api/auth/login: EXITOSO. Retorna ID y JWT correctamente.

[x] Pruebas de Seguridad: OK. Credenciales inválidas o campos vacíos retornan 401 unificado. No se revela existencia de usuarios.

Fase 2: Verificación de Frontend

[x] Control de Acceso por Roles: FINALIZADO. Implementación de adminGuard y authGuard.

[x] Prueba de Rol: Logueado como vendor, el acceso manual a /register redirecciona a /pos. Botones administrativos ocultos mediante *ngIf.

[x] Navegación Anónima: Rutas protegidas redirigen al Login si no existe token activo.

### Historia: H2 - Registro de Ventas y Carrito
Fase 1: Verificación de Backend

[x] POST /api/sales: EXITOSO.

Incidencia: Error de validación en product.save() por campos antiguos obligatorios.

Acción: Uso de Product.updateOne con $inc para bypass de validaciones no relacionadas.

[x] Persistencia de Snapshots: EXITOSO. La venta guarda precio y nombre del momento, protegiendo reportes históricos.

[x] Validación de Inventario: El sistema bloquea ventas (Error 400) si superan el stock físico.

Fase 2: Verificación de Integración

[x] Interceptor: EXITOSO. authInterceptor añade el token JWT en el header de todas las peticiones de venta.

[x] Gestión de Carrito: Unificación de productId a product_id para cumplir con esquema Zod (evita Error 422).

[x] Totalizadores: Getter reactivo en el POS muestra el monto exacto antes de confirmar el pago.

### Historia: H3 - Control de Inventario Reactivo
Fase 1: Persistencia

[x] Sincronización: Cada venta descuenta unidades reales en MongoDB de forma atómica.

Fase 2: Interfaz de Usuario

[x] Selector de Cantidad: OK. No permite cantidades < 1 ni > al stock disponible.

[x] Reactividad Post-Venta: Al recibir Status 201, la lista de productos actualiza el stock visualmente sin recargar.

[x] Control de Agotado: Al llegar a 0, la tarjeta aplica opacidad, deshabilita el botón y muestra leyenda "SIN STOCK".

### Historia: H1 - Gestión de Catálogo (Admin)
Fase 1: Verificación de Backend

[x] CRUD de Productos: EXITOSO. Operaciones GET, POST, PUT y DELETE verificadas con el middleware isAdmin.

[x] Blindaje de Datos: Bloqueo de precios/stock negativos y prevención de inyección de texto en campos numéricos.

Fase 2: Interfaz Admin

[x] Renderizado: Uso de semáforo de stock (Rojo/Naranja/Verde) mediante [ngClass].

[x] Formulario Reactivo: Alternancia fluida entre creación y edición con limpieza de estado vía resetForm().

### Historia: H4 - Registro de Clientes y Fidelización (Sprint 03)
Fase 1: Verificación de Backend

[x] Estrategia Get or Create: EXITOSO. Búsqueda y registro unificado en un solo endpoint.

[x] Lógica de Descuentos: El servidor aplica 5%, 10% o 15% según purchases_count previo.

Fase 2: Verificación de Frontend e Integración

[x] Validación de Captura: EXITOSO. Se intentaron registrar datos mal formados (teléfonos cortos/emails sin @).

Resultado: El sistema detecta el Error 422 y lanza un alert() informativo bloqueando el envío.

[x] Flujo de Registro: EXITOSO. Ante un Error 404 (cliente no encontrado), se habilita el campo de nombre para registro inmediato sin abandonar la venta.

[x] Ticket de Lealtad: FINALIZADO. Visualización correcta de descuentos y mensaje de beneficio de socio en el ticket final.

[x] Limpieza de Sesión: EXITOSO. El SaleFormComponent resetea los datos del cliente tras confirmar la venta, previniendo errores en la siguiente transacción.