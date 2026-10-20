---
title: Mehrmandantenbetrieb
description: Legen Sie isolierte RustFS-Tenants an und greifen Sie auf deren S3-API und Console-Services zu.
---

Ein `Tenant` steht für einen unabhängigen RustFS-Cluster. Verwenden Sie für jedes Team oder jede Arbeitslast einen eigenen Namespace, ein eigenes Zugangsdaten-Secret und eine eigene Tenant-Ressource.

## 1. Namespace und Zugangsdaten anlegen

Legen Sie das Secret direkt an, damit die Zugangsdaten nicht in einem Manifest gespeichert werden:

```bash
kubectl create namespace storage-a
kubectl -n storage-a create secret generic rustfs-tenant-creds \
  --from-literal=accesskey='<your-access-key>' \
  --from-literal=secretkey='<your-secret-key>'
```

## 2. Tenant definieren

Dieses Entwicklungsbeispiel erzeugt einen RustFS-Pod und ein PVC mit `10Gi`. Ersetzen Sie `standard` durch eine StorageClass in Ihrem Cluster.

```yaml title="tenant.yaml"
apiVersion: rustfs.com/v1alpha1
kind: Tenant
metadata:
  name: tenant-a
  namespace: storage-a
spec:
  image: rustfs/rustfs:1.0.0-beta.10
  credsSecret:
    name: rustfs-tenant-creds
  pools:
    - name: pool-0
      servers: 1
      persistence:
        volumesPerServer: 1
        volumeClaimTemplate:
          storageClassName: standard
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 10Gi
```

## 3. Anwenden und prüfen

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a get tenant,pods,pvc,svc
kubectl -n storage-a describe tenant tenant-a
```

## 4. Auf RustFS zugreifen

```bash
kubectl -n storage-a port-forward svc/tenant-a-io 9000:9000
kubectl -n storage-a port-forward svc/tenant-a-console 9001:9001
```

Führen Sie die Befehle in getrennten Terminals aus. Verwenden Sie `http://localhost:9000` als S3-Endpunkt und öffnen Sie `http://localhost:9001` für die Tenant-Console (Weboberfläche).

Um einen weiteren Tenant hinzuzufügen, wiederholen Sie den Vorgang mit einem anderen Namespace, Secret und Tenant-Namen. Listen Sie alle verwalteten Tenants so auf:

```bash
kubectl get tenants --all-namespaces
```

:::warning[Produktivtopologie]

Das Beispiel mit einem Server dient der Evaluierung. Produktive Tenants benötigen ein verteiltes Pool-Layout, Ressourcenanforderungen, Scheduling-Einschränkungen und eine unveränderliche Image-Referenz.

:::
