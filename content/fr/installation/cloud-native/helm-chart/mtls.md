---
title: mTLS
description: Configurez le TLS mutuel entre les pods RustFS déployés par le chart Helm.
---

Le chart peut activer le TLS mutuel (mTLS) pour la communication entre les pods RustFS. Lorsque le mTLS est activé, RustFS exige des certificats client, utilise HTTPS pour les URL de pairs générées et monte dans chaque pod le matériel du serveur, du client et de l’autorité de certification.

## Prérequis

Le mTLS utilise les ressources cert-manager `Issuer` et `Certificate`. Installez cert-manager avant de l’activer et confirmez que ses CRD sont disponibles :

```bash
kubectl get crd certificates.cert-manager.io issuers.cert-manager.io
```

## 1. Utiliser l’autorité de certification gérée par le chart

Ajoutez le réglage suivant à votre fichier de valeurs existant :

```yaml title="values.yaml"
mtls:
  enabled: true
```

Mettez à niveau la release :

```bash
helm upgrade rustfs ./helm/rustfs \
  --namespace rustfs \
  -f values.yaml
```

Le chart crée une autorité de certification racine auto-signée, un Issuer d’espace de noms, ainsi que des Certificates serveur et client. Il monte les Secrets obtenus et configure RustFS avec `RUSTFS_SERVER_MTLS_ENABLE=1` et `RUSTFS_TLS_PATH=/opt/tls`. Les sondes d’intégrité utilisent aussi le certificat client généré.

## 2. Utiliser un Issuer existant

Pour utiliser un Issuer ou un ClusterIssuer déjà géré par votre plateforme, configurez sa référence :

```yaml title="values.yaml"
mtls:
  enabled: true
  existingIssuerRef:
    enabled: true
    name: internal-ca
    kind: ClusterIssuer
    group: cert-manager.io
```

L’émetteur doit être prêt et en mesure d’émettre à la fois des certificats serveur et des certificats client dans l’espace de noms `rustfs`. Utilisez `kind: Issuer` pour un émetteur limité à un espace de noms.

## 3. Vérifier le mTLS

```bash
kubectl -n rustfs get issuer,certificate,secret
kubectl -n rustfs describe certificate rustfs-server-tls
kubectl -n rustfs describe certificate rustfs-client-tls
kubectl -n rustfs get pods
```

Pour une release nommée `rustfs`, les Secrets de certificats générés sont `rustfs-server-tls` et `rustfs-client-tls`.

:::warning[Planifiez l’accès externe]

Le mTLS exige que les clients présentent un certificat de confiance. Validez la manière dont votre contrôleur Ingress ou un autre client externe présente ce certificat avant d’activer le mTLS sur un déploiement existant.

:::
