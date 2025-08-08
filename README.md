# 🛡️ Microservicio de Autenticación (AUTH) — New Stetic S.A.

Este microservicio es el núcleo del sistema de autenticación centralizado de **New Stetic S.A.**, diseñado para validar usuarios mediante **Active Directory (AD)** a través del protocolo **LDAP**. Proporciona un inicio de sesión seguro, sin almacenamiento local de credenciales, y con una arquitectura extensible para soportar futuros métodos de autenticación (como OAuth, correo electrónico, etc.).

---

## ✨ Características Principales

* ✅ Autenticación segura contra **LDAP / Active Directory**.
* 🔒 Emisión de **JSON Web Tokens (JWT)** para el manejo de sesiones.
* 🧩 Integración fluida con otros microservicios mediante cabeceras autenticadas.
* 🏗️ Arquitectura modular y extensible.
* ⚙️ Configuración 100% basada en variables de entorno.
* 🚫 No se almacenan contraseñas ni información sensible de los usuarios.

---

## 🚀 Endpoint Principal

El servicio expone un único endpoint para autenticación, el cual se conecta directamente con el **Directorio Activo (AD)**. Gracias a su arquitectura modular, puede adaptarse fácilmente para incorporar otros métodos de autenticación en el futuro (como autenticación vía correo electrónico, redes sociales, etc.).

---

## 🔐 Seguridad

Este servicio implementa buenas prácticas de seguridad para proteger las credenciales y los tokens de sesión:

* Las credenciales del usuario se validan **directamente contra el AD** y **nunca se almacenan**.
* Los tokens JWT son **firmados con clave privada** y cuentan con una expiración configurable.
* Se implementan mecanismos de protección adicionales:

  * Validación de dominios autorizados.
  * Uso de **LDAPS** para cifrado del canal de autenticación.
  * Expiración y firma segura de los tokens.

---

## ⚙️ Configuración por Variables de Entorno

Toda la configuración del servicio se gestiona mediante variables de entorno. Se recomienda crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

---

## 🧑‍💻 Mantenimiento

Desarrollado por el equipo TIC con **Andrés Cardona**

---