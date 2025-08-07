---
title: "Gestión de claves de acceso de RustFS"
description: "Creación, uso y eliminación de las claves de acceso de RustFS."
---

# Claves de acceso

Las claves de acceso de RustFS son las credenciales básicas del sistema, utilizadas para la autenticación y la autorización. Son esenciales en escenarios de API y SDK. Esta sección explica cómo crear y eliminar claves de acceso en RustFS.

Requisitos previos:

- Una instancia disponible de RustFS. Consulta la [Guía de instalación](/es/installation/index) para desplegarla.

## Crear una clave de acceso

1. Inicia sesión en la consola UI de RustFS.
2. En la navegación izquierda, selecciona **Claves de acceso**.
3. En la página de Claves de acceso, haz clic en **Agregar clave de acceso** en la esquina superior derecha.
4. Introduce **fecha de expiración, nombre y descripción** de la clave y haz clic en **Enviar**.
5. (Opcional pero recomendado) En la página de detalle de la clave, elige **Copiar** o **Exportar** para guardar de forma segura las credenciales para su uso posterior.

![access key list page](images/access_token_creation.png)

## Eliminar una clave de acceso

1. Inicia sesión en la consola UI de RustFS.
2. En la navegación izquierda, selecciona **Claves de acceso**.
3. En la página de Claves de acceso, selecciona la clave a eliminar.
4. Haz clic en **Eliminar** a la derecha de la clave, o en **Eliminar seleccionados** en la parte superior derecha.

![access key deletion](images/access_token_deletion.png)