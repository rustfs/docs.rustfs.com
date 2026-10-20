---
title: cert-manager
description: Verwenden Sie cert-manager, um TLS-Zertifikate für eine RustFS-Helm-Bereitstellung auszustellen und zu erneuern.
---

Verwenden Sie **cert-manager**, um das Zertifikat auszustellen, auf das der RustFS-Ingress verweist. Damit stellen Sie HTTPS für den öffentlichen Endpunkt der S3-API und der Console (Weboberfläche) bereit und ermöglichen cert-manager die Erneuerung des Zertifikats.

## Anforderungen

- cert-manager ist installiert und die Controller-Pods sind bereit.
- Ein `Issuer` oder `ClusterIssuer` ist bereit.
- Der RustFS-Hostname wird auf den Ingress-Controller aufgelöst.

Prüfen Sie den Issuer, bevor Sie RustFS installieren:

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl -n cert-manager get pods
```

## 1. Ingress-TLS konfigurieren

Ergänzen Sie die Ingress- und Zertifikatseinstellungen in Ihrer Standalone- oder verteilten Values-Datei:

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

Ersetzen Sie Ingress-Klasse, Issuer und Hostname für Ihren Cluster. Verwenden Sie für einen auf den Namespace begrenzten Issuer stattdessen die Annotation `cert-manager.io/issuer`.

## 2. Konfiguration anwenden

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

Der Ingress verweist für ein Release namens `rustfs` auf das Secret `rustfs-tls`. cert-manager ingress-shim liest die Issuer-Annotation und erzeugt ein Certificate, das in dieses Secret schreibt.

## 3. Zertifikat prüfen

```bash
kubectl -n rustfs get ingress,certificate,certificaterequest
kubectl -n rustfs describe certificate rustfs-tls
kubectl -n rustfs get secret rustfs-tls
```

Warten Sie, bis das Certificate `Ready=True` meldet, und öffnen Sie anschließend `https://s3.example.com`.

## cert-manager mit mTLS verwenden

Das Chart verwendet cert-manager auch, um Server- und Client-Zertifikate auszustellen, wenn `mtls.enabled=true`. Unter [mTLS](./mtls.md) erfahren Sie, wie Sie die vom Chart verwaltete CA verwenden oder einen vorhandenen Issuer referenzieren.
