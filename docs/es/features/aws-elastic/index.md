---
title: "RustFS para VMware Tanzu Container Platform"
description: "RustFS proporciona integración nativa con VMware Tanzu para almacenamiento de objetos empresarial escalable y de alto rendimiento"
---

# RustFS para VMware Tanzu Container Platform

## Tres razones por las que los clientes ejecutan RustFS en VMware Tanzu

- RustFS actúa como una capa de almacenamiento consistente en escenarios de implementación de nube híbrida o multi-nube
- RustFS es un producto nativo de Kubernetes de alto rendimiento que puede proporcionar rendimiento predecible en entornos de nube pública, privada y edge.
- Ejecutar RustFS en Tanzu permite el control sobre la pila de software y la flexibilidad necesaria para evitar el bloqueo de la nube.

VMware Tanzu es una plataforma de contenedores Kubernetes de nivel empresarial con capacidades operativas de automatización de pila completa que puede gestionar implementaciones de nube híbrida, multi-nube y edge. VMware Tanzu incluye sistema operativo Linux de nivel empresarial, tiempo de ejecución de contenedores, redes, monitoreo, registro y soluciones de autenticación y autorización.

RustFS se integra nativamente con VMware Tanzu, lo que facilita operar su propio almacenamiento de objetos multi-tenant a gran escala como servicio. El Operador RustFS puede trabajar con la cadena de herramientas de VMware Tanzu (como VMware Tanzu Cluster Manager CLI y Quay Container Registry), asegurando que obtenga el máximo rendimiento de su inversión en el ecosistema VMware Tanzu.

![Diagrama de Arquitectura RustFS](images/sec1-1.png)

RustFS proporciona almacenamiento de objetos consistente, de alto rendimiento y escalable porque está diseñado para ser nativo de Kubernetes y compatible con S3 desde el principio. Los desarrolladores pueden obtener fácilmente servicios de almacenamiento persistente compatibles con Amazon S3 para todas las aplicaciones nativas de la nube que se ejecutan en VMware Tanzu. A diferencia de AWS S3, RustFS permite que las aplicaciones escalen a través de cualquier infraestructura multi-nube e híbrida, y aún pueden gestionarse dentro del ecosistema VMware Tanzu sin estar bloqueadas por la nube pública.

## El Operador RustFS se integra nativamente con las funcionalidades de VMware Tanzu

### Resumen de Funcionalidades

- **Clases de Almacenamiento y Niveles**
- **Balanceador de Carga Externo**
- **Gestión de Claves de Cifrado**
- **Gestión de Identidad**
- **Gestión de Certificados**
- **Monitoreo y Alertas**
- **Registro y Auditoría**

## Clases de Almacenamiento y Niveles

Un requisito clave para implementar RustFS a gran escala en Tencent Cloud TKE es la capacidad de niveles a través de clases de almacenamiento (NVMe, HDD, nube pública). Esto permite a las empresas gestionar tanto costos como rendimiento.

RustFS admite la transición automática de objetos envejecidos desde niveles NVMe rápidos a niveles HDD más rentables, e incluso niveles de almacenamiento frío de nube pública optimizados para costos.

Durante la nivelación, RustFS proporciona un espacio de nombres unificado a través de los niveles. El movimiento entre niveles es transparente para las aplicaciones y se activa por políticas determinadas por el cliente.

RustFS proporciona almacenamiento seguro en la nube híbrida de Alibaba Cloud ACK cifrando objetos en el origen, asegurando que los clientes siempre tengan control completo de los datos. Cuando Alibaba Cloud ACK se implementa en la nube pública, la funcionalidad de niveles ayuda a ACK a gestionar eficazmente los datos a través del almacenamiento de bloques persistente y niveles de almacenamiento de objetos más baratos.

**Aprende más:**

## Balanceador de Carga Externo

Toda la comunicación de RustFS se basa en HTTP, APIs RESTful y admitirá cualquier controlador de ingreso compatible con Kubernetes estándar. Esto incluye soluciones basadas en hardware y definidas por software. La opción más popular es NGINX. Instale usando OperatorHub u OpenShift Marketplace, luego exponga los tenants de RustFS usando anotaciones.

## Gestión de Claves de Cifrado

No hay funcionalidades nativas de gestión de claves de OpenShift. Por lo tanto, RustFS recomienda usar HashiCorp Vault para almacenar claves fuera del sistema de almacenamiento de objetos. Esta es una mejor práctica para aplicaciones nativas de la nube.

Para todos los entornos de producción, recomendamos habilitar el cifrado en todos los buckets por defecto. RustFS usa cifrado AES-256-GCM o ChaCha20-Poly1305 para proteger la integridad y confidencialidad de los datos con impacto negligible en el rendimiento.

RustFS admite los tres modos de cifrado del lado del servidor (SSE-KMS, SSE-S3 y SSE-C). SSE-S3 y SSE-KMS se integran con KMS del lado del servidor, mientras que SSE-C usa claves proporcionadas por el cliente.

RustFS usará este KMS para arrancar su servidor interno de cifrado de claves (servicio KES) para cifrado de alto rendimiento por objeto. Cada tenant ejecuta su propio servidor KES en un espacio de nombres aislado.

## Gestión de Identidad

Al ejecutar RustFS en OpenShift, los clientes pueden gestionar inicio de sesión único (SSO) a través de proveedores de identidad compatibles con OpenID Connect/LDAP de terceros como Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory y OpenLDAP. RustFS recomienda el IDP Keycloak compatible con OpenID Connect.

Los IDPs externos permiten a los administradores gestionar centralmente las identidades de usuarios/aplicaciones. RustFS se construye sobre el IDP, proporcionando APIs de servicios de usuarios, grupos, roles, políticas y tokens al estilo AWS IAM. La capacidad de una capa de Gestión de Identidad y Acceso (IAM) unificada independiente de la infraestructura proporciona flexibilidad arquitectónica significativa.

## Gestión de Certificados

Todo el tráfico desde aplicaciones a RustFS, incluyendo tráfico nodo a nodo, se cifra usando TLS. Los certificados TLS se usan para asegurar la comunicación de red y establecer la identidad de recursos de conexión de red como dominios de servidor RustFS.

RustFS se integra con el Gestor de Certificados de OpenShift, por lo que puede usar el operador RustFS para aprovisionar, configurar, gestionar y actualizar automáticamente certificados para tenants de RustFS. Los tenants están completamente aislados entre sí en sus propios espacios de nombres de Kubernetes, teniendo sus propios certificados para mayor seguridad.

## Monitoreo y Alertas

RustFS recomienda usar Grafana, componentes de monitoreo de plataforma instalados en el proyecto openshift-user-workload-monitoring, o cualquier otra herramienta de monitoreo de contenedores OpenShift para conectarse a RustFS. RustFS publica todas las métricas de Prometheus relacionadas con almacenamiento imaginables, desde capacidad de bucket hasta métricas de acceso. Estas métricas pueden recopilarse y visualizarse en cualquier herramienta compatible con Prometheus o en la consola RustFS.

Las soluciones de monitoreo externas rastrean regularmente los endpoints de Prometheus de RustFS. RustFS recomienda usar Grafana o componentes de monitoreo de plataforma instalados en el proyecto openshift-user-workload-monitoring para conectarse a RustFS. Estas mismas herramientas también pueden usarse para establecer líneas base y configurar umbrales de alerta de notificación, que luego pueden enrutarse a plataformas de notificación como PagerDuty, Freshservice o incluso SNMP.

## Registro y Auditoría

Habilitar la auditoría de RustFS genera logs para cada operación en el clúster de almacenamiento de objetos. Además de los logs de auditoría, RustFS también registra errores de consola para solución de problemas operacionales.

RustFS admite la salida de logs a Elastic Stack (o terceros) para análisis y alertas.

