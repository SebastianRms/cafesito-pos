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