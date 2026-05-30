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

## 7. Instrucciones de Ejecución
Para visualizar y probar el proyecto correctamente en su entorno local, siga estos pasos:

### 1. Requisitos Previos
* **Node.js**: Asegúrese de tener instalado.
* **Ionic CLI**: Recomendado para una mejor gestión del servidor.

### 2. Instalación de Dependencias
Ejecute el siguiente comando en la terminal del proyecto para instalar los módulos necesarios:
```bash
npm install
```
### 3. Inicie el servidor de desarrollo local con el siguiente comando:
```bash
ionic serve

o alternativamente

npm run dev
```
### 4. Credenciales
En este punto ya deberia encontrarse en la pantalla principal de tramites, como podra darse cuenta en la esquina superior derecha
podra realizar los respectivos inicios de sesion, para ello podra usar las siguientes credenciales o bien registrarse si asi
lo desea.

Inicio de sesion (Normal)
RUT: 22.222.222-2
Contraseña: 222

Inicio de sesion Funcionario
Email: admin@municipalidad.cl
Contraseña: admin123

### 5. Importante
Cabe destacar que multiples de las funciones pensadas para la pagina aun no han sido implementadas, por ello a aquellas paginas que
no estan listas se les ha incorporado un mensaje de error.
