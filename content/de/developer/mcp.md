---
title: "RustFS MCP"
description: "Verbinden Sie KI-Assistenten über den RustFS-MCP-Server mit dem RustFS-Objektspeicher."
---

Der **RustFS MCP Server** ist ein [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol)-Server, der KI-Assistenten wie Claude Desktop Zugriff auf S3-kompatiblen Objektspeicher gibt.

### Was ist MCP?

Das Model Context Protocol ist ein offener Standard, mit dem KI-Anwendungen sichere, kontrollierte Verbindungen zu externen Systemen aufbauen. Dieser Server verbindet KI-Werkzeuge mit S3-kompatiblen Speicherdiensten. Er bietet strukturierten Zugriff auf Objektoperationen und wahrt dabei Sicherheit und Observability.

## Funktionen

### Unterstützte S3-Operationen

- **Buckets auflisten**: Listet alle zugänglichen S3-Buckets auf.
- **Objekte auflisten**: Durchsucht den Inhalt eines Buckets, optional mit Präfixfilter.
- **Dateien hochladen**: Lädt lokale Dateien hoch, erkennt den MIME-Typ automatisch und setzt Cache-Control.
- **Objekte abrufen**: Ruft Objekte aus dem S3-Speicher ab und unterstützt die Modi Lesen und Herunterladen.

## Installation

:::warning[Anweisungen zum Bauen können veraltet sein]

Das Crate `rustfs-mcp` gehört nicht mehr zum aktuellen `main`-Branch von `rustfs/rustfs`. Die folgenden Build-Befehle können daher bei einem frisch geklonten Repository fehlschlagen. Prüfen Sie vor dem Bauen aus dem Quellcode in der [RustFS-Organisation auf GitHub](https://github.com/rustfs), wo der MCP-Server derzeit liegt.

:::

### Voraussetzungen

- Rust 1.75 oder höher (zum Bauen aus dem Quellcode)
- Konfigurierte AWS-Zugangsdaten (über Umgebungsvariablen, die AWS CLI oder IAM-Rollen)
- Zugriff auf S3-kompatible Speicherdienste

### Aus dem Quellcode bauen

```bash
# Clone the repository
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Build the MCP server
cargo build --release -p rustfs-mcp

# Binary will be available at
./target/release/rustfs-mcp
```

## Konfiguration

### Umgebungsvariablen

```bash
# AWS credentials (required)
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1  # optional, defaults to us-east-1

# Optional: Custom S3 endpoint (for MinIO, etc.)
export AWS_ENDPOINT_URL=http://localhost:9000

# Log level (optional)
export RUST_LOG=info
```

### Befehlszeilenoptionen

```bash
rustfs-mcp --help
```

Der Server unterstützt mehrere Befehlszeilenoptionen, mit denen Sie das Verhalten anpassen:

- `--access-key-id`: AWS-Zugriffsschlüssel-ID für die S3-Authentifizierung
- `--secret-access-key`: geheimer AWS-Zugriffsschlüssel für die S3-Authentifizierung
- `--region`: AWS-Region für S3-Operationen (Standard: us-east-1)
- `--endpoint-url`: benutzerdefinierte S3-Endpunkt-URL (für MinIO, LocalStack und andere)
- `--log-level`: Log-Level (Standard: rustfs_mcp_server=info)

## Verwendung

### Server starten

```bash
# Start the MCP server
rustfs-mcp

# Or with custom options
rustfs-mcp --log-level debug --region us-west-2
```

### Integration mit Chat-Clients

#### Option 1: Befehlszeilenargumente

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "your_access_key",
        "--secret-access-key", "your_secret_key",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Option 2: Umgebungsvariablen

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "your_access_key",
        "AWS_SECRET_ACCESS_KEY": "your_secret_key",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Verwendung mit Docker

RustFS MCP stellt ein [offizielles Dockerfile](https://github.com/rustfs/rustfs/tree/main/crates/mcp) bereit, mit dem Sie ein Container-Image bauen.

```bash
# Clone RustFS repository code
git clone https://github.com/rustfs/rustfs.git

# Build Docker image
docker build -f crates/mcp/Dockerfile -t rustfs/rustfs-mcp .
```

Wenn das Image gebaut wurde, fügen Sie den Server der MCP-Konfiguration Ihrer IDE hinzu.

#### MCP in KI-IDEs konfigurieren

Viele KI-IDEs, darunter Cursor, Windsurf und Trae, unterstützen MCP. Fügen Sie in Trae beispielsweise den folgenden Inhalt zur MCP-Konfiguration hinzu (**MCP --> Add**):

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "AWS_ACCESS_KEY_ID",
        "-e",
        "AWS_SECRET_ACCESS_KEY",
        "-e",
        "AWS_REGION",
        "-e",
        "AWS_ENDPOINT_URL",
        "rustfs/rustfs-mcp"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "rustfs_access_key",
        "AWS_SECRET_ACCESS_KEY": "rustfs_secret_key",
        "AWS_REGION": "us-east-1",
        "AWS_ENDPOINT_URL": "rustfs_instance_url"
      }
    }
  }
}
```

> `AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY` sind RustFS-Zugriffsschlüssel. Zum Anlegen siehe [Zugriffsschlüssel-Verwaltung](../security-compliance/iam/access-token.md).

Wenn der Server erfolgreich hinzugefügt wurde, listet die MCP-Konfigurationsseite seine [verfügbaren Tools](#verfügbare-tools) auf.

![RustFS-MCP-Server in der MCP-Konfiguration von Trae hinzugefügt](images/add-rustfs-mcp-succ.png)

Um in Trae ein MCP-Tool aufzurufen, geben Sie im Chat eine Eingabeaufforderung ein. Zum Beispiel:

```text
Please help me list the buckets in the current rustfs instance, thank you!
```

Trae gibt die folgende Antwort zurück:

![Buckets einer RustFS-Instanz, aufgelistet mit dem RustFS-MCP](images/list-rustfs-bucket-with-mcp.png)

Trae verwendet den Modus **Builder with MCP** und ruft das Tool `list_buckets` auf, um alle Buckets in der konfigurierten RustFS-Instanz aufzulisten. Andere Tools funktionieren auf dieselbe Weise.

## Verfügbare Tools

Der MCP-Server stellt die folgenden Tools bereit, die KI-Assistenten verwenden können:

### `list_buckets`

Listet alle S3-Buckets auf, die mit den konfigurierten Zugangsdaten erreichbar sind.

**Parameter**: Keine

### `list_objects`

Listet Objekte in einem S3-Bucket auf, optional mit Präfixfilter.

**Parameter**:

- `bucket_name` (string): Name des S3-Buckets
- `prefix` (string, optional): Präfix zum Filtern der Objekte

### `upload_file`

Lädt eine lokale Datei nach S3 hoch und erkennt den MIME-Typ automatisch.

**Parameter**:

- `local_file_path` (string): lokaler Dateipfad
- `bucket_name` (string): Ziel-S3-Bucket
- `object_key` (string): S3-Objektschlüssel (Zielpfad)
- `content_type` (string, optional): Inhaltstyp (wird automatisch erkannt, wenn er fehlt)
- `storage_class` (string, optional): S3-Speicherklasse
- `cache_control` (string, optional): Cache-Control-Header

### `get_object`

Ruft Objekte aus S3 in zwei Betriebsmodi ab: Inhalt direkt lesen oder in eine Datei herunterladen.

**Parameter**:

- `bucket_name` (string): Quell-S3-Bucket
- `object_key` (string): S3-Objektschlüssel
- `version_id` (string, optional): Versions-ID für versionierte Objekte
- `mode` (string, optional): Betriebsmodus. `read` (Standard) gibt den Inhalt direkt zurück, `download` speichert in eine lokale Datei
- `local_path` (string, optional): lokaler Dateipfad (erforderlich, wenn `mode` den Wert `download` hat)
- `max_content_size` (number, optional): maximale Inhaltsgröße im Lesemodus in Byte (Standard: 1 MB)

### `create_bucket`

Erstellt einen neuen RustFS-Bucket.

**Parameter**:

- `bucket_name` (string): Name des zu erstellenden Buckets.

### `delete_bucket`

Löscht den angegebenen RustFS-Bucket.

**Parameter**:

- `bucket_name` (string): Name des zu löschenden Buckets.

## Architektur

Der MCP-Server ist modular aufgebaut:

```text
rustfs-mcp/
├── src/
│   ├── main.rs          # Entry point, CLI parsing and server initialization
│   ├── server.rs        # MCP server implementation and tool handlers
│   ├── s3_client.rs     # S3 client wrapper with async operations
│   ├── config.rs        # Configuration management and CLI options
│   └── lib.rs           # Library exports and public API
└── Cargo.toml           # Dependencies, metadata and binary configuration
```
