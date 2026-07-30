---
title: cert-manager
description: Use cert-manager to issue and renew TLS certificates for a RustFS Helm deployment.
---

Use **cert-manager** to issue the certificate referenced by the RustFS Ingress. This provides HTTPS for the public S3 API and Console endpoint and allows cert-manager to renew the certificate.

## Requirements

- cert-manager is installed and its controller Pods are ready.
- An `Issuer` or `ClusterIssuer` is ready.
- The RustFS hostname resolves to the Ingress controller.

Verify the issuer before installing RustFS:

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl -n cert-manager get pods
```

## 1. Configure Ingress TLS

Add the Ingress and certificate settings to your standalone or distributed values file:

```yaml title="values.yaml"
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: s3.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    enabled: true
    certManager:
      enabled: true
    existingSecret:
      enabled: false
      name: ""
```

Replace the Ingress class, issuer, and hostname for your cluster. For a namespace-scoped Issuer, use the `cert-manager.io/issuer` annotation instead.

## 2. Apply the configuration

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

The Ingress references the `rustfs-tls` Secret for a release named `rustfs`. cert-manager ingress-shim reads the issuer annotation and creates a Certificate that writes to this Secret.

## 3. Verify the certificate

```bash
kubectl -n rustfs get ingress,certificate,certificaterequest
kubectl -n rustfs describe certificate rustfs-tls
kubectl -n rustfs get secret rustfs-tls
```

Wait for the Certificate to report `Ready=True`, then open `https://s3.example.com`.

## Use cert-manager with mTLS

The chart also uses cert-manager to issue server and client certificates when `mtls.enabled=true`. See [mTLS](./mtls.md) to use the chart-managed CA or reference an existing issuer.