---
title: "Instalación de RustFS en macOS"
description: "Este artículo explica principalmente el método de inicio rápido de RustFS en macOS"
---

# Instalación de RustFS en macOS


En macOS se pueden usar tres métodos:
1. Docker
2. Paquete de inicio gráfico con un clic
3. Paquete binario

> Este artículo explica principalmente el uso del **paquete de inicio gráfico con un clic** de RustFS para un inicio rápido de RustFS.



## I. Preparativos

Por favor, entienda:

> El **modo de inicio gráfico** solo soporta el modo de una sola máquina y un solo disco, más adecuado para entornos de desarrollo, depuración y prueba.


1. Para una introducción detallada de los modos de inicio, consulte los [Modos de Inicio](../linux/index.md#mode);

2. Descargue el paquete de instalación, modifique los permisos y proceda con el inicio.


## II. Descarga

Visite la página de descarga oficial para descargar la última versión del paquete de instalación de RustFS.


## III. Modificar Permisos

Por favor, confirme que este programa tiene los permisos de ejecución relevantes en el sistema operativo macOS.


## Hacer Doble Clic en el Icono de Inicio

1. Haga doble clic en el icono de inicio;

2. Haga clic en configurar disco;

3. Haga clic en "Start Service", el servicio RustFS se inicia con éxito.


<img src="./images/macos-setup.jpg" alt="inicio de macOS" />



## IV. Modificar Configuración

Haga clic en el botón de modificación en la esquina superior derecha (botón con forma de engranaje), puede modificar:

1. Puerto predeterminado del servidor;

2. Nombre de usuario y contraseña del administrador predeterminado;

3. Directorio de disco especificado;

<img src="./images/setting.jpg" alt="configuración de RustFS Windows" />



## V. Acceder a la Consola


Después de un inicio exitoso, visite `http://127.0.0.1:7001` para acceder a la consola.

