---
title: "Docker Installation von RustFS"
description: "RustFS Docker-Bereitstellung."
---

# Docker Installation von RustFS

RustFS ist ein hochperformantes, 100% S3-kompatibles Open-Source-Distributed-Object-Storage-System. Im Single-Node-Single-Disk (SNSD) Bereitstellungsmodus verwendet das Backend Zero-Erasure-Coding und bietet keine zusätzliche Datenredundanz, geeignet für lokale Tests und kleinere Szenarien.
Dieser Artikel basiert auf dem offiziellen RustFS Linux-Binärpaket und verpackt RustFS und seine Laufzeitumgebung über eine benutzerdefinierte Dockerfile in Container. Mit der Konfiguration von Datenvolumen und Umgebungsvariablen kann der Service mit einem Klick gestartet werden.

---

## I. Voraussetzungen

1. **Host-Anforderungen**

 * Docker (≥ 20.10) ist installiert und kann Images normal pullen und Container ausführen
 * Lokaler Pfad `/mnt/rustfs/data` (oder benutzerdefinierter Pfad) zum Mount der Objektdaten
2. **Netzwerk und Firewall**

 * Stellen Sie sicher, dass Port 9000 des Host-Rechners nach außen geöffnet ist (oder konsistent mit benutzerdefiniertem Port)
3. **Konfigurationsdatei-Vorbereitung**

 * Im Host-Rechner `/etc/rustfs/config.toml`, definieren Sie Listening-Port, Administrator-Konto, Datenpfad usw. (siehe Abschnitt 4)

---

## II. Schnelles Pullen des offiziellen RustFS-Images

Verwenden Sie das offizielle Ubuntu-Base-Image, um schnell das offizielle RustFS-Image zu pullen:


```bash
docker pull rustfs/rustfs

```

---

## III. RustFS-Container ausführen

RustFS SNSD Docker-Ausführungsmethode, kombiniert mit oben genanntem Image und Konfiguration, ausführen:

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

Parametererklärung:

* `-p 9000:9000`: Mappen Sie Host-Port 9000 zum Container
* `-v /mnt/rustfs/data:/data`: Mount-Datenvolumen
* `--name rustfs_local`: Benutzerdefinierter Container-Name
* `-d`: Hintergrund-Ausführung

---

### Vollständiges Parameterkonfigurations-Beispiel

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### Parametererklärung und entsprechende Methoden

1. **Umgebungsvariablen-Methode** (empfohlen):
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **Kommandozeilen-Parameter-Methode**:
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **Erforderliche Parameter**:
    - `<VOLUMES>`: Am Ende des Befehls spezifizieren, wie `/data`

### Häufig verwendete Konfigurationskombinationen

1. **Basiskonfiguration**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **Konsole aktivieren**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **Benutzerdefinierte Authentifizierungs-Schlüssel**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### Hinweise

1. Port-Mapping muss korrespondieren:
    - Service-Port standardmäßig 9000 (`-p 9000:9000`)

2. Datenvolumen muss persistiert werden:
    - `-v /host/path:/container/path`

3. Umgebungsvariablen und Kommandozeilen-Parameter können gemischt verwendet werden, aber Kommandozeilen-Parameter haben höhere Priorität

4. Falls [TLS verwendet](../../integration/tls-configured.md) wird, muss zusätzlich der Zertifikatspfad gemountet werden:

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## IV. Verifikation und Zugriff

1. **Container-Status und Logs anzeigen:**

 ```bash
 docker logs rustfs_local
 ```

 Die Logs sollten erfolgreichen Service-Start anzeigen und Port 9000 überwachen.

2. **S3 API testen:**

 Verwenden Sie `mc` oder andere S3-Clients:

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 Wenn Bucket erfolgreich erstellt und aufgelistet werden kann, ist die Bereitstellung wirksam.


## V. Weitere Empfehlungen

1. Produktionsumgebungs-Empfehlungen:
- Verwenden Sie Multi-Node-Bereitstellungsarchitektur
- [TLS-verschlüsselte Kommunikation aktivieren](../../integration/tls-configured.md)
- Log-Rotation-Strategie konfigurieren
- Regelmäßige Backup-Strategie einrichten

2. Speicher-Empfehlungen:
- Verwenden Sie lokalen SSD/NVMe-Speicher
- Vermeiden Sie Network File System (NFS)
- Stellen Sie exklusiven Zugriff auf Speicherverzeichnis sicher

---

## Zusammenfassung

Dieser Artikel kombiniert RustFS Single-Node-Single-Disk-Containerisierungs-Best-Practices und demonstriert detailliert, wie man über Docker selbst RustFS-Images erstellt und SNSD-Umgebung bereitstellt.
Diese Lösung ist einfach für schnellen Start und Experimente, könnte später auf Kubernetes, Swarm und anderen Plattformen mit der gleichen Denkweise zu Multi-Node-Multi-Disk-Produktions-Clustern erweitert werden.

