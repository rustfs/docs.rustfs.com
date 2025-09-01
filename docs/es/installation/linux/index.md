---
title: "Qué es RustFS y guía de instalación"
description: "RustFS es una solución de almacenamiento de objetos, software de código abierto distribuido bajo licencia Apache2."
---

# I. ¿Qué es RustFS?

RustFS es un almacenamiento de objetos simple, eficiente y distribuido, adecuado para el reemplazo rápido de MinIO y para el uso de escenarios de almacenamiento de objetos de entrenamiento e inferencia de IA.
Al mismo tiempo, RustFS es una solución de almacenamiento de objetos eficiente, de código abierto y libre. Es 100% compatible con el protocolo S3, utiliza una licencia Apache2 y se distribuye como software de código abierto. RustFS está escrito en el lenguaje Rust, actualmente el lenguaje más popular y seguro en memoria del mundo, particularmente adecuado para escenarios de alto rendimiento. RustFS es un producto de almacenamiento de objetos distribuido comercialmente amigable en el que participan y contribuyen excelentes ingenieros de todo el mundo. RustFS puede reemplazar muchos productos de almacenamiento de objetos con licencias de código abierto no amigables.

RustFS pronto pasará oficialmente de aplicaciones comerciales a código abierto, con lanzamiento global, ayudando al mundo a reducir costos de almacenamiento y mejorar la seguridad de datos.



## II. Lectura obligatoria antes de la instalación

 RustFS se divide en tres modos de instalación: mono-máquina mono-disco, mono-máquina multi-discos y multi-máquinas multi-discos. El modo multi-máquinas multi-discos incluye rendimiento, seguridad y escalabilidad de nivel empresarial. Además, proporciona diagramas de arquitectura necesarios para cargas de trabajo de producción. Antes de la instalación, lea nuestros modos de inicio y lista de verificación, como sigue:

1. Por favor, clarifique sus tres modos de instalación:

    - [Modo mono-máquina mono-disco (SNSD)](./single-node-single-disk.md)   
    - [Modo mono-máquina multi-discos (SNMD)](./single-node-multiple-disk.md)
    - [Modo multi-máquinas multi-discos (MNMD)](./multiple-node-multiple-disk.md) 

2. [Verificación antes de instalación](../checklists/index.md), para asegurar que todos los indicadores cumplan con las características de guía de producción. Esta guía puede omitirse si no se requiere estándar de producción;



## III. Soporte de sistema operativo y CPU

Puedes ejecutar RustFS en casi cualquier CPU y sistema operativo, ya sea Linux, Unix, Windows, MacOS, FreeBSD, Docker, o incluso en gateways de borde, puedes ejecutar RustFS.
Soporte de arquitectura de CPU: X86, ARM y muchas otras arquitecturas de CPU.

## IV. Características de RustFS

- **Compatible con S3**: 100% compatible con protocolo S3, excelente compatibilidad con big data, lagos de datos, software de respaldo, software de procesamiento de imágenes y software de producción industrial;
- **Distribuido**: RustFS es un almacenamiento de objetos distribuido, por lo tanto, RustFS puede satisfacer varias necesidades;
- **Comercialmente amigable**: RustFS es software 100% de código abierto y utiliza licencia Apache v2.0, por lo tanto, RustFS es comercialmente amigable;
- **Rápido**: El rendimiento del lenguaje de desarrollo Rust está infinitamente cerca de la velocidad del lenguaje C. Por lo tanto, el rendimiento de RustFS es muy potente;
- **Seguro**: RustFS está escrito en el lenguaje Rust seguro en memoria, por lo tanto, RustFS es 100% seguro;
- **Multiplataforma**: RustFS funciona en Windows, macOS y Linux;
- **Extensible**: RustFS soporta plugins personalizados, por lo tanto, RustFS puede satisfacer varias necesidades;
- **Personalizable**: Debido a las características de código abierto, puedes personalizar varios plugins, por lo tanto, RustFS puede satisfacer varias necesidades;
- **Nativo en la nube**: RustFS soporta despliegue a través de Docker y otros métodos, puede desplegarse rápidamente en entornos nativos en la nube.

## V. Valores de RustFS

Ayudar a toda la humanidad a mejorar la seguridad de datos y reducir costos de almacenamiento.

## VI. Visión de RustFS

Cada entidad de IA personal en el mundo puede usar RustFS para almacenar datos.

