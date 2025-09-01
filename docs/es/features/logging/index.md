---
title: "Registro y Auditoría"
description: "Monitoreo detallado de rendimiento de almacenamiento, métricas y registro para cada operación"
---

# Registro y Auditoría

Al rastrear la salud y rendimiento de cualquier sistema, las métricas y el registro son cruciales. RustFS proporciona visibilidad completa en el clúster a través del monitoreo detallado de rendimiento de almacenamiento, métricas y registro de cada operación. El resultado es una respuesta robusta, transparente y eficiente al monitoreo, alertas y observabilidad del almacenamiento de objetos.

## Características Funcionales

### Métricas de Monitoreo

Proporciona monitoreo completo del sistema y recolección de métricas de rendimiento.

### Registro

Registra información detallada de logs para cada operación, soporta seguimiento de auditoría.

## Monitoreo de Métricas

RustFS exporta un amplio rango de métricas granulares de hardware y software a través de un endpoint de métricas compatible con Prometheus. Prometheus es una plataforma de monitoreo cloud-nativo compuesta por un modelo de datos multidimensional con datos de series temporales identificados por nombre de métrica y pares clave/valor. RustFS incluye un dashboard de monitoreo de almacenamiento usando Grafana para visualizar las métricas recolectadas. El ecosistema de Prometheus incluye múltiples integraciones para enrutar métricas de RustFS a servicios de almacenamiento, mensajería y alertas.

RustFS muestra varias métricas finas de hardware y software a través del endpoint de Prometheus, incluyendo información de salud como fallas de disco o nodo, capacidad total de almacenamiento disponible y capacidad de almacenamiento por disco. Aprovechando Prometheus y su creciente popularidad como plataforma líder de recolección y análisis de métricas, RustFS puede enfocarse en sus funcionalidades de almacenamiento de objetos en lugar de construir innumerables adaptadores personalizados de monitoreo de almacenamiento de datos para servicios dados de análisis/visualización/alertas de terceros.

El Operador Kubernetes de RustFS puede automáticamente desplegar, configurar y gestionar despliegues de Prometheus y recolección de métricas para cada inquilino. Las organizaciones también pueden apuntar su propio sistema Prometheus o compatible con Prometheus hacia cada inquilino para monitoreo centralizado a través de múltiples proveedores, centros de datos y herramientas de visualización/análisis.

RustFS también proporciona un endpoint de verificación de salud para sondear la vivacidad de nodos y clústers. Una simple declaración CURL puede indicar si un nodo dado está saludable o si el clúster tiene quórum de lectura/escritura.

## Logs de Auditoría

Habilitar el registro de auditoría de RustFS instruye a RustFS a generar logs para cada operación en el clúster. Cada operación genera un log de auditoría conteniendo un ID único así como detalles sobre el cliente, objeto, bucket y todos los otros metadatos relacionados con la operación. RustFS escribe datos de log a endpoints webhook HTTP/HTTPS configurados. Adaptadores personalizados pueden ser usados para cumplir requisitos específicos de objetivos de registro de auditoría.

RustFS soporta configuración de logs de auditoría a través de la UI de consola RustFS y la herramienta de línea de comandos RustFS `mc`. Para entornos Kubernetes, el Operador RustFS configura automáticamente la consola con integración LogSearch para inspección visual de logs de auditoría recolectados.

Las notificaciones Lambda de RustFS proporcionan soporte adicional de registro. RustFS puede automáticamente enviar eventos de bucket y objeto a aplicaciones de terceros para procesamiento dirigido por eventos, como frameworks de computación sin servidor o función-como-servicio. Las notificaciones Lambda de RustFS soportan objetivos como RabbitMQ, Kafka, Elasticsearch y servicios arbitrarios vía webhook.

RustFS también soporta rastreo en tiempo real de operaciones HTTP/S a través de la consola RustFS y el comando shell RustFS mc admin trace.

## Arquitectura

**RustFS expone sus métricas a través de un endpoint HTTP(S) compatible con Prometheus, donde un servicio Prometheus proporciona acceso push/pull a estas métricas. El Operador Kubernetes de RustFS despliega un servicio Prometheus independiente para cada inquilino RustFS preconfigurado para extraer métricas del inquilino. Las organizaciones también pueden desplegar o utilizar su propio servicio Prometheus centralizado para extraer métricas del inquilino.**

![Diagrama de arquitectura 1](images/s7-1.png)

Las notificaciones Lambda de RustFS automáticamente empujan notificaciones de eventos a servicios objetivo soportados como Kafka, Elasticsearch o PostgreSQL. Los administradores pueden definir reglas de notificación a nivel de bucket incluyendo filtros granulares para eventos S3 y objetos para los cuales RustFS genera eventos. Las notificaciones Lambda de RustFS están integradas en el servicio de almacenamiento de objetos RustFS y solo requieren acceso a objetivos de notificación remotos.

![Diagrama de arquitectura 2](images/s7-2.png)

## Requisitos

### Para Métricas

BYO Prometheus *o* usar Operador Kubernetes para despliegue/configuración automática por inquilino.

### Para Búsqueda de Logs

BYO PostgreSQL *o* usar Operador Kubernetes para despliegue/configuración automática por inquilino.

### Para Logs

Soporte para objetivos de notificación de terceros.

