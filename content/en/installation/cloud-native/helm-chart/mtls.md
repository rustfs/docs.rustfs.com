---
title: mTLS
description: Configure mutual TLS between RustFS Pods deployed by the Helm chart.
---

The chart can enable mutual Transport Layer Security (mTLS) for RustFS Pod communication. When enabled, RustFS requires client certificates, uses HTTPS for generated peer URLs, and mounts server, client, and CA material into every Pod.

## Requirements

mTLS uses cert-manager `Issuer` and `Certificate` resources. Install cert-manager before enabling it and confirm that its CRDs are available:

```bash
kubectl get crd certificates.cert-manager.io issuers.cert-manager.io
```

## 1. Use the chart-managed CA

Add the following setting to your existing values file:

```yaml title="values.yaml"
mtls:
  enabled: true
```

Upgrade the release:

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

The chart creates a self-signed root CA, a namespace Issuer, and server and client Certificates. It mounts the resulting Secrets and configures RustFS with `RUSTFS_SERVER_MTLS_ENABLE=1` and `RUSTFS_TLS_PATH=/opt/tls`. Health probes also use the generated client certificate.

## 2. Use an existing Issuer

To use an Issuer or ClusterIssuer already managed by your platform, configure its reference:

```yaml title="values.yaml"
mtls:
  enabled: true
  existingIssuerRef:
    enabled: true
    name: internal-ca
    kind: ClusterIssuer
    group: cert-manager.io
```

The issuer must be ready and able to issue both server and client certificates in the `rustfs` namespace. Use `kind: Issuer` for a namespace-scoped issuer.

## 3. Verify mTLS

```bash
kubectl -n rustfs get issuer,certificate,secret
kubectl -n rustfs describe certificate rustfs-server-tls
kubectl -n rustfs describe certificate rustfs-client-tls
kubectl -n rustfs get pods
```

For a release named `rustfs`, the generated certificate Secrets are `rustfs-server-tls` and `rustfs-client-tls`.

:::warning[Plan external access]

mTLS requires clients to present a trusted certificate. Validate how your Ingress controller or other external client presents that certificate before enabling mTLS on an existing deployment.

:::