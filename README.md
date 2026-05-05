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

| **RF-03** |Seguridad: Acceso restringido mediante rutas protegidas y validación JWT.

## 4. Arquitectura de Navegación y UX (EP 1.4)

### Mapa de Rutas
* **Públicas:** `/login`, `/registro`, `/home`[cite: 5].
* **Protegidas (Ciudadano):** `/perfil`, `/mis-tramites`, `/agendamiento`, `/dideco`[cite: 5].
* **Protegidas (Funcionario):** `/admin/panel`, `/admin/revision`, `/admin/reportes`[cite: 5].
