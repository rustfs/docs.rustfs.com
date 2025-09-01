---
title: "Glosario"
description: "Este artículo introduce vocabulario comúnmente usado en almacenamiento de objetos para ayudar a los usuarios a entender rápidamente el almacenamiento de objetos"
---

# Colección de Vocabulario Central de Almacenamiento de Objetos (100 Términos)

| No. | Término | Chino | Descripción |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Object Storage | 对象存储 | Una arquitectura donde los datos se almacenan como objetos, reemplazando estructuras jerárquicas de archivos tradicionales |
| 2 | Bucket | 存储桶 | Un contenedor para almacenar objetos con espacio de nombres globalmente único |
| 3 | Object | 对象 | Unidad básica de almacenamiento que contiene datos, metadatos e identificador único (Object Key) |
| 4 | Metadata | 元数据 | Información de pares clave-valor que describe atributos de objetos (como tipo de archivo, tiempo de creación) |
| 5 | S3-Compatible | S3 兼容 | Servicios de almacenamiento compatibles con estándares de API de Amazon S3 |
| 6 | Data Durability | 数据持久性 | Probabilidad de que los datos se conserven a largo plazo en el sistema sin pérdida (ej. 99.999999999%) |
| 7 | Replication | 多副本 | Tecnología de redundancia que asegura la seguridad de datos a través de múltiples copias |
| 8 | Erasure Coding | 纠删码 | Tecnología que fragmenta y codifica datos para alta confiabilidad con menos espacio |
| 9 | Cold Storage | 冷存储 | Tipo de almacenamiento de bajo costo para datos accedidos infrecuentemente (como datos archivados) |
| 10 | Lifecycle Management | 生命周期管理 | Políticas para transicionar/eliminar automáticamente objetos (ej. mover a almacenamiento frío después de 30 días) |
| 11 | Versioning | 版本控制 | Retener versiones históricas de objetos para prevenir sobrescritura |
| 12 | Storage Class | 存储类型 | Diferentes niveles de almacenamiento de rendimiento/costo (Estándar, Acceso Infrecuente, Archivo) |
| 13 | Access Key | 访问密钥 | Claves de autenticación para solicitudes de API (Access Key ID + Secret Access Key) |
| 14 | Region | 区域 | Ubicación geográfica de infraestructura de almacenamiento (ej. Este de China 1, Oeste de EE.UU.) |
| 15 | Availability Zone (AZ) | 可用区 | Centros de datos aislados con poder/red independiente dentro de la misma región |
| 16 | Endpoint | 端点 | Dirección de dominio para acceder al servicio de almacenamiento (ej. us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | Especificación de diseño de API basada en protocolo HTTP |
| 18 | Multipart Upload | 分片上传 | Mecanismo para dividir archivos grandes para carga y fusión |
| 19 | Pre-Signed URL | 预签名 URL | Enlaces de acceso temporal con validez de tiempo |
| 20 | Server-Side Encryption (SSE) | 服务端加密 | Cifrado automático de datos en el lado del servidor (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Client-Side Encryption (CSE) | 客户端加密 | Cifrado local en el lado del cliente antes de la carga |
| 22 | Cross-Region Replication | 跨区域复制 | Replicación automática de objetos a través de regiones geográficas |
| 23 | Access Control List (ACL) | 访问控制列表 | Lista de reglas controlando permisos de acceso para buckets/objetos |
| 24 | Bucket Policy | 存储桶策略 | Políticas de control de permisos de granularidad fina basadas en JSON |
| 25 | IAM | IAM | Sistema de Gestión de Identidad y Acceso para gestión centralizada de permisos de usuario/rol |
| 26 | Event Notification | 事件通知 | Enviar notificaciones a colas de mensajes/computación de funciones cuando se activan eventos |
| 27 | Data Lake | 数据湖 | Repositorio para almacenamiento centralizado de datos estructurados/no estructurados |
| 28 | Compliance | 合规性 | Cumplir requisitos regulatorios de almacenamiento de datos como GDPR, HIPAA |
| 29 | Logging & Audit | 日志审计 | Registrar todos los registros de operaciones de API para auditoría |
| 30 | Monitoring & Alerting | 监控告警 | Monitoreo en tiempo real de uso de almacenamiento/solicitudes con alertas |
| 31 | CORS | 跨域资源共享 | Reglas controlando acceso de recursos de origen cruzado del navegador |
| 32 | Transfer Acceleration | 传输加速 | Optimizar velocidad de carga/descarga a través de nodos de borde |
| 33 | CDN Integration | CDN 加速 | Combinar con Red de Entrega de Contenido para aceleración de caché |
| 34 | Data Export | 数据导出 | Proceso de migrar datos a otros sistemas de almacenamiento |
| 35 | Data Import | 数据导入 | Migración de datos por lotes desde sistemas externos a almacenamiento de objetos |
| 36 | Static Website Hosting | 静态网站托管 | Alojar directamente archivos estáticos HTML/CSS/JS a través de buckets |
| 37 | Hotlink Protection | 防盗链 | Tecnología que previene que sitios web externos roben enlaces de recursos |
| 38 | Request Rate Limiting | 请求速率限制 | Controlar frecuencia de solicitudes de API por usuario/IP |
| 39 | Tagging | 标签 | Agregar etiquetas de clasificación a buckets/objetos para gestión |
| 40 | Inventory Report | 清单报告 | Archivos CSV/ORC generados periódicamente listando objetos de almacenamiento |
| 41 | Data Restoration | 数据恢复 | Restaurar datos desde almacenamiento de archivo a estado accesible |
| 42 | Storage Gateway | 存储网关 | Capa de acceso mapeando almacenamiento de objetos como sistema de archivos local |
| 43 | Data Compression | 数据压缩 | Comprimir datos antes de la carga para ahorrar espacio de almacenamiento |
| 44 | Data Deduplication | 数据去重 | Eliminar datos duplicados para reducir uso de almacenamiento |
| 45 | Direct Read Archive | 直读归档 | Tecnología para leer directamente datos archivados sin restauración |
| 46 | Bandwidth Control | 流量控制 | Limitar ancho de banda de descarga para evitar congestión de red |
| 47 | Concurrent Connections | 并发连接数 | Número de conexiones de transferencia de datos simultáneas |
| 48 | Data Migration Service | 数据迁移服务 | Herramientas de migración automatizada (ej. AWS Snowball) |
| 49 | Client SDK | 客户端 SDK | Kits de herramientas para desarrolladores para integrar servicios de almacenamiento (ej. Python/Java SDK) |
| 50 | CLI | 命令行工具 | Herramientas de gestión de línea de comandos (ej. aws s3 cp) |
| 51 | Web Console | 图形化控制台 | Interfaz de gestión basada en web |
| 52 | Data Integrity Check | 数据校验 | Verificar integridad de transmisión a través de MD5/SHA |
| 53 | Resumable Upload/Download | 断点续传 | Continuar transferencia desde punto de interrupción después de interrupción de red |
| 54 | Mirror Back to Source | 镜像回源 | Extraer y guardar desde origen especificado cuando el objeto solicitado no existe |
| 55 | Canary Release | 灰度发布 | Estrategia de lanzamiento abriendo gradualmente nuevas funciones a algunos usuarios |
| 56 | Soft Delete | 软删除 | Marcar objetos para eliminación mientras se mantiene período de recuperación |
| 57 | Object Lock | 对象锁定 | Mecanismo de protección de cumplimiento previniendo eliminación o sobrescritura de objetos |
| 58 | Watermarking | 水印 | Agregar información de identificación a imágenes/videos |
| 59 | Thumbnail Generation | 缩略图生成 | Crear automáticamente versiones en miniatura de imágenes |
| 60 | Image Processing | 图片处理 | Funciones de procesamiento en línea de recorte/escalado/rotación |
| 61 | Video Transcoding | 视频转码 | Convertir formatos/resoluciones de video para diferentes dispositivos |
| 62 | Content Moderation | 内容审核 | Detectar automáticamente imágenes/videos/texto inapropiados |
| 63 | Cost Analysis | 成本分析 | Calcular costos por dimensiones de tipo de almacenamiento/conteo de solicitudes |
| 64 | Usage Monitoring | 用量监控 | Panel en tiempo real viendo almacenamiento/tráfico/conteos de solicitudes |
| 65 | Storage Analytics | 存储分析 | Herramientas analizando patrones de almacenamiento para optimizar costos |
| 66 | Requester Pays | 请求者付费 | Modelo de facturación donde el descargador de datos asume el costo |
| 67 | Tiered Storage | 数据分层 | Mover automáticamente datos a niveles de almacenamiento de menor costo |
| 68 | Intelligent Tiering | 智能分层 | Seleccionar automáticamente tipo de almacenamiento óptimo basado en patrones de acceso |
| 69 | PrivateLink | 私有链接 | Acceder a almacenamiento de objetos a través de red interna evitando exposición pública |
| 70 | VPC Endpoint | VPC 端点 | Punto de entrada para acceder de forma segura a servicios de almacenamiento dentro de Nube Privada Virtual |
| 71 | SSL/TLS | 传输加密 | Cifrar transmisión de datos a través de protocolo HTTPS |
| 72 | Client-Side Encryption | 客户端加密 | Usuarios cifran datos ellos mismos antes de la carga |
| 73 | KMS | KMS | Servicio de Gestión de Claves para gestión centralizada de claves de cifrado |
| 74 | Permission Boundary | 权限边界 | Limitar alcance máximo de permisos de roles/usuarios IAM |
| 75 | Temporary Credentials | 临时凭证 | Tokens de acceso válidos a corto plazo (ej. STS Token) |
| 76 | MFA Delete | MFA 删除保护 | Requerir autenticación de múltiples factores para eliminar datos |
| 77 | Immutability | 数据不可变性 | Propiedad previniendo manipulación de datos (combinado con modelo WORM) |
| 78 | Legal Hold | 法律保留 | Protección obligatoria prohibiendo eliminación/modificación de datos en escenarios de cumplimiento |
| 79 | Cross-Account Sharing | 跨账户共享 | Permitir que otras cuentas de nube accedan a recursos de almacenamiento especificados |
| 80 | Prefetch Policy | 预取策略 | Cargar datos en caché por adelantado para acelerar acceso posterior |
| 81 | Cache-Control | 缓存控制 | Especificar comportamiento de caché de navegador/CDN a través de encabezados HTTP |
| 82 | Delayed Deletion | 延迟删除 | Retrasar operaciones de eliminación para prevenir acciones accidentales |
| 83 | Batch Operations | 批量操作 | Realizar operaciones unificadas en múltiples objetos (eliminar/copiar/restaurar) |
| 84 | Data Lineage | 数据血缘 | Registros de metadatos rastreando fuentes de datos e historial de cambios |
| 85 | Data Catalog | 数据目录 | Sistema de recuperación almacenando información de metadatos |
| 86 | Storage Gateway | 存储网关 | Solución de nube híbrida conectando sistemas locales con almacenamiento en la nube |
| 87 | Hybrid Cloud Storage | 混合云存储 | Arquitectura usando tanto almacenamiento local como en la nube |
| 88 | Edge Storage | 边缘存储 | Proporcionar servicios de almacenamiento en nodos de borde cerca de fuentes de datos |
| 89 | Multi-Cloud Storage | 多云存储 | Soluciones de almacenamiento a través de diferentes proveedores de servicios en la nube |
| 90 | Storage Federation | 存储联盟 | Capa de abstracción para gestión unificada de múltiples sistemas de almacenamiento |
| 91 | Object Tag | 对象标签 | Agregar etiquetas de clasificación personalizadas a objetos |
| 92 | Bucket Tag | 存储桶标签 | Agregar etiquetas relacionadas con gestión/facturación a buckets |
| 93 | Storage Quota | 存储配额 | Limitar capacidad máxima de buckets |
| 94 | Request Throttling | 请求限速 | Limitar solicitudes de API por unidad de tiempo |
| 95 | SLA | 服务等级协议 | Compromisos de Acuerdo de Nivel de Servicio para disponibilidad/durabilidad (ej. 99.9% disponibilidad) |
| 96 | Disaster Recovery | 灾难恢复 | Asegurar continuidad de negocio a través de respaldos entre regiones |
| 97 | Storage Topology | 存储拓扑 | Estructura de distribución de datos en niveles físicos/lógicos |
| 98 | Proximity Access | 就近访问 | Enrutar solicitudes de usuario a nodos de almacenamiento más cercanos |
| 99 | Global Namespace | 全球统一命名空间 | Gestión de vista unificada de buckets entre regiones |
| 100 | Zero-Copy Migration | 零拷贝迁移 | Migración rápida de datos a través de operaciones de metadatos |