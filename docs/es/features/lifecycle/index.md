---
title: "Gestión del Ciclo de Vida y Niveles de Datos"
description: "Optimización para acceso, seguridad y economía"
---

# Gestión del Ciclo de Vida y Niveles de Datos

Mientras los datos continúan creciendo, la capacidad de optimizar colaborativamente para acceso, seguridad y economía se convierte en un requisito duro en lugar de algo deseable. Aquí es donde entra en juego la gestión del ciclo de vida de datos. RustFS proporciona un conjunto único de características para proteger datos dentro y entre nubes - incluyendo nubes públicas y privadas. Las herramientas de gestión del ciclo de vida de datos empresariales de RustFS, incluyendo versionado, bloqueo de objetos y varios componentes derivados, satisfacen muchos casos de uso.

## Expiración de Objetos

Los datos no tienen que existir para siempre: las herramientas de gestión del ciclo de vida de RustFS te permiten definir cuánto tiempo permanecen los datos en disco antes de la eliminación. Los usuarios definen la duración del tiempo como una fecha específica o número de días antes de que RustFS comience a eliminar objetos.

Las reglas de gestión del ciclo de vida se crean por bucket y pueden construirse usando cualquier combinación de filtros de objetos y etiquetas. No especificar filtros para establecer reglas de expiración para todo el bucket, o especificar múltiples reglas para crear comportamiento de expiración más complejo.

Las reglas de expiración de objetos de RustFS también se aplican a buckets versionados y vienen con algunos sabores específicos de versionado. Por ejemplo, puedes especificar reglas de expiración solo para versiones no actuales de objetos para maximizar los beneficios del versionado de objetos sin incurrir en costos de almacenamiento a largo plazo. De manera similar, puedes crear reglas de gestión del ciclo de vida para eliminar objetos cuya única versión restante es un marcador de eliminación.

Las reglas de expiración de bucket cumplen completamente con el bloqueo WORM de RustFS y retenciones legales - los objetos en un estado bloqueado permanecerán en disco hasta que el bloqueo expire o sea liberado explícitamente. Una vez que los objetos ya no están restringidos por bloqueos, RustFS comienza a aplicar reglas de expiración normalmente.

Las reglas de gestión del ciclo de vida de expiración de objetos de RustFS son funcional y sintácticamente compatibles con AWS Lifecycle Management. RustFS también soporta importar reglas existentes en formato JSON, haciendo fácil migrar reglas de expiración existentes de AWS.

## Niveles de Objetos Basados en Políticas

RustFS puede configurarse programáticamente para niveles de almacenamiento de objetos para que los objetos transicionen de un estado o clase a otro basado en cualquier número de variables - aunque las más comúnmente usadas son tiempo y frecuencia de acceso. Esta característica se entiende mejor en el contexto de niveles. Los niveles permiten a los usuarios optimizar costos de almacenamiento o funcionalidad en respuesta a patrones de acceso a datos cambiantes. El almacenamiento de datos por niveles generalmente se usa en los siguientes escenarios:

## A Través de Medios de Almacenamiento

Los niveles de medios de almacenamiento cruzado es el caso de uso de niveles más conocido y directo. Aquí, RustFS abstrae los medios subyacentes y optimiza colaborativamente para rendimiento y costo. Por ejemplo, para cargas de trabajo de rendimiento o nearline, los datos podrían almacenarse en NVMe o SSD, pero después de un período de tiempo, organizarse por niveles a medios HDD, o para cargas de trabajo que valoran el escalado de rendimiento. Con el tiempo, si es apropiado, estos datos pueden migrarse más a almacenamiento a largo plazo.

![Niveles de Medios de Almacenamiento Cruzado](images/s9-2.png)

## A Través de Tipos de Nube

Un caso de uso emergente rápidamente involucra usar los recursos de almacenamiento y computación baratos de la nube pública como otro nivel para nubes privadas. En este caso de uso, las cargas de trabajo nearline orientadas al rendimiento se ejecutan usando medios de nube privada apropiados. El volumen de datos no importa, pero las expectativas de valor y rendimiento sí. A medida que los volúmenes de datos aumentan y las expectativas de rendimiento disminuyen, las empresas pueden usar las opciones de almacenamiento frío de la nube pública para optimizar costos y capacidades de acceso asociadas con retener datos.

Esto se logra ejecutando RustFS tanto en nubes privadas como públicas. Usando replicación, RustFS puede mover datos a opciones de nube pública baratas y usar RustFS en la nube pública para protegerlos y acceder a ellos cuando sea necesario. En este caso, la nube pública se convierte en almacenamiento tonto para RustFS, así como JBOD se convierte en almacenamiento tonto para RustFS. Este enfoque evita reemplazar y agregar infraestructura de cinta obsoleta.

![Niveles de Tipo de Nube Cruzado](images/s9-3.png)

## En Nubes Públicas

RustFS típicamente sirve como el nivel primario de almacenamiento de aplicaciones en nubes públicas. En este caso, como con otros casos de uso, RustFS es el único almacenamiento accedido por aplicaciones. Las aplicaciones (y desarrolladores) no necesitan saber nada más allá del endpoint de almacenamiento. RustFS determina qué datos pertenecen dónde basado en parámetros de gestión. Por ejemplo, RustFS puede determinar que los datos de bloque deberían moverse al nivel de objeto, y qué nivel de objeto cumple las metas de rendimiento y económicas de la empresa.

RustFS combina diferentes capas de niveles de almacenamiento y determina medios apropiados para proporcionar mejor economía sin comprometer el rendimiento. Las aplicaciones simplemente direccionan objetos a través de RustFS, mientras RustFS aplica transparentemente políticas para mover objetos entre niveles y retiene los metadatos de ese objeto en el nivel de bloque.

![Niveles de Nube Pública](images/s9-4.png)

