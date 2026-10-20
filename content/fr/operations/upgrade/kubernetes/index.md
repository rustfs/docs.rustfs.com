---
title: "Mise à niveau Kubernetes"
description: "Mettez à niveau les déploiements RustFS gérés par le chart Helm ou par RustFS Operator, puis vérifiez chaque déploiement."
---

Mettez à niveau un déploiement Kubernetes avec l’outil qui possède ses ressources. Utilisez Helm pour une installation directe du chart Helm RustFS. Pour une installation avec l’Operator, mettez à niveau la version de l’Operator et chaque Tenant au moyen de leurs configurations déclaratives respectives.

## Avant la mise à niveau

Lisez les notes de version de RustFS, du chart et de l’Operator qui s’appliquent à votre déploiement. Confirmez que le cluster dispose d’assez de capacité pour remplacer les pods et que toutes les charges de travail actuelles sont prêtes :

```bash
kubectl get nodes
kubectl -n <namespace> get pods,pvc
```

Ne supprimez pas les PersistentVolumeClaims (PVC) pendant une mise à niveau ou un retour arrière. Conservez sous contrôle de version les valeurs et les manifestes du déploiement existant, y compris les étiquettes d’image, la topologie de stockage, les règles de planification et les références aux Secrets.

## Mettre à niveau un déploiement par chart Helm

Ce flux s’applique à RustFS installé directement avec le [chart Helm RustFS](/fr/installation/cloud-native/helm-chart/installation). Il ne s’applique pas à un Tenant créé par RustFS Operator.

Relevez la révision actuelle de la release, la version du chart, la version de l’application et les valeurs effectives fournies par l’utilisateur :

```bash
helm status rustfs --namespace rustfs
helm history rustfs --namespace rustfs
helm get values rustfs --namespace rustfs -o yaml > rustfs-values.previous.yaml
```

Préparez le chart cible de la même façon que lors de l’installation. Si vous utilisez le dépôt du chart, mettez à jour son index et définissez la référence du chart :

```bash
helm repo update rustfs
export RUSTFS_CHART=rustfs/rustfs
```

Si vous utilisez une copie des sources, placez-vous sur la version RustFS cible et faites pointer `RUSTFS_CHART` vers le répertoire de son chart :

```bash
export RUSTFS_CHART=./helm/rustfs
```

Mettez à jour le fichier de valeurs que vous maintenez pour tout changement propre à la version. Définissez `image.rustfs.tag` sur la version RustFS explicite que vous comptez exécuter, puis appliquez la mise à niveau :

```bash
helm upgrade rustfs "$RUSTFS_CHART" \
	--namespace rustfs \
	-f <values-file> \
	--set-string image.rustfs.tag=<target-version> \
	--wait \
	--timeout 10m
```

Helm effectue une mise à jour continue. Surveillez la release et les pods jusqu’à la fin du déploiement :

```bash
helm status rustfs --namespace rustfs
kubectl -n rustfs get pods,pvc,services
```

Le mode distribué crée un StatefulSet :

```bash
kubectl -n rustfs rollout status statefulset/rustfs --timeout=10m
```

Le mode autonome crée un Deployment :

```bash
kubectl -n rustfs rollout status deployment/rustfs --timeout=10m
```

Vérifiez l’API S3 après le déploiement. Si elle n’est pas exposée à l’extérieur du cluster, démarrez d’abord le réacheminement de port documenté dans le guide d’installation :

```bash
curl -fsS http://localhost:9000/health/ready
```

### Revenir en arrière sur une release Helm

Listez l’historique de la release, identifiez la dernière révision fonctionnelle et laissez Helm restaurer son chart, ses valeurs et sa configuration d’image :

```bash
helm history rustfs --namespace rustfs
helm rollback rustfs <previous-revision> \
	--namespace rustfs \
	--wait \
	--timeout 10m
```

Contrôlez de nouveau la charge de travail et le point de terminaison d’état de préparation après le retour arrière. Ne désinstallez pas la release et ne supprimez pas ses PVC.

## Mettre à niveau un déploiement Operator

Un déploiement Operator comporte deux périmètres de mise à niveau indépendants :

- RustFS Operator et Operator Console s’exécutent à partir de la release Helm `rustfs-operator`.
- Chaque Tenant exécute l’image RustFS déclarée dans le champ `spec.image` de ce Tenant.

Mettez à niveau et validez le plan de contrôle de l’Operator avant de modifier les images des Tenants. Ne combinez pas une mise à niveau de l’Operator et plusieurs mises à niveau de Tenants dans une même étape de maintenance.

### Mettre à niveau la release Operator

Relevez la release actuelle et enregistrez ses valeurs :

```bash
helm status rustfs-operator --namespace rustfs-system
helm history rustfs-operator --namespace rustfs-system
helm get values rustfs-operator --namespace rustfs-system -o yaml \
	> rustfs-operator-values.previous.yaml
```

Mettez à jour la copie des sources de l’Operator vers la version cible et examinez les changements de ses valeurs de chart et de ses CustomResourceDefinitions (CRD). Helm ne met pas à niveau les CRD stockées dans le répertoire `crds/` d’un chart ; appliquez donc les deux CRD cibles avant de mettre à niveau le contrôleur :

```bash
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/tenant.yaml
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/policybinding-crd.yaml
```

Les CRD ont une portée de cluster et sont partagées par chaque espace de noms de Tenant. Les appliquer d’abord permet au serveur d’API Kubernetes d’accepter les champs introduits par le nouveau contrôleur. Lorsque les deux commandes ont réussi, mettez à niveau l’Operator avec le fichier de valeurs que vous maintenez :

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
	--namespace rustfs-system \
	-f <operator-values-file> \
	--set-string operator.image.tag=<target-operator-version> \
	--set-string console.image.tag=<target-operator-version> \
	--wait \
	--timeout 10m
```

Vérifiez les CRD et tous les composants du plan de contrôle avant de mettre à niveau un Tenant :

```bash
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator --timeout=10m
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console --timeout=10m
kubectl get tenants --all-namespaces
```

Les changements de CRD ne font pas partie de l’historique de release Helm, et `helm rollback` ne les restaure pas. Consultez les notes de compatibilité et de migration de la version cible avant d’envisager un retour arrière du contrôleur. Si cette version prend explicitement en charge la rétrogradation, restaurez la révision Helm précédente sans appliquer d’anciens fichiers de CRD :

```bash
helm history rustfs-operator --namespace rustfs-system
helm rollback rustfs-operator <previous-revision> \
	--namespace rustfs-system \
	--wait \
	--timeout 10m
```

Ne rétrogradez pas au-delà d’une migration de charge de travail ou de sécurité documentée comme unidirectionnelle. Avancez plutôt vers une version corrigée de l’Operator.

### Mettre à niveau un Tenant

L’Operator possède les StatefulSets de chaque Tenant. Ne modifiez pas directement les images de leurs conteneurs, car la réconciliation rétablit l’image déclarée par le Tenant.

Relevez l’image actuelle du Tenant et confirmez sa condition `Ready` :

```bash
kubectl -n storage-a get tenant tenant-a \
	-o jsonpath='{.spec.image}{"\n"}'
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

Dans le fichier `tenant.yaml` complet utilisé pour installer le Tenant, ne modifiez que `spec.image`, en la remplaçant par `rustfs/rustfs:<target-version>`. Laissez inchangés ses pools, ses modèles de PVC, ses identifiants et ses autres réglages. Appliquez le manifeste complet et attendez que l’Operator réconcilie la nouvelle génération :

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
kubectl -n storage-a get pods -l rustfs.tenant=tenant-a
```

Mettez à niveau un Tenant à la fois. Confirmez son API S3 et l’[état du cluster](/fr/operations/status-check) avant de mettre à jour un autre Tenant.

### Revenir en arrière sur un Tenant

Restaurez dans `spec.image` l’image précédemment relevée, appliquez le manifeste complet du Tenant et attendez de nouveau la condition `Ready` :

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
```

L’Operator réutilise les PVC existants du Tenant. Ne supprimez pas le Tenant, ses StatefulSets ni ses PVC pendant le retour arrière.

## Étapes suivantes

Consultez [Contrôle de l’état](/fr/operations/status-check) et [Observabilité](/fr/operations/observability) pour valider le déploiement après la mise à jour.
