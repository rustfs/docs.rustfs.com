---
title: "Limitaciones de Uso"
description: "RustFS es un almacenamiento de objetos distribuido simple, eficiente y distribuido. Es 100% compatible con S3, un software de código abierto lanzado bajo la licencia Apache2."
---

# Limitaciones de Uso

## I. Limitaciones de API S3

> Los siguientes estándares siguen estrictamente las especificaciones del protocolo S3.

| Elemento | Especificación |
| --------------------- | ---------------------------------- |
| Tamaño máximo de objeto | 5 TiB |
| Tamaño mínimo de objeto | 0 B |
| Tamaño máximo de objeto para operación PUT única | Carga no multiparte: 500 GiB; Carga multiparte: 5 TiB |
| Número máximo de partes por carga | 10,000 |
| Rango de tamaño de parte | 5 MiB a 5 GiB; la última parte puede ser de 0 B a 5 GiB |
| Número máximo de partes devueltas por solicitud de listado de partes | 10,000 |
| Número máximo de objetos devueltos por solicitud de listado de objetos | 1,000 |
| Número máximo de cargas multiparte devueltas por solicitud de listado de cargas multiparte | 1,000 |
| Longitud máxima del nombre de bucket | 63 caracteres |
| Longitud máxima del nombre de objeto | 1024 caracteres |
| Longitud máxima de cada segmento de nombre de objeto separado por `/` | 255 caracteres |
| Número máximo de versiones por objeto único | 10,000 (configurable) |

---


## II. Limitaciones de Codificación de Borrado

> Los parámetros EC se configuran basados en el algoritmo EC de matriz Reed-Solomon. Sujeto a la configuración real de parámetros EC.

| Elemento | Especificación |
| ---------------------------- | ------------------------------ |
| Número máximo de servidores por clúster | Ilimitado |
| Número mínimo de servidores | 1 |
| Cuando el número de servidores es 1, número mínimo de unidades por servidor | 1 (aplicable para despliegue de nodo único y unidad única, no puede proporcionar confiabilidad o disponibilidad adicional) |
| Cuando el número de servidores es 2 o más, número mínimo de unidades por servidor | 1 |
| Número máximo de unidades por servidor | Ilimitado |
| Número de quórum de lectura | N/2 |
| Número de quórum de escritura | (N/2) + 1 |


---

## III. Limitaciones de Nomenclatura de Objetos

### Limitaciones del Sistema de Archivos y Sistema Operativo

Los nombres de objetos en RustFS están principalmente limitados por el sistema operativo subyacente y el sistema de archivos. Por ejemplo, Windows y algunos otros sistemas operativos restringen el uso de ciertos caracteres especiales como `^`, `*`, `|`, `\`, `/`, `&`, `"`, o `;`.

Por favor, consulte la documentación relevante para obtener una lista completa de restricciones según su sistema operativo y sistema de archivos específicos.

RustFS recomienda usar sistemas operativos Linux basados en el sistema de archivos XFS en entornos de producción para obtener mejor rendimiento y compatibilidad.

### Manejo de Conflictos de Nomenclatura

En RustFS, las aplicaciones deben asignar claves únicas y no conflictivas a todos los objetos. Esto incluye evitar crear objetos cuyos nombres puedan entrar en conflicto con nombres de objetos padre o hermanos. RustFS devolverá un conjunto vacío al realizar operaciones LIST en ubicaciones donde ocurran conflictos.

Por ejemplo, las siguientes operaciones causarían conflictos de espacio de nombres:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Conflicto con prefijo de objeto existente

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Conflicto con objeto existente
```

Aunque puede realizar operaciones GET o HEAD en estos objetos, los conflictos de nomenclatura causarán que las operaciones LIST ejecutadas en la ruta `hello/2025/first/` devuelvan conjuntos de resultados vacíos.
