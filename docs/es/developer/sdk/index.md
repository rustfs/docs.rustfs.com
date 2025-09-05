---
title: "Descripción General del SDK de RustFS"
description: "¿Qué SDK de S3 se pueden usar con RustFS? Este artículo proporciona una explicación detallada."
---

# Descripción General del SDK

RustFS es un software de almacenamiento de objetos distribuido que es 100% compatible con el protocolo S3. Los usuarios pueden:

1. Administrar RustFS a través de la interfaz de administración de la Consola;
2. Administrar RustFS a través de clientes S3;
3. Implementar operaciones y administración de almacenamiento de objetos en el lado comercial a través de SDK.

Actualmente, los SDK proporcionados por RustFS incluyen:

- [SDK de Java](./java.md)
- [SDK de JavaScript](./javascript.md)
- [SDK de Python](./python.md)
- [SDK de Rust](./rust.md)
- [SDK de TypeScript](./typescript.md)
- [SDK de Golang](./go.md)

## Explicación de Terminología Antes de la Lectura

S3 es el nombre del primer producto de almacenamiento de objetos abierto y lanzado por Amazon. Abrió todos sus protocolos y especificaciones. Posteriormente, casi todos los sistemas de almacenamiento de objetos siguieron los protocolos y especificaciones de S3. A veces la gente llama a S3 almacenamiento de objetos, ya veces simplemente llaman a S3 el protocolo de almacenamiento de objetos.

## 1. Recomendaciones de SDK

Como ya existen demasiados SDK en el mercado que han sido mantenidos durante muchos años, como el SDK de AWS S3 que ha sido depurado y optimizado durante muchos años. Su rendimiento y errores son casi cero. Por lo tanto, recomendamos que uses directamente el SDK de S3 estándar de AWS para controlar directamente y comunicarte con RustFS.

Si tienes un SDK familiar y de confianza de un proveedor, puedes usarlo.

Como muchos proveedores de nube chinos han realizado "modificaciones" en muchos lugares y no admiten muchas de las tecnologías S3 más recientes, muchos productos de almacenamiento de objetos en todo el mundo no recomiendan los SDK de muchos proveedores de nube chinos.

## 2. ¿Pueden los SDK de MinIO comunicarse directamente con RustFS?

Sí.

Hemos realizado adaptación y compatibilidad integral para los SDK de MinIO.

Si estás usando los SDK de MinIO, puedes modificar el Endpoint, AK y SK para ser directamente compatible con RustFS.

## 3. ¿Qué hacer si hay otros SDK incompatibles?

Si usamos un SDK de un proveedor de nube que no admite los últimos S3, MinIO o RustFS, ¿cómo debemos manejarlo?
Por favor, reemplaza el SDK lo antes posible y realiza un re-emparejamiento y actualización en el lado comercial.
