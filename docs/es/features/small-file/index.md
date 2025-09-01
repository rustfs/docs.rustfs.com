---
title: "Optimización de Archivos Pequeños"
description: "Crear almacenamiento de objetos en memoria para cargas de trabajo de ultra alto rendimiento utilizando DRAM del servidor"
---

# Optimización de Archivos Pequeños

> Crear almacenamiento de objetos en memoria para cargas de trabajo de ultra alto rendimiento

Utilizar DRAM del servidor para crear un pool de memoria compartida distribuida para cargas de trabajo que requieren un gran rendimiento de IOPS y throughput.

## Antecedentes

La optimización de archivos pequeños de RustFS es muy adecuada para cargas de trabajo que requieren rendimiento de IOPS y throughput. En arquitecturas modernas, esto significa cada vez más cargas de trabajo de AI/ML. Sin caché, las operaciones I/O pueden convertirse en un cuello de botella para las GPU.

Con caché empresarial, se pueden mantener buckets que contienen conjuntos de datos de entrenamiento, validación y prueba en memoria para proporcionar acceso basado en memoria.

## Características

### 🗃️ Caché de Objetos Dedicado

La optimización de archivos pequeños de RustFS está específicamente dedicada a cachear objetos de archivos.
Si un objeto no se encuentra en el caché de objetos existente, recuperará automáticamente ese objeto, lo cacheará para solicitudes futuras y devolverá el objeto al llamador.

### 💾 Algoritmo de Hash Consistente

La optimización de archivos pequeños de RustFS prioriza el contenido.
Utiliza un algoritmo de hash consistente para distribuir datos de objetos cacheados a través de un cluster de nodos de caché (llamados peers). El hash consistente asegura que los objetos se puedan encontrar fácilmente basándose en la clave del objeto. Esto resulta en una relación uno-a-uno entre la clave del objeto y el nodo que guarda el objeto cacheado. También asegura que los nodos contengan la misma cantidad de datos, para que no haya una situación donde un nodo esté sobrecargado mientras otros estén inactivos. Sin embargo, más importante aún, distribuye objetos de tal manera que si se agregan o eliminan nodos, solo se requiere una reorganización mínima para alinear el sistema.

### 🧹 Gestión de Memoria de Caché Rotativo

RustFS utiliza caché rotativo para gestión de memoria. RustFS usa caché rotativo para mantener el tamaño total del caché dentro de los límites especificados en la configuración de optimización de archivos pequeños. Si agregar un nuevo objeto causaría que el tamaño del caché exceda el límite especificado, se eliminan uno o más objetos basándose en la marca de tiempo que indica cuándo se solicitó por última vez el objeto.

### 🔄 Actualización Automática de Versiones

Actualización automática de nuevas versiones de objetos. Si un objeto cacheado ha sido actualizado, el almacenamiento de objetos RustFS actualizará automáticamente el caché con la nueva versión del objeto.

### 🧩 Integración API Sin Fisuras

La optimización de archivos pequeños de RustFS es una extensión detrás de escena de RustFS. Dado que la optimización de archivos pequeños es una extensión de RustFS, los desarrolladores no necesitan aprender una nueva API. Los desarrolladores usan la misma API que antes. Si el objeto solicitado está en caché, RustFS lo obtendrá automáticamente desde el caché. Si un objeto debería estar cacheado y es la primera vez que se solicita, entonces RustFS lo obtendrá del almacenamiento de objetos, lo devolverá al llamador y lo colocará en caché para solicitudes posteriores.

