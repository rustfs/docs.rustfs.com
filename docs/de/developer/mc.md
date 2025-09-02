---
title: "RustFS Objekte mit MinIO Client verwalten"
description: "Verwaltung von RustFS Objekten mit MinIO Client"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) ist das offizielle Kommandozeilen-Tool von MinIO zur Verwaltung von MinIO Objektspeicherdiensten. `mc` kann mit MinIO, Amazon S3 und anderen S3-kompatiblen Objektspeicherdiensten interagieren und bietet eine einfache, effiziente Möglichkeit zur Verwaltung von Daten in Objektspeicherdiensten. Da MinIO S3-kompatibel ist, kann `mc` auch zur Verwaltung von RustFS Objekten verwendet werden.

Voraussetzungen:

- Eine verfügbare RustFS Instanz. Siehe [Installationsanleitung](../installation/index.md) für die Installation.
- Das `mc` Tool ist installiert.
- Verfügbare [Zugriffsschlüssel](../administration/iam/access-token.md).

## RustFS mit `mc` betreiben

Zuerst muss ein Alias für RustFS mit dem `mc alias` Befehl konfiguriert werden:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Antwort:

```
Added `rustfs` successfully.
```

Anschließend kann der Alias `rustfs` mit `mc` verwendet werden, um Speicher-Buckets zu erstellen/löschen, Dateien hoch-/herunterzuladen usw.

### Speicher-Buckets auflisten

Verwenden Sie `mc ls`, um alle Speicher-Buckets in der aktuellen RustFS Instanz aufzulisten:

```
mc ls rustfs
```

Antwort:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Speicher-Bucket erstellen

Verwenden Sie den `mc mb` Befehl, um einen Speicher-Bucket zu erstellen:

```
mc mb rustfs/bucket-name
```

Antwort:

```
Bucket created successfully `rustfs/bucket-name`.
```

### Speicher-Bucket löschen

Verwenden Sie den `mc rb` Befehl, um einen Speicher-Bucket zu löschen:

```
mc rb rustfs/bucket-name
```

Antwort:

```
Removed `rustfs/bucket-name` successfully.
```

### Datei hochladen

Verwenden Sie den `mc cp` Befehl, um eine Datei hochzuladen:

```
mc cp /path/to/local/file rustfs/bucket-name/
```

Antwort:

```
/path/to/local/file: 1.2 MiB / 1.2 MiB [================================] 100.00% 2.1 MiB/s 0s
```

### Datei herunterladen

Verwenden Sie den `mc cp` Befehl, um eine Datei herunterzuladen:

```
mc cp rustfs/bucket-name/file /path/to/local/destination/
```

### Datei auflisten

Verwenden Sie den `mc ls` Befehl, um Dateien in einem Speicher-Bucket aufzulisten:

```
mc ls rustfs/bucket-name/
```

### Datei löschen

Verwenden Sie den `mc rm` Befehl, um eine Datei zu löschen:

```
mc rm rustfs/bucket-name/file
```

### Synchronisation

Verwenden Sie den `mc mirror` Befehl, um lokale Verzeichnisse mit Speicher-Buckets zu synchronisieren:

```
mc mirror /path/to/local/directory rustfs/bucket-name/
```

### Replikation

Verwenden Sie den `mc replicate` Befehl, um Speicher-Buckets zwischen verschiedenen RustFS Instanzen zu replizieren:

```
mc replicate add rustfs/bucket-name --remote-bucket bucket-name --remote-endpoint http://remote-rustfs:9000
```

## Weitere Befehle

`mc` bietet viele weitere nützliche Befehle:

- `mc stat`: Zeigt detaillierte Informationen über Objekte an
- `mc cat`: Zeigt den Inhalt von Objekten an
- `mc head`: Zeigt nur die Header von Objekten an
- `mc find`: Sucht nach Objekten basierend auf verschiedenen Kriterien
- `mc watch`: Überwacht Änderungen in Speicher-Buckets

Für eine vollständige Liste der verfügbaren Befehle verwenden Sie:

```
mc --help
```
