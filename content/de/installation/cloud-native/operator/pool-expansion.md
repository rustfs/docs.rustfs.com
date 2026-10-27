---
title: "Tenant-Speicherpool erweitern"
description: Erweitern Sie die Speicherkapazität eines RustFS-Tenants, indem Sie einen Speicherpool anhängen.
---

Alle Pools eines Tenants bilden einen RustFS-Cluster. Erweitern Sie die Kapazität, indem Sie einen neuen Pool an `spec.pools` anhängen. Ändern Sie die Form eines bestehenden Pools nicht.

:::warning[Bestehende Pools sind unveränderlich]

Ändern Sie `servers` oder `persistence.volumesPerServer` eines bestehenden Pools nicht. Der Operator erzeugt für jeden Pool ein unveränderliches StatefulSet.

:::

## 1. Tenant prüfen

```bash
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Prüfen Sie, dass der Tenant `Ready` ist und der Cluster genug Rechen- und Speicherkapazität hat.

## 2. Pool hinzufügen

Hängen Sie den folgenden Eintrag an die bestehende Liste `spec.pools` in `tenant.yaml` an. Lassen Sie alle vorhandenen Einträge unverändert.

```yaml title="tenant.yaml"
- name: pool-1
  servers: 2
  persistence:
    volumesPerServer: 2
    volumeClaimTemplate:
      storageClassName: standard
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 100Gi
```

Dieser Pool erzeugt vier PVCs: zwei Server multipliziert mit zwei Volumes pro Server. Wenden Sie das vollständige Tenant-Manifest an:

```bash
kubectl apply -f tenant.yaml
```

## 3. Erweiterung beobachten

```bash
kubectl -n storage-a get tenant tenant-a -w
kubectl -n storage-a get pods,pvc \
  -l rustfs.pool=pool-1
```

Warten Sie, bis der Tenant wieder `Ready` ist, bevor Sie eine weitere Topologieänderung vornehmen. Die Vergrößerung eines bestehenden PVC ist ein eigener Kubernetes-Speichervorgang und hängt von der StorageClass ab.
