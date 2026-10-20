---
title: "Mise à niveau"
description: "Planifiez et effectuez les mises à niveau de RustFS tout en préservant la disponibilité du cluster."
---

Choisissez le flux de mise à niveau qui correspond à la façon dont vous déployez RustFS. Pour les clusters à plusieurs nœuds, remplacez un nœud ou un pod à la fois et attendez qu’il se déclare prêt avant de continuer.

## Modes de déploiement

- [Mise à niveau du binaire](./binary/index.md) couvre le remplacement et le retour arrière d’un exécutable géré par systemd.
- [Mise à niveau de conteneur](./container/index.md) couvre le remplacement d’image avec des volumes de données persistants.
- [Mise à niveau Kubernetes](./kubernetes/index.md) couvre les charges de travail gérées par Helm et par l’Operator.

Avant toute mise à niveau, lisez les notes de la version cible et confirmez que le cluster est sain.
