# ☕ Cafecito POS & Loyalty System (MVP)

**Cafecito POS** es un sistema de Punto de Venta (POS) diseñado para optimizar la operación de una cafetería mediante la automatización del control de inventarios y la fidelización de clientes. Este proyecto ha sido profesionalizado con una interfaz oscura premium de tipo Single-Page Dashboard, un sistema reactivo de notificaciones, soporte para carga de productos por lote y cobertura de pruebas automatizadas completas.

El proyecto resuelve tres problemas críticos de negocio:
1. **Falta de control en stock:** Evita ventas de productos sin existencias físicas y maneja transacciones de forma atómica.
2. **Fidelización manual:** Aplica descuentos automáticos (5%, 10%, 15%) basados en la recurrencia del cliente.
3. **Inseguridad:** Restringe las funciones de administración mediante control de acceso basado en roles (RBAC).

---

## 🛠️ Tech Stack & Arquitectura

El sistema está desarrollado bajo el stack **MEAN** con un enfoque reactivo y moderno:

* **Frontend:** 
  - **Angular 19** (Standalone Components, Signals para el manejo del estado inmutable de vistas, `inject()`).
  - **Tailwind CSS v4** (Diseño moderno con variables de tema nativas, efecto Glassmorphism y micro-interacciones).
  - **Jasmine & Karma** para la suite de pruebas unitarias y de integración.
* **Backend:** 
  - **Node.js & Express** (Arquitectura desacoplada en Controladores, Servicios, Modelos y Validadores).
  - **MongoDB & Mongoose** (Modelado de datos con soporte de transacciones ACID y fallback dinámico para bases de datos standalone locales).
  - **Jest** para pruebas unitarias de persistencia y lógica de negocio.
* **Seguridad:** Autenticación JWT y validaciones estrictas con Zod.

---

## ✨ Características Premium Implementadas (Sprint 4)

* **Interfaz de Pantalla Fija (Dashboard POS)**: El punto de venta está optimizado para ajustarse exactamente al alto del monitor (`h-screen`), eliminando el scroll general de página. La lista de compras cuenta con scroll interno independiente para facilitar la visualización.
* **Catálogo en Rejilla 4x3**: Distribución visual optimizada de hasta 12 productos por página con tarjetas dinámicas compactas y controles de paginación Anterior/Siguiente.
* **Sistema Global de Notificaciones (Toasts)**: Erradicación total de las alertas nativas del navegador (`alert()` y `confirm()`). Los avisos de éxito, error o validación se despliegan mediante un `ToastService` inyectable basado en Signals de Angular con desvanecimiento automático.
* **Carga Masiva de Productos (Bulk Insert)**: Endpoint polimórfico en el backend que acepta tanto un único producto como un array de productos, validado rigurosamente mediante Zod e insertado de forma optimizada en base de datos.
* **Resiliencia de Conexión**: Detección dinámica en el servicio de ventas que permite operar sin sesiones transaccionales si la base de datos corre en modo local standalone (sin Replica Set).

---

## 🚦 Cobertura de Pruebas (Quality Assurance)

El proyecto cuenta con una cobertura de pruebas automatizadas al **100% en verde (32 Specs)** para garantizar la consistencia en refactorizaciones futuras:

* **Pruebas del Backend (Jest - 4 Specs)**:
  - Creación de ventas exitosas y actualización atómica del inventario.
  - Reversión transaccional en caso de stock insuficiente.
  - Aplicación automática de descuentos basados en lealtad.
  - Resiliencia y fallback en bases de datos standalone.
* **Pruebas del Frontend (Jasmine/Karma - 28 Specs)**:
  - Ciclo de vida y mutabilidad del `CartStore` (Signals).
  - Autenticación (`AuthService`) y protección de rutas (`AuthGuard` y `AdminGuard`).
  - Lógica de selección de cantidades y validaciones de socio en `PosPageComponent` y `SaleFormComponent`.
  - Carga y renderizado del catálogo en `InventoryComponent`.

---

## 🚀 Instalación y Ejecución Rápida

### 1. Requisitos Previos
* Node.js v18 o superior.
* MongoDB corriendo localmente (puerto por defecto `27017`).

### 2. Configuración de Variables de Envío
Crea un archivo llamado `.env` en el directorio `/backend` con el siguiente contenido:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cafesito
JWT_SECRET=tu_clave_secreta_super_segura
```

### 3. Instalación y Arranque Automatizado
Desde la raíz del proyecto, puedes ejecutar los scripts unificados del `package.json`:

```bash
# 1. Instalar todas las dependencias del monorepo (Raíz, Backend y Frontend)
npm run install:all

# 2. Poblar la base de datos con productos y usuarios de prueba (Admin y Vendor)
npm run seed

# 3. Iniciar el Backend (Node.js) y el Frontend (Angular) simultáneamente
npm run dev
```

### 4. Credenciales de Prueba (Seed)
* **Administrador**: `admin@cafecito.com` / `admin123` (Acceso completo a Inventario y Usuarios).
* **Vendedor (Vendor)**: `vendor@cafecito.com` / `vendor123` (Acceso exclusivo a Ventas/POS).

---

Desarrollado con excelencia por **SebastianRms** ☕
