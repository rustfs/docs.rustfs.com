---
title: "Container"
description: "Betreiben Sie das offizielle Container-Image von RustFS mit Docker oder Podman."
---

RustFS ist ein quelloffenes, S3-kompatibles System für verteilten Objektspeicher. Im Modus mit einem einzelnen Knoten und einem Datenträger (SNSD) verwendet RustFS kein Erasure Coding und speichert keine redundanten Daten. Dieser Modus eignet sich daher nur für lokale Tests und kleine Arbeitslasten. Das offizielle RustFS-Image packt die RustFS-Binärdatei und ihre Laufzeitumgebung in einen Container, sodass Sie RustFS mit persistentem Speicher durch einen einzigen Befehl starten.

Der Container läuft als Benutzer `rustfs` ohne Root-Rechte mit der ID `10001`. Ein per Bind-Mount eingehängtes Host-Verzeichnis muss daher `10001` gehören, sonst treten Fehler `permission denied` auf.

## Container-Laufzeiten

- [Docker](./docker.md): Betreiben Sie eine Instanz auf einem Knoten mit persistentem Speicher und erweitern Sie sie anschließend um Docker Compose, TLS und Netzwerke für mehrere Knoten.
- [Podman](./podman.md): Betreiben Sie dasselbe Image in einem Ablauf ohne Daemon.

:::note[Verzeichnisberechtigungen]

Wenn Sie ein Host-Verzeichnis mit `-v` in den Container einhängen, muss `10001` der Eigentümer des Host-Verzeichnisses sein:

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

Für Kubernetes-Bereitstellungen verwenden Sie stattdessen das [Helm-Chart](/de/installation/cloud-native/helm-chart) oder den [Operator](/de/installation/cloud-native/operator).
