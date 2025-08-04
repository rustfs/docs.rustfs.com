---
title: "RustFS MCP"
description: "RustFS MCP Nutzungshandbuch"
---

# RustFS MCP

**Der RustFS MCP Server** ist ein hochperformanter [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.org) Server, der AI/LLM-Tools nahtlosen Zugriff auf S3-kompatible Objektspeicher-Operationen bietet. Dieser Server ist mit Rust für maximale Performance und Sicherheit entwickelt und ermöglicht es AI-Assistenten wie Claude Desktop, über standardisierte Protokolle mit Cloud-Speicher zu interagieren.

### Was ist MCP?

Das Model Context Protocol ist ein offener Standard, der es AI-Anwendungen ermöglicht, sichere und kontrollierte Verbindungen zu externen Systemen herzustellen. Dieser Server fungiert als Brücke zwischen AI-Tools und S3-kompatiblen Speicherdiensten und bietet strukturierten Zugriff auf Dateioperationen bei gleichzeitiger Wahrung von Sicherheit und Beobachtbarkeit.

## ✨ Funktionen

### Unterstützte S3-Operationen

- **Buckets auflisten**: Alle zugänglichen S3-Buckets auflisten
- **Objekte auflisten**: Bucket-Inhalte mit optionaler Präfix-Filterung durchsuchen
- **Dateien hochladen**: Lokale Dateien hochladen mit automatischer MIME-Typ-Erkennung und Cache-Kontrolle
- **Objekte abrufen**: Objekte aus S3-Speicher abrufen mit Unterstützung für Lese- oder Download-Modi

## 🔧 Installation

### Voraussetzungen

- Rust 1.88+ (für das Erstellen aus Quellcode)
- Konfigurierte AWS-Anmeldeinformationen (über Umgebungsvariablen, AWS CLI oder IAM-Rollen)
- Zugriff auf S3-kompatible Speicherdienste

### Aus Quellcode erstellen

```bash
# Repository klonen
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP-Server erstellen
cargo build --release -p rustfs-mcp

# Binärdatei ist verfügbar unter
./target/release/rustfs-mcp
```

## ⚙️ Konfiguration

### Umgebungsvariablen

```bash
# AWS-Anmeldeinformationen (erforderlich)
export AWS_ACCESS_KEY_ID=ihr_zugangsschlüssel
export AWS_SECRET_ACCESS_KEY=ihr_geheimer_schlüssel
export AWS_REGION=us-east-1  # Optional, Standard ist us-east-1

# Optional: Benutzerdefinierter S3-Endpunkt (für MinIO usw.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Log-Level (optional)
export RUST_LOG=info
```

### Kommandozeilenoptionen

```bash
rustfs-mcp --help
```

Der Server unterstützt verschiedene Kommandozeilenoptionen zur Anpassung des Verhaltens:

- `--access-key-id`: AWS-Zugangsschlüssel-ID für S3-Authentifizierung
- `--secret-access-key`: AWS-Geheimschlüssel für S3-Authentifizierung
- `--region`: AWS-Region für S3-Operationen (Standard: us-east-1)
- `--endpoint-url`: Benutzerdefinierte S3-Endpunkt-URL (für MinIO, LocalStack usw.)
- `--log-level`: Log-Level-Konfiguration (Standard: rustfs_mcp_server=info)

-----

## 🚀 Verwendung

### Server starten

```bash
# MCP-Server starten
rustfs-mcp

# Oder mit benutzerdefinierten Optionen
rustfs-mcp --log-level debug --region us-west-2
```

### Integration mit Chat-Clients

#### Option 1: Kommandozeilenargumente verwenden

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "ihr_zugangsschlüssel",
        "--secret-access-key", "ihr_geheimer_schlüssel",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Option 2: Umgebungsvariablen verwenden

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "ihr_zugangsschlüssel",
        "AWS_SECRET_ACCESS_KEY": "ihr_geheimer_schlüssel",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ Verfügbare Tools

Der MCP-Server stellt die folgenden Tools zur Verfügung, die AI-Assistenten verwenden können:

### `list_buckets`

Alle S3-Buckets auflisten, die mit den konfigurierten Anmeldeinformationen zugänglich sind.

**Parameter**: Keine

### `list_objects`

Objekte in einem S3-Bucket auflisten mit Unterstützung für optionale Präfix-Filterung.

**Parameter**:
- `bucket_name` (String): Name des S3-Buckets
- `prefix` (String, optional): Präfix zum Filtern von Objekten

### `upload_file`

Lokale Datei zu S3 hochladen mit automatischer MIME-Typ-Erkennung.

**Parameter**:
- `local_file_path` (String): Lokaler Dateipfad
- `bucket_name` (String): Ziel-S3-Bucket
- `object_key` (String): S3-Objektschlüssel (Zielpfad)
- `content_type` (String, optional): Inhaltstyp (automatisch erkannt wenn nicht angegeben)
- `storage_class` (String, optional): S3-Speicherklasse
- `cache_control` (String, optional): Cache-Control-Header

### `get_object`

Objekt aus S3 abrufen mit zwei Betriebsmodi: direktes Lesen des Inhalts oder Download in eine Datei.

**Parameter**:
- `bucket_name` (String): Quell-S3-Bucket
- `object_key` (String): S3-Objektschlüssel
- `version_id` (String, optional): Versions-ID für versionierte Objekte
- `mode` (String, optional): Betriebsmodus - "read" (Standard) gibt Inhalt direkt zurück, "download" speichert in lokale Datei
- `local_path` (String, optional): Lokaler Dateipfad (erforderlich wenn Modus "download" ist)
- `max_content_size` (Zahl, optional): Maximale Inhaltsgröße für Lesemodus (Bytes) (Standard: 1MB)

## Architektur

Der MCP-Server ist mit einer modularen Architektur aufgebaut:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # Einstiegspunkt, CLI-Parsing und Server-Initialisierung
│   ├── server.rs        # MCP-Server-Implementierung und Tool-Handler
│   ├── s3_client.rs     # S3-Client-Wrapper mit asynchronen Operationen
│   ├── config.rs        # Konfigurationsverwaltung und CLI-Optionen
│   └── lib.rs           # Bibliotheksexporte und öffentliche API
└── Cargo.toml           # Abhängigkeiten, Metadaten und Binärkonfiguration
```

