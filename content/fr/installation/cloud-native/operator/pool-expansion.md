---
title: Extension de pool
description: Ajoutez de la capacité de stockage à un Tenant RustFS en ajoutant un pool de stockage.
---

Tous les pools d’un Tenant forment un seul cluster RustFS. Ajoutez de la capacité en ajoutant un nouveau pool à `spec.pools` ; ne modifiez pas les dimensions d’un pool existant.

:::warning[Les pools existants sont immuables]

Ne modifiez pas `servers` ni `persistence.volumesPerServer` sur un pool existant. L’Operator crée un StatefulSet immuable pour chaque pool.

:::

## 1. Vérifier le Tenant

```bash
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Confirmez que le Tenant est `Ready` et que le cluster dispose d’assez de capacité de calcul et de stockage.

## 2. Ajouter un pool

Ajoutez l’entrée suivante à la liste `spec.pools` existante dans `tenant.yaml`. Conservez toutes les entrées existantes inchangées.

```yaml title="tenant.yaml"
- name: pool-1
  servers: 2
  persistence:
    volumesPerServer: 2
    volumeClaimTemplate:
      storageClassName: standard
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 100Gi
```

Ce pool crée quatre PVC : deux serveurs multipliés par deux volumes par serveur. Appliquez le manifeste Tenant complet :

```bash
kubectl apply -f tenant.yaml
```

## 3. Observer l’extension

```bash
kubectl -n storage-a get tenant tenant-a -w
kubectl -n storage-a get pods,pvc \
  -l rustfs.pool=pool-1
```

Attendez que le Tenant revienne à `Ready` avant d’apporter une autre modification de topologie. Augmenter la taille d’un PVC existant est une opération de stockage Kubernetes distincte, qui dépend de la StorageClass.
