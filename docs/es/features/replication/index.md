# Replicación Activo-Activo Multi-Sitio para Almacenamiento de Objetos

## Replicación Activa para Almacenamiento de Objetos

![Replicación de Almacenamiento de Objetos](images/s6-1.png)

La replicación activa para almacenamiento de objetos es un requisito crítico para entornos de producción de misión crítica. RustFS es actualmente el único proveedor que ofrece este servicio. Ejecutada con granularidad a nivel de bucket, se utiliza en las siguientes situaciones:

RustFS soporta replicación síncrona y casi-síncrona, dependiendo de las decisiones arquitectónicas y las tasas de cambio de datos. En cada uno de los casos anteriores, la replicación debe ser lo más cercana posible a estrictamente consistente (considerando limitaciones de ancho de banda y tasas de cambio).

## Replicación de Datos RustFS Diseñada para Resistencia a Gran Escala

Las características clave incluyen:

- ✅ Objetos cifrados o sin cifrar y sus metadatos asociados (escritos atómicamente con objetos)
- ✅ Versiones de objetos
- ✅ Etiquetas de objetos (si las hay)
- ✅ Información de retención de bloqueo de objetos S3 (si la hay)

## Características Principales

### Capacidad para que los Buckets de Origen y Destino Tengan el Mismo Nombre

Esto es requerido para aplicaciones que deben fallar de manera transparente a sitios remotos sin ninguna interrupción.

### Soporte Nativo para Replicación Automática de Bloqueo/Retención de Objetos Entre Origen y Destino

Asegura que los requisitos de integridad de datos y cumplimiento se mantengan durante la replicación.

### Replicación Casi-Síncrona

Puede actualizar objetos inmediatamente después de que ocurra cualquier mutación en el bucket. RustFS sigue consistencia estricta dentro de los centros de datos y consistencia eventual entre centros de datos para proteger los datos.

### Funcionalidad de Notificación

Funcionalidad de notificación para enviar eventos de fallo de replicación. Las aplicaciones pueden suscribirse a estos eventos y alertar a los equipos de operaciones.

## Consideraciones al Implementar Replicación Activo-Activo RustFS

En el nivel más básico, cualquier diseño necesita considerar infraestructura, ancho de banda, latencia, resistencia y escala. Examinémoslos en orden:

### Infraestructura

RustFS recomienda usar el mismo hardware en ambos extremos de los puntos finales de replicación. Aunque hardware similar puede funcionar, introducir perfiles de hardware heterogéneos trae complejidad y ralentiza la identificación de problemas.

### Ancho de Banda

El ancho de banda es un factor crítico para mantener dos sitios consistentemente sincronizados. El requisito óptimo de ancho de banda entre sitios está determinado por la tasa de datos entrantes. Específicamente, si el ancho de banda es insuficiente para manejar los picos, los cambios se pondrán en cola al sitio remoto y eventualmente se sincronizarán.

### Latencia

Después del ancho de banda, la latencia es la consideración más importante al diseñar un modelo activo-activo. La latencia representa el tiempo de ida y vuelta (RTT) entre dos clusters RustFS. El objetivo es reducir la latencia al número más pequeño posible dentro de las restricciones presupuestarias impuestas por el ancho de banda. RustFS recomienda umbrales RTT que no excedan 20 milisegundos para enlaces y redes Ethernet, con tasas de pérdida de paquetes que no excedan 0.01%.

### Arquitectura

Actualmente, RustFS solo recomienda replicación entre dos centros de datos. La replicación entre múltiples centros de datos es posible, sin embargo, la complejidad involucrada y las compensaciones requeridas hacen esto bastante difícil.

## Arquitectura de Despliegue a Gran Escala

RustFS soporta despliegues muy grandes en cada centro de datos, incluyendo origen y destino, con las consideraciones anteriores determinando la escala.

![Arquitectura de Despliegue a Gran Escala](images/s6-2.png)

## Preguntas Frecuentes

### ¿Qué sucede cuando falla el destino de replicación?

Si el destino se cae, el origen almacenará en caché los cambios y comenzará a sincronizar después de que el destino de replicación se recupere. Puede haber algún retraso en alcanzar la sincronización completa, dependiendo de la duración, número de cambios, ancho de banda y latencia.

### ¿Cuáles son los parámetros para la inmutabilidad?

La inmutabilidad está soportada. Los conceptos clave se pueden encontrar en este artículo. En modo de replicación activo-activo, la inmutabilidad solo puede garantizarse cuando los objetos están versionados. El versionado no puede deshabilitarse en el origen. Si el versionado se suspende en el destino, RustFS comenzará a fallar la replicación.

### ¿Qué otros impactos hay si el versionado se suspende o hay un desajuste?

En estos casos, la replicación puede fallar. Por ejemplo, si intentas deshabilitar el versionado en el bucket de origen, se devolverá un error. Primero debes remover la configuración de replicación antes de poder deshabilitar el versionado en el bucket de origen. Además, si el versionado está deshabilitado en el bucket de destino, la replicación fallará.

### ¿Cómo se maneja si el bloqueo de objetos no está habilitado en ambos extremos?

El bloqueo de objetos debe estar habilitado tanto en el origen como en el destino. Hay un caso límite donde después de configurar la replicación de buckets, el bucket de destino puede ser eliminado y recreado pero sin el bloqueo de objetos habilitado, y la replicación puede fallar. Si las configuraciones de bloqueo de objetos no están configuradas en ambos extremos, pueden ocurrir situaciones inconsistentes. En este caso, RustFS fallará silenciosamente.