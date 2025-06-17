# 🛡️ Microservicio de Autenticación (AUTH)

Este microservicio permite autenticar usuarios contra el **Directorio Activo (AD)** corporativo, proporcionando un mecanismo de inicio de sesión seguro y centralizado para las aplicaciones internas de la empresa.

## ✨ Características principales

* ✅ Autenticación de usuarios vía **LDAP/Active Directory**.
* 🔒 Emisión de **JSON Web Tokens (JWT)** para manejo de sesiones.
* 🔧 Configuración flexible a través de **variables de entorno**.
* 🧩 Fácil integración con otros servicios internos.
* 🚫 No almacena credenciales ni información sensible de los usuarios.

## 🔐 Seguridad

* ✨ Las credenciales del usuario **no se almacenan** en ningún momento.
* 🔐 Los tokens de acceso son firmados con **JWT**, lo que permite validación sin estado.
* 🛡️ Se siguen **buenas prácticas** de seguridad en autenticación y gestión de sesiones.

> **Importante:** Asegúrate de usar una conexión segura (LDAPS) si el entorno lo permite, para proteger la confidencialidad de las credenciales durante la autenticación.

## 🧑‍💻 Mantenimiento

Este servicio fue desarrollado por: **Andrés Cardona**


