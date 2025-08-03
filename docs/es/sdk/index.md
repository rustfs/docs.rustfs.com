---
title: "Resumen de SDK"
description: "¿Qué SDKs de S3 se pueden usar con RustFS? Este artículo proporciona una explicación detallada."
---

# Resumen de SDK

RustFS es un software de almacenamiento de objetos distribuido 100% compatible con el protocolo S3. Los usuarios pueden:

1. Gestionar RustFS a través de la consola Console
2. Gestionar RustFS a través de clientes S3
3. Usar SDKs en el lado del negocio para implementar operaciones y gestión de almacenamiento de objetos

## Explicación de términos antes de leer

S3 es el nombre del primer producto de almacenamiento de objetos abierto y lanzado por Amazon. Abrió todos sus protocolos y especificaciones. Posteriormente, casi todos los almacenamientos de objetos siguieron los protocolos y especificaciones de S3.
A veces la gente llama a S3 almacenamiento de objetos, y a veces abrevian S3 como protocolo de almacenamiento de objetos.

## 1. Recomendaciones de SDK

Ya existen muchos SDKs en el mercado que han sido mantenidos durante años. Como el SDK de AWS S3, después de años de depuración y optimización, su rendimiento y errores son casi cero. Por lo tanto, recomendamos usar directamente el SDK S3 estándar de AWS para controlar y comunicarse con RustFS.

Si tiene SDKs familiares y productos de proveedores de SDK confiables, puede usarlos.

Dado que los proveedores de nube chinos han realizado "modificaciones mágicas" en muchos lugares, muchas tecnologías S3 recientes no son compatibles. Por lo tanto, muchos productos de almacenamiento de objetos en el mundo no recomiendan los SDKs de muchos proveedores de nube chinos.

## 2. ¿Pueden los SDKs de MinIO comunicarse directamente con RustFS?

Sí.

Hemos realizado adaptación y compatibilidad completas para los SDKs de MinIO.

Si está usando SDKs de MinIO, puede ser directamente compatible con RustFS modificando el Endpoint y AK, SK.

## 3. ¿Qué hacer si hay otros SDKs incompatibles?

Si usamos el SDK de un proveedor de nube que no admite los últimos S3, MinIO y RustFS, ¿cómo debemos manejarlo?
Por favor cambie el SDK lo antes posible y realice re-emparejamiento y actualización en el lado del negocio.
