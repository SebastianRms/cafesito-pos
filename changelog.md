# Changelog - Cafecito POS

## [En Progreso] - Sprint 1

### Finalizado (H8: Seguridad y Gestión de Accesos)
- **Frontend:** Implementación de `RegisterPageComponent` y `RegisterFormComponent`.
- **Seguridad:** Creación de `authGuard` y `adminGuard` para protección de rutas.
- **UI:** Layout con navegación dinámica basada en roles (`*ngIf` para ocultar botones de Admin).
- **Contrato:** Estandarización de errores 422 (Zod) y 401 para fallos de validación/auth.

---

## [2026-01-28] - Infraestructura Backend y H1 (Inventario)
- **H1:** Endpoint `POST /api/products` con validación de Zod y trazabilidad.
- **Validación:** Migración total a Zod para esquemas de datos.
- **Auth:** Middleware de JWT y protección de rutas por roles en el servidor.
- **Global:** Manejador de errores centralizado (ZodError 422 / Server Error 500).

## [2026-01-21 a 2026-01-27] - Cimientos del Proyecto
- **Setup:** Configuración de Angular 17+ y Node.js con orquestación (Concurrently).
- **DB:** Conexión a MongoDB y creación de modelos de Mongoose (`Product`, `User`).
- **UI Inicial:** Integración de Tailwind CSS (o Bootstrap, según tu ajuste reciente) y SweetAlert2.
- **Seed:** Script para llenado automático de base de datos de productos.