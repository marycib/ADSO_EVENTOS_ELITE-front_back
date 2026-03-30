# Eventos Elite

Sistema web de gestión de eventos desarrollado con React (frontend) y Node.js (backend).

---

## Estructura del proyecto

ADSO_EVENTOS_ELITE-front_back/
├── eventos-elite-backend/ → API REST (Node.js + Express + MongoDB)
├── eventos-elite-frontend/ → Interfaz web (React + Tailwind CSS)
└── README.md



---

## Tecnologías utilizadas

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18 | Librería principal |
| Vite | 5 | Bundler y servidor de desarrollo |
| Tailwind CSS | 3 | Estilos |
| React Router DOM | 6 | Navegación entre páginas |
| React Hot Toast | — | Notificaciones |
| jwt-decode | — | Decodificar token JWT |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18+ | Entorno de ejecución |
| Express | 4 | Framework web |
| MongoDB | — | Base de datos |
| Mongoose | — | ODM para MongoDB |
| JWT | — | Autenticación |
| bcryptjs | — | Encriptación de contraseñas |
| express-validator | — | Validación de datos |
| cors | — | Control de origen cruzado |

---

## Cómo ejecutar el proyecto

### 1. Requisitos previos
- Node.js 18+
- MongoDB Atlas o MongoDB local
- Git

### 2. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/ADSO_EVENTOS_ELITE-front_back.git
cd ADSO_EVENTOS_ELITE-front_back.git


cd ADSO_EVENTOS_ELITE-front_back.git
npm install


MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
PORT=5000
ADMIN_EMAIL=admin@eventoselit.com
ADMIN_PASSWORD=Admin123!

node src/seed/adminSeed.js


Iniciar servidor:

npx nodemon server.js

El backend corre en http://localhost:5000


cd ADSO_EVENTOS_ELITE-front_back
npm install
npm run dev

La app corre en http://localhost:5173

Credenciales de prueba
Rol	Correo	Contraseña
Administrador	admin@eventoselit.com	Admin123!
Pantallas del sistema
#	Pantalla	Ruta	Rol requerido	API consumida
1	Home / Landing	/	Público	—
2	Nosotros	/nosotros	Público	—
3	Testimonios	/testimonios	Público	—
4	Contacto	/contacto	Público	—
5	Términos y condiciones	/terminos	Público	—
6	Políticas de privacidad	/privacidad	Público	—
7	Iniciar sesión	/login	Público	POST /api/usuarios/login
8	Registrarse	/register	Público	POST /api/usuarios/registro
9	Eventos	/eventos	Autenticado	GET /api/eventos/listar GET /api/eventos/disponibles
10	Mi Panel (usuario)	/usuario	Autenticado	GET /api/inscripciones/mis-inscripciones PATCH /api/inscripciones/:id/cancelar
11	Panel Organizador	/organizador	Organizador / Admin	GET /api/eventos/listar POST /api/eventos/crear PUT /api/eventos/:id PATCH /api/eventos/:id/cancelar PATCH /api/eventos/:id/finalizar DELETE /api/eventos/:id
12	Inscritos por evento	/eventos/:id/inscritos	Organizador / Admin	GET /api/eventos/:id/inscritos PATCH /api/inscripciones/:id/confirmar PATCH /api/inscripciones/:id/certificado
13	Usuarios	/usuarios	Administrador	GET /api/usuarios/listar
14	Crear usuario	/usuarios/crear	Administrador	POST /api/usuarios/crear
15	Editar usuario	/usuarios/editar/:id	Administrador	PUT /api/usuarios/:id
16	Detalle usuario	/usuarios/:id	Administrador	GET /api/usuarios/:id
17	Roles	/roles	Administrador	GET /api/roles
18	Crear rol	/roles/crear	Administrador	POST /api/roles/crear
19	Editar rol	/roles/editar/:id	Administrador	PUT /api/roles/:id
20	Ponentes	/ponentes	Organizador / Admin	GET /api/ponentes
21	Crear ponente	/ponentes/crear	Organizador / Admin	POST /api/ponentes/crear
22	Editar ponente	/ponentes/editar/:id	Organizador / Admin	PUT /api/ponentes/:id
23	Sesiones	/sesiones	Organizador / Admin	GET /api/sesiones/listar
24	Crear sesión	/sesiones/crear	Organizador / Admin	POST /api/sesiones/crear
25	Editar sesión	/sesiones/editar/:id	Organizador / Admin	PUT /api/sesiones/:id
26	No autorizado	/no-autorizado	—	—
27	No encontrado	*	—	—



Endpoints del API
Autenticación / Usuarios
Método	Ruta	Descripción	Auth
POST	/api/usuarios/login	Iniciar sesión	No
POST	/api/usuarios/registro	Registro público	No
POST	/api/usuarios/crear	Crear usuario	Admin
GET	/api/usuarios/listar	Listar usuarios	Admin
GET	/api/usuarios/:id	Ver usuario	Auth
PUT	/api/usuarios/:id	Actualizar usuario	Admin
DELETE	/api/usuarios/:id	Eliminar usuario	Admin
Eventos
Método	Ruta	Descripción	Auth
GET	/api/eventos/listar	Listar todos	Público
GET	/api/eventos/disponibles	Eventos con cupo	Público
GET	/api/eventos/:id	Ver evento	Público
POST	/api/eventos/crear	Crear evento	Org / Admin
PUT	/api/eventos/:id	Actualizar evento	Org / Admin
DELETE	/api/eventos/:id	Eliminar evento	Admin
PATCH	/api/eventos/:id/cancelar	Cancelar evento	Org / Admin
PATCH	/api/eventos/:id/finalizar	Finalizar evento	Org / Admin
GET	/api/eventos/:id/inscritos	Ver inscritos	Org / Admin
Inscripciones
Método	Ruta	Descripción	Auth
POST	/api/inscripciones/inscribir	Inscribirse	Auth
GET	/api/inscripciones/mis-inscripciones	Mis inscripciones	Auth
PATCH	/api/inscripciones/:id/cancelar	Cancelar inscripción	Auth
PATCH	/api/inscripciones/:id/confirmar	Confirmar inscripción	Org / Admin
PATCH	/api/inscripciones/:id/certificado	Emitir certificado	Org / Admin
Ponentes
Método	Ruta	Descripción	Auth
GET	/api/ponentes	Listar ponentes	Público
GET	/api/ponentes/:id	Ver ponente	Público
POST	/api/ponentes/crear	Crear ponente	Org / Admin
PUT	/api/ponentes/:id	Actualizar ponente	Org / Admin
DELETE	/api/ponentes/:id	Eliminar ponente	Admin
Sesiones
Método	Ruta	Descripción	Auth
GET	/api/sesiones/listar	Listar sesiones	Público
GET	/api/sesiones/:id	Ver sesión	Público
POST	/api/sesiones/crear	Crear sesión	Org / Admin
PUT	/api/sesiones/:id	Actualizar sesión	Org / Admin
DELETE	/api/sesiones/:id	Eliminar sesión	Admin
Roles
Método	Ruta	Descripción	Auth
GET	/api/roles	Listar roles	Admin
GET	/api/roles/:id	Ver rol	Admin
POST	/api/roles/crear	Crear rol	Admin
PUT	/api/roles/:id	Actualizar rol	Admin
DELETE	/api/roles/:id	Eliminar rol	Admin
Roles del sistema
Rol	Descripción	Acceso
administrador	Control total	Todas las pantallas
organizador	Gestiona eventos	Panel organizador, ponentes, sesiones
asistente	Participa en eventos	Eventos, mi panel
ponente	Presenta en eventos	Eventos, mi panel



Seguridad implementada
✅ Autenticación con JWT (JSON Web Tokens)
✅ Contraseñas encriptadas con bcryptjs
✅ Rutas protegidas por rol en frontend
✅ Middleware de verificación de token en backend
✅ Middleware de verificación de rol en backend
✅ Validación de datos con express-validator
✅ Manejo de errores global
✅ CORS configurado
✅ Registro público separado de creación por admin
Acciones del negocio implementadas
✅ Registro de usuarios con validaciones
✅ Inscribirse a un evento (verifica cupo y estado)
✅ Cancelar inscripción propia
✅ Confirmar inscripción (organizador/admin)
✅ Emitir certificado de participación
✅ Cancelar evento
✅ Finalizar evento
✅ Editar evento
✅ Eliminar evento
✅ Ver eventos con cupo disponible
✅ Ver inscritos por evento con resumen de cupo
✅ Buscador y filtros en eventos
✅ Buscador en usuarios, roles, ponentes y sesiones
Cambios recientes
✅ Ruta /api/usuarios/registro separada para registro público
✅ Páginas estáticas: Nosotros, Testimonios, Contacto, Términos, Privacidad
✅ Botón "Volver al inicio" en Login y Register
✅ Filtro "Solo con cupo" en Eventos consume /api/eventos/disponibles
✅ Panel Usuario mejorado con estadísticas y badges
✅ Panel Organizador con editar, eliminar y ver inscritos
