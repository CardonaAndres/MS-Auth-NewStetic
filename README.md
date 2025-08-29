# 🛡️ Microservicio de Autenticación (AUTH) — New Stetic S.A.

Este microservicio es el núcleo del sistema de autenticación centralizado de **New Stetic S.A.**, diseñado para validar usuarios mediante **Active Directory (AD)** a través del protocolo **LDAP**, y ahora también mediante **BUK**.
Proporciona un inicio de sesión seguro, sin almacenamiento local de credenciales, y con una arquitectura extensible para soportar múltiples métodos de autenticación (como OAuth, correo electrónico, etc.).

---

## ✨ Características Principales

* ✅ Autenticación segura contra **LDAP / Active Directory**.
* ✅ **Autenticación mediante BUK**.
* 🔒 Emisión de **JSON Web Tokens (JWT)** para el manejo de sesiones.
* 🧩 Integración fluida con otros microservicios mediante cabeceras autenticadas.
* 🏗️ Arquitectura modular y extensible.
* 🚫 No se almacenan contraseñas ni información sensible de los usuarios.

---

## 🚀 Endpoints

El servicio ofrece actualmente **dos formas principales de autenticación**:

* **Directorio Activo (AD)** → Permite validar usuarios internos de la organización con sus credenciales corporativas.
* **BUK** → Permite autenticar usuarios y, además, realizar validaciones adicionales como persona, cargo o estado, según lo que se necesite verificar.

👉 Gracias a su diseño flexible, en el futuro se podrán integrar fácilmente **nuevos métodos de autenticación**, como inicio de sesión con correo electrónico, redes sociales u otros proveedores externos.

---

## 🔐 Seguridad

Este servicio implementa buenas prácticas de seguridad para proteger las credenciales y los tokens de sesión:

* Las credenciales del usuario se validan **directamente contra el AD** o **mediante la API segura de BUK**, y **nunca se almacenan**.
* Los tokens JWT son **firmados con clave privada** y cuentan con una expiración configurable.
* Se implementan mecanismos de protección adicionales:

  * Validación de dominios autorizados.
  * Uso de **LDAPS** para cifrado del canal de autenticación con AD.
  * Uso de **HTTPS / API Key** para la comunicación con BUK.
  * Expiración y firma segura de los tokens.

---

## 🧑‍💻 Mantenimiento

Desarrollado por el equipo TIC de **New Stetic S.A** con **Andrés Cardona**
