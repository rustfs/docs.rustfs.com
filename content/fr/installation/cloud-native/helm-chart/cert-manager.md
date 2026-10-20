---
title: cert-manager
description: Utilisez cert-manager pour émettre et renouveler les certificats TLS d’un déploiement Helm de RustFS.
---

Utilisez **cert-manager** pour émettre le certificat référencé par l’Ingress RustFS. Cela fournit le HTTPS du point de terminaison public de l’API S3 et de la Console, et permet à cert-manager de renouveler le certificat.

## Prérequis

- cert-manager est installé et les pods de son contrôleur sont prêts.
- Un `Issuer` ou un `ClusterIssuer` est prêt.
- Le nom d’hôte RustFS se résout vers le contrôleur Ingress.

Vérifiez l’émetteur avant d’installer RustFS :

```bash
kubectl get clusterissuer letsencrypt-prod
kubectl -n cert-manager get pods
```

## 1. Configurer le TLS de l’Ingress

Ajoutez les réglages d’Ingress et de certificat à votre fichier de valeurs, en mode autonome ou distribué :

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

Remplacez la classe d’Ingress, l’émetteur et le nom d’hôte en fonction de votre cluster. Pour un Issuer limité à un espace de noms, utilisez plutôt l’annotation `cert-manager.io/issuer`.

## 2. Appliquer la configuration

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

L’Ingress référence le Secret `rustfs-tls` pour une release nommée `rustfs`. Le composant ingress-shim de cert-manager lit l’annotation de l’émetteur et crée un Certificate qui écrit dans ce Secret.

## 3. Vérifier le certificat

```bash
kubectl -n rustfs get ingress,certificate,certificaterequest
kubectl -n rustfs describe certificate rustfs-tls
kubectl -n rustfs get secret rustfs-tls
```

Attendez que le Certificate indique `Ready=True`, puis ouvrez `https://s3.example.com`.

## Utiliser cert-manager avec mTLS

Le chart utilise aussi cert-manager pour émettre les certificats serveur et client lorsque `mtls.enabled=true`. Consultez [mTLS](./mtls.md) pour utiliser l’autorité de certification gérée par le chart ou pour référencer un émetteur existant.
