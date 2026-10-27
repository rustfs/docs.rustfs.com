---
title: "Installationspfad für RustFS wählen"
description: "Wählen Sie den passenden Bereitstellungspfad für RustFS: lokaler Test, Produktion auf einem oder mehreren Knoten, Container und Kubernetes."
---

RustFS ist ein verteiltes Objektspeichersystem. Es ist in Rust geschrieben und steht unter der Apache-2.0-Lizenz. Es läuft auf Linux, Windows, macOS und FreeBSD sowie in Containern, auf x86, ARM, RISC-V und weiteren CPU-Architekturen.

:::warning[Nur für Entwicklung und Debugging]

Die Windows-Version von RustFS ist ausschließlich für Entwicklung und Debugging vorgesehen und wird **nicht für Produktionsbereitstellungen empfohlen**. Für Produktionsarbeitslasten empfehlen wir [Linux](/de/installation/linux).

:::

:::warning[Standardzugangsdaten sofort ändern]

Legen Sie nach der Installation eindeutige Werte für `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` fest, bevor Sie RustFS in einem Netzwerk erreichbar machen. Verwenden Sie den allgemein bekannten Wert `rustfsadmin` weder als Zugriffsschlüssel noch als geheimen Zugriffsschlüssel.

- Bei einer Installation als Linux-Binärdatei oder mit systemd tragen Sie beide Werte in `/etc/default/rustfs` ein und starten Sie anschließend den Dienst `rustfs` neu.
- Bei Docker, Podman oder Docker Compose übergeben Sie beide Werte beim Erstellen des Containers als Umgebungsvariablen. Erstellen Sie einen bestehenden Container neu, wenn er ohne diese Werte gestartet wurde.

:::

## Pfad auswählen

| Ihr Ziel | Empfohlener Pfad | Anleitung |
| - | - | - |
| RustFS auf einem lokalen Rechner ausprobieren | Installationsskript mit einem Befehl oder ein Container | [Linux-Schnellstart](./linux/quick-start.md) · [Container](./container/index.md) |
| Produktion auf einem Server | SNSD (ein Datenträger) oder SNMD (mehrere Datenträger) | [RustFS unter Linux installieren](./linux/index.md) |
| Produktionscluster auf mehreren Servern | MNMD, nachdem Sie die Produktions-Checklisten abgeschlossen haben | [Mehrere Knoten mit mehreren Datenträgern](./linux/multiple-node-multiple-disk.md) · [Checklisten](./requirement/checklists/index.md) |
| Kubernetes / Cloud-native | Bereitstellung mit dem Helm-Chart oder dem Operator | [Cloud-native](./cloud-native/index.md) |
| Windows- oder macOS-Host | Installation des nativen Programms | [Windows](./windows/index.md) · [macOS](./macos/index.md) |

## Vergleich der Bereitstellungsmodi [#deployment-mode-comparison]

| Modus | Knoten | Datenträger | Fehlertoleranz | Typische Verwendung |
| - | - | - | - | - |
| [SNSD](./linux/single-node-single-disk.md) | 1 | 1 | Keine — nur über Sicherungen | Entwicklung, Tests und kleine, nicht kritische Arbeitslasten |
| [SNMD](./linux/single-node-multiple-disk.md) | 1 | Mehrere | Bis zu M Paritätsdatenträger innerhalb des Knotens | Mittlere, nicht kritische Arbeitslasten auf einem Server |
| [MNMD](./linux/multiple-node-multiple-disk.md) | 4+ | Mehrere je Knoten | Datenträger- und Knotenebene durch Erasure Coding über mehrere Server | Produktionsarbeitslasten |

## Checkliste

Arbeiten Sie vor jeder Produktionsbereitstellung die [Checklisten vor der Installation](./requirement/checklists/index.md) durch — Hardware, Netzwerk, Software und Sicherheit —, damit Ihre Umgebung die Produktionsanforderungen erfüllt.
