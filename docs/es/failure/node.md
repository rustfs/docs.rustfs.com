---
title: "Daño del nodo"
description: "Pasos completos para manejar fallos de nodos en clusters RustFS. Incluye principalmente: preparación de hardware de nodo de reemplazo, actualización de configuración, despliegue de servicios, reincorporación al cluster, curación de datos y verificaciones posteriores con mejores prácticas."
---

# Daño del nodo

En un cluster distribuido RustFS, se adopta el mecanismo de Código de Borrado (Erasure Coding) para garantizar el acceso de lectura y escritura incluso cuando fallan nodos parciales, y realizar automáticamente la curación de datos después de que el nodo se reincorpore. Este documento le guiará a través del siguiente flujo:

1. Iniciar nodo de reemplazo y sincronizar entorno
2. Actualizar DNS/nombre de host para que el identificador del nodo antiguo apunte al nuevo nodo
3. Descargar y desplegar servicio RustFS consistente con el cluster
4. Reincorporar el nuevo nodo al cluster y activar curación de datos
5. Monitorear progreso de curación y realizar verificaciones y optimizaciones posteriores

## 1) Iniciar nodo de reemplazo

* **Preparación de hardware y sistema**
  Asegúrese de que el hardware del servidor del nodo de reemplazo sea aproximadamente consistente con el nodo fallido, incluyendo CPU, memoria, configuración de red y tipo de disco; incluso usar una configuración superior no afectará el rendimiento del cluster.
  El entorno de software debe mantener consistencia de versión con otros nodos (sistema operativo, kernel, bibliotecas de dependencias, etc.) para evitar comportamiento anormal del cluster debido a diferencias de entorno.

* **Acceso exclusivo a unidades**
  Al igual que con las operaciones de unidades físicas, RustFS requiere acceso exclusivo a volúmenes de almacenamiento, prohibiendo que cualquier otro proceso o script modifique directamente los datos dentro de los volúmenes de almacenamiento, de lo contrario es fácil causar corrupción de datos o pérdida de redundancia.

## 2) Actualizar nombre de host y resolución de red

* **Configuración DNS/Hosts**
  Si la dirección IP del nodo de reemplazo es diferente del nodo fallido, es necesario re-resolver el nombre de host del nodo antiguo (como `rustfs-node-2.example.net`) al nuevo nodo, para garantizar que cada nodo en el cluster pueda descubrirse mutuamente a través de la misma dirección.

  ```bash
  # Ejemplo: agregar o modificar línea en /etc/hosts
  192.168.1.12 rustfs-node-2.example.net
  ```

  Después de la resolución correcta, puede verificar a través de `ping` o `nslookup` que el nombre de host apunte al nuevo nodo.

## 3) Desplegar y configurar servicio RustFS

* **Descarga e instalación**
  Siga el flujo de despliegue oficial de RustFS de la misma versión, descargue el binario o paquete de instalación consistente con los nodos existentes, y extraiga al directorio unificado. Asegúrese de que los scripts de inicio, variables de entorno y archivos de configuración (como `/etc/default/rustfs`) sean completamente consistentes con otros nodos en el cluster.

* **Verificación de configuración**

  * Verifique si la lista de nodos del cluster (endpoints) en `config.yaml` incluye el nombre de host y puerto del nuevo nodo.
  * Asegúrese de que todos los nodos tengan las mismas claves de acceso y configuraciones de permisos, para evitar que el nuevo nodo no pueda unirse debido a fallas de autenticación.

## 4) Reincorporación al cluster y activación de curación de datos

* **Iniciar servicio**

  ```bash
  systemctl start rustfs-server
  ```

  O use su script de inicio personalizado para iniciar el servicio RustFS, y vea los logs de inicio a través de `journalctl -u rustfs-server -f` para confirmar que el nuevo nodo ha detectado otros nodos en línea y ha comenzado el proceso de curación de datos.

* **Monitoreo manual del estado de curación**
  Use la herramienta de gestión RustFS (asumiendo que el comando sea `rustfs-admin`) para ver la salud del cluster y progreso de curación:

  ```bash
  # Ver estado de nodos del cluster
  rc cluster status

  # Activar curación de datos del nuevo nodo
  rc heal --node rustfs-node-2.example.net

  # Rastrear progreso de curación en tiempo real
  rc heal status --follow
  ```

  Aquí, el comando `heal` es similar a `rc admin heal` de RustFS, puede asegurar que todos los fragmentos de datos perdidos o inconsistentes se recuperen en segundo plano.

* **Referencia de experiencia comunitaria**
  Las pruebas de la comunidad muestran que cuando un nodo se reincorpora después de estar desconectado, RustFS solo ejecutará operaciones de curación en el nuevo nodo, no rebalanceará completamente el cluster, evitando así picos innecesarios de red e E/S.

## 5) Verificaciones posteriores y mejores prácticas

* **Monitoreo y alertas**

  * Durante la curación, monitoree la carga de disco y red, asegúrese de que el cluster satisfaga los requisitos de lectura-escritura y ancho de banda de red.
  * Configure alertas para notificar oportunamente al equipo de operaciones cuando la curación del nodo falle o el progreso se estanque más allá del umbral.

* **Ejercicios de fallo repetidos**
  Simule regularmente fallos de nodos y practique todo el flujo de recuperación para asegurar la familiaridad del equipo con comandos de operación y pasos de emergencia.

* **Análisis de causa raíz**
  Para nodos o discos que fallan frecuentemente, realice diagnósticos profundos de salud de hardware (SMART, logs de BIOS, etc.) y adopte un plan de mantenimiento preventivo.

* **Soporte profesional**
  Si necesita localización de fallos más profunda y orientación de recuperación, puede contactar al equipo de desarrollo RustFS o la comunidad para obtener ayuda.

---

**Resumen**: A través del flujo anterior, RustFS puede reemplazar rápida y seguramente un nodo y completar la curación de datos después de un fallo completo de hardware del nodo, minimizando al máximo la interrupción de disponibilidad del cluster. Es esencial calibrar según su propio entorno y herramientas específicas de línea de comandos para asegurar consistencia de configuración y corrección del orden de operaciones.

