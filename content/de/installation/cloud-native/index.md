---
title: "Kubernetes-Installation (Helm)"
description: "Stellen Sie RustFS mit dem offiziellen Helm-Chart auf Kubernetes bereit: Standalone- oder verteilter Modus, Speichergröße, Integritätsprüfungen, Härtung für den Produktivbetrieb und Erweiterung von Speicherpools."
---

RustFS liefert ein offizielles Helm-Chart, das entweder eine Einzelknoten-Instanz (ein `Deployment` mit einem PVC) oder einen verteilten Cluster (ein `StatefulSet` mit mehreren Pods und PVCs) bereitstellt. Diese Anleitung führt durch die Installation des Charts, die Wahl eines Bereitstellungsmodus, die korrekte Speicherdimensionierung und die Produktivoptionen, die das Chart bereitstellt.

**Voraussetzungen**

- Ein Kubernetes-Cluster und Zugriff über `kubectl`
- Helm 3
- RustFS-Image-Version `>= 1.0.0-alpha.69` (Anforderung des Charts)
- Eine StorageClass mit funktionierendem Provisioner. Das Chart verwendet standardmäßig [`local-path`](https://github.com/rancher/local-path-provisioner). Setzen Sie `storageclass.name`, um Ihre eigene StorageClass zu verwenden.
- [`rc`](/de/operations/rc) ist auf dem Verwaltungshost installiert, bevor Sie die Speicherpool-Befehle in dieser Anleitung verwenden

Das Chart liegt im RustFS-Quell-Repository unter `helm/rustfs`:

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs/helm/rustfs
```

## 1. Schnellinstallation

Installieren Sie in einen eigenen Namespace und setzen Sie eigene Zugangsdaten sowie eine realistische Datengröße:

```bash
helm install rustfs . \
  --namespace rustfs --create-namespace \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key> \
  --set storageclass.dataStorageSize=100Gi \
  --set storageclass.logStorageSize=1Gi
```

:::note[Das Chart lehnt Standard-Zugangsdaten ab]

Das Rendern schlägt standardmäßig fehl, sofern nicht eine der folgenden Bedingungen zutrifft:

1. `secret.existingSecret` benennt ein Kubernetes-Secret, das Sie kontrollieren, oder
2. `secret.rustfs.access_key` und `secret.rustfs.secret_key` sind **beide** auf nicht leere Werte gesetzt, die nicht den Standardwerten entsprechen, oder
3. `secret.allowInsecureDefaults: true` ist gesetzt (nur für die lokale Entwicklung).

So wird eine versehentliche Bereitstellung mit den allgemein bekannten Standard-Zugangsdaten `rustfsadmin`/`rustfsadmin` verhindert. Das Setzen nur eines der beiden Schlüssel wird ebenfalls abgelehnt. Das Chart fällt für den fehlenden Schlüssel nie stillschweigend auf einen Standardwert zurück.

:::

Beobachten Sie, wie die Pods starten:

```bash
kubectl -n rustfs get pods -w
```

```text
NAME       READY   STATUS    RESTARTS   AGE
rustfs-0   1/1     Running   0          2m27s
rustfs-1   1/1     Running   0          2m27s
rustfs-2   1/1     Running   0          2m27s
rustfs-3   1/1     Running   0          2m27s
```

## 2. Bereitstellungsmodus wählen

Das Chart unterstützt zwei Modi, die Sie über die `mode`-Values auswählen:

| Modus | Werte | Arbeitslast | Aufbau |
| --- | --- | --- | --- |
| Verteilt (**Standard**) | `mode.distributed.enabled=true` | StatefulSet | `replicaCount` Pods (`>= 2`, Standard `4`) × `drivesPerNode` Daten-PVCs pro Pod (`>= 1`, abgeleitet als `4`, wenn `replicaCount: 4`, sonst als `1`; standardmäßig 16 Laufwerke) |
| Standalone | `mode.standalone.enabled=true`, `mode.distributed.enabled=false` | Deployment | 1 Pod, 1 Daten-PVC (ein Knoten, eine Festplatte) |

- **Standalone** entspricht einem einzelnen Knoten mit einer Festplatte: Es gibt keine Erasure-Coding-Redundanz über Knoten hinweg. Verwenden Sie diesen Modus für Entwicklung, Tests oder kleine Umgebungen, in denen der zugrunde liegende Speicher selbst für Dauerhaftigkeit sorgt. Vorhandene PVCs lassen sich über `mode.standalone.existingClaim.dataClaim` und `mode.standalone.existingClaim.logsClaim` wiederverwenden.
- **Verteilt** verhält sich wie [mehrere Knoten, mehrere Festplatten](../linux/multiple-node-multiple-disk.md): Objekte werden per Erasure Coding über Pods und PVCs verteilt. `replicaCount` legt die Anzahl der Pods fest (`>= 2`) und `drivesPerNode` die Anzahl der Daten-PVCs pro Pod (`>= 1`). Daraus ergeben sich insgesamt `replicaCount * drivesPerNode` Laufwerke. Wenn `drivesPerNode` nicht gesetzt ist (`null`), leitet das Chart `4` Daten-PVCs pro Pod ab, wenn `replicaCount` den Wert `4` hat (insgesamt 16 Laufwerke), und `1` Daten-PVC pro Pod für jeden anderen Wert von `replicaCount` (etwa `replicaCount: 16` für 16 Pods mit je einem PVC). Setzen Sie `replicaCount` und `drivesPerNode` ausdrücklich (zum Beispiel `replicaCount: 4` und `drivesPerNode: 2` für 8 Laufwerke), um einen anderen Aufbau zu wählen.

```bash
# Standalone mode
helm install rustfs . -n rustfs --create-namespace \
  --set mode.standalone.enabled=true \
  --set mode.distributed.enabled=false \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key>
```

## 3. Speicher dimensionieren

Die PVC-Größen stammen aus dem Block `storageclass`:

```yaml title="values-prod.yaml"
storageclass:
  name: local-path        # your StorageClass
  dataStorageSize: 256Mi  # per data PVC
  logStorageSize: 256Mi   # per logs PVC
```

:::warning[Die Standard-PVC-Größe ist 256Mi — ändern Sie sie]

Die Standardgröße des Charts für die Daten- und Protokoll-Volumes beträgt **256Mi**. Das reicht nur, um zu prüfen, ob das Chart funktioniert. Setzen Sie für jede reale Last bei der Installation `storageclass.dataStorageSize` (zum Beispiel `1Ti`) und `storageclass.logStorageSize` (zum Beispiel `1Gi`). Im verteilten Modus gilt die Datengröße für **jedes** Daten-PVC (`replicaCount * drivesPerNode`, standardmäßig 16 PVCs).

:::

Wenn Sie `config.rustfs.obs_log_directory` auf `""` setzen, werden die Protokoll-PVCs zusammen mit den zugehörigen Einhängungen deaktiviert. Eigene PVC-Annotationen tragen Sie unter `storageclass.pvcAnnotations.data` und `storageclass.pvcAnnotations.logs` ein.

## 4. Integritätsprüfungen

Das Chart erzeugt standardmäßig HTTP-Probes auf dem S3-Port (9000), passend zu den Integritätsendpunkten des Servers:

- **Liveness**: `GET /health` (`livenessProbe.httpGet.path`), anfängliche Verzögerung 30s, Intervall 5s
- **Readiness** (Bereitschaft): `GET /health/ready` (`readinessProbe.httpGet.path`), anfängliche Verzögerung 10s, Intervall 5s

Ein Pod wird den Service-Endpunkten erst hinzugefügt, nachdem `/health/ready` den Status `200` zurückgibt. Im verteilten Modus setzt das voraus, dass das Speicher-Quorum erreicht ist. Schwellenwerte und Zeitintervalle lassen sich über die Values `livenessProbe.*` und `readinessProbe.*` anpassen.

## 5. Härtung für den Produktivbetrieb

### Pod Disruption Budget

Standardmäßig deaktiviert. Aktivieren Sie es, damit freiwillige Evictions (Node-Drains, Cluster-Upgrades) nie mehr als einen Pod gleichzeitig entfernen:

```bash
--set pdb.create=true    # pdb.maxUnavailable defaults to 1
```

### Anti-Affinität und Topology Spread

`affinity.podAntiAffinity.enabled` ist standardmäßig `true` mit `topologyKey: kubernetes.io/hostname` und verteilt Pods auf unterschiedliche Nodes. Für eine Verteilung auf Zonenebene aktivieren Sie `topologySpreadConstraints.enabled` und tragen die Constraint-Einträge unverarbeitet unter `topologySpreadConstraints.constraints` ein. Sie gelten für das verteilte StatefulSet.

### mTLS zwischen Pods (cert-manager)

Setzen Sie `mtls.enabled=true`, um den Verkehr zwischen Pods zu verschlüsseln. Das Chart erzeugt cert-manager-Ressourcen vom Typ `Issuer` und `Certificate` für eine CA sowie für Server- und Client-Zertifikate. Um einen Issuer zu verwenden, den Sie bereits betreiben, setzen Sie `mtls.existingIssuerRef.enabled=true` zusammen mit `name`, `kind` (`Issuer` oder `ClusterIssuer`) und `group`.

### Ingress und Gateway API

Ingress ist standardmäßig aktiviert (`ingress.enabled=true`) mit `ingress.className: nginx`. Setzen Sie den Wert auf `traefik`, wenn das Ihr Controller ist. Das Chart setzt dann die passenden Annotations für Session-Stickiness. Legen Sie Ihre Domain über `ingress.hosts[0].host` fest (Standard `example.rustfs.com`). Aktivieren Sie für HTTPS `ingress.tls.enabled` und übergeben Sie das Zertifikat entweder mit `--set-file ingress.tls.crt=./tls.crt --set-file ingress.tls.key=./tls.key`, verweisen Sie auf ein vorhandenes Secret (`ingress.tls.existingSecret`) oder lassen Sie cert-manager eines ausstellen (`ingress.tls.certManager.enabled=true`).

Das Chart unterstützt außerdem die [Gateway API](https://gateway-api.sigs.k8s.io/) im Alpha-Status (`gatewayApi.enabled=true` zusammen mit `ingress.enabled=false`, Traefik-Gateway-Klasse) und erzeugt die Ressourcen `Gateway` und `HTTPRoute`.

## 6. Auf RustFS zugreifen

Ohne Ingress leiten Sie den Service per Port-Forward weiter:

```bash
kubectl -n rustfs port-forward svc/rustfs 9000:9000 9001:9001
```

- S3-API: `http://localhost:9000`
- Console (Weboberfläche): `http://localhost:9001`

Melden Sie sich an der Console mit dem Zugriffsschlüssel und dem geheimen Zugriffsschlüssel an, die Sie bei der Installation gesetzt haben. Wenn Ingress aktiviert ist, verwenden Sie stattdessen den konfigurierten Host (prüfen Sie das mit `kubectl -n rustfs get ing`). Der Service ist standardmäßig `ClusterIP`. Über `service.type` können Sie auf `NodePort` wechseln (S3 über `service.endpoint.nodePort: 32000`, Console über `service.console.nodePort: 32001`) oder auf `LoadBalancer`.

## 7. Mit Speicherpools skalieren

Im verteilten Modus kann das Chart mehrere **Speicherpools** betreiben: unabhängige StatefulSets, deren Laufwerke zusammen einen Cluster bilden. Das entspricht auf Chart-Ebene dem Hinzufügen eines Speicherpools, wie unter [Speicherpool-Erweiterung](../../operations/scaling/storage-pool-expansion.md) beschrieben.

Um eine bestehende Bereitstellung zu erweitern, aktivieren Sie Pools und beschreiben Sie das aktuelle Layout als Pool 0 plus die neue Kapazität:

```yaml title="values-prod.yaml (pools)"
pools:
  enabled: true
  list:
    - {}                  # pool 0: inherits top-level values and keeps the
                          # existing StatefulSet/pod/PVC names and data
    - replicaCount: 4     # pool 1: new capacity (replicaCount >= 2)
      storageclass:
        dataStorageSize: 10Gi
```

Wenden Sie die Änderung anschließend mit `helm upgrade` an. Jeder Eintrag kann `replicaCount` (`>= 2`), einen Block `storageclass` oder beides setzen. Ausgelassene Felder erben die Werte der obersten Ebene. Wenn `drivesPerNode` auf oberster Ebene ausdrücklich gesetzt ist, gilt diese Laufwerkszahl für jeden Pool. Wenn `drivesPerNode` nicht gesetzt ist (`null`), leitet das Chart die Laufwerkszahl pro Pool aus dem `replicaCount` dieses Pools ab (`4` Laufwerke pro Pod, wenn `replicaCount` den Wert `4` hat, sonst `1` Laufwerk pro Pod). Weitere Pools werden als StatefulSets `<fullname>-pool<N>` erzeugt. Alle Pools teilen sich den Headless Service, den Haupt-Service, die Konfiguration und die Zugangsdaten.

:::warning[Pools lassen sich nur anhängen]

Der Listenindex bestimmt den Namen des StatefulSet. Entfernen Sie Einträge nicht und ändern Sie ihre Reihenfolge nicht. Nehmen Sie einen Pool mit `rc admin decommission` außer Betrieb, bevor Sie ihn aus der Liste entfernen.

:::

Was während des Rollouts zu erwarten ist, laut Dokumentation des Charts:

- **Rechnen Sie mit Neustarts.** Pods starten neu, bis jeder Pod in jedem Pool auflösbar ist. Der Server startet nicht, wenn Peer-Adressen nicht aufgelöst werden können. Erwarten Sie daher einige Crash-Loops, bevor der Cluster konvergiert. Das ist unbedenklich.
- **Führen Sie anschließend ein Rebalancing aus.** Nachdem der Cluster konvergiert ist, führen Sie `rc admin rebalance start <alias>` aus, um vorhandene Objekte auf den neuen Pool zu verteilen.
- Das PodDisruptionBudget umfasst alle Pools. Mit dem Standard `pdb.maxUnavailable: 1` darf höchstens ein Pod des gesamten Clusters gleichzeitig entfernt werden.

:::note

`rc` ist der Befehlszeilenclient von RustFS. Verwenden Sie `rc admin pool list`, `expand`, `rebalance` und `decommission` für die Speicherpool-Abläufe, die das Chart beschreibt.

:::

## 8. Deinstallation

```bash
helm uninstall rustfs -n rustfs
```

:::note

Helm löscht keine PVCs, die aus Volume-Claim-Templates eines StatefulSet entstanden sind. Wenn Sie die Daten verwerfen möchten, entfernen Sie die PVCs ausdrücklich (`kubectl -n rustfs delete pvc -l app.kubernetes.io/name=rustfs`). Andernfalls hängt eine spätere Neuinstallation mit demselben Release-Namen sie wieder an.

:::

## Nächste Schritte

- [Speicherpool-Erweiterung](../../operations/scaling/storage-pool-expansion.md) — wie die Erweiterung von Speicherpools auf Cluster-Ebene funktioniert
- [Kubernetes-Upgrade](../../operations/upgrade/kubernetes/index.md) — Upgrade von Bereitstellungen, die Helm oder der Operator verwaltet
- [TLS-Konfiguration](../../integration/tls-configured.md) — durchgehende TLS-Optionen
