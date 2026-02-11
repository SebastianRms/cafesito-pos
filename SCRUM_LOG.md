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

### Refinación de Historias de Usuario: Se refinaran 5 de las historias de usuario
1. Como Administrador, quiero registrar productos con su precio y stock inicial para tener un catálogo disponible para la venta.
2. Como Vendedor, quiero seleccionar productos y procesar el pago para registrar la salida de mercancía y el ingreso de dinero.
3. Como Vendedor, quiero que el sistema me impida vender productos sin existencias para evitar compromisos que no puedo cumplir con el cliente.
4. Como Vendedor, quiero dar de alta a clientes con su correo o teléfono para identificarlos en futuras visitas.
8. Como Administrador, quiero restringir las funciones sensibles (como borrar productos) mediante login para que solo personal autorizado haga cambios.

1. Gestión de Catálogo de Productos (Historia 1)
Historia Refinada: Como Administrador, quiero gestionar el catálogo de productos (crear, editar, eliminar) con nombre, precio y stock para asegurar que la oferta de la cafetería esté siempre actualizada.

Criterio de Aceptación 1: Dado que soy un administrador autenticado, cuando completo el formulario con nombre, precio (>0) y stock, entonces el sistema debe persistir el producto y mostrarlo inmediatamente en el listado de inventario.

Criterio de Aceptación 2: Dado que intento eliminar un producto, cuando confirmo la acción, entonces el sistema debe borrarlo lógicamente y dejar de mostrarlo como opción en el punto de venta (POS).

2. Flujo de Venta y Carrito (Historia 2)
Historia Refinada: Como Vendedor, quiero operar un carrito de ventas que me permita listar, buscar y seleccionar productos para calcular subtotales y procesar el registro de transacciones.

Criterio de Aceptación 1: Dado que agrego productos al carrito, cuando selecciono diferentes ítems, entonces el sistema debe calcular el total en tiempo real y permitir visualizar un desglose antes de finalizar la venta.

Criterio de Aceptación 2: Dado que se confirma la venta, cuando el sistema procesa el pago simulado, entonces debe generar un registro único de venta y disparar la actualización de stock en la base de datos.

3. Validación de Existencias en Venta (Historia 3)
Historia Refinada: Como Sistema, quiero validar la disponibilidad de stock durante el proceso de compra para impedir la venta de productos agotados y garantizar la integridad del inventario.

Criterio de Aceptación 1: Dado que un producto tiene stock 0, cuando se carga el listado de ventas, entonces el sistema debe mostrar el ítem como "No disponible" y deshabilitar su botón de selección.

Criterio de Aceptación 2: Dado que el stock es insuficiente para la cantidad solicitada, cuando el vendedor intenta procesar la venta, entonces el sistema debe rechazar la transacción con un mensaje de error y no permitir el guardado en la base de datos.

4. Registro y Búsqueda de Clientes (Historia 4)
Historia Refinada: Como Vendedor, quiero administrar perfiles de clientes capturando su nombre y contacto para identificarlos rápidamente mediante búsqueda y realizar un seguimiento de su recurrencia.

Criterio de Aceptación 1: Dado que un cliente proporciona sus datos, cuando ingreso su nombre y correo/teléfono, entonces el sistema debe crear un registro con un contador de compras inicializado en cero.

Criterio de Aceptación 2: Dado que un cliente recurrente se presenta, cuando busco su correo o teléfono en el sistema, entonces debe aparecer su información existente para vincularla a la nueva venta.

5. Control de Acceso por Roles (Historia 8)
Historia Refinada: Como Administrador, quiero restringir el acceso a módulos sensibles mediante autenticación para asegurar que solo los usuarios autorizados puedan modificar el inventario y configuraciones.

Criterio de Aceptación 1: Dado que un usuario no está logueado, cuando intenta acceder a cualquier ruta interna (POS o Inventario), entonces el sistema debe bloquear el acceso y redirigirlo a la pantalla de Login.

Criterio de Aceptación 2: Dado que un usuario tiene rol de "Vendedor", cuando intenta ingresar a la edición de productos, entonces el sistema debe impedir la carga de la vista y notificar que no tiene permisos de administrador.


### Creacion de Roadmap de MVP

Planificación de Sprints (Roadmap del MVP)
He dividido las 5 historias de usuario refinadas en 3 Sprints lógicos para asegurar una entrega incremental de valor:

Sprint 01: Infraestructura y Venta Base
Historias:

H8 (Seguridad de Acceso): Implementación de Login y Guards para proteger las rutas.

H2 (Flujo de Venta): Creación del carrito y lógica de cobro (Total/Subtotal).

Objetivo: Tener un "Walking Skeleton" (esqueleto funcional). Al final de este sprint, el sistema ya permite loguearse y realizar una venta manual.

Sprint 02: Gestión de Inventario y Reglas de Negocio
Historias:

H1 (Gestión de Catálogo): CRUD completo de productos para el Administrador.

H3 (Validación de Stock): Lógica para impedir ventas de productos agotados.

Objetivo: Dar autonomía al Administrador para gestionar el catálogo y proteger la integridad del inventario automáticamente.

Sprint 03: Experiencia del Cliente y Cierre de MVP
Historias:

H4 (Registro de Clientes): Base de datos de clientes y búsqueda por correo/teléfono.

Refinamiento de Ticket: Generación visual del resumen de compra.

Objetivo: Completar el ciclo de fidelización y asegurar que el producto cumple con todos los requisitos visuales y de usuario del MVP.

🧠 Justificación de la Estrategia (Lo que aprendiste)
Priorización: Se movió la H8 (Seguridad) al Sprint 1 porque es la base técnica que impide que el sistema se rompa o que usuarios no autorizados accedan.

Mitigación de Riesgos: La H3 (Stock) se dejó para el Sprint 2 para primero asegurar que el flujo de venta (H2) fuera sólido antes de añadirle capas de validación complejas.

Valor Incremental: El negocio puede empezar a operar desde el Sprint 1, cumpliendo con la filosofía Agile de entregar valor lo antes posible.

### Plan de Sprints con Story Points (Capacidad Máxima: 20 SP)
Sprint 01: El Núcleo Operativo (Infraestructura y Venta)
En este sprint se construye la base de seguridad y la funcionalidad que genera dinero: la venta.

H8: Seguridad de Acceso (5 SP): Configuración de Login, Guards e Interceptor JWT. (Alta complejidad técnica).

H2: Flujo de Venta y Carrito (8 SP): Lógica de snapshots de precios, cálculo de totales y carrito. (Máxima complejidad).

H7: Generación de Ticket (2 SP): Vista de resumen de compra para el cliente. (Baja complejidad).

H0: Setup y Arquitectura (3 SP): Configuración de rutas, Tailwind y estructura de carpetas.

Total Sprint 01: 18 Story Points ✅ (Dentro del límite de 20)

Sprint 02: Gestión y Reglas de Negocio
Aquí el sistema deja de ser una "calculadora" y se convierte en una herramienta de gestión inteligente.

H1: Gestión de Inventario - CRUD (3 SP): Creación, edición y eliminación de productos para el catálogo.

H3: Validación de Stock (3 SP): Lógica del sistema para bloquear ventas sin existencias y manejo de errores 400.

H5: Aplicación de Descuentos (5 SP): Lógica automática de 5%/10%/15% basada en el historial del cliente. (Complejidad media-alta).

Total Sprint 02: 11 Story Points ✅ (Carga moderada para pulir detalles del inventario)

Sprint 03: Fidelización y Control Total
El cierre del MVP enfocado en el cliente y la auditoría que te gusta como Jefe de Almacén.

H4: Registro y Búsqueda de Clientes (3 SP): Base de datos de clientes y validación de duplicados.

H6: Trazabilidad de Almacén - Logs (5 SP): Tu firma personal; registro de movimientos de stock para auditoría. (Complejidad media por el manejo de logs).

QA y Refactor Final (3 SP): Limpieza de código, corrección de bugs y validación de Edge Cases.

Total Sprint 03: 11 Story Points ✅ (Espacio para asegurar la calidad final del portafolio)

🧠 Resumen de Estimación (Fibonacci)
Historias de 8 SP: El corazón del POS (H2). Mucho riesgo y lógica de frontend.

Historias de 5 SP: Tareas que tocan seguridad o reglas de negocio críticas (H8, H5, H6).

Historias de 3 SP: CRUDS estándar y validaciones directas (H1, H3, H4).

Historias de 2 SP: Tareas visuales o de formato (H7).

### Tablero de flujo de trabajo sprint 01

1. Tablero inicial (Sprint 1: Infraestructura y Venta Base)
To Do:

Historia: H2 - Operar un carrito de ventas con cálculo de totales y snapshots.

(Próxima) Historia: H8 - Restringir acceso a módulos sensibles mediante roles (Admin/Vendedor).

In Progress:

Historia: H2 - Implementación de la lógica del carrito en el Frontend (WIP).

In Review:

(Vacío al inicio del desarrollo de la H2)

Done:

Historia: H0 - Setup inicial del proyecto (Angular, Tailwind, Routing).

Historia: H0 - Estructura de servicios base y configuración de Interceptor.

2. Flujo de una historia (ejemplo: "H2 - Flujo de Venta y Carrito")
Paso 1: La historia se mueve de "To Do" a "In Progress" tras definir los componentes del carrito.
Paso 2: El desarrollador crea la rama feature/carrito-ventas desde main.
Paso 3: Se programa la lógica de sumar productos y congelar el precio (Snapshot).
Paso 4: Se realizan pruebas locales: verificar que el total cambie al agregar/quitar ítems.
Paso 5: Se sube el código y se abre un Pull Request (PR) → La historia pasa a "In Review".
Paso 6: Se valida el cumplimiento del DoD (Definition of Done) y se hace el merge → Historia llega a "Done".

3. Estrategia de ramas Git
Convención de nombres:

feature/nombre-h-usuario (Ej: feature/auth-roles)

fix/descripcion-error (Ej: fix/error-calculo-carrito)

¿Cuándo crear rama?

Inmediatamente al mover una historia a "In Progress" para trabajar de forma aislada.

¿Cuándo crear PR?

Al terminar la funcionalidad de la historia y asegurar que el código compila sin errores.

¿Quién revisa?

Auto-revisión técnica basada en el checklist de criterios de aceptación y el MVP.

4. Reglas del equipo
WIP Limit: Máximo 1 historia en "In Progress" (ya que soy un único desarrollador, para asegurar el foco total).

Definición de "In Review":

El código está pusheado, no tiene conflictos con main y la lógica de snapshots ha sido probada manualmente.

Definición de "Done":

La funcionalidad permite completar el flujo de venta desde la selección hasta el total.

El código sigue las convenciones del proyecto y ha sido integrado a main.





### Sprint 4 — Definition of Done del POS
1. Definition of Done (aplica a TODAS las historias)
[ ] Seguridad: La ruta está protegida por AuthGuard y el Interceptor adjunta el token JWT.

[ ] Persistencia: Los datos se guardan en la base de datos y se mantienen tras recargar.

[ ] Validación: El frontend y backend rechazan datos inválidos (precios < 0, stock insuficiente).

[ ] Feedback: El usuario recibe una notificación clara de éxito o un mensaje de error (400, 404, 500).

[ ] Código: Pull Request revisado, sin console.logs y mergeado a main sin conflictos.

[ ] (Opcional) Responsividad: La interfaz es usable en tablets y dispositivos móviles.

2. Plan de validación para historias
Historia 1: Registrar cliente (H4)
Tipo de prueba: Integración (Frontend + Backend + DB).

Qué validar:

Creación de nuevo registro con purchasesCount en 0.

Manejo de duplicados (Email/Teléfono).

Persistencia de los datos en la colección de clientes.

Cómo probar:

Ingresar al módulo de Clientes y llenar el formulario con un correo nuevo.

Intentar registrar un segundo cliente con el mismo correo electrónico.

Consultar la base de datos o el listado para verificar la existencia del primer registro.

Resultado esperado:

Éxito (201) en la primera creación. En la segunda, el sistema debe recuperar el cliente existente o mostrar un mensaje de "Usuario ya registrado".

Historia 2: Crear venta con descuento (H2 + H5)
Tipo de prueba: End-to-End (Flujo completo).

Qué validar:

Cálculo de subtotal y total con snapshots de precios.

Aplicación de descuentos automáticos (ej. 10% si el cliente tiene 5 compras).

Incremento del contador de compras del cliente tras la venta.

Cómo probar:

Seleccionar un cliente que tenga 5 compras previas.

Agregar productos al carrito (ej. 2 cafés de $25.00 c/u).

Finalizar la venta y verificar el ticket visual.

Resultado esperado:

El total debe ser de $45.00 ($50.00 - 10% desc). El purchasesCount del cliente en la DB debe subir a 6.

Historia 3: Validar stock insuficiente (H3)
Tipo de prueba: Edge Case (Caso límite / Error).

Qué validar:

Bloqueo de la transacción si la cantidad solicitada > stock disponible.

Integridad atómica: Si la venta falla por un producto, no se descuenta nada de los demás.

Mensaje de error descriptivo (400 Bad Request).

Cómo probar:

Identificar un producto con 1 sola unidad en stock.

Intentar realizar una venta solicitando 2 unidades de dicho producto.

Revisar la respuesta del servidor en la pestaña "Network".

Resultado esperado:

Respuesta 400 (Insufficient Stock). El stock en la base de datos debe permanecer en 1 unidad.



### Sprint 5 — Profesionalización del POS
1. Mi checklist de hábitos
Antes de cada commit:

[ ] Limpieza de código: Eliminar console.log, comentarios basura y asegurar que los tipos de TypeScript están definidos.

[ ] Atomicidad: Verificar que el commit solo incluya cambios relacionados a una única tarea o historia.

Antes de cada push:

[ ] Smoke Test: Validar con el REST Client (ejemplos-api.http) que los endpoints clave siguen respondiendo correctamente.

[ ] Build Check: Ejecutar npm run build para garantizar que el código no rompe la compilación general.

Antes de cada PR:

[ ] Sincronización: Hacer git pull origin main y resolver conflictos localmente.

[ ] Documentación: Escribir una descripción clara de la funcionalidad implementada y los criterios de aceptación cumplidos.

Al revisar código de otros:

[ ] Validación contra el DoD: Confirmar que se respetaron las reglas de negocio (como el stock y los snapshots).

2. Pipeline del POS
Trigger: Push a cualquier rama feature/ o Merge a la rama main.

Paso 1: Instalación: npm install para asegurar que todas las dependencias (backend/frontend) están presentes.

Paso 2: Linter: npm run lint para verificar que el código cumple con el estándar de estilo y evitar errores tontos de sintaxis.

Paso 3: Compilación: npm run build para validar que el proyecto de Angular y el servidor Node.js compilan sin fallos.

Paso 4: Pruebas de Integración: Ejecución de scripts automatizados para validar que POST /api/sales descuenta stock correctamente.

Paso 5: Seguridad: Verificación de presencia de variables de entorno críticas.

¿Qué pasa si falla?
El proceso se detiene inmediatamente, se bloquea el Merge a main y se notifica al desarrollador para que corrija el error en su rama local.

¿Qué herramienta usarías?
GitHub Actions, por su facilidad para integrar el flujo de trabajo directamente con mis Pull Requests.

3. Reflexión final
¿Qué aprendí que no sabía antes?
Aprendí que la metodología Scrum es el mapa que evita que te pierdas en el código. Antes veía las tareas como "cosas que programar", ahora las veo como Historias de Usuario con un valor real para el negocio. Entendí que proteger la integridad de los datos (como usar Snapshots de precios) es lo que diferencia un juguete de un software profesional.

¿Qué fue lo más difícil?
Lo más difícil fue la redefinición del alcance. Enfrentar que no podía hacer todo el MVP en un solo sprint de 20 puntos me obligó a ser honesto con mi capacidad y a priorizar lo que realmente importa: que el POS venda de forma segura (Login y Carrito primero).

¿Qué haría diferente en el próximo proyecto?
Definiría la Definition of Done (DoD) y los Edge Cases antes de tocar el código. Hoy aprendí que es más caro refactorizar una lógica de stock mal planeada que dedicarle una hora extra a la planificación en el papel.

¿Cómo me siento ahora vs al inicio del curso?
Al inicio me sentía abrumado por la cantidad de requisitos. Ahora me siento con control sobre el proceso. Sé que si sigo mis hábitos y el pipeline, el código será estable. He pasado de "hacer que compile" a "construir con calidad".



