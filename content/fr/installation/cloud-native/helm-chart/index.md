---
title: Vue d’ensemble
description: Comprenez comment le chart Helm RustFS déploie des clusters autonomes et distribués sur Kubernetes.
---

Le **chart Helm RustFS** officiel déploie directement un cluster RustFS dans Kubernetes. Helm génère la charge de travail, les Services, les identifiants, la configuration, les PersistentVolumeClaims (PVC), l’Ingress et les ressources de certificats facultatives à partir d’un seul fichier de valeurs.

Le chart prend en charge deux modes de déploiement :

- **Autonome** crée un pod avec un PVC de données. Utilisez-le pour l’évaluation et le développement.
- **Distribué** crée un StatefulSet avec plusieurs pods et plusieurs PVC de données. `replicaCount` contrôle le nombre de pods et `drivesPerNode` contrôle le nombre de PVC de données montés par chaque pod.

Le mode distribué est activé par défaut. Le chart prend aussi en charge plusieurs pools de serveurs que l’on ne peut qu’ajouter, mais une topologie explicite unique est plus simple à exploiter pour un premier déploiement. Les identifiants doivent être fournis par les valeurs du chart ou par un Secret existant ; le chart rejette les identifiants vides et les identifiants par défaut bien connus, sauf si les valeurs par défaut non sécurisées de développement sont explicitement activées.

Utilisez le chart Helm lorsque vous voulez que Helm gère un seul cluster RustFS. Utilisez l’[Operator RustFS](../operator/index.md) lorsque vous avez besoin de ressources personnalisées Kubernetes, de plusieurs Tenants ou d’une gestion des pools pilotée par l’Operator.

## Flux de travail du chart Helm

- [Installation](./installation.mdx) couvre les prérequis et le déploiement autonome ou distribué.
- [mTLS](./mtls.md) chiffre et authentifie le trafic entre les pods RustFS.
- [cert-manager](./cert-manager.md) émet et renouvelle les certificats de l’Ingress RustFS et du mTLS.
