# Proyecto: Sistema de Gestión de Trámites Municipales - Santo Domingo

## 1. Información del Grupo
* **Integrantes:** Fernanda Cádiz, Luciano Fredes, Héctor Fuentes, Diego Escobar
* **Asignatura:** Ingeniería Web y Móvil (ICI 4247-2)
* **Fecha:** Mayo 2026
* **Tecnologías:** Ionic Framework, React, TypeScript

---

## 2. Definición del Problema y Usuario Objetivo (EP 1.2)

### Justificación
Actualmente, la Municipalidad de Santo Domingo presenta una oferta digital incompleta. El sistema actual redirige a sitios externos y carece de una gestión de usuarios personalizada. En un contexto donde solo el 19% de las comunas en Chile permite agendar licencias de conducir en línea, este proyecto busca unificar la experiencia del usuario y automatizar la validación de residencia conforme a la Ley 21.180 de Transformación Digital.

### Perfiles de Usuario
* **Ciudadano (Invitado/Residente):** Usuarios mayores de 18 años que buscan realizar trámites y beneficios sociales (DIDECO) desde dispositivos móviles o web.
* **Funcionario Municipal (Administrador):** Encargado de validar documentos de residencia y gestionar los estados de los trámites.

---

## 3. Requerimientos del Proyecto (EP 1.1)

### Requerimientos Funcionales (RF)
| **RF-01** |	Validación de Residencia: Carga de comprobante para pasar de estado 'invitado' a 'residente'.  

| **RF-02** |	Gestión de Estados: Cambio de estado de trámites (Enviado, En revisión, Aprobado/Rechazado).  

| **RF-05** |	Corrección de Errores: Capacidad de editar datos de un trámite en estado 'Por modificar'.  

| **RF-06** |	Agendamiento de Hora: Solicitud de horas presenciales para exámenes de conducir.

### Requerimientos No Funcionales (RNF)
| **RNF-01** | Responsividad: Interfaz adaptada a móvil y web mediante componentes de Ionic.

| **RNF-02** | Rendimiento: Tiempos de respuesta aceptables bajo alta demanda.

| **RNF-03** |Seguridad: Acceso restringido mediante rutas protegidas y validación JWT.

## 4. Diseño UI/UX (EP 1.3)
Se han diseñado 7 mockups diferenciados para versiones móvil y web, considerando una jerarquía visual clara y navegación adaptativa[cite: 3, 6].

* **Prototipo Navegable en Figma:** [Acceder al Prototipo](https://www.figma.com/design/2x3lhSDr8Qh3J415n52FCj/Sin-t%C3%ADtulo?node-id=0-1&t=lk1vlgy2RKpvECyH-1)

## 5. Arquitectura de Navegación y UX (EP 1.4)

### Mapa de Rutas
* **Públicas:** `/login`, `/registro`, `/home`.
* **Protegidas (Ciudadano):** `/perfil`, `/mis-tramites`, `/agendamiento`, `/dideco`.
* **Protegidas (Funcionario):** `/admin/panel`, `/admin/revision`, `/admin/reportes`.

### Estrategia de Experiencia de Usuario (UX)
Siguiendo los principios de usabilidad de la cátedra, el diseño contempla:
* **Claridad y Control:** Acciones principales visibles y manejo de estados vacíos útiles.
* **Carga Cognitiva Mínima:** Tareas divididas por pantallas y copy conciso.
* **Apoyo:** Micro-feedback inmediato ante errores o éxito en la carga de archivos.

### Flujos de Tarea (Task Flows)
1. **Inscripción a Taller:** Login -> Trámites -> DIDECO -> Detalle Taller -> Formulario -> Confirmación.
2. **Agendar Licencia:** Login -> Trámites Presenciales -> Ver disponibilidad -> Seleccionar hora -> Confirmar.
3. **Validación Residencia:** Perfil -> Subir documento -> Revisión Admin -> Aprobación -> Cambio a Rol Residente.

---

## 6. Gestión del Proyecto
El desarrollo se gestiona íntegramente mediante herramientas de GitHub:
* **GitHub Projects:** Tablero Kanban para el seguimiento de tareas en tiempo real.
* **GitHub Issues:** Registro detallado de cada requerimiento funcional con sus criterios de aceptación.

---

## 7. Instrucciones de Ejecución
```bash
# Instalar dependencias
npm install

# Ejecutar en el navegador
ionic serve
