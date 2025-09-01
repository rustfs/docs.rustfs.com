---
title: "Cifrado"
description: "Infraestructura para seguridad de datos a gran escala"
---

# Infraestructura para Datos a Gran Escala

RustFS está diseñado para la escala. Escala técnica, escala operacional y escala económica. Escala fundamental.

En el campo del almacenamiento de objetos, se requiere un cifrado robusto para tener un asiento en la mesa de negociaciones. RustFS proporciona más funcionalidad a través del más alto nivel de cifrado y optimizaciones extensivas, eliminando prácticamente la sobrecarga típicamente asociada con las operaciones de cifrado de almacenamiento.

![Arquitectura de Cifrado de Datos](images/s5-1.png)

RustFS cifra datos tanto cuando se almacenan en disco como cuando se transmiten a través de la red. El esquema de cifrado de vanguardia de RustFS soporta cifrado de granularidad fina a nivel de objeto utilizando algoritmos de cifrado estándar de la industria modernos como AES-256-GCM, ChaCha20-Poly1305, y AES-CBC. RustFS es completamente compatible con la semántica de cifrado S3 y también extiende S3 al soportar servicios de gestión de claves que no son de AWS como Hashicorp Vault, Gemalto KeySecure, y Google Secrets Manager.

## Cifrado de Red

Cuando los datos se transmiten entre el almacenamiento de objetos y las aplicaciones, pueden rebotar entre cualquier número de redes desconocidas y/o no confiables. Cifrar datos mientras se transmiten a través de la red (también conocido como "en tránsito") mitiga exitosamente los ataques de hombre en el medio y asegura que los datos permanezcan seguros independientemente de la ruta de enrutamiento tomada.

RustFS soporta Transport Layer Security (TLS) v1.2+ entre todos los componentes del clúster. Este enfoque asegura que no hay enlaces débiles en el tráfico cifrado entre o dentro de clústeres. TLS es un marco de cifrado ubicuo: es el mismo protocolo de cifrado usado por bancos, sitios web de comercio electrónico y otros sistemas de nivel empresarial que dependen del cifrado de almacenamiento de datos.

La implementación TLS de RustFS está optimizada a nivel de instrucción de CPU con sobrecarga de rendimiento insignificante. Solo requiere especificar claves privadas TLS y certificados públicos para cada servidor RustFS en el clúster. Para entornos de Kubernetes, el Operador de Kubernetes de RustFS integra/genera automáticamente y asigna certificados TLS durante el despliegue de inquilinos. RustFS soporta múltiples certificados TLS, donde cada certificado corresponde a un nombre de dominio específico. RustFS usa Server Name Indication (SNI) para determinar qué certificado servir para cualquier solicitud dada.

## Cifrado de Objetos

Los datos almacenados en disco dependen enteramente de la seguridad del disco y se extienden al sistema host para asegurar la seguridad de los datos. El cifrado de objetos del lado del servidor de RustFS cifra automáticamente los datos antes de que se almacenen en disco (cifrado en reposo). Este enfoque garantiza que no se escriban datos a discos no cifrados. Esta capa de seguridad de línea base asegura la confidencialidad, integridad y autenticidad de los datos en reposo. RustFS soporta tanto cifrado de objetos predeterminado de bucket automático como dirigido por el cliente para máxima flexibilidad en el cifrado de datos.

El cifrado del lado del servidor de RustFS es compatible con la semántica de Amazon AWS-S3 (SSE-S3). RustFS extiende el soporte de línea base para AWS KMS para incluir sistemas KMS empresariales comunes como Hashicorp Vault y Thales Ciphertrust (anteriormente Gemalto KeySecure). RustFS también soporta cifrado dirigido por el cliente (SSE-C), donde las aplicaciones pueden especificar la clave de datos usada para cifrar objetos. Para tanto SSE-S3 como SSE-C, el servidor RustFS realiza todas las operaciones de cifrado, incluyendo rotación de claves y re-cifrado de objetos.

A través del cifrado automático del lado del servidor, RustFS cifra cada objeto con una clave única y aplica múltiples capas de cifrado adicional usando claves de cifrado dinámicas y claves derivadas de KMS externo o claves proporcionadas por el cliente. Este enfoque seguro y sofisticado se realiza dentro de RustFS sin la necesidad de manejar múltiples utilidades de cifrado independientes de kernel y espacio de usuario.

RustFS usa esquemas de Cifrado Autenticado con Datos Asociados (AEAD) para cifrar/descifrar objetos cuando los objetos se escriben o leen desde el almacenamiento de objetos. El cifrado AEAD de RustFS soporta protocolos de cifrado estándar de la industria como AES-256-GCM y ChaCha20-Poly1305 para proteger datos de objetos. Las optimizaciones a nivel de CPU de RustFS (como aceleración SIMD) aseguran sobrecarga de rendimiento insignificante para operaciones de cifrado/descifrado. Las organizaciones pueden ejecutar cifrado automático a nivel de bucket en cualquier momento en lugar de verse forzadas a hacer elecciones de seguridad subóptimas.

## Servicio de Cifrado de Claves RustFS

RustFS proporciona opciones integradas para cifrado de claves. El Servicio de Cifrado de Claves (KES) de RustFS es un sistema de gestión de claves distribuido sin estado para aplicaciones de alto rendimiento. Está diseñado para ejecutarse en Kubernetes y distribuir claves de cifrado a aplicaciones. KES es un componente requerido para el cifrado de objetos del lado del servidor de RustFS (SSE-S3).

KES soporta operaciones de cifrado en clústeres RustFS y es un mecanismo clave para asegurar operaciones de cifrado escalables y de alto rendimiento. KES actúa como un intermediario entre clústeres RustFS y KMS externo, generando claves de cifrado según sea necesario y realizando operaciones de cifrado sin estar limitado por restricciones de KMS. Por lo tanto, todavía hay un KMS central que protege claves maestras y sirve como la raíz de confianza en la infraestructura. KES simplifica el despliegue y la gestión eliminando la necesidad de arrancar KMS para cada conjunto de aplicaciones. En su lugar, las aplicaciones pueden solicitar claves de cifrado de datos (DEKs) de servidores KES o pedir a los servidores KES que descifren DEKs cifradas.

Dado que los servidores KES son completamente sin estado, pueden escalarse automáticamente, como a través del Escalador Automático Horizontal de Pods de Kubernetes. Al mismo tiempo, dado que KES maneja independientemente la gran mayoría de solicitudes de aplicaciones, la carga en el KMS central no aumenta significativamente.

Para entornos de Kubernetes, el Operador de Kubernetes de RustFS soporta el despliegue y configuración de KES para cada inquilino, habilitando SSE-S3 como parte de cada despliegue de inquilino.

![Arquitectura del Servicio de Cifrado de Claves KES](images/s5-2.png)

## Sistemas de Gestión de Claves Externos Soportados

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |

