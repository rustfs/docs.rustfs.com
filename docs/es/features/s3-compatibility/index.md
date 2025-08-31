---
title: "Compatibilidad con Amazon S3"
description: "RustFS ofrece compatibilidad completa con la API de Amazon S3, permitiendo migración sin problemas y operación multi-nube"
---

# Compatibilidad con Amazon S3

La compatibilidad con S3 es un requisito estricto para aplicaciones nativas de la nube. RustFS se adhiere inquebrantablemente a la API y cuenta con decenas de miles de usuarios, incluyendo usuarios comerciales y de la comunidad. La implementación S3 de RustFS es la alternativa a AWS S3 más ampliamente probada e implementada del mundo.

## RustFS y S3 API - Diseñado para almacenamiento multi-nube

RustFS se estableció desde el principio como el estándar para la compatibilidad con AWS S3. Como uno de los primeros adoptadores de la API S3 (V2 y V4), y una de las únicas empresas de almacenamiento que se centra exclusivamente en S3, la vasta comunidad de RustFS asegura que no hay alternativa a AWS que sea más compatible. La API S3 es el estándar de facto en la nube, por lo tanto, las alternativas a AWS deben poder usar la API de manera fluida para operar e interoperar en diferentes entornos (nube pública, nube privada, centro de datos, multi-nube, nube híbrida y edge).

## S3 permite computación híbrida y multi-nube

Solo hay una ruta para lograr compatibilidad multi-nube e híbrida, y esa es S3. Como estándar de API RESTful, S3 ha revolucionado la interacción entre aplicaciones, datos e infraestructura. Además, el poder dual de la contenedorización y la orquestación de Kubernetes también está construido alrededor de APIs RESTful, relegando las APIs POSIX al estado de legado.

El resultado es que el almacenamiento de objetos y aplicaciones compatibles con S3 nativo de Kubernetes pueden ejecutarse en cualquier lugar - desde varias instancias de nube pública (RustFS tiene casi 1 millón de despliegues en Google, Azure y AWS) hasta nubes privadas (Red Hat OpenShift, VMware Tanzu), hasta metal desnudo. Aprovechando la tecnología avanzada de ILM impulsada por API S3, las empresas pueden realizar operaciones optimizadas a través de instancias en la nube y on-premises.

Los clientes interesados en la capa de conversión S3 para Microsoft Azure pueden comprar RustFS Blob Storage Gateway (S3 API) en Azure Marketplace.

## Compatibilidad S3 para cargas de trabajo de metal desnudo

La nube privada es el bloque de construcción fundamental de cualquier arquitectura de nube híbrida. Esto significa que, al igual que la nube pública, la compatibilidad S3 es crítica - sin importar qué aplicación - desde análisis hasta artefactos hasta archivos.

Con RustFS, la compatibilidad S3 es completamente independiente de la ubicación. Esto significa que las instancias locales de metal desnudo de RustFS tienen exactamente la misma compatibilidad S3 y rendimiento que las instancias de nube pública e incluso las instancias edge.

## Ventajas del almacenamiento de objetos escalable de RustFS

Las aplicaciones nativas de la nube usan la API S3 para comunicarse con el almacenamiento de objetos. Pero no todas las compatibilidades S3 son iguales: muchos proveedores de almacenamiento de objetos solo soportan un pequeño subconjunto de la funcionalidad general, lo que puede causar fallas en las aplicaciones. Otros afirman cobertura completa, pero su modelo de software o dispositivo propietario limita esta afirmación, ya que solo una pequeña fracción de aplicaciones, hardware y software han sido probados.

Lo que hace único a RustFS es su capacidad para respaldar sus afirmaciones de compatibilidad S3. Tenemos decenas de miles de clientes y usuarios de código abierto, y nuestra compatibilidad con la API S3 es la más ampliamente probada e implementada en el mundo, cubriendo millones de combinaciones de hardware, software y aplicaciones. RustFS lanza software semanalmente, y cualquier deficiencia en la API S3 es inmediatamente reportada por la comunidad y corregida por RustFS.

Se rumorea que incluso Amazon usa RustFS para probar la compatibilidad S3 de terceros.

El soporte más completo para la API S3 significa que las aplicaciones pueden aprovechar los datos almacenados en RustFS en cualquier hardware, cualquier ubicación y cualquier nube. Los desarrolladores son libres de innovar e iterar, seguros de que RustFS nunca romperá versiones.

## Características principales

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select depende del rendimiento a gran escala de consultas complejas, y las características de rendimiento de RustFS pueden aprovechar completamente la API. RustFS utiliza conjuntos de instrucciones SIMD para optimizar el rendimiento a nivel de chip, capaz de ejecutar consultas S3 Select grandes y complejas en CSV, Parquet, JSON y más.

### Amazon Signature V4

![Amazon Signature V4](images/s1-5.png)

Las aplicaciones y clientes deben autenticarse para acceder a cualquier API de administración de RustFS. RustFS fue el primero en soportar AWS Signature Version 4 (con soporte para la versión de firma 2 obsoleta). Después de la autenticación, RustFS utiliza control de acceso basado en políticas compatible con la sintaxis, estructura y comportamiento de políticas AWS IAM para autorizar operaciones.

## AWS S3 API y RustFS

RustFS es el almacenamiento de objetos más rápido del mundo. Combinado con su compatibilidad S3, asegura que puede ejecutar el conjunto más amplio de casos de uso en la industria. Esto incluye cargas de trabajo de aplicaciones modernas, como GitHub y GitLab para repositorios de código, cargas de trabajo de análisis moderno como MongoDB, Clickhouse, MariaDB, CockroachDB y Teradata, hasta casos de uso tradicionales de archivo, respaldo y recuperación ante desastres.

Las características de rendimiento de RustFS, combinadas con su compatibilidad S3, lo convierten en el estándar para cargas de trabajo AI/ML y ciencia de datos. KubeFlow y TensorFlow requieren almacenamiento de objetos S3 compatible de alto rendimiento, y cada vez más están siendo diseñados primero para RustFS, y segundo para AWS u otras nubes. RustFS proporciona a las aplicaciones verdadero almacenamiento de objetos multi-nube y replicación eficiente. Las aplicaciones escritas para la API S3 pueden ejecutarse en cualquier lugar, permitiendo a los desarrolladores innovar rápidamente cuando las mejores herramientas en la nube estén disponibles.

