---
title: "Integración con Commvault"
description: "RustFS proporciona una integración perfecta con Commvault Complete Data Protection, ofreciendo soluciones de respaldo, recuperación y gestión de datos a escala empresarial."
---

# Integración con Commvault

RustFS proporciona una integración perfecta con Commvault Complete Data Protection, ofreciendo soluciones de respaldo, recuperación y gestión de datos a escala empresarial con un rendimiento y fiabilidad excepcionales.

## Descripción General

![Logo de Commvault](./images/commvault-logo.png)

RustFS con Commvault ofrece:

- **Protección de Datos Empresarial**: Respaldo y recuperación integral para todas las cargas de trabajo
- **Almacenamiento a Escala de Nube**: Backend de almacenamiento de objetos masivamente escalable
- **Gestión Avanzada de Datos**: Gestión inteligente del ciclo de vida de los datos
- **Plataforma Unificada**: Plataforma única para respaldo, archivo y análisis

## Ventajas Clave

### Operaciones Atómicas de Metadatos

![Metadatos Atómicos](./images/atomic-metadata.png)

#### Metadatos Consistentes

- **Transacciones ACID**: Operaciones atómicas, consistentes, aisladas y duraderas
- **Integridad de Metadatos**: Consistencia garantizada de metadatos
- **Recuperación Rápida**: Recuperación rápida con metadatos consistentes
- **Operaciones Concurrentes**: Alta concurrencia sin conflictos

### Rendimiento Rápido a Escala

![Rendimiento Rápido](./images/fast-performance.png)

#### Operaciones de Alto Rendimiento

- **Procesamiento Paralelo**: Respaldo y restauración masivamente paralelos
- **E/S Optimizada**: Optimizado para cargas de trabajo de protección de datos
- **Caché Inteligente**: Caché inteligente para datos accedidos frecuentemente
- **Escalado Lineal**: El rendimiento escala con el crecimiento del clúster

### Escalabilidad Sin Igual

![Escalabilidad](./images/scalability.png)

#### Escalado Elástico

- **Escala de Petabytes**: Escalar a petabytes de datos de respaldo
- **Escalado Horizontal**: Agregar nodos para capacidad y rendimiento
- **Auto-escalado**: Escalado automático basado en la demanda
- **Espacio de Nombres Global**: Espacio de nombres unificado en todos los nodos

### Arquitectura Simple y Segura

![Simple Seguro](./images/simple-secure.png)

#### Seguridad Empresarial

- **Cifrado de Extremo a Extremo**: Cifrado en reposo y en tránsito
- **Controles de Acceso**: Políticas de control de acceso granulares
- **Registro de Auditoría**: Pistas de auditoría integrales
- **Cumplimiento**: Cumplir requisitos de cumplimiento normativo

## Características de Integración con Commvault

### Integración de Almacenamiento

#### Configuración de Biblioteca de Disco

- **Biblioteca de Disco**: Configurar RustFS como biblioteca de disco de Commvault
- **Deduplicación**: Deduplicación global en todos los datos
- **Compresión**: Algoritmos de compresión avanzados
- **Cifrado**: Cifrado acelerado por hardware

#### Integración de Almacenamiento en la Nube

- **Biblioteca en la Nube**: Usar RustFS como biblioteca de almacenamiento en la nube
- **Compatibilidad S3**: Compatibilidad completa con la API de Amazon S3
- **Despliegue Híbrido**: Despliegue híbrido en la nube sin problemas
- **Optimización de Costos**: Organización inteligente del almacenamiento en niveles

### Capacidades de Protección de Datos

#### Respaldo y Recuperación

- **Consciente de Aplicaciones**: Respaldos consistentes con aplicaciones
- **Recuperación Granular**: Recuperación a nivel de archivo, carpeta y aplicación
- **Recuperación Instantánea**: Recuperación rápida con RTO mínimo
- **Multiplataforma**: Soporte para todas las plataformas principales

#### Archivo y Cumplimiento

- **Archivo Inteligente**: Archivo de datos basado en políticas
- **Retención Legal**: Retención legal y soporte para litigios
- **Gestión de Retención**: Políticas de retención flexibles
- **Informes de Cumplimiento**: Informes de cumplimiento automatizados

## Arquitecturas de Despliegue

### Protección de Datos en las Instalaciones

```
┌─────────────────┐    ┌─────────────────┐
│   Entorno de    │    │   CommServe     │
│   Producción    │───►│   + MediaAgent  │
│                 │    │                 │
│ • Servidores    │    │ ┌─────────────┐ │
│ • Bases de Datos│    │ │   RustFS    │ │
│ • Aplicaciones  │    │ │   Biblioteca│ │
│ • VMs           │    │ │   Almacenaje│ │
└─────────────────┘    │ └─────────────┘ │
                       └─────────────────┘
```

### Arquitectura de Nube Híbrida

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Producción    │    │   Respaldo      │    │   Archivo       │
│   en Instalac. │───►│   Primario      │───►│   en la Nube    │
│                 │    │   (RustFS)      │    │   (RustFS)      │
│ • Datos Primar. │    │                 │    │                 │
│ • Aplicaciones  │    │ • Recuper. Ráp. │    │ • Largo Plazo   │
│ • Bases de Datos│    │ • Deduplicación │    │ • Cumplimiento  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Protección de Datos Multi-sitio

```
┌─────────────────┐    ┌─────────────────┐
│   DC Primario   │    │   Sitio DR      │
│                 │◄──►│                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Producción  │ │    │ │ Sistemas DR │ │
│ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   RustFS    │ │    │ │   RustFS    │ │
│ │   Primario  │ │    │ │   Réplica   │ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
```

## Configuración e Instalación

### Configuración de Commvault

#### Configuración de Biblioteca de Disco

```bash
# Configurar RustFS como biblioteca de disco
# Vía Commvault Command Center
1. Almacenamiento → Disco → Crear Biblioteca de Disco
2. Nombre de Biblioteca: RustFS-Library
3. MediaAgent: Seleccionar MediaAgent apropiado
4. Ruta de Montaje: /mnt/rustfs
5. Habilitar Deduplicación: Sí
6. Cifrado: Habilitar
```

#### Configuración de Biblioteca en la Nube

```bash
# Configurar RustFS como biblioteca en la nube
1. Almacenamiento → Nube → Crear Biblioteca en la Nube
2. Almacenamiento en la Nube: S3 Genérico
3. Host del Servicio: rustfs.example.com
4. Clave de Acceso: tu-clave-de-acceso
5. Clave Secreta: tu-clave-secreta
6. Contenedor: commvault-backups
```

### Configuración de Política de Almacenamiento

#### Políticas de Almacenamiento de Respaldo

- **Copia Primaria**: Almacenamiento de alto rendimiento para respaldos recientes
- **Copia Secundaria**: Almacenamiento optimizado en costos para respaldos antiguos
- **Copia de Archivo**: Retención a largo plazo y cumplimiento
- **Copia Auxiliar**: Recuperación ante desastres y replicación

#### Políticas de Envejecimiento de Datos

- **Reglas de Retención**: Definir períodos de retención para diferentes tipos de datos
- **Políticas de Envejecimiento**: Movimiento automático entre niveles de almacenamiento
- **Purga**: Eliminación automática de datos vencidos
- **Cumplimiento**: Cumplir requisitos normativos de retención

## Protección de Cargas de Trabajo

### Protección de Máquinas Virtuales

#### VMware vSphere

- **Integración con vCenter**: Integración nativa con vCenter
- **Seguimiento de Bloques Cambiados**: Optimización de respaldo incremental
- **Consistencia de Aplicaciones**: Respaldos conscientes de VSS
- **Recuperación Instantánea**: Recuperación rápida de VMs y failover

#### Microsoft Hyper-V

- **Integración con SCVMM**: Integración con System Center
- **VSS de Hyper-V**: Servicio de Copia de Sombra de Volumen
- **Migración en Vivo**: Respaldo durante migración en vivo
- **Soporte de Clúster**: Soporte para clúster de failover

### Protección de Bases de Datos

#### Microsoft SQL Server

- **SQL VSS Writer**: Respaldos consistentes con aplicaciones
- **Envío de Logs**: Respaldo y envío de logs de transacciones
- **Always On**: Soporte para Grupos de Disponibilidad Always On
- **Recuperación Granular**: Recuperación a nivel de base de datos, tabla y fila

#### Base de Datos Oracle

- **Integración con RMAN**: Integración con Oracle Recovery Manager
- **Data Guard**: Soporte para Oracle Data Guard
- **Soporte RAC**: Soporte para Real Application Clusters
- **Recuperación Point-in-Time**: Recuperación granular point-in-time

#### Otras Bases de Datos

- **MySQL**: Protección de base de datos MySQL
- **PostgreSQL**: Respaldo y recuperación de PostgreSQL
- **MongoDB**: Protección de base de datos NoSQL
- **SAP HANA**: Respaldo de base de datos SAP HANA

### Protección de Sistemas de Archivos

#### Sistemas de Archivos Windows

- **NTFS**: Sistema de archivos NTFS de Windows
- **Protección de Recursos Compartidos**: Respaldo de recursos compartidos de red
- **Integración con VSS**: Servicio de Copia de Sombra de Volumen
- **Respaldo de Archivos Abiertos**: Respaldo de archivos abiertos y bloqueados

#### Sistemas de Archivos Unix/Linux

- **ext4/XFS**: Soporte para sistemas de archivos Linux
- **NFS**: Respaldo de Network File System
- **Integración con Snapshots**: Snapshots de LVM y sistemas de archivos
- **Enlaces Simbólicos**: Preservar enlaces simbólicos y permisos

### Protección de Aplicaciones

#### Microsoft Exchange

- **VSS de Exchange**: Respaldos conscientes de Exchange
- **Recuperación de Buzón**: Recuperación de buzones individuales
- **Recuperación de Base de Datos**: Recuperación de base de datos de Exchange
- **Carpeta Pública**: Respaldo y recuperación de carpetas públicas

#### Microsoft SharePoint

- **VSS de SharePoint**: Respaldos conscientes de SharePoint
- **Colección de Sitios**: Respaldo y recuperación de colecciones de sitios
- **Base de Datos de Contenido**: Protección de base de datos de contenido
- **Índice de Búsqueda**: Respaldo y recuperación de índice de búsqueda

#### Aplicaciones Empresariales

- **SAP**: Respaldo de aplicaciones SAP
- **Lotus Notes**: IBM Lotus Notes/Domino
- **Active Directory**: Respaldo de Active Directory
- **Recursos Compartidos de Archivos**: Protección de recursos compartidos de red

## Gestión de Datos y Análisis

### Indexación de Contenido

#### Búsqueda y Descubrimiento

- **Búsqueda de Texto Completo**: Búsqueda en todos los datos de respaldo
- **Indexación de Metadatos**: Indexar metadatos de archivos y aplicaciones
- **Análisis de Contenido**: Analizar patrones y tendencias de datos
- **eDiscovery**: Descubrimiento legal y cumplimiento

#### Clasificación de Datos

- **Clasificación Automática**: Clasificación de datos impulsada por IA
- **Basado en Políticas**: Políticas de clasificación basadas en reglas
- **Datos Sensibles**: Identificar y proteger datos sensibles
- **Cumplimiento**: Cumplir requisitos de gobernanza de datos

### Gestión del Ciclo de Vida de Datos

#### Movimiento Inteligente de Datos

- **Organización Basada en Políticas**: Movimiento automático de datos entre niveles
- **Optimización de Costos**: Optimizar costos de almacenamiento
- **Optimización de Rendimiento**: Equilibrar rendimiento y costo
- **Cumplimiento**: Cumplir requisitos de retención y cumplimiento

#### Archivo y Retención

- **Archivo Automatizado**: Archivo de datos basado en políticas
- **Retención Legal**: Retención legal y soporte para litigios
- **Políticas de Retención**: Gestión flexible de retención
- **Disposición**: Eliminación segura de datos

## Seguridad y Cumplimiento

### Seguridad de Datos

#### Cifrado

- **Cifrado AES-256**: Cifrado fuerte para datos en reposo
- **Cifrado en Tránsito**: Cifrado TLS para transferencia de datos
- **Gestión de Claves**: Gestión centralizada de claves de cifrado
- **Seguridad de Hardware**: Soporte para módulo de seguridad de hardware

#### Control de Acceso

- **Acceso Basado en Roles**: Control de acceso basado en roles (RBAC)
- **Autenticación Multifactor**: Autenticación mejorada
- **Integración LDAP/AD**: Integración con directorio empresarial
- **Registro de Auditoría**: Registro completo de acceso

### Características de Cumplimiento

#### Cumplimiento Normativo

- **GDPR**: Reglamento General de Protección de Datos
- **HIPAA**: Ley de Portabilidad de Seguros Médicos
- **SOX**: Ley Sarbanes-Oxley
- **SEC**: Reglas de la Comisión de Valores y Bolsa

#### Gobernanza de Datos

- **Retención de Datos**: Políticas de retención automatizadas
- **Retención Legal**: Retención legal y preservación
- **Informes de Auditoría**: Informes de auditoría automatizados
- **Cadena de Custodia**: Mantener cadena de custodia de datos

## Monitoreo y Gestión

### Commvault Command Center

#### Gestión Centralizada

- **Consola Única**: Interfaz de gestión unificada
- **Multi-inquilino**: Soporte para múltiples organizaciones
- **Panel de Control**: Estado en tiempo real y análisis
- **Informes**: Informes y análisis integrales

#### Monitoreo de Trabajos

- **Estado en Tiempo Real**: Monitoreo de estado de trabajos en tiempo real
- **Métricas de Rendimiento**: Rendimiento de respaldo y restauración
- **Planificación de Capacidad**: Planificación de capacidad de almacenamiento
- **Alertas**: Alertas proactivas y notificaciones

### Integración y Automatización

#### API REST

- **Acceso Programático**: API RESTful para automatización
- **Integración con Terceros**: Integración con sistemas externos
- **Aplicaciones Personalizadas**: Construir aplicaciones personalizadas
- **Automatización de Flujos de Trabajo**: Automatizar flujos de trabajo operacionales

#### Integración con PowerShell

- **Cmdlets de PowerShell**: Soporte nativo de PowerShell
- **Scripting**: Automatizar tareas rutinarias
- **Operaciones en Lote**: Realizar operaciones en lote
- **Scripts Personalizados**: Crear scripts de automatización personalizados

## Mejores Prácticas

### Mejores Prácticas de Despliegue

1. **Dimensionamiento**: Dimensionamiento apropiado para cargas de trabajo de respaldo
2. **Red**: Optimizar configuración de red
3. **Almacenamiento**: Configurar políticas de almacenamiento apropiadas
4. **Seguridad**: Implementar mejores prácticas de seguridad

### Optimización de Rendimiento

1. **Operaciones Concurrentes**: Optimizar configuraciones de trabajos concurrentes
2. **Deduplicación**: Configurar deduplicación global
3. **Compresión**: Equilibrar compresión y rendimiento
4. **Red**: Optimizar uso de ancho de banda de red

### Gestión de Datos

1. **Políticas de Almacenamiento**: Diseñar políticas de almacenamiento efectivas
2. **Retención**: Implementar políticas de retención apropiadas
3. **Archivo**: Usar políticas de archivo inteligentes
4. **Monitoreo**: Monitoreo y optimización continuos

## Solución de Problemas

### Problemas Comunes

#### Problemas de Rendimiento

- **Respaldos Lentos**: Verificar rendimiento de red y almacenamiento
- **Alto Uso de CPU**: Monitorear uso de recursos del MediaAgent
- **Problemas de Memoria**: Optimizar asignación de memoria
- **Espacio en Disco**: Monitorear espacio disponible en disco

#### Problemas de Conectividad

- **Conectividad de Red**: Verificar conectividad de red
- **Reglas de Firewall**: Verificar configuración de firewall
- **Resolución DNS**: Verificar resolución DNS
- **Estado del Servicio**: Verificar estado del servicio Commvault

#### Problemas de Configuración

- **Configuración de Biblioteca**: Verificar configuraciones de biblioteca
- **Política de Almacenamiento**: Verificar configuración de política de almacenamiento
- **Credenciales**: Verificar credenciales de acceso
- **Permisos**: Verificar permisos del sistema de archivos

## Comenzando

### Prerrequisitos

1. **Entorno Commvault**: Commvault Complete Data Protection v11.20+
2. **Clúster RustFS**: Clúster RustFS configurado apropiadamente
3. **Conectividad de Red**: Conectividad de red entre Commvault y RustFS
4. **MediaAgent**: MediaAgent de Commvault con recursos suficientes

### Guía de Inicio Rápido

1. **Instalar MediaAgent**: Instalar y configurar MediaAgent de Commvault
2. **Configurar Biblioteca**: Agregar RustFS como biblioteca de disco o nube
3. **Crear Política de Almacenamiento**: Crear política de almacenamiento usando biblioteca RustFS
4. **Configurar Subclient**: Crear subclient para protección de datos
5. **Ejecutar Respaldo**: Ejecutar trabajo de respaldo inicial
6. **Probar Recuperación**: Probar procedimientos de recuperación de respaldo

### Próximos Pasos

- **Optimizar Rendimiento**: Ajustar configuraciones de respaldo para rendimiento óptimo
- **Implementar Seguridad**: Configurar cifrado y controles de acceso
- **Configurar Monitoreo**: Implementar monitoreo integral
- **Planificar Recuperación ante Desastres**: Desarrollar procedimientos de recuperación ante desastres
- **Entrenar Personal**: Entrenar personal en procedimientos de respaldo y recuperación