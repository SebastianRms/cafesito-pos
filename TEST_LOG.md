# 🧪 Cafecito POS - Registro de Calidad y Pruebas (Test Log)

Este documento registra los resultados de las pruebas de aceptación y la suite de pruebas unitarias automatizadas implementadas para asegurar la robustez, seguridad y consistencia lógica de **Cafecito POS**.

---

## 🚦 Resumen Ejecutivo del Estado del Software

| Entorno | Framework | Pruebas Ejecutadas | Resultados | Estado |
| :--- | :--- | :---: | :---: | :---: |
| **Backend (API REST)** | Jest | 4 Specs | 4 Pasadas, 0 Fallos | 🟢 Verde (100%) |
| **Frontend (Angular)** | Jasmine + Karma | 28 Specs | 28 Pasadas, 0 Fallos | 🟢 Verde (100%) |

---

## ⚙️ Pruebas Automatizadas (Unit & Integration Testing)

### Suite del Backend (Jest)
Ubicación de pruebas clave: [saleService.test.js](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/backend/src/services/saleService.test.js)

1. **`debería procesar una venta y descontar stock correctamente`**:
   - Valida que al enviar productos con stock suficiente, la transacción se guarde, se descuente el inventario de MongoDB y se genere el ticket inmutable.
2. **`debería rechazar la venta si no hay stock suficiente`**:
   - Asegura la atomicidad: una venta con stock excedido retorna un error `400` y revierte cualquier descuento previo de stock de otros productos.
3. **`debería aplicar el descuento correspondiente por compras previas`**:
   - Certifica que la lógica matemática del negocio aplique el 5%, 10% o 15% dependiendo del historial del socio y que actualice el acumulador del cliente.
4. **`debería procesar la venta sin sesión transaccional si MongoDB corre en modo Standalone`**:
   - Garantiza la resiliencia en despliegues simplificados locales donde no hay un Replica Set configurado.

---

### Suite del Frontend (Jasmine + Karma)
Ubicación de pruebas clave:
- [cart.store.spec.ts](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/frontend/src/app/services/sales/cart.store.spec.ts)
- [pos-page.component.spec.ts](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/frontend/src/app/pages/pos/pos-page/pos-page.component.spec.ts)
- [inventory.component.spec.ts](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/frontend/src/app/pages/inventory/inventory/inventory.component.spec.ts)
- [auth.service.spec.ts](file:///c:/Users/sebas/Documents/proyectos/MEAN/cafesito-pos/frontend/src/app/services/auth/auth.service.spec.ts)

#### 1. Lógica del Carrito (`CartStore`)
* `[x]` Debería inicializarse con un carrito vacío.
* `[x]` Debería agregar un producto al carrito actualizando el subtotal.
* `[x]` Debería acumular cantidades al agregar el mismo producto sin exceder el stock físico.
* `[x]` Debería quitar un producto específico del pedido.
* `[x]` Debería limpiar el carrito al cancelar o finalizar la venta.

#### 2. Gestión de Seguridad (`AuthService` & `AuthGuard`)
* `[x]` Debería ser creado.
* `[x]` Debería inicializarse con un estado no autenticado (vacío).
* `[x]` Debería actualizar el estado y almacenar el token tras un login exitoso.
* `[x]` Debería limpiar el estado, el token y el rol de usuario al hacer logout.
* `[x]` **Guard**: Debe permitir el acceso (`true`) si el usuario está logueado.
* `[x]` **Guard**: Debe denegar el acceso y redirigir a `/login` si no hay sesión.

#### 3. Punto de Venta (`PosPageComponent`)
* `[x]` Debería crearse y cargar el catálogo de productos llamando a `salesService`.
* `[x]` Debería cambiar la cantidad temporal en la tarjeta del producto respetando límites de stock sin mutar datos.
* `[x]` Debería agregar productos al `CartStore` y reiniciar la cantidad temporal a 1.
* `[x]` Debería buscar un cliente y actualizar el estado reactivo de la venta.
* `[x]` Debería establecer `isNewCustomer` si la búsqueda de socio arroja un error `404` (no encontrado).
* `[x]` Debería procesar la venta registrando primero al cliente si es un socio nuevo.
* `[x]` Debería procesar la venta directamente si es un cliente existente.

#### 4. Formulario de Cierre (`SaleFormComponent`)
* `[x]` Debería disparar un warning de toast si intenta confirmar un nuevo cliente sin ingresar su nombre.
* `[x]` Debería cambiar el método de pago localmente (`cash`, `card`, `transfer`).
* `[x]` Debería emitir `confirmSaleEvent` con la estructura de datos correcta al cobrar.
* `[x]` Debería emitir `searchCustomerEvent` al hacer clic en "Validar".
* `[x]` Debería emitir `resetCustomerEvent` y limpiar el estado al llamar a `clearCustomer`.

#### 5. Gestión del Inventario (`InventoryComponent`)
* `[x]` Debería crearse, inyectar el servicio de productos y listar el inventario disponible del Administrador.

---

## 📈 Pruebas de Aceptación por Historia de Usuario (MVP Validation)

### H8: Seguridad de Acceso
*   **Prueba de Roles**: Logueado con rol `vendor`, el acceso manual a la URL `/admin/inventory` es rechazado por el `adminGuard` y redirige a `/pos`. Los botones administrativos en la cabecera se ocultan mediante directivas estructurales del framework.
*   **Navegación Anónima**: Intentar acceder a `/pos` o `/admin/inventory` sin un JWT válido redirige de forma inmediata a la pantalla de `/login`.

### H2: Registro de Ventas e Inmutabilidad (Snapshots)
*   **Persistencia Histórica**: Si se realiza una venta de un café a $35 y posteriormente el administrador edita el precio del café a $40 en el catálogo, la venta antigua en la base de datos conserva el precio original de $35 en su snapshot, protegiendo las estadísticas contables del negocio.

### H3: Validación de Existencias en Venta
*   **Bloqueo de Agotados**: Al acabarse las existencias de un café (stock = 0), la tarjeta en el POS adquiere opacidad, muestra la etiqueta de **"AGOTADO"** y deshabilita el botón de agregar. Intentar saltarse la restricción en el backend retorna un código `400 (Insufficient Stock)`.

### H4 y H5: Registro de Socios y Fidelización
*   **Estrategia Get or Create**: Si el cliente no existe al validar su número (retorna `404`), se despliega dinámicamente un campo de texto para escribir su nombre y afiliarlo en la misma transacción sin perder los productos del carrito.
*   **Descuentos en Escalera**: Un socio con 5 compras previas recibe de forma automatizada un 10% de descuento en el ticket final. El contador de visitas se incrementa en `+1` atómicamente tras concretarse la transacción.

### H10: Sistema Centralizado de Notificaciones (Toasts)
*   **Reemplazo de Alertas Nativas**: Se validaron flujos erróneos (como intentar afiliar un socio sin nombre o buscar un formato inválido de teléfono). El sistema muestra toasts con animaciones elegantes de advertencia y error en lugar de congelar la pantalla con los diálogos del navegador.
*   **Toast de Éxito**: Al procesar la transacción o añadir ítems al pedido, se genera una confirmación emergente que desaparece de manera fluida a los 3 segundos.