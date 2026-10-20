---
title: mTLS
description: Konfigurieren Sie gegenseitiges TLS zwischen RustFS-Pods, die das Helm-Chart bereitstellt.
---

Das Chart kann gegenseitiges Transport Layer Security (mTLS) für die Kommunikation zwischen RustFS-Pods aktivieren. Wenn die Funktion aktiv ist, verlangt RustFS Client-Zertifikate, verwendet HTTPS für erzeugte Peer-URLs und hängt Server-, Client- und CA-Material in jeden Pod ein.

## Anforderungen

mTLS verwendet die cert-manager-Ressourcen `Issuer` und `Certificate`. Installieren Sie cert-manager, bevor Sie mTLS aktivieren, und prüfen Sie, dass die CRDs verfügbar sind:

```bash
kubectl get crd certificates.cert-manager.io issuers.cert-manager.io
```

## 1. Vom Chart verwaltete CA verwenden

Ergänzen Sie die folgende Einstellung in Ihrer vorhandenen Values-Datei:

```yaml title="values.yaml"
mtls:
  enabled: true
```

Aktualisieren Sie das Release:

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

Das Chart erzeugt eine selbstsignierte Root-CA, einen Issuer im Namespace sowie Server- und Client-Certificates. Es hängt die resultierenden Secrets ein und konfiguriert RustFS mit `RUSTFS_SERVER_MTLS_ENABLE=1` und `RUSTFS_TLS_PATH=/opt/tls`. Die Integritäts-Probes verwenden ebenfalls das erzeugte Client-Zertifikat.

## 2. Vorhandenen Issuer verwenden

Um einen Issuer oder ClusterIssuer zu verwenden, den Ihre Plattform bereits verwaltet, konfigurieren Sie dessen Referenz:

```yaml title="values.yaml"
mtls:
  enabled: true
  existingIssuerRef:
    enabled: true
    name: internal-ca
    kind: ClusterIssuer
    group: cert-manager.io
```

Der Issuer muss bereit sein und sowohl Server- als auch Client-Zertifikate im Namespace `rustfs` ausstellen können. Verwenden Sie `kind: Issuer` für einen auf den Namespace begrenzten Issuer.

## 3. mTLS prüfen

```bash
kubectl -n rustfs get issuer,certificate,secret
kubectl -n rustfs describe certificate rustfs-server-tls
kubectl -n rustfs describe certificate rustfs-client-tls
kubectl -n rustfs get pods
```

Für ein Release namens `rustfs` heißen die erzeugten Zertifikats-Secrets `rustfs-server-tls` und `rustfs-client-tls`.

:::warning[Externen Zugriff planen]

mTLS verlangt, dass Clients ein vertrauenswürdiges Zertifikat vorlegen. Prüfen Sie, wie Ihr Ingress-Controller oder ein anderer externer Client dieses Zertifikat vorlegt, bevor Sie mTLS für eine bestehende Bereitstellung aktivieren.

:::
