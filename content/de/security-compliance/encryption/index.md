---
title: "Datenverschlüsselung"
description: "Hier finden Sie die geprüften Referenzen zu serverseitiger Verschlüsselung und Schlüsselverwaltung in RustFS."
---

RustFS bietet Optionen für serverseitige Verschlüsselung von Daten im Objektspeicher. In diesem Abschnitt wählen Sie das Schlüsselverwaltungsmodell, das zu Ihren Sicherheitsanforderungen passt.

## Verschlüsselungsoptionen

- [SSE-S3](./sse-s.md) beschreibt die vom Server verwaltete serverseitige Verschlüsselung im S3-Modus `AES256`.
- [SSE-C](./sse-c.md) beschreibt die serverseitige Verschlüsselung mit vom Kunden bereitgestellten Schlüsseln.
- [SSE-KMS](./kms.md) beschreibt die Schlüsselverwaltungs-Backends Local, Vault KV2 und Vault Transit.

Die derzeit geprüfte KMS-Konfiguration finden Sie in der [CLI-Referenz](/de/reference/cli) und in der [Referenz der Umgebungsvariablen](/de/reference/environment-variables).
