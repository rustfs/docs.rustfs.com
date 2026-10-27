---
title: "Vue d’ensemble de l’Operator"
description: Comprenez comment l’Operator RustFS gère les clusters RustFS sur Kubernetes.
---

L’**Operator RustFS** applique le modèle Operator de Kubernetes aux clusters RustFS. Au lieu de créer à la main les StatefulSets, les Services, les PersistentVolumeClaims (PVC) et la configuration, vous déclarez le cluster de stockage requis sous la forme d’une ressource personnalisée Kubernetes. Le contrôleur surveille cette ressource et réconcilie en continu le cluster en cours d’exécution avec l’état déclaré.

L’Operator installe deux définitions de ressources personnalisées (CRD) :

- `Tenant` (`rustfs.com/v1alpha1`) représente un cluster RustFS. Il définit les pools de stockage, les identifiants, l’ordonnancement, la sécurité de la couche de transport (TLS) et les réglages du service de gestion des clés (KMS).
- `PolicyBinding` (`sts.rustfs.com/v1alpha1`) associe un ServiceAccount Kubernetes à des politiques RustFS lorsque les charges de travail demandent des identifiants temporaires au service de jetons de sécurité (STS) de l’Operator.

Un même Operator peut gérer plusieurs Tenants répartis dans plusieurs espaces de noms. Chaque Tenant dispose de son propre stockage, de ses propres identifiants, de ses propres services S3 et Console, et de son propre cycle de vie. L’Operator crée un StatefulSet pour chaque pool : vous pouvez donc ajouter de la capacité en ajoutant un pool, sans reconstruire le cluster. Il signale aussi les conditions `Ready`, `Progressing` ou `Degraded`, ainsi que des événements Kubernetes, et expose des points de terminaison d’intégrité et de métriques pour la supervision du cluster.

La même API couvre les petits clusters de test et les déploiements distribués. Les identifiants sensibles et le matériel KMS restent dans des Secrets Kubernetes, tandis que les manifestes Tenant suivis en contrôle de versions ne contiennent que des références à des Secrets. Les déploiements sont ainsi reproductibles, les flux GitOps sont pris en charge, et les opérations courantes — gestion multi-tenant, extension de pool, TLS et chiffrement — restent dans des outils natifs de Kubernetes.

## Flux de travail de l’Operator

- [Installation](./installation.md) couvre les prérequis, l’installation Helm, l’accès à la Console et la configuration TLS.
- [Multi-tenant](./tenant.md) crée des clusters RustFS isolés pour différentes équipes ou charges de travail.
- [Extension de pool](./pool-expansion.md) ajoute de la capacité de stockage en ajoutant un pool à un Tenant existant.
- [Intégration KMS](./kms.md) configure la gestion de clés locale ou HashiCorp Vault pour les données chiffrées.

:::warning[Logiciel en préversion]

L’Operator RustFS est actuellement un logiciel en préversion (preview), en version `v0.1.0`, et son développement se poursuit. Validez d’abord les mises à niveau et les modifications de Tenant dans un cluster hors production.

:::
