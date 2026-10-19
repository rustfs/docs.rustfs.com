---
title: Installation
description: Préparez Kubernetes, installez l’Operator RustFS et accédez à sa Console de façon sécurisée.
---

Ce guide installe l’Operator avec Helm, vérifie le déploiement et expose la Console de l’Operator en local ou en HTTPS.

## Prérequis

| Composant | Exigence |
|-----------|-------------|
| Kubernetes | `v1.30` ou ultérieur |
| Helm | `v3.0` ou ultérieur |
| kubectl | Compatible avec le cluster Kubernetes |
| StorageClass | Provisionnement dynamique de PVC pour le stockage des Tenants |

Votre compte doit pouvoir créer des CRD, le RBAC de cluster, des Deployments et des Services. Confirmez le cluster cible avant l’installation :

```bash
kubectl config current-context
kubectl get storageclass
```

## 1. Installer l’Operator

Le chart Helm est stocké dans le dépôt de l’Operator :

```bash
git clone https://github.com/rustfs/operator.git
cd operator

helm upgrade --install rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  --create-namespace
```

Les réglages courants se placent dans un fichier de valeurs :

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

Appliquez le fichier avec `-f values.yaml`. Le chart génère les variables `OPERATOR_*` à partir de ces valeurs ; ne les dupliquez pas sous `operator.env`.

## 2. Vérifier l’installation

```bash
kubectl -n rustfs-system get pods,services
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console
```

## 3. Accéder à la Console de l’Operator

La Console écoute sur le port `9090`. Générez un jeton de connexion de courte durée :

```bash
kubectl -n rustfs-system create token rustfs-operator-console --duration=24h
```

Redirigez le service de la Console vers votre poste de travail :

```bash
kubectl -n rustfs-system port-forward \
  svc/rustfs-operator-console 19090:9090
```

Ouvrez `http://127.0.0.1:19090` et collez le jeton dans le formulaire de connexion. Les notes d’installation Helm affichent les noms exacts du ServiceAccount et du Service lorsque le nom de la release ou l’espace de noms diffère.

:::note[Accès HTTP local]

Si votre navigateur ne conserve pas la session en HTTP, définissez `CONSOLE_COOKIE_SECURE=false` sous `console.env`, uniquement pour les tests locaux. Laissez les cookies sécurisés activés pour HTTPS.

:::

## 4. Configurer le TLS de la Console

Utilisez un seul nom d’hôte HTTPS à la fois pour l’interface de la Console et pour `/api/v1`. Créez un Secret TLS, ou laissez cert-manager le créer, puis activez l’Ingress :

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

Mettez à niveau la release avec le fichier de valeurs :

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
  --namespace rustfs-system \
  -f values.yaml
```

Remplacez la classe d’Ingress, l’émetteur et le nom d’hôte en fonction de votre environnement. Si cert-manager n’est pas installé, créez le Secret `console-tls` avec votre certificat et votre clé privée avant la mise à niveau.

Ensuite, [créez un Tenant](./tenant.md).
