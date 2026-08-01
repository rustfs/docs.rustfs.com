---
title: KMS Integration
description: Configure local or HashiCorp Vault key management for a RustFS Tenant through the Operator encryption API.
---

Configure Key Management Service (KMS) integration through `spec.encryption`. Do not add `RUSTFS_KMS_*` variables to `spec.env`; the Operator generates them from the structured Tenant configuration and Secret references.

## Choose a backend

Use `local` only for a single-server Tenant. Use `vault` for distributed deployments where every Tenant Pod can reach HashiCorp Vault.

## Local KMS

Create a master key Secret:

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

Add the encryption block to the existing Tenant manifest:

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

The key directory must be inside a mounted data path so it survives Pod replacement.

## HashiCorp Vault KMS

Create a Secret containing a Vault token:

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

Add the Vault configuration to the existing Tenant manifest:

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

Every Tenant Pod must be able to resolve and connect to the Vault endpoint and trust its certificate.

## Apply the configuration

```bash
kubectl apply -f local-kms-secret.yaml
kubectl apply -f tenant.yaml
kubectl -n storage-a describe tenant tenant-a
```

For Vault, apply `vault-kms-secret.yaml` before `tenant.yaml`. Changing encryption settings rolls the affected StatefulSets.

:::warning[Protect encryption keys]

Back up key material and test recovery before storing production data. Losing the local master key or Vault keys can make encrypted objects unrecoverable.

:::