# Proyecto: Sistema de Gestión de Trámites Municipales - Santo Domingo

## 1. Información del Grupo
* **Integrantes:** Fernanda Cádiz, Luciano Fredes, Héctor Fuentes, Diego Escobar
* **Asignatura:** Ingeniería Web y Móvil (ICI 4247-2)
* **Fecha:** Mayo 2026
* **Tecnologías Frontend:** Ionic Framework, React, TypeScript
* **Tecnologías Backend:** Node.js con Express
* **Base de Datos:** MySQL

---

## 2. Definición del Problema y Usuario Objetivo (EP 1.2)

### Justificación
La Municipalidad de Santo Domingo cuenta actualmente con una plataforma de trámites en línea que presenta múltiples deficiencias, como una oferta limitada de servicios, fragmentación entre distintos sitios web, inconsistencias en la ejecución de trámites, problemas de calidad y falta de gestión de perfiles de usuario.

Este proyecto propone el desarrollo de una nueva plataforma web y móvil que centralice y modernice los trámites municipales, permitiendo a ciudadanos y funcionarios realizar gestiones de forma más eficiente. Entre las funcionalidades contempladas se incluyen inscripción a talleres, solicitud de beneficios sociales, obtención de certificados, pago de permisos y multas, además de herramientas de validación y gestión para funcionarios municipales.

La propuesta también incorpora un sistema de perfiles personalizados y bases de datos orientadas a mejorar la experiencia del usuario. Asimismo, el proyecto se alinea con la transformación digital del sector público en Chile y contribuye al cumplimiento de la Ley 21.180, que establece la digitalización total de los organismos públicos para el año 2027.

### Perfiles de Usuario
* **Ciudadano (Invitado/Residente):** Usuarios mayores de 18 años que buscan realizar trámites y beneficios sociales (DIDECO) desde dispositivos móviles o web.
* **Funcionario Municipal (Administrador):** Encargado de validar documentos de residencia y gestionar los estados de los trámites.

---

## 3. Requerimientos del Proyecto (EP 1.1)

### Requerimientos Funcionales (RF)
| **RF-01** |	Validación de Residencia: Carga de comprobante para pasar de estado 'invitado' a 'residente'.  

| **RF-02** |	Gestión de Estados: Cambio de estado de trámites (Enviado, En revisión, Aprobado/Rechazado).  

| **RF-03** | Diferencia de Usuarios: Capacidad del sistema de modificar funcionalidades según el tipo de usuario.

| **RF-04** | Gestión de Reportes: Generación de reportes de inscripciones y asistencia para administradores.

| **RF-05** |	Corrección de Errores: Capacidad de editar datos de un trámite en estado 'Por modificar'.  

| **RF-06** |	Agendamiento de Hora: Solicitud de horas presenciales para exámenes de conducir.

| **RF-07** | Inscripción DIDECO: Registro de residentes en talleres con recordatorios automáticos.

### Requerimientos No Funcionales (RNF)
| **RNF-01** | Responsividad: Interfaz adaptada a móvil y web mediante componentes de Ionic.

| **RNF-02** | Rendimiento: Tiempos de respuesta aceptables bajo alta demanda.

| **RNF-03** |Seguridad: Acceso restringido mediante rutas protegidas y validación JWT.

## 4. Diseño UI/UX (EP 1.3)
Se han diseñado 7 mockups diferenciados para versiones móvil y web, considerando una jerarquía visual clara y navegación adaptativa.

* **Prototipo en Figma:** [Acceder al Prototipo](https://www.figma.com/design/2x3lhSDr8Qh3J415n52FCj/Sin-t%C3%ADtulo?node-id=0-1&t=lk1vlgy2RKpvECyH-1)

## 5. Arquitectura de Navegación y UX (EP 1.4)

### Mapa de Rutas
* **Públicas:** `/login`, `/registro`, `/tramites`.
* **Protegidas (Ciudadano):** `/profile`, `/mis-tramites`, `/mis-agendas`, `/dideco`.
* **Protegidas (Funcionario):** `/admin-dashboard`, `/Generar-reportes`, `/tramites-asignados`, `/Confirmaciones-de-Residencia`.

### Estrategia de Experiencia de Usuario (UX)
Siguiendo los principios de usabilidad de la cátedra, el diseño contempla:
* **Claridad y Control:** Acciones principales visibles y manejo de estados vacíos útiles.
* **Carga Cognitiva Mínima:** Tareas divididas por pantallas y copy conciso.
* **Apoyo:** Micro-feedback inmediato ante errores o éxito en la carga de archivos.

### Flujos de Tarea (Task Flows)
1. **Inscripción a Taller:** Login -> Trámites -> DIDECO -> Detalle Taller -> Formulario -> Confirmacion Via Correo.
2. **Agendar Trámite:** Login -> Trámites Presenciales -> Ver disponibilidad -> Seleccionar hora -> Confirmar.
3. **Validación Residencia:** Perfil -> Subir documento -> Revisión Admin -> Aprobación -> Cambio a Rol Residente.

<div align="center">
  <img src="Otros/Flowchart - Flujo navegación.png" alt="Flujo de Navegacion" width="600px">
</div>

<div align="center">
  <img src="Otros/Flowchart - Task Flow.png" alt="Task-Flow" width="600px">
</div>

---

## 6. Gestión del Proyecto
El desarrollo se gestiona íntegramente mediante herramientas de GitHub:
* **GitHub Projects:** Tablero Kanban para el seguimiento de tareas en tiempo real.
* **GitHub Issues:** Registro detallado de cada requerimiento funcional con sus criterios de aceptación.

---

## 7. Desarrollo del Backend y Base de Datos (Entrega Parcial 2)

Durante la segunda etapa del proyecto, se construyó e integró el servidor Backend con el Frontend de la aplicación, cumpliendo con los siguientes hitos técnicos:

* **Servidor y API REST (EP 2.1, 2.3 y 2.4):** Se levantó el entorno backend utilizando **Node.js y Express**, desarrollando los endpoints necesarios (GET, POST) manejando respuestas en formato JSON estructurado. Esta API fue conectada con éxito al frontend desarrollado en Ionic con React.

* **Base de Datos (EP 2.2):** Se creó una base de datos relacional en **MySQL**. A continuación, se presenta el Modelo Relacional diseñado para la persistencia de datos del sistema municipal:

<div align="center">
  <img src="Otros/diagrama-mr.png" alt="Modelo Relacional Base de Datos" width="800px">
</div>

* **Seguridad y Autenticación (EP 2.5 y 2.6):** Se implementó un sistema de seguridad. El registro y login generan y validan **JWT (JSON Web Tokens)** para proteger las rutas privadas y diferenciar roles (Ciudadano vs Funcionario). Además, las contraseñas de los usuarios son encriptadas utilizando **bcrypt** antes de almacenarse en la base de datos para prevenir vulnerabilidades.

* **Documentación de la API (Punto 2.7)**
A continuación se detallan los principales endpoints de la API RESTful implementada, probados mediante Postman/Insomnia.

| Método | Endpoint | Descripción | Request (Body / Headers) | Respuestas HTTP |
|---|---|---|---|---|
| `GET` | `/api` | Verifica el estado del servidor. | *Ninguno* | `200 OK` |
| `POST` | `/api/auth/register` | Crea un nuevo usuario y encripta su contraseña con bcrypt. | **Body:** `{ "rut": "...", "nombres": "...", "apellidoP": "...", "apellidoM": "...", "correo": "...", "password": "...", "region": "...", "comuna": "..." }` | `201 Created`, `400 Bad Request`, `500 Internal Server Error` |
| `POST` | `/api/auth/login` | Valida credenciales (RUT o correo) y genera el token JWT. | **Body:** `{ "credential": "...", "password": "..." }` | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error` |
| `GET` | `/api/dashboard/datos` | Ruta protegida de prueba para acceder a datos municipales. | **Headers:** `Authorization: Bearer <tu_token_jwt>` | `200 OK`, `401 Unauthorized`, `403 Forbidden` |

### Evidencia de Pruebas Funcionales (Postman)

**Registro de Usuario (POST):** Se envía una petición al endpoint `/api/auth/register` adjuntando los datos del ciudadano en el cuerpo (JSON). El servidor responde con un código `201 Created`, confirmando la creación exitosa del registro en la base de datos con su contraseña encriptada.
<div align="center">
  <img src="Otros/evidencia-registro.jpg" alt="Evidencia Registro" width="800px">
</div>
<br>

**Autenticación y Generación de JWT (POST):** Se realiza una petición al endpoint `/api/auth/login` con las credenciales del usuario recién creado. El sistema valida la información y devuelve un código `200 OK` junto con el Token JWT asignado para mantener la sesión segura.
<div align="center">
  <img src="Otros/evidencia-login.jpg" alt="Evidencia Login JWT" width="800px">
</div>
<br>

**Acceso a Ruta Privada (GET):** Se ejecuta una consulta al endpoint protegido `/api/dashboard/datos`, enviando el Token JWT en la cabecera de autorización (Bearer Token). El servidor devuelve un `200 OK` y el mensaje de acceso autorizado, demostrando la validación correcta del middleware de seguridad.
<div align="center">
  <img src="Otros/evidencia-dashboard.jpg" alt="Evidencia Ruta Privada" width="800px">
</div>

---

## 8. Instrucciones de Ejecución
Para visualizar y probar el proyecto correctamente en su entorno local, siga estos pasos:

### 1. Requisitos Previos
* **Node.js**: Asegúrese de tener instalado.
* **Ionic CLI**: Recomendado para una mejor gestión del servidor.

### 2. Inicie el backend via terminal
```bash
Ejecute el comando
"cd backend"
en la terminal para que esta se diriga al backend

Una vez alli ingrese el comando
"npm install & npm run dev"
Tras esto se instalaran las depencias y se ejecutara el backend

```

### 3. Inicie el servidor de desarrollo local con el siguiente comando:
```bash
Abra una nueva terminal para salir de la seccion de backend

En la nueva terminal ejecute el comando
"npm install & npm run dev"
Tras esto la pagina deberia comenzar a ejecutarse
```
### 4. Credenciales
En este punto ya deberia encontrarse en la pantalla principal de tramites, como podra darse cuenta en la esquina superior derecha
podra realizar los respectivos inicios de sesion, para ello podra usar las siguientes credenciales o bien registrarse si asi
lo desea.

Inicio de sesion (Normal)
Recomendamos Crear una nueva cuenta usando la funcion de registro

Inicio de sesion Funcionario
Email: admin@municipalidad.cl
Contraseña: admin123

Además, si se desea revisar la base de datos directamente, puede conectarse usando TablePlus o DBeaver con las siguientes credenciales:

Host:     zephyr.proxy.rlwy.net

Port:     49825

User:     root

Password: yzbXDSfWnEhClCrhJSSTLBlecYxwMqeA

Database: railway

### 5. Importante
Cabe destacar que multiples de las funciones pensadas para la pagina aun no han sido implementadas, por ello a aquellas paginas que
no estan listas se les ha incorporado un mensaje de error.
