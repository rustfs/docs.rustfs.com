---
title: "Nutzungsbeschränkungen"
description: "RustFS ist eine einfache, effiziente, verteilte Objektspeicherlösung. Sie ist 100% S3-kompatibel und als Open-Source-Software unter der Apache2-Lizenz veröffentlicht."
---

# Nutzungsbeschränkungen

## I. S3 API Beschränkungen

> Die folgenden Standards folgen strikt den S3-Protokollstandards zur Spezifikation.

| Element | Spezifikation |
| --------------------- | ---------------------------------- |
| Maximale Objektgröße | 5 TiB |
| Minimale Objektgröße | 0 B |
| Maximale Objektgröße für einzelne PUT-Operation | Nicht-Multipart-Upload: 500 GiB; Multipart-Upload: 5 TiB |
| Maximale Anzahl von Teilen pro Upload | 10,000 |
| Teilgrößenbereich | 5 MiB bis 5 GiB; letzter Teil kann 0 B bis 5 GiB sein |
| Maximale Anzahl von Teilen pro Listenteile-Anfrage | 10,000 |
| Maximale Anzahl von Objekten pro Listenobjekte-Anfrage | 1,000 |
| Maximale Anzahl von Multipart-Uploads pro Listen-Multipart-Uploads-Anfrage | 1,000 |
| Maximale Länge des Bucket-Namens | 63 Zeichen |
| Maximale Länge des Objektnamens | 1024 Zeichen |
| Maximale Länge pro `/`-getrennte Objektnamensegment | 255 Zeichen |
| Maximale Anzahl von Versionen pro Objekt | 10,000 (konfigurierbar) |

---

## II. Erasure Coding Beschränkungen

> EC-Parameter basierend auf Reed-Solomon-Matrix EC-Algorithmus konfigurieren. Tatsächliche EC-Parameterkonfiguration ist maßgebend.

| Element | Spezifikation |
| ---------------------------- | ------------------------------ |
| Maximale Anzahl von Servern pro Cluster | Unbegrenzt |
| Minimale Anzahl von Servern | 1 |
| Bei 1 Server: Minimale Anzahl von Laufwerken pro Server | 1 (für Single-Node-Single-Drive-Deployment, bietet keine zusätzliche Zuverlässigkeit oder Verfügbarkeit) |
| Bei 2 oder mehr Servern: Minimale Anzahl von Laufwerken pro Server | 1 |
| Maximale Anzahl von Laufwerken pro Server | Unbegrenzt |
| Lese-Quorum-Anzahl | N/2 |
| Schreib-Quorum-Anzahl | (N/2) + 1 |

---

## III. Objektbenennungsbeschränkungen

### Dateisystem- und Betriebssystembeschränkungen

Objektnamen in RustFS sind hauptsächlich durch das zugrunde liegende Betriebssystem und Dateisystem beschränkt. Zum Beispiel beschränken Windows und einige andere Betriebssysteme die Verwendung bestimmter Sonderzeichen wie `^`, `*`, `|`, `\`, `/`, `&`, `"` oder `;`.

Bitte konsultieren Sie die entsprechende Dokumentation für eine vollständige Liste der Beschränkungen basierend auf Ihrem spezifischen Betriebssystem und Dateisystem.

RustFS empfiehlt die Verwendung von Linux-Betriebssystemen basierend auf XFS-Dateisystem in Produktionsumgebungen für bessere Leistung und Kompatibilität.

### Behandlung von Namenskonflikten

In RustFS müssen Anwendungen allen Objekten eindeutige und nicht-kollidierende Schlüssel zuweisen. Dies beinhaltet die Vermeidung der Erstellung von Objekten, deren Namen mit übergeordneten Objekten oder gleichrangigen Objektnamen kollidieren könnten. RustFS gibt ein leeres Set zurück, wenn LIST-Operationen an konfliktbehafteten Stellen ausgeführt werden.

Zum Beispiel würden die folgenden Operationen zu Namespace-Konflikten führen:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Konflikt mit vorhandenem Objektpräfix

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Konflikt mit vorhandenem Objekt
```

Obwohl Sie GET- oder HEAD-Operationen auf diese Objekte ausführen können, führen Namenskonflikte dazu, dass LIST-Operationen im Pfad `hello/2025/first/` ein leeres Ergebnisset zurückgeben.

