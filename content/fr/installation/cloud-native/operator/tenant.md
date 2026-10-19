---
title: Multi-tenant
description: Créez des Tenants RustFS isolés et accédez à leurs services d’API S3 et de Console.
---

Un `Tenant` représente un cluster RustFS indépendant. Utilisez un espace de noms, un Secret d’identifiants et une ressource Tenant distincts pour chaque équipe ou charge de travail.

## 1. Créer un espace de noms et des identifiants

Créez le Secret directement afin que les identifiants ne soient pas stockés dans un manifeste :

```bash
kubectl create namespace storage-a
kubectl -n storage-a create secret generic rustfs-tenant-creds \
  --from-literal=accesskey='<your-access-key>' \
  --from-literal=secretkey='<your-secret-key>'
```

## 2. Définir le Tenant

Cet exemple de développement crée un pod RustFS et un PVC de `10Gi`. Remplacez `standard` par une StorageClass de votre cluster.

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

## 3. Appliquer et vérifier

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a get tenant,pods,pvc,svc
kubectl -n storage-a describe tenant tenant-a
```

## 4. Accéder à RustFS

```bash
kubectl -n storage-a port-forward svc/tenant-a-io 9000:9000
kubectl -n storage-a port-forward svc/tenant-a-console 9001:9001
```

Exécutez les commandes dans des terminaux distincts. Utilisez `http://localhost:9000` comme point de terminaison S3 et ouvrez `http://localhost:9001` pour la Console du Tenant.

Pour ajouter un autre Tenant, répétez le processus avec un espace de noms, un Secret et un nom de Tenant différents. Répertoriez tous les Tenants gérés avec :

```bash
kubectl get tenants --all-namespaces
```

:::warning[Topologie de production]

L’exemple à un seul serveur est destiné à l’évaluation. Les Tenants de production ont besoin d’une disposition de pool distribuée, de demandes de ressources, de contraintes d’ordonnancement et d’une référence d’image immuable.

:::
