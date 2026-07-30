---
title: Multi-Tenant
description: Create isolated RustFS Tenants and access their S3 API and Console services.
---

A `Tenant` represents one independent RustFS cluster. Use a separate namespace, credentials Secret, and Tenant resource for each team or workload.

## 1. Create a namespace and credentials

Create the Secret directly so credentials are not stored in a manifest:

```bash
kubectl create namespace storage-a
kubectl -n storage-a create secret generic rustfs-tenant-creds \
  --from-literal=accesskey='<your-access-key>' \
  --from-literal=secretkey='<your-secret-key>'
```

## 2. Define the Tenant

This development example creates one RustFS Pod and one `10Gi` PVC. Replace `standard` with a StorageClass in your cluster.

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

## 3. Apply and verify

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a get tenant,pods,pvc,svc
kubectl -n storage-a describe tenant tenant-a
```

## 4. Access RustFS

```bash
kubectl -n storage-a port-forward svc/tenant-a-io 9000:9000
kubectl -n storage-a port-forward svc/tenant-a-console 9001:9001
```

Run the commands in separate terminals. Use `http://localhost:9000` as the S3 endpoint and open `http://localhost:9001` for the Tenant Console.

To add another Tenant, repeat the process with a different namespace, Secret, and Tenant name. List all managed Tenants with:

```bash
kubectl get tenants --all-namespaces
```

:::warning[Production topology]

The one-server example is for evaluation. Production Tenants need a distributed pool layout, resource requests, scheduling constraints, and an immutable image reference.

:::