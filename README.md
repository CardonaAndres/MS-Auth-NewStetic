# 🛡️ Microservicio de Autenticación (AUTH)

Este microservicio permite autenticar usuarios contra el **Active Directory (AD)** corporativo utilizando el protocolo **LDAP**, ofreciendo un inicio de sesión seguro, centralizado y sin almacenamiento de credenciales. Está pensado para integrarse con otros servicios internos mediante tokens JWT firmados.

---

## ✨ Características Principales

* ✅ Autenticación de usuarios mediante **LDAP/Active Directory**.
* 🔒 Emisión de **JSON Web Tokens (JWT)** para la gestión de sesiones.
* 🧩 Integración sencilla con microservicios internos vía cabeceras autenticadas.
* 🔧 Configuración por medio de variables de entorno.
* 🚫 No se almacenan contraseñas ni información sensible de los usuarios.

---

## 🔐 Seguridad

* 🔐 Las credenciales se validan directamente contra el **AD** y **no se almacenan** en ningún punto.
* 📜 Los tokens son firmados con clave privada y pueden incluir expiración configurable.
* 🛡️ Se implementan buenas prácticas de seguridad:

  * Validación por dominio autorizado.
  * Tokens con expiración y firma segura.
  * Uso de **LDAPS** para cifrar el canal de autenticación.

---

## ⚙️ Variables de Entorno

Este servicio utiliza variables de entorno para su configuración. Se recomienda crear un archivo `.env` en la raíz del proyecto.

### 📄 Ejemplo de `.env`:

```env
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

PORT=
LDAP_PORT=
LDAP_SERVER=
LDAP_DOMAIN=
LDAP_BASE_DN=DC=dominio,DC=local

JWT_SECRET=
```

---

## 🧑‍💻 Mantenimiento

Desarrollado por el equipo TIC con **Andrés Cardona**



