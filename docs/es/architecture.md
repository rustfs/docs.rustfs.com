---
title: "Arquitectura RustFS"
description: "Introducción a la arquitectura RustFS"
---

# Arquitectura RustFS

RustFS es un sistema de almacenamiento de objetos similar al conocido AWS S3. Como producto de reemplazo de MinIO, RustFS hace referencia a la arquitectura simple, ligera, escalable y elegante de MinIO.

Los objetos pueden ser documentos, videos, archivos PDF, etc. Para almacenar objetos, MinIO proporciona una solución escalable, flexible y eficiente para almacenar, acceder y gestionar datos. Su compatibilidad con la API de AWS S3 permite una integración perfecta con aplicaciones basadas en AWS S3.

El diagrama de arquitectura es el siguiente:

![Diagrama de arquitectura RustFS](./images/s2-1.png)

Esta es la arquitectura básica de RustFS. La red distribuida es una arquitectura informática que utiliza múltiples nodos para ejecutar una sola tarea. Los nodos están conectados entre sí a través de la red, lo que les permite comunicarse entre sí.

## Diseño de consistencia

En modo distribuido y de máquina única, todas las operaciones de lectura y escritura siguen estrictamente el modelo de consistencia read-after-write.

## Conceptos importantes en RustFS

**Object (Objeto)**: El objeto básico almacenado en Minio, como archivos, flujos de bytes, cualquier cosa...

**Bucket (Cubo)**: El espacio lógico utilizado para almacenar objetos. Los datos entre cada bucket están mutuamente aislados. Para el cliente, equivale a una carpeta de nivel superior para colocar archivos.

**Drive (Unidad)**: El disco que almacena datos, pasado como parámetro al iniciar MinIO. Todos los datos de objetos en Minio se almacenarán en las unidades.

**Set (Conjunto)**: Un grupo de unidades. El despliegue distribuido se divide automáticamente en uno o más conjuntos según la escala del cluster, y las unidades en cada conjunto se distribuyen en diferentes ubicaciones. Un objeto se almacena en un conjunto.

Por lo tanto, al diseñar la arquitectura y desplegar equipos, se debe tener en cuenta que:

1. Un objeto se almacena en un conjunto;
2. Un cluster se divide en múltiples conjuntos;
3. El número de unidades contenidas en un conjunto es fijo, calculado automáticamente por el sistema basado en la escala del cluster por defecto;
4. Las unidades en un conjunto se distribuyen tanto como sea posible en diferentes nodos;

## Agradecimientos especiales

Todos los nodos están en una relación de nivel igual, simplificando enormemente el diseño de la arquitectura y eliminando las preocupaciones sobre la pérdida de metadatos, pudiendo iniciarse con un solo comando.

Sin perder elegancia, simplicidad y confiabilidad, RustFS adopta el mismo diseño de arquitectura que MinIO.

Gracias a MinIO por el concepto de arquitectura propuesto, que ha facilitado enormemente a los usuarios de todo el mundo y promovido el protocolo S3.