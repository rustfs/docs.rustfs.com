---
title: "Hardwareauswahl"
description: "Diese Seite listet die minimale und die empfohlene Hardware für Test- und Produktionsumgebungen von RustFS auf."
---

> RustFS ist auf Effizienz bei geringem Arbeitsspeicherbedarf ausgelegt.

## Testumgebung

Mindestanforderungen für Tests:

| Komponente | Anforderung |
| - | - |
| CPU | mindestens 1 Kern |
| Architektur | x86, ARM |
| Arbeitsspeicher | mindestens 1 GB |
| Speicher | HDD oder SSD |
| Docker | Unterstützt |
| Netzwerk | Lokal oder offline |
| Betriebssystem | Windows, Linux, macOS |
| Lastverteilung | Keine |
| Knoten | 1 |

## Produktionsumgebung

Die Windows-Version von RustFS ist ausschließlich für Entwicklung und Fehlersuche vorgesehen und wird **nicht für Produktionsbereitstellungen empfohlen**. Wir empfehlen [Linux](/de/installation/linux) für Produktionslasten.

| Komponente | Anforderung |
| - | - |
| CPU | 2 × 12 Kerne oder mehr |
| Architektur | x86, ARM usw. |
| Arbeitsspeicher | mindestens 64 GB |
| Speicher | SSD empfohlen |
| Netzwerk | mindestens 10 Gbps |
| Betriebssystem | Linux (empfohlen) |
| Lastverteilung | Empfohlen |
| Knoten | mindestens 4 |

## Professionelle Dienste

Wenden Sie sich bei komplexen Bereitstellungen an den Support unter hello@rustfs.com.
