---
title: "RustFS-Operator installieren"
description: Bereiten Sie Kubernetes vor, installieren Sie den RustFS Operator und greifen Sie sicher auf seine Console zu.
---

Diese Anleitung installiert den Operator mit Helm, prüft die Bereitstellung und macht die Operator-Console (Weboberfläche) lokal oder über HTTPS erreichbar.

## Anforderungen

| Komponente | Anforderung |
|-----------|-------------|
| Kubernetes | `v1.30` oder neuer |
| Helm | `v3.0` oder neuer |
| kubectl | Kompatibel mit dem Kubernetes-Cluster |
| StorageClass | Dynamische PVC-Bereitstellung für Tenant-Speicher |

Ihr Konto muss CRDs, Cluster-RBAC, Deployments und Services anlegen können. Bestätigen Sie den Zielcluster vor der Installation:

```bash
kubectl config current-context
kubectl get storageclass
```

## 1. Operator installieren

Das Helm-Chart liegt im Operator-Repository:

```bash
git clone https://github.com/rustfs/operator.git
cd operator

helm upgrade --install rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  --create-namespace
```

Übliche Einstellungen gehören in eine Values-Datei:

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

Wenden Sie die Datei mit `-f values.yaml` an. Das Chart erzeugt aus diesen Werten die Variablen `OPERATOR_*`. Duplizieren Sie sie nicht unter `operator.env`.

## 2. Installation prüfen

```bash
kubectl -n rustfs-system get pods,services
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console
```

## 3. Auf die Operator-Console zugreifen

Die Console lauscht auf Port `9090`. Erzeugen Sie ein kurzlebiges Anmelde-Token:

```bash
kubectl -n rustfs-system create token rustfs-operator-console --duration=24h
```

Leiten Sie den Console-Service auf Ihre Arbeitsstation weiter:

```bash
kubectl -n rustfs-system port-forward \
  svc/rustfs-operator-console 19090:9090
```

Öffnen Sie `http://127.0.0.1:19090` und fügen Sie das Token in das Anmeldeformular ein. Die Helm-Installationshinweise geben die genauen Namen von ServiceAccount und Service aus, wenn Release-Namen oder Namespaces abweichen.

:::note[Lokaler HTTP-Zugriff]

Wenn Ihr Browser die Anmeldung über HTTP nicht beibehält, setzen Sie `CONSOLE_COOKIE_SECURE=false` unter `console.env` ausschließlich für lokale Tests. Lassen Sie sichere Cookies für HTTPS aktiviert.

:::

## 4. TLS der Console konfigurieren

Verwenden Sie einen HTTPS-Hostnamen sowohl für die Console-Oberfläche als auch für `/api/v1`. Legen Sie ein TLS-Secret an oder lassen Sie es von cert-manager anlegen und aktivieren Sie anschließend Ingress:

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

Aktualisieren Sie das Release mit der Values-Datei:

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  -f values.yaml
```

Ersetzen Sie Ingress-Klasse, Issuer und Hostname für Ihre Umgebung. Wenn cert-manager nicht installiert ist, legen Sie das Secret `console-tls` mit Ihrem Zertifikat und Ihrem privaten Schlüssel an, bevor Sie das Upgrade ausführen.

Als Nächstes [legen Sie einen Tenant an](./tenant.md).
