---
title: "Statusprüfung"
description: "Prüfen Sie den Netzwerkzugriff, die Integritätsendpunkte, den Clusterstatus und die Speicherkapazität von RustFS."
---

Nutzen Sie Netzwerktests, die Seite **Status** in der RustFS Console (Weboberfläche) oder die Befehlszeile `rc`, um Verfügbarkeit und Speicherverbrauch von RustFS zu prüfen. Bevor Sie den Ablauf über die Befehlszeile verwenden, [installieren Sie `rc`](/de/operations/rc) und konfigurieren Sie einen Alias für den Zielcluster.

## Netzwerkports

RustFS verwendet standardmäßig zwei Listener. Beide Bind-Adressen lassen sich über Umgebungsvariablen oder Befehlszeilenoptionen ändern.

| Port | Listener | Konfiguriert über | Datenverkehr |
| --- | --- | --- | --- |
| `9000` | S3-API | `RUSTFS_ADDRESS` / `--address` | S3-Objekt-API, Admin-API und interne RPC von Knoten zu Knoten unter `/rustfs/rpc/` und `/rustfs/peer/` |
| `9001` | Console | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | Eingebettete Weboberfläche unter `/rustfs/console/`; deaktivieren Sie sie mit `RUSTFS_CONSOLE_ENABLE=false` |

:::note[Konnektivität zwischen den Knoten]

Die RPC zwischen den Knoten nutzt Port 9000 mit. In einem Cluster mit mehreren Knoten muss jeder Knoten jeden anderen Knoten auf dem S3-Port erreichen können. Einen eigenen Cluster-Port gibt es nicht.

:::

Öffnen Sie die Standardports mit `firewalld`, wenn Clients beide Listener erreichen müssen:

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning[Zugriff auf die Console einschränken]

Geben Sie Port 9001 nur für vertrauenswürdige Netze frei. Wenn Sie die Console nicht benötigen, setzen Sie `RUSTFS_CONSOLE_ENABLE=false` und lassen Sie den Port geschlossen.

:::

## Endpunkte für Integritätsprüfungen

Der S3-Listener auf Port **9000** stellt unauthentifizierte Prüf-Endpunkte bereit. Deaktivieren Sie sie mit `RUSTFS_HEALTH_ENDPOINT_ENABLE=false`. Die Console auf Port **9001** hat einen eigenen Integritätspfad.

| Endpunkt | Port | Bedeutung |
| --- | --- | --- |
| `GET /health`, `HEAD /health`, `GET /health/live`, `GET /minio/health/live` | 9000 | Liveness: liefert `200`, solange der Prozess läuft |
| `GET /health/ready` | 9000 | Bereitschaft: `200` nur, wenn Speicher, IAM und der Zustand der Peers bereit sind; andernfalls `503` |
| `GET /minio/health/ready` | 9000 | MinIO-kompatibler Alias der Bereitschaftsprüfung |
| `GET /minio/health/cluster`, `GET /minio/health/cluster/read` | 9000 | Schreib- und Leseintegrität des Clusters (erfordert zusätzlich Lock-Quorum) |
| `GET /rustfs/console/health` | 9001 | Integrität des Console-Prozesses |

Ein bereiter Knoten antwortet mit `200` und `"ready": true`. Ein beeinträchtigter Knoten antwortet mit `503` und Details je Abhängigkeit:

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -s http://<node>:9000/health/ready | jq
curl -fsS http://localhost:9001/rustfs/console/health
```

Das Objekt `details` meldet `storage`, `iam` und `lock` (sowie `kms`, wenn konfiguriert). `degradedReasons` listet maschinenlesbare Ursachen wie `storage_quorum_unavailable`, `iam_not_ready` oder `lock_quorum_unavailable`.

## Clusterstatus

### Clusterstatus in der Console prüfen

1. Melden Sie sich an der RustFS Console an.
2. Öffnen Sie **Status**.
3. Bestätigen Sie, dass der Cluster online ist, und prüfen Sie den Status von Servern, Netzwerk und Laufwerken.
4. Klären Sie jeden offline geschalteten Server, jedes nicht verfügbare Laufwerk und jede fehlgeschlagene Netzwerkverbindung, bevor Sie Wartung oder Kapazitätsänderungen vornehmen.

### Clusterstatus mit rc prüfen

Führen Sie den Befehl für Clusterinformationen mit Ihrem konfigurierten Alias aus:

```bash
rc admin info cluster rustfs
```

Die Übersicht meldet den Clusterzustand, die RustFS-Version, die Zahl der Server und Laufwerke, den Backend-Typ und die Parität des Erasure Coding. Die Knotenliste zeigt Laufzeit, Netzwerkkonnektivität, Verfügbarkeit der Laufwerke und die Poolzugehörigkeit. Die Laufwerksliste zeigt Zustand sowie Pool, Set und Laufwerksposition jedes Laufwerks.

Fordern Sie für maschinenlesbare Ausgabe JSON an:

```bash
rc admin info cluster rustfs --json
```

## Speicherkapazität

### Speicherkapazität in der Console prüfen

1. Melden Sie sich an der RustFS Console an und öffnen Sie **Status**.
2. Prüfen Sie die genutzte und die gesamte Speicherkapazität des Clusters.
3. Prüfen Sie Kapazität und verfügbaren Speicher jedes Laufwerks.
4. Vergleichen Sie die Nutzung über die Zeit und planen Sie eine Erweiterung, bevor die verfügbare Kapazität für normale Schreibvorgänge und Wartung nicht mehr ausreicht.

### Speicherkapazität mit rc prüfen

Verwenden Sie denselben Befehl für Clusterinformationen:

```bash
rc admin info cluster rustfs
```

Die Zusammenfassung **Storage** (Speicher) meldet genutzte Kapazität, Gesamtkapazität und den genutzten Prozentsatz des Clusters. Jeder Eintrag unter **Disks** (Laufwerke) meldet genutzte, gesamte und verfügbare Kapazität dieses Laufwerks.

Verwenden Sie die JSON-Ausgabe, wenn Sie die Werte in einem Skript oder einer Monitoring-Integration erfassen:

```bash
rc admin info cluster rustfs --json
```

Administrative Informationsbefehle erfordern Zugangsdaten mit den entsprechenden Berechtigungen der RustFS Admin API.

## Nächste Schritte

Für fortlaufende Telemetrie und Alarmierung fahren Sie mit [Observability](./observability.md) fort. Um Speicher hinzuzufügen, lesen Sie [Speicherpool-Erweiterung](./scaling/storage-pool-expansion.md).
