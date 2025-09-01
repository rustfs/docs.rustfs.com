---
title: "Infraestructura para Datos a Gran Escala"
description: "Arquitectura distribuida diseñada para escalabilidad técnica, operativa y económica"
---

# Infraestructura para Datos a Gran Escala

RustFS está diseñado para la escalabilidad. Escalabilidad técnica, escalabilidad operativa y escalabilidad económica. Escalabilidad fundamental.

RustFS está diseñado como cloud-nativo y puede ejecutarse como contenedores ligeros gestionados por servicios de orquestación externos como Kubernetes. Todo el servidor es un binario estático de ~100 MB que utiliza eficientemente los recursos de CPU y memoria incluso bajo alta carga. El resultado es que puedes co-hospedar un gran número de inquilinos en hardware compartido.

![Diagrama de arquitectura RustFS](./images/s2-1.png)

RustFS puede ejecutarse en cualquier lugar y en cualquier nube, pero típicamente se ejecuta en servidores estándar con unidades conectadas localmente (JBOD/JBOF). Todos los servidores en el clúster son funcionalmente equivalentes (arquitectura completamente simétrica). No hay nodos de nombres o servidores de metadatos.

RustFS escribe datos y metadatos juntos como objetos, sin requerir una base de datos de metadatos. Además, RustFS realiza todas las funciones (codificación de borrado, verificación de bitrot, cifrado) como operaciones en línea, estrictamente consistentes. El resultado es que RustFS es excepcionalmente resistente.

Cada clúster RustFS es una colección de servidores RustFS distribuidos con un proceso por nodo. RustFS se ejecuta en el espacio de usuario como un proceso único y utiliza corrutinas ligeras para alta concurrencia. Las unidades se agrupan en conjuntos de borrado (ver calculadora de borrado aquí) y los objetos se colocan en estos conjuntos usando algoritmos de hash determinísticos.

RustFS está diseñado para servicios de almacenamiento en la nube multi-centro de datos a gran escala. Cada inquilino opera su propio clúster RustFS, completamente aislado de otros inquilinos, permitiéndoles protegerlos de cualquier perturbación por actualizaciones, updates y eventos de seguridad. Cada inquilino escala independientemente mediante federación de clústeres a través de ubicaciones geográficas.

