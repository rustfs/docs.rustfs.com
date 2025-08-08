---
title: "RustFS‑Objekte mit MinIO Client verwalten"
description: "Verwenden von MinIO Client zur Verwaltung von RustFS‑Objekten"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) ist das offizielle CLI‑Werkzeug von MinIO zur Verwaltung von Objektspeicherdiensten. Als S3‑kompatibles Tool kann `mc` auch RustFS verwalten.

Voraussetzungen:

- Eine RustFS‑Instanz (../../de/installation/index.md)
- Installiertes `mc`
- Verfügbarer [Zugriffsschlüssel](access-token.md)

## RustFS mit `mc` bedienen

Konfigurieren Sie zunächst einen Alias für RustFS mit `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Antwort:

```
Added `rustfs` successfully.
```

Anschließend können Sie mit dem Alias `rustfs` Buckets erstellen/löschen und Dateien hoch‑/herunterladen.

### Buckets auflisten

```
mc ls rustfs
```

Antwort:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Bucket erstellen

```
mc mb rustfs/bucket-creation-by-mc
```

Antwort:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Bucket löschen

```
mc rb rustfs/bucket-creation-by-mc
```

Antwort:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Datei in Bucket hochladen

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Antwort:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Datei im Bucket löschen

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Antwort:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Datei aus Bucket herunterladen

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Antwort:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```