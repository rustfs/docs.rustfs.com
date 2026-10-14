---
title: "S3-Kompatibilitätsmatrix"
description: "Prüfen Sie das getestete und bewusst ausgeschlossene Amazon-S3-Verhalten in der aktuellen RustFS-Kompatibilitätsprüfung (Compatibility Gate)."
---

RustFS implementiert eine getestete Teilmenge der Amazon-S3-API. Diese Matrix fasst die ausführbaren Ceph-s3tests-Listen im Repository `rustfs/rustfs` zusammen; sie erhebt keinen Anspruch auf vollständige Abdeckung aller standardmäßigen oder anbieterspezifischen S3-Verhaltensweisen.

Der folgende Stand wurde am 9. August 2026 gegen den RustFS-Commit [`1e6f5f1e`](https://github.com/rustfs/rustfs/commit/1e6f5f1e35f188f28844a7f81361ccca4d5d0c7b) geprüft.

## Statuslegende

| Status | Bedeutung |
| --- | --- |
| ✅ Getestet | Von der standardmäßigen oder von der Lebenszyklus-Kompatibilitätsprüfung abgedeckt |
| ❌ Geplant | Als noch nicht implementiertes Standardverhalten erfasst |
| ⊘ Ausgeschlossen | Anbieterspezifisch, bewusst nicht unterstützt oder außerhalb der standardmäßigen Kompatibilitätsprüfung |

## Ausführbare Testlisten

| Liste | Fälle | Aufgabe |
| --- | ---: | --- |
| [Implementierte Tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/implemented_tests.txt) | 455 | Standardfälle, die in der standardmäßigen Kompatibilitätsprüfung bestehen müssen |
| [Lebenszyklus-Verhaltenstests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/lifecycle_behavior_tests.txt) | 5 | Ablauf-Fälle in der separaten Lebenszyklus-Kompatibilitätsprüfung |
| [Nicht implementierte Tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/unimplemented_tests.txt) | 17 | Standardverhalten, das weiterhin geplant ist |
| [Ausgeschlossene Tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/excluded_tests.txt) | 270 | Fälle, die die RustFS-Kompatibilitätsprüfung nicht blockieren |

Die Zählung ignoriert Leerzeilen und Kommentare. Tests wechseln bei Änderungen zwischen den Listen; die verlinkten Dateien enthalten den neuesten Stand.

## Bucket-Operationen

| Funktion | Status | Umfang |
| --- | --- | --- |
| Buckets erstellen, löschen, auflisten und Metadaten abrufen (Head) | ✅ Getestet | Übliche Bucket-Lebenszyklusoperationen |
| Bucket-Tags | ✅ Getestet | Tags setzen, abrufen und löschen |
| Bucket-Richtlinien | ✅ Getestet | Richtlinien setzen, abrufen und löschen |
| Blockierung öffentlichen Zugriffs | ✅ Getestet | Konfiguration setzen, abrufen und löschen |
| Ausgewählte Versionierungs-, Object-Lock-, CORS- und Lebenszyklusverhalten | ✅ Getestet | Nur Fälle aus den implementierten Listen |
| Bucket-Zugriffsprotokollierung | ❌ Geplant | In der nicht implementierten Liste erfasst |
| Bucket-Eigentümersteuerung | ❌ Geplant | In der nicht implementierten Liste erfasst |
| ACL-Autorisierung | ⊘ Ausgeschlossen | Bewusst nicht unterstütztes Produktverhalten |

## Objektoperationen

| Funktion | Status | Umfang |
| --- | --- | --- |
| Objekte hochladen, abrufen, kopieren, Metadaten abrufen und löschen | ✅ Getestet | Übliche Objektoperationen |
| Listenverhalten für Präfix, Trennzeichen, Marker und `max-keys` | ✅ Getestet | `ListObjects` und `ListObjectsV2` |
| Bereichs- und bedingte Lesezugriffe | ✅ Getestet | Ausgewählte HTTP-Range- und Vorbedingungsfälle |
| Benutzermetadaten und Objekt-Tags | ✅ Getestet | Schreiben und erneutes Lesen (Roundtrip) von Metadaten und Tags |
| Vorsignierte GET- und PUT-URLs | ✅ Getestet | Ausgewählte Signatur- und Anfragefälle |
| SSE-C und ausgewähltes SSE-KMS-Verhalten | ✅ Getestet | Nur Schreib- und Lese-Roundtrips für von RustFS verwaltete Objekte |
| Prüfsummen bei POST-Object-Formularuploads | ❌ Geplant | In der nicht implementierten Liste erfasst |

Verschlüsselte Objektformate sind zwischen RustFS und anderen S3-Implementierungen nicht portabel. Ein bestandener Verschlüsselungstest bedeutet, dass RustFS von RustFS verschlüsselte Objekte lesen kann; er garantiert nicht, dass RustFS direkt kopierte verschlüsselte Objekte einer anderen Implementierung lesen kann.

## Mehrteilige Uploads

| Funktion | Status | Umfang |
| --- | --- | --- |
| Erstellen, Teile hochladen, abschließen und abbrechen | ✅ Getestet | Kernablauf eines mehrteiligen Uploads |
| Ausgewähltes Multipart-Kopier-, Prüfsummen- und Objektattributverhalten | ✅ Getestet | Fälle aus der implementierten Liste |
| Auflistung mehrteiliger Uploads und Grenzfälle beim Teileabruf | ⊘ Ausgeschlossen | Nicht Teil der standardmäßigen Kompatibilitätsprüfung |

## Verbindliche Quellen

Die [S3-Kompatibilitätsmatrix](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md) im Repository erläutert die Kompatibilitätsprüfung (Compatibility Gate) und ihre Aktualisierungsregel. Die ausführbaren Dateien unter [`scripts/s3-tests`](https://github.com/rustfs/rustfs/tree/main/scripts/s3-tests) bestimmen das aktuelle Ergebnis. Wenn sich eine Funktion ändert, müssen Testlisten und beide veröffentlichten Matrizen gemeinsam aktualisiert werden.
