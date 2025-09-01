---
title: "Inmutabilidad de Objetos de RustFS"
description: "Cumplimiento WORM e inmutabilidad de datos"
---

# Inmutabilidad de Objetos de RustFS

## RustFS y API S3 - Diseñado para Almacenamiento Multi-Nube

RustFS se ha establecido como el estándar para la compatibilidad con AWS S3 desde el principio. Como uno de los primeros adoptantes de la API S3 (V2 y V4) y una de las únicas compañías de almacenamiento enfocadas exclusivamente en S3, la gran comunidad de RustFS asegura que ninguna otra alternativa a AWS sea más compatible. La API S3 es el estándar de facto en la nube, por lo que las alternativas a AWS deben poder usar la API con fluidez para operar e interoperar a través de diferentes entornos (nube pública, nube privada, centro de datos, multi-nube, nube híbrida y edge).

## Retención de Objetos

Las reglas de retención de almacenamiento de objetos aseguran que los objetos estén protegidos por WORM durante un período de tiempo. Las políticas de retención de almacenamiento de objetos especifican el período de retención establecido en las versiones de objetos, ya sea explícitamente o a través de configuraciones predeterminadas del bucket. Las configuraciones de bloqueo predeterminadas establecidas a nivel del bucket se aplican a objetos creados posteriormente y no se aplican retroactivamente a versiones de objetos creados previamente.

Cuando se usan configuraciones predeterminadas del bucket, se establece una duración en días o años para definir la cantidad de tiempo que cada versión de objeto colocada en el bucket debe estar protegida. Los nuevos objetos colocados en el bucket heredarán la duración de protección establecida para el bucket.

Los períodos de retención pueden establecerse explícitamente para las versiones de objetos. Los períodos de retención explícitos especifican una "fecha de retener hasta" para la versión del objeto. La "fecha de retener hasta" se almacena en los metadatos de la versión del objeto y protege la versión del objeto hasta que expire el período de retención.

Después de que expire el período de retención, la versión del objeto puede eliminarse a menos que también se coloque una retención legal en la versión del objeto.

Las configuraciones de modo de retención explícitas anulan las configuraciones predeterminadas del bucket.

Los períodos de retención pueden extenderse fácilmente enviando una nueva solicitud de bloqueo.

Dentro del marco de retención, hay dos tipos de modos para establecer períodos de retención para objetos y buckets.

## Modo de Gobernanza

El modo de gobernanza se usa para prevenir que los objetos sean eliminados por usuarios estándar. Sin embargo, ciertos usuarios necesitan retener los permisos requeridos para modificar configuraciones de retención o eliminar objetos. Estos usuarios necesitarán permisos especiales como el permiso s3:BypassGovernanceRetention y el permiso DeleteObject.

## Modo de Cumplimiento

El modo de cumplimiento es más restrictivo y no puede revocarse durante el período de retención. Por lo tanto, el modo de cumplimiento asegura que nadie (incluyendo el usuario root) pueda eliminar objetos durante el período de retención del objeto.

## Retención Legal

La retención legal proporciona la misma protección WORM que los períodos de retención pero sin fecha de expiración. Esta es una retención indefinida que solo puede ser removida por usuarios autorizados.

Cuando los objetos tienen políticas de retención o retención legal definidas, continuarán siendo versionados. Las operaciones de replicación realizadas en una versión de objeto no transfieren configuraciones de retención y retención legal del bucket de origen al destino.

## La Inmutabilidad de Datos de RustFS Cumple o Excede los Estándares de Certificación Cohasset

El estándar dorado para bloqueo de objetos, retención y retención legal es la verificación por Cohasset Associates. La retención de almacenamiento de objetos e inmutabilidad de datos de RustFS ha obtenido evaluación positiva de Cohasset Associates, particularmente con respecto a SEC Rule 17a-4(f), FINRA Rule 4511, y CFTC Regulation 1.31. La Regla 17a-4 tiene requisitos específicos para almacenamiento de datos electrónicos, incluyendo muchos aspectos de gestión de registros como duración, formato, calidad, disponibilidad y responsabilidad de la retención de registros de broker-dealer.

Una copia del informe de evaluación de Cohasset Associates puede descargarse completamente y compartirse con cuerpos regulatorios relevantes al almacenar datos en RustFS. Detalla cómo configurar RustFS para cumplir requisitos y la lógica que soporta la funcionalidad de bloqueo de objetos.

