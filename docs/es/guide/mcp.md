---
title: "RustFS MCP"
description: "Guía de uso de RustFS MCP"
---

# RustFS MCP

**El servidor RustFS MCP** es un servidor de alto rendimiento del [Protocolo de Contexto de Modelo (MCP)](https://spec.modelcontextprotocol.org) que proporciona a las herramientas de IA/LLM acceso sin problemas a operaciones de almacenamiento de objetos compatibles con S3. Este servidor está construido con Rust para máximo rendimiento y seguridad, permitiendo que asistentes de IA como Claude Desktop interactúen con almacenamiento en la nube a través de un protocolo estandarizado.

### ¿Qué es MCP?

El Protocolo de Contexto de Modelo es un estándar abierto que permite a las aplicaciones de IA establecer conexiones seguras y controladas con sistemas externos. Este servidor actúa como un puente entre herramientas de IA y servicios de almacenamiento compatibles con S3, proporcionando acceso estructurado a operaciones de archivos mientras mantiene seguridad y observabilidad.

## ✨ Características

### Operaciones S3 soportadas

- **Listar buckets**: Listar todos los buckets S3 accesibles
- **Listar objetos**: Navegar contenido de buckets con filtrado por prefijo opcional
- **Subir archivos**: Subir archivos locales con detección automática de tipo MIME y control de caché
- **Obtener objetos**: Recuperar objetos del almacenamiento S3, soporte para modos de lectura o descarga

## 🔧 Instalación

### Prerrequisitos

- Rust 1.88+ (para construir desde fuentes)
- Credenciales de AWS configuradas (vía variables de entorno, AWS CLI o roles IAM)
- Acceso a servicios de almacenamiento compatibles con S3

### Construir desde fuentes

```bash
# Clonar el repositorio
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Construir el servidor MCP
cargo build --release -p rustfs-mcp

# El binario estará disponible en
./target/release/rustfs-mcp
```

## ⚙️ Configuración

### Variables de entorno

```bash
# Credenciales de AWS (requeridas)
export AWS_ACCESS_KEY_ID=su_clave_de_acceso
export AWS_SECRET_ACCESS_KEY=su_clave_secreta
export AWS_REGION=us-east-1  # Opcional, por defecto us-east-1

# Opcional: Endpoint S3 personalizado (para MinIO, etc.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Nivel de log (opcional)
export RUST_LOG=info
```

### Opciones de línea de comandos

```bash
rustfs-mcp --help
```

El servidor soporta varias opciones de línea de comandos para personalizar el comportamiento:

- `--access-key-id`: ID de clave de acceso AWS para autenticación S3
- `--secret-access-key`: Clave secreta AWS para autenticación S3
- `--region`: Región AWS a usar para operaciones S3 (por defecto: us-east-1)
- `--endpoint-url`: URL de endpoint S3 personalizada (para MinIO, LocalStack, etc.)
- `--log-level`: Configuración de nivel de log (por defecto: rustfs_mcp_server=info)

-----

## 🚀 Uso

### Iniciar el servidor

```bash
# Iniciar el servidor MCP
rustfs-mcp

# O con opciones personalizadas
rustfs-mcp --log-level debug --region us-west-2
```

### Integración con clientes de chat

#### Opción 1: Usar argumentos de línea de comandos

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "su_clave_de_acceso",
        "--secret-access-key", "su_clave_secreta",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Opción 2: Usar variables de entorno

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "su_clave_de_acceso",
        "AWS_SECRET_ACCESS_KEY": "su_clave_secreta",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ Herramientas disponibles

El servidor MCP expone las siguientes herramientas que los asistentes de IA pueden usar:

### `list_buckets`

Listar todos los buckets S3 accesibles con las credenciales configuradas.

**Parámetros**: Ninguno

### `list_objects`

Listar objetos en un bucket S3, con soporte para filtrado por prefijo opcional.

**Parámetros**:
- `bucket_name` (cadena): Nombre del bucket S3
- `prefix` (cadena, opcional): Prefijo para filtrar objetos

### `upload_file`

Subir un archivo local a S3 con detección automática de tipo MIME.

**Parámetros**:
- `local_file_path` (cadena): Ruta del archivo local
- `bucket_name` (cadena): Bucket S3 de destino
- `object_key` (cadena): Clave de objeto S3 (ruta de destino)
- `content_type` (cadena, opcional): Tipo de contenido (detectado automáticamente si no se proporciona)
- `storage_class` (cadena, opcional): Clase de almacenamiento S3
- `cache_control` (cadena, opcional): Header de control de caché

### `get_object`

Recuperar un objeto desde S3, con dos modos de operación: lectura directa de contenido o descarga a archivo.

**Parámetros**:
- `bucket_name` (cadena): Bucket S3 fuente
- `object_key` (cadena): Clave de objeto S3
- `version_id` (cadena, opcional): ID de versión para objetos versionados
- `mode` (cadena, opcional): Modo de operación - "read" (por defecto) devuelve contenido directamente, "download" guarda en archivo local
- `local_path` (cadena, opcional): Ruta de archivo local (requerida cuando el modo es "download")
- `max_content_size` (número, opcional): Tamaño máximo de contenido para modo lectura (bytes) (por defecto: 1MB)

## Arquitectura

El servidor MCP está construido con una arquitectura modular:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # Punto de entrada, análisis CLI e inicialización del servidor
│   ├── server.rs        # Implementación del servidor MCP y manejadores de herramientas
│   ├── s3_client.rs     # Wrapper de cliente S3 con operaciones asíncronas
│   ├── config.rs        # Gestión de configuración y opciones CLI
│   └── lib.rs           # Exportaciones de biblioteca y API pública
└── Cargo.toml           # Dependencias, metadatos y configuración binaria
```

