---
title: "RustFS MCP"
description: "RustFS MCP Verwendungsanleitung"
---

# RustFS MCP

**RustFS MCP Server** ist ein hochperformanter [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) Server, der AI/LLM-Tools nahtlosen Zugriff auf S3-kompatible Objektspeicher-Operationen bietet. Der Server ist in Rust gebaut für maximale Leistung und Sicherheit und ermöglicht es AI-Assistenten wie Claude Desktop, über ein standardisiertes Protokoll mit Cloud-Speicher zu interagieren.

### Was ist MCP?

Das Model Context Protocol ist ein offener Standard, der es AI-Anwendungen ermöglicht, sichere, kontrollierte Verbindungen zu externen Systemen herzustellen. Dieser Server fungiert als Brücke zwischen AI-Tools und S3-kompatiblen Speicherdiensten und bietet strukturierten Zugriff auf Dateioperationen bei gleichzeitiger Wahrung von Sicherheit und Beobachtbarkeit.

## ✨ Funktionen

### Unterstützte S3-Operationen

- **Speicher-Buckets auflisten**: Listet alle zugänglichen S3-Speicher-Buckets auf
- **Objekte auflisten**: Durchsucht Speicher-Bucket-Inhalte mit optionalem Präfix-Filter
- **Dateien hochladen**: Lädt lokale Dateien hoch mit automatischer MIME-Typ- und Cache-Control-Erkennung
- **Objekte abrufen**: Ruft Objekte aus S3-Speicher ab, unterstützt Lese- oder Download-Modus

## 🔧 Installation

### Voraussetzungen

- Rust 1.88+ (zum Bauen aus Quellcode)
- Konfigurierte AWS-Anmeldedaten (über Umgebungsvariablen, AWS CLI oder IAM-Rollen)
- Zugriff auf S3-kompatible Speicherdienste

### Aus Quellcode bauen

```bash
# Repository klonen
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP Server bauen
cargo build --release -p rustfs-mcp

# Binärdatei wird unter folgendem Pfad verfügbar sein
./target/release/rustfs-mcp
```

## ⚙️ Konfiguration

### Umgebungsvariablen

Der Server verwendet Standard-AWS-Umgebungsvariablen für die Authentifizierung:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
export AWS_ENDPOINT_URL="https://your-s3-endpoint.com"
```

### Claude Desktop Konfiguration

Fügen Sie den folgenden Eintrag zu Ihrer `claude_desktop_config.json` hinzu:

```json
{
  "mcpServers": {
    "rustfs": {
      "command": "/path/to/rustfs-mcp",
      "args": [],
      "env": {
        "AWS_ACCESS_KEY_ID": "your-access-key",
        "AWS_SECRET_ACCESS_KEY": "your-secret-key",
        "AWS_DEFAULT_REGION": "us-east-1",
        "AWS_ENDPOINT_URL": "https://your-s3-endpoint.com"
      }
    }
  }
}
```

## 🚀 Verwendung

### Verfügbare Tools

#### 1. `list_buckets`
Listet alle verfügbaren S3-Speicher-Buckets auf.

**Parameter**: Keine

**Beispiel**:
```
Liste alle verfügbaren Speicher-Buckets auf
```

#### 2. `list_objects`
Listet Objekte in einem Speicher-Bucket auf.

**Parameter**:
- `bucket_name` (string): Name des Speicher-Buckets
- `prefix` (string, optional): Präfix zum Filtern von Objekten

**Beispiel**:
```
Liste alle Objekte im Speicher-Bucket "mein-bucket" auf
```

#### 3. `upload_file`
Lädt eine lokale Datei in einen S3-Speicher-Bucket hoch.

**Parameter**:
- `bucket_name` (string): Name des Ziel-Speicher-Buckets
- `object_key` (string): Schlüssel für das Objekt im Speicher-Bucket
- `file_path` (string): Pfad zur lokalen Datei
- `content_type` (string, optional): MIME-Typ der Datei

**Beispiel**:
```
Lade die Datei "/pfad/zur/datei.txt" als "dokumente/datei.txt" in den Speicher-Bucket "mein-bucket" hoch
```

#### 4. `get_object`
Ruft ein Objekt aus S3-Speicher ab.

**Parameter**:
- `bucket_name` (string): Name des Speicher-Buckets
- `object_key` (string): Schlüssel des Objekts
- `mode` (string): "read" für Inhalt anzeigen oder "download" für Datei herunterladen
- `output_path` (string, optional): Pfad für Download-Modus

**Beispiel**:
```
Lade das Objekt "dokumente/datei.txt" aus dem Speicher-Bucket "mein-bucket" herunter
```

## 🔒 Sicherheit

### Authentifizierung
- Unterstützt AWS IAM-Rollen, Umgebungsvariablen und AWS CLI-Konfiguration
- Sichere Übertragung von Anmeldedaten über Umgebungsvariablen
- Keine Speicherung von Anmeldedaten in Konfigurationsdateien

### Berechtigungen
- Minimal erforderliche Berechtigungen für S3-Operationen
- Unterstützt Bucket-spezifische Richtlinien
- Audit-freundliche Operationen

## 🐛 Fehlerbehebung

### Häufige Probleme

#### 1. Authentifizierungsfehler
```
Error: AWS credentials not found
```
**Lösung**: Stellen Sie sicher, dass AWS-Anmeldedaten korrekt konfiguriert sind.

#### 2. Endpoint-Fehler
```
Error: Unable to connect to S3 endpoint
```
**Lösung**: Überprüfen Sie die `AWS_ENDPOINT_URL` und Netzwerkkonnektivität.

#### 3. Berechtigungsfehler
```
Error: Access denied
```
**Lösung**: Überprüfen Sie IAM-Berechtigungen für S3-Operationen.

### Debug-Modus

Aktivieren Sie detaillierte Protokollierung:

```bash
export RUST_LOG=debug
./rustfs-mcp
```

## 📚 API-Referenz

### S3-Operationen

Alle Operationen verwenden die AWS SDK für Rust und sind vollständig kompatibel mit:
- Amazon S3
- MinIO
- RustFS
- Andere S3-kompatible Dienste

### Unterstützte Regionen

Der Server unterstützt alle AWS-Regionen und benutzerdefinierte Endpoints für S3-kompatible Dienste.

## 🤝 Beitragen

Wir freuen uns über Beiträge! Bitte lesen Sie unsere [Contributing Guidelines](https://github.com/rustfs/rustfs/blob/main/CONTRIBUTING.md).

### Entwicklung

```bash
# Repository klonen
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# Abhängigkeiten installieren
cargo build

# Tests ausführen
cargo test -p rustfs-mcp

# Linting
cargo clippy -p rustfs-mcp
```

## 📄 Lizenz

Dieses Projekt ist unter der Apache License 2.0 lizenziert. Siehe [LICENSE](https://github.com/rustfs/rustfs/blob/main/LICENSE) für Details.

## 🔗 Links

- [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Claude Desktop](https://claude.ai/desktop)
- [AWS SDK für Rust](https://docs.rs/aws-sdk-s3/)
- [RustFS Dokumentation](https://docs.rustfs.com)
