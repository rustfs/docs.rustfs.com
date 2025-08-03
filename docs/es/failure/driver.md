---
title: "Fallo del disco duro"
description: "RustFS garantiza el acceso de lectura y escritura cuando fallan discos parciales a través de un mecanismo similar al código de borrado, y cura automáticamente los datos después del reemplazo del disco."
---

# Fallo del disco duro

RustFS garantiza el acceso de lectura y escritura cuando fallan discos parciales a través de un mecanismo similar al código de borrado, y cura automáticamente los datos después del reemplazo del disco.

---

### Índice

1. [Desmontar disco defectuoso](#1-desmontar-disco-defectuoso)
2. [Reemplazar disco defectuoso](#2-reemplazar-disco-defectuoso)
3. [Actualizar `/etc/fstab` o configuración RustFS](#3-actualizar-etcfstab-o-configuración-rustfs)
4. [Remontar nuevo disco](#4-remontar-nuevo-disco)
5. [Activar y monitorear curación de datos](#5-activar-y-monitorear-curación-de-datos)
6. [Verificaciones posteriores y notas](#6-verificaciones-posteriores-y-notas)

---

### 1) Desmontar disco defectuoso

Antes de reemplazar físicamente el disco duro, primero debe desmontarse de forma segura el disco defectuoso a nivel del sistema operativo para evitar errores de E/S en el sistema de archivos o RustFS durante el proceso de reemplazo.

```bash
# Supongamos que el disco defectuoso es /dev/sdb
umount /dev/sdb
```

> **Explicación**
>
> * Si hay múltiples puntos de montaje, ejecute `umount` para cada uno.
> * En caso de error "dispositivo ocupado", primero detenga el servicio RustFS:
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Reemplazar disco defectuoso

Después de reemplazar físicamente el disco defectuoso, el nuevo disco debe ser particionado y formateado, con la misma etiqueta que el disco original.

```bash
# Formatear como ext4 y etiquetar como DISK1 (debe coincidir con la etiqueta original)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Requisitos**
>
> * Capacidad del nuevo disco ≥ capacidad del disco original
> * Tipo de sistema de archivos consistente con otros discos
> * Se recomienda usar etiqueta (LABEL) o UUID para montaje, para que el orden de los discos no se vea afectado por el reinicio del sistema

---

### 3) Actualizar `/etc/fstab` o configuración RustFS

Confirme que las etiquetas o UUID de las entradas de montaje en `/etc/fstab` apunten al nuevo disco. Si usa un archivo de configuración específico de RustFS (como `config.yaml`), también necesita actualizar sincronizadamente las entradas correspondientes.

```bash
# Verificar fstab actual
cat /etc/fstab

# Ejemplo de entrada fstab (no necesita modificación si la etiqueta es la misma)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Consejo**
>
> * Si usa UUID:
>
> ```bash
> blkid /dev/sdb
> # Obtener UUID de la nueva partición, luego reemplazar el campo correspondiente en fstab
> ```
> * Después de modificar fstab, verifique imperativamente la sintaxis:
>
> ```bash
> mount -a # Si no hay errores, la configuración es correcta
> ```

---

### 4) Remontar nuevo disco

Ejecute los siguientes comandos para montar todos los discos en lote e iniciar el servicio RustFS:

```bash
mount -a
systemctl start rustfs
```

Confirme que todos los discos están montados normalmente:

```bash
df -h | grep /mnt/disk
```

> **Atención**
>
> * Si algunos montajes fallan, verifique que las entradas fstab coincidan con las etiquetas/UUID de los discos.

---

### 5) Activar y monitorear curación de datos

Después de detectar el nuevo disco, RustFS activará automática o manualmente el proceso de curación (heal) de datos. Aquí hay un ejemplo usando la herramienta hipotética `rustfs-admin`:

```bash
# Verificar estado actual de discos
rustfs-admin disk status

# Activar manualmente la curación del nuevo disco
rustfs-admin heal --disk /mnt/disk1

# Seguir en tiempo real el progreso de curación
rustfs-admin heal status --follow
```

Simultáneamente, puede verificar los logs del servicio para confirmar que el sistema ha reconocido e iniciado la recuperación de datos:

```bash
# Para instalación gestionada por systemd
journalctl -u rustfs -f

# O verificar archivo de log dedicado
tail -f /var/log/rustfs/heal.log
```

> **Explicación**
>
> * El proceso de curación se completa en segundo plano, normalmente con impacto mínimo en el acceso en línea
> * Después de completar la curación, la herramienta reportará éxito o listará objetos fallidos

---

### 6) Verificaciones posteriores y notas

1. **Monitoreo de rendimiento**

   * Durante la curación, E/S puede fluctuar ligeramente, se recomienda monitorear la carga de disco y red.

2. **Fallos en lote**

   * Si ocurren múltiples fallos en discos del mismo lote, considere inspecciones de hardware más frecuentes.

3. **Ejercicios regulares**

   * Realice regularmente ejercicios simulando fallos de disco para asegurar que el equipo esté familiarizado con el proceso de recuperación.

4. **Ventana de mantenimiento**

   * En períodos de alta tasa de fallos, programe una ventana de mantenimiento dedicada para acelerar el reemplazo y curación.

