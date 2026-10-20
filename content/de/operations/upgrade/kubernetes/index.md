---
title: "Kubernetes-Upgrade"
description: "Aktualisieren Sie RustFS-Bereitstellungen unter dem Helm-Chart oder dem RustFS Operator und prüfen Sie jedes Rollout."
---

Aktualisieren Sie eine Kubernetes-Bereitstellung über das Werkzeug, dem ihre Ressourcen gehören. Verwenden Sie Helm für eine direkte Installation mit dem RustFS-Helm-Chart. Bei einer Operator-Installation aktualisieren Sie das Operator-Release und jeden Tenant über die jeweiligen deklarativen Konfigurationen.

## Vor dem Upgrade

Lesen Sie die Versionshinweise von RustFS, Chart und Operator, die für Ihre Bereitstellung gelten. Bestätigen Sie, dass der Cluster genug Kapazität hat, um Pods zu ersetzen, und dass alle aktuellen Workloads bereit sind:

```bash
kubectl get nodes
kubectl -n <namespace> get pods,pvc
```

Löschen Sie während eines Upgrades oder Rollbacks keine PersistentVolumeClaims (PVCs). Behalten Sie die vorhandenen Werte und Manifeste der Bereitstellung unter Versionsverwaltung, einschließlich Image-Tags, Speichertopologie, Scheduling-Regeln und Secret-Verweisen.

## Eine Helm-Chart-Bereitstellung aktualisieren

Dieser Ablauf gilt für RustFS, das direkt mit dem [RustFS-Helm-Chart](/de/installation/cloud-native/helm-chart/installation) installiert wurde. Er gilt nicht für einen Tenant, den der RustFS Operator angelegt hat.

Notieren Sie die aktuelle Release-Revision, die Chart-Version, die Anwendungsversion und die wirksam gesetzten, von Ihnen gelieferten Werte:

```bash
helm status rustfs --namespace rustfs
helm history rustfs --namespace rustfs
helm get values rustfs --namespace rustfs -o yaml > rustfs-values.previous.yaml
```

Bereiten Sie das Ziel-Chart auf dieselbe Weise vor wie bei der Installation. Wenn Sie das Chart-Repository verwenden, aktualisieren Sie dessen Index und setzen Sie die Chart-Referenz:

```bash
helm repo update rustfs
export RUSTFS_CHART=rustfs/rustfs
```

Wenn Sie einen Quellcode-Checkout verwenden, checken Sie das RustFS-Zielrelease aus und lassen Sie `RUSTFS_CHART` auf dessen Chart-Verzeichnis zeigen:

```bash
export RUSTFS_CHART=./helm/rustfs
```

Aktualisieren Sie Ihre gepflegte Values-Datei um release-spezifische Änderungen. Setzen Sie `image.rustfs.tag` auf die konkrete RustFS-Version, die Sie betreiben wollen, und führen Sie dann das Upgrade aus:

```bash
helm upgrade rustfs "$RUSTFS_CHART" \
	--namespace rustfs \
	-f <values-file> \
	--set-string image.rustfs.tag=<target-version> \
	--wait \
	--timeout 10m
```

Helm führt eine rollierende Aktualisierung aus. Beobachten Sie das Release und die Pods, bis das Rollout abgeschlossen ist:

```bash
helm status rustfs --namespace rustfs
kubectl -n rustfs get pods,pvc,services
```

Der verteilte Modus erzeugt ein StatefulSet:

```bash
kubectl -n rustfs rollout status statefulset/rustfs --timeout=10m
```

Der eigenständige Modus erzeugt ein Deployment:

```bash
kubectl -n rustfs rollout status deployment/rustfs --timeout=10m
```

Prüfen Sie nach dem Rollout die S3-API. Wenn sie außerhalb des Clusters nicht erreichbar ist, starten Sie zuerst die Portweiterleitung aus der Installationsanleitung:

```bash
curl -fsS http://localhost:9000/health/ready
```

### Ein Helm-Release zurücksetzen

Listen Sie die Release-Historie auf, ermitteln Sie die letzte funktionierende Revision und lassen Sie Helm Chart, Werte und Image-Konfiguration wiederherstellen:

```bash
helm history rustfs --namespace rustfs
helm rollback rustfs <previous-revision> \
	--namespace rustfs \
	--wait \
	--timeout 10m
```

Prüfen Sie nach dem Rollback erneut den Workload und den Bereitschafts-Endpunkt. Deinstallieren Sie das Release nicht und löschen Sie seine PVCs nicht.

## Eine Operator-Bereitstellung aktualisieren

Eine Operator-Bereitstellung hat zwei unabhängige Upgrade-Ebenen:

- Der RustFS Operator und die Operator Console laufen aus dem Helm-Release `rustfs-operator`.
- Jeder Tenant führt das RustFS-Image aus, das im Feld `spec.image` dieses Tenants steht.

Aktualisieren und prüfen Sie die Steuerungsebene des Operators, bevor Sie Tenant-Images ändern. Kombinieren Sie ein Operator-Upgrade nicht mit mehreren Tenant-Upgrades in einem Wartungsschritt.

### Das Operator-Release aktualisieren

Notieren Sie das aktuelle Release und speichern Sie seine Werte:

```bash
helm status rustfs-operator --namespace rustfs-system
helm history rustfs-operator --namespace rustfs-system
helm get values rustfs-operator --namespace rustfs-system -o yaml \
	> rustfs-operator-values.previous.yaml
```

Aktualisieren Sie den Quellcode-Checkout des Operators auf das Zielrelease und prüfen Sie Änderungen an den Chart-Werten und den CustomResourceDefinitions (CRDs). Helm aktualisiert CRDs im Verzeichnis `crds/` eines Charts nicht. Wenden Sie deshalb beide Ziel-CRDs an, bevor Sie den Controller aktualisieren:

```bash
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/tenant.yaml
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/policybinding-crd.yaml
```

Die CRDs gelten clusterweit und werden von jedem Tenant-Namespace gemeinsam genutzt. Wenn Sie sie zuerst anwenden, kann der Kubernetes-API-Server Felder annehmen, die der neue Controller einführt. Nachdem beide Befehle erfolgreich waren, aktualisieren Sie den Operator mit Ihrer gepflegten Values-Datei:

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
	--namespace rustfs-system \
	-f <operator-values-file> \
	--set-string operator.image.tag=<target-operator-version> \
	--set-string console.image.tag=<target-operator-version> \
	--wait \
	--timeout 10m
```

Prüfen Sie die CRDs und alle Komponenten der Steuerungsebene, bevor Sie einen Tenant aktualisieren:

```bash
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator --timeout=10m
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console --timeout=10m
kubectl get tenants --all-namespaces
```

CRD-Änderungen gehören nicht zur Helm-Release-Historie, und `helm rollback` stellt sie nicht wieder her. Lesen Sie die Kompatibilitäts- und Migrationshinweise des Zielreleases, bevor Sie ein Rollback des Controllers erwägen. Wenn dieses Release ein Downgrade ausdrücklich unterstützt, stellen Sie die vorherige Helm-Revision wieder her, ohne ältere CRD-Dateien anzuwenden:

```bash
helm history rustfs-operator --namespace rustfs-system
helm rollback rustfs-operator <previous-revision> \
	--namespace rustfs-system \
	--wait \
	--timeout 10m
```

Führen Sie kein Downgrade über eine dokumentierte Einwegmigration von Workload oder Sicherheit hinweg aus. Rollen Sie stattdessen vorwärts auf ein korrigiertes Operator-Release.

### Einen Tenant aktualisieren

Der Operator besitzt die StatefulSets jedes Tenants. Ändern Sie deren Container-Images nicht direkt, weil die Reconciliation das vom Tenant deklarierte Image wiederherstellt.

Notieren Sie das aktuelle Tenant-Image und bestätigen Sie die Bedingung `Ready`:

```bash
kubectl -n storage-a get tenant tenant-a \
	-o jsonpath='{.spec.image}{"\n"}'
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Ändern Sie in der vollständigen `tenant.yaml`, mit der Sie den Tenant installiert haben, nur `spec.image` auf `rustfs/rustfs:<target-version>`. Lassen Sie Speicherpools, PVC-Vorlagen, Zugangsdaten und die übrigen Einstellungen unverändert. Wenden Sie das vollständige Manifest an und warten Sie, bis der Operator die neue Generation abgeglichen hat:

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
kubectl -n storage-a get pods -l rustfs.tenant=tenant-a
```

Aktualisieren Sie jeweils einen Tenant. Bestätigen Sie seine S3-API und den [Clusterstatus](/de/operations/status-check), bevor Sie einen weiteren Tenant aktualisieren.

### Einen Tenant zurücksetzen

Setzen Sie das zuvor notierte Image in `spec.image` wieder ein, wenden Sie das vollständige Tenant-Manifest an und warten Sie erneut auf `Ready`:

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
```

Der Operator verwendet die vorhandenen PVCs des Tenants weiter. Löschen Sie während des Rollbacks weder den Tenant noch seine StatefulSets oder PVCs.

## Nächste Schritte

Prüfen Sie nach dem Rollout die Bereitstellung über [Statusprüfung](/de/operations/status-check) und [Observability](/de/operations/observability).
