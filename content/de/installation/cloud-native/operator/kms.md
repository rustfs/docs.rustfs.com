---
title: KMS-Integration
description: Konfigurieren Sie die lokale oder die HashiCorp-Vault-Schlüsselverwaltung für einen RustFS-Tenant über die Verschlüsselungs-API des Operators.
---

Konfigurieren Sie die Integration des Key Management Service (KMS) über `spec.encryption`. Fügen Sie keine Variablen `RUSTFS_KMS_*` zu `spec.env` hinzu. Der Operator erzeugt sie aus der strukturierten Tenant-Konfiguration und den Secret-Referenzen.

## Backend wählen

Verwenden Sie `local` nur für einen Tenant mit einem einzelnen Server. Verwenden Sie `vault` für verteilte Bereitstellungen, in denen jeder Tenant-Pod HashiCorp Vault erreichen kann.

## Lokales KMS

Legen Sie ein Secret für den Hauptschlüssel an:

```yaml title="local-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-local-kms
  namespace: storage-a
type: Opaque
stringData:
  local-master-key: "replace-with-a-random-master-key"
```

Ergänzen Sie den Verschlüsselungsblock im vorhandenen Tenant-Manifest:

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: local
    local:
      keyDirectory: /data/rustfs0/.kms-keys
      masterKeySecretRef:
        name: rustfs-local-kms
        key: local-master-key
    defaultKeyId: tenant-default
```

Das Schlüsselverzeichnis muss in einem eingehängten Datenpfad liegen, damit es einen Pod-Ersatz übersteht.

## HashiCorp Vault als KMS

Legen Sie ein Secret mit einem Vault-Token an:

```yaml title="vault-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-kms
  namespace: storage-a
type: Opaque
stringData:
  vault-token: "replace-with-vault-token"
```

Ergänzen Sie die Vault-Konfiguration im vorhandenen Tenant-Manifest:

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: vault
    vault:
      endpoint: https://vault.example.com:8200
    kmsSecret:
      name: rustfs-kms
    defaultKeyId: tenant-default
```

Jeder Tenant-Pod muss den Vault-Endpunkt auflösen und erreichen können und seinem Zertifikat vertrauen.

## Konfiguration anwenden

```bash
kubectl apply -f local-kms-secret.yaml
kubectl apply -f tenant.yaml
kubectl -n storage-a describe tenant tenant-a
```

Bei Vault wenden Sie `vault-kms-secret.yaml` vor `tenant.yaml` an. Eine Änderung der Verschlüsselungseinstellungen führt ein Rolling Update der betroffenen StatefulSets aus.

:::warning[Verschlüsselungsschlüssel schützen]

Sichern Sie das Schlüsselmaterial und prüfen Sie die Wiederherstellung, bevor Sie Produktivdaten speichern. Der Verlust des lokalen Hauptschlüssels oder der Vault-Schlüssel kann dazu führen, dass sich verschlüsselte Objekte nicht wiederherstellen lassen.

:::
