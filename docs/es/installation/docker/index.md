---
title: "Instalación Docker de RustFS"
description: "Despliegue Docker de RustFS."
---

# Instalación Docker de RustFS

RustFS es un sistema de almacenamiento de objetos distribuido de código abierto de alto rendimiento, 100% compatible con S3. En el modo de despliegue de nodo único disco único (SNSD), el backend adopta codificación de borrado cero, no proporciona redundancia de datos adicional, adecuado para pruebas locales y escenarios de pequeña escala.
Este artículo se basa en el paquete binario oficial de RustFS para Linux, a través de un Dockerfile personalizado, empaqueta RustFS y su entorno de ejecución en contenedores, y configura volúmenes de datos y variables de entorno, permitiendo iniciar el servicio con un clic.

---

## I. Preparación previa

1. **Requisitos del host**

 * Docker (≥ 20.10) instalado y capaz de extraer imágenes y ejecutar contenedores normalmente
 * Ruta local `/mnt/rustfs/data` (o ruta personalizada) para montar datos de objetos
2. **Red y firewall**

 * Asegúrese de que el puerto 9000 del host esté abierto hacia el exterior (o consistente con puerto personalizado)
3. **Preparación del archivo de configuración**

 * En el host `/etc/rustfs/config.toml`, defina puerto de escucha, cuenta de administrador, ruta de datos, etc. (ver sección 4)

---

## II. Extraer rápidamente la imagen oficial de RustFS

Use la imagen base oficial de Ubuntu para extraer rápidamente la imagen oficial de RustFS:


```bash
docker pull rustfs/rustfs

```


---

## III. Ejecutar contenedor RustFS

Método de ejecución Docker SNSD de RustFS, combinado con la imagen y configuración anteriores, ejecutar:

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Explicación de parámetros:

* `-p 9000:9000`: Mapear puerto 9000 del host al contenedor
* `-v /mnt/rustfs/data:/data`: Montar volumen de datos
* `--name rustfs_local`: Nombre personalizado del contenedor
* `-d`: Ejecución en segundo plano

---

### Ejemplo de configuración de parámetros completos

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Explicación de parámetros y métodos correspondientes

1. **Método de variables de entorno** (recomendado):
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Método de parámetros de línea de comandos**:
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Parámetros requeridos**:
    - `<VOLUMES>`: Especificar al final del comando, como `/data`

### Combinaciones de configuración comunes

1. **Configuración básica**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Habilitar consola**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **Claves de autenticación personalizadas**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Notas

1. El mapeo de puertos debe corresponder:
    - Puerto de servicio por defecto 9000 (`-p 9000:9000`)

2. El volumen de datos debe ser persistente:
    - `-v /host/path:/container/path`

3. Las variables de entorno y parámetros de línea de comandos pueden usarse de forma mixta, pero los parámetros de línea de comandos tienen mayor prioridad

4. Si se [usa TLS](../../integration/tls-configured.md), es necesario montar adicionalmente la ruta del certificado:

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## IV. Verificación y acceso

1. **Ver estado del contenedor y registros:**

 ```bash
 docker logs rustfs_local
 ```

 Los registros deberían mostrar inicio exitoso del servicio y monitoreo del puerto 9000.

2. **Probar API S3:**

 Use `mc` u otros clientes S3:

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 Si el bucket puede crearse y listarse exitosamente, entonces el despliegue es efectivo.


## V. Otras sugerencias

1. Recomendaciones para entorno de producción:
- Usar arquitectura de despliegue multi-nodo
- [Habilitar comunicación cifrada TLS](../../integration/tls-configured.md)
- Configurar estrategia de rotación de registros
- Establecer estrategia de respaldo regular

2. Recomendaciones de almacenamiento:
- Usar almacenamiento SSD/NVMe local
- Evitar usar sistema de archivos de red (NFS)
- Garantizar acceso exclusivo al directorio de almacenamiento

---

## Resumen

Este artículo combina las mejores prácticas de conteneurización de RustFS nodo único disco único y demuestra detalladamente cómo construir imágenes RustFS a través de Docker y desplegar entorno SNSD.
Esta solución es fácil para inicio rápido y experimentación, posteriormente puede extenderse en plataformas como Kubernetes, Swarm con el mismo enfoque hacia clusters de producción multi-nodo multi-disco.

