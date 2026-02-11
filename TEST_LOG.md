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