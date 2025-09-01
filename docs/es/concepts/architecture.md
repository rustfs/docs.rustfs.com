---
title: "Arquitectura de RustFS"
description: "Introducción a la arquitectura de RustFS"
---

# Arquitectura de RustFS

RustFS es un sistema de almacenamiento de objetos similar al conocido AWS S3. Como alternativa a MinIO, RustFS hace referencia a la arquitectura limpia, ligera, escalable y elegante de MinIO.

Los objetos pueden ser documentos, videos, archivos PDF y más. Para el almacenamiento de objetos, MinIO proporciona una solución escalable, flexible y eficiente para almacenar, acceder y gestionar datos. Su compatibilidad con la API de AWS S3 permite una integración perfecta con aplicaciones basadas en AWS S3.

El diagrama de arquitectura es el siguiente:

![Diagrama de Arquitectura de RustFS](./images/s2-1.png)

Esta es la arquitectura básica de RustFS. Una malla distribuida es una arquitectura de computadora que utiliza múltiples nodos para realizar una sola tarea. Los nodos están conectados entre sí a través de una red, permitiéndoles comunicarse entre ellos.

## Diseño de consistencia

En los modos distribuido y de máquina única, todas las operaciones de lectura y escritura siguen estrictamente el modelo de consistencia lectura-después-escritura.

## Conceptos importantes en RustFS

**Objeto**: El objeto básico almacenado en RustFS, como archivos, flujos de bytes, cualquier cosa...

**Bucket**: El espacio lógico utilizado para almacenar objetos. Los datos entre cada bucket están mutuamente aislados. Para los clientes, es equivalente a una carpeta de nivel superior para almacenar archivos.

**Drive**: El disco que almacena datos, pasado como parámetro cuando se inicia RustFS. Todos los datos de objetos en RustFS se almacenarán en drives.

**Set**: Una colección de drives. El despliegue distribuido se divide automáticamente en uno o más sets basados en la escala del clúster, y los drives en cada set se distribuyen en diferentes ubicaciones. Un objeto se almacena en un set.

Por lo tanto, al diseñar la arquitectura e implementar equipos, necesitas considerar:

1. Un objeto se almacena en un set;
2. Un clúster se divide en múltiples sets;
3. El número de drives en un set es fijo, calculado automáticamente por el sistema basado en la escala del clúster por defecto;
4. Los drives en un set se distribuyen en diferentes nodos tanto como sea posible;

## Agradecimientos especiales

Todos los nodos están en relaciones de igual a igual, simplificando enormemente el diseño arquitectural y eliminando preocupaciones sobre la pérdida de metadatos. Puede iniciarse con un solo comando.

Sin perder elegancia, simplicidad y confiabilidad, RustFS adopta el mismo diseño arquitectural que MinIO.

Gracias a MinIO por el concepto arquitectural propuesto, que ha facilitado enormemente a los usuarios de todo el mundo y promovido el protocolo S3.

