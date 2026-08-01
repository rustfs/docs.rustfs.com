---
title: Install
description: Prepare Kubernetes, install RustFS Operator, and access its Console securely.
---

This guide installs the Operator with Helm, verifies the deployment, and exposes the Operator Console locally or through HTTPS.

## Requirements

| Component | Requirement |
|-----------|-------------|
| Kubernetes | `v1.30` or later |
| Helm | `v3.0` or later |
| kubectl | Compatible with the Kubernetes cluster |
| StorageClass | Dynamic PVC provisioning for Tenant storage |

Your account must be able to create CRDs, cluster RBAC, Deployments, and Services. Confirm the target cluster before installation:

```bash
kubectl config current-context
kubectl get storageclass
```

## 1. Install the Operator

The Helm chart is stored in the Operator repository:

```bash
git clone https://github.com/rustfs/operator.git
cd operator

helm upgrade --install rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  --create-namespace
```

Common settings belong in a values file:

```yaml title="values.yaml"
operator:
  replicas: 1
  metrics:
    enabled: true
  tenantMonitor:
    enabled: true
    intervalSeconds: 300
console:
  enabled: true
  service:
    type: ClusterIP
```

Apply the file with `-f values.yaml`. The chart generates `OPERATOR_*` variables from these values; do not duplicate them under `operator.env`.

## 2. Verify the installation

```bash
kubectl -n rustfs-system get pods,services
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console
```

## 3. Access the Operator Console

The Console listens on port `9090`. Generate a short-lived login token:

```bash
kubectl -n rustfs-system create token rustfs-operator-console --duration=24h
```

Forward the Console service to your workstation:

```bash
kubectl -n rustfs-system port-forward \
  svc/rustfs-operator-console 19090:9090
```

Open `http://127.0.0.1:19090` and paste the token into the login form. The Helm installation notes print the exact ServiceAccount and Service names when release names or namespaces differ.

:::note[Local HTTP access]

If your browser does not retain the login over HTTP, set `CONSOLE_COOKIE_SECURE=false` under `console.env` for local testing only. Keep secure cookies enabled for HTTPS.

:::

## 4. Configure Console TLS

Use one HTTPS hostname for both the Console UI and `/api/v1`. Create a TLS Secret, or let cert-manager create it, then enable Ingress:

```yaml title="values.yaml"
console:
  ingress:
    enabled: true
    className: nginx
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod
    hosts:
      - host: console.example.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: console-tls
        hosts:
          - console.example.com
```

Upgrade the release with the values file:

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  -f values.yaml
```

Replace the Ingress class, issuer, and hostname for your environment. If cert-manager is not installed, create the `console-tls` Secret with your certificate and private key before the upgrade.

Next, [create a Tenant](./tenant.md).