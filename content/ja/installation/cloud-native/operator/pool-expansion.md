---
title: Pool Expansion
description: Add storage capacity to a RustFS Tenant by appending a storage pool.
---

All pools in a Tenant form one RustFS cluster. Add capacity by appending a new pool to `spec.pools`; do not change the shape of an existing pool.

:::warning[Existing pools are immutable]

Do not change `servers` or `persistence.volumesPerServer` on an existing pool. The Operator creates an immutable StatefulSet for each pool.

:::

## 1. Check the Tenant

```bash
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Confirm that the Tenant is `Ready` and the cluster has enough compute and storage capacity.

## 2. Add a pool

Append the following entry to the existing `spec.pools` list in `tenant.yaml`. Keep all existing entries unchanged.

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

This pool creates four PVCs: two servers multiplied by two volumes per server. Apply the complete Tenant manifest:

```bash
kubectl apply -f tenant.yaml
```

## 3. Watch the expansion

```bash
kubectl -n storage-a get tenant tenant-a -w
kubectl -n storage-a get pods,pvc \
  -l rustfs.pool=pool-1
```

Wait for the Tenant to return to `Ready` before making another topology change. Increasing an existing PVC size is a separate Kubernetes storage operation and depends on the StorageClass.