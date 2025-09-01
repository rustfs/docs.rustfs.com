---
title: "Infrastructure pour Données à Grande Échelle"
description: "Architecture distribuée conçue pour la scalabilité technique, opérationnelle et économique"
---

# Infrastructure pour Données à Grande Échelle

RustFS est conçu pour la scalabilité. Scalabilité technique, scalabilité opérationnelle et scalabilité économique. Scalabilité fondamentale.

RustFS est conçu comme cloud-natif et peut être exécuté en tant que conteneurs légers gérés par des services d'orchestration externes comme Kubernetes. L'ensemble du serveur est un binaire statique de ~100 MB qui utilise efficacement les ressources CPU et mémoire même sous forte charge. Le résultat est que vous pouvez co-héberger un grand nombre de locataires sur du matériel partagé.

![Diagramme d'architecture RustFS](./images/s2-1.png)

RustFS peut fonctionner partout et dans n'importe quel cloud, mais s'exécute typiquement sur des serveurs standard avec des disques attachés localement (JBOD/JBOF). Tous les serveurs du cluster sont fonctionnellement équivalents (architecture entièrement symétrique). Il n'y a pas de nœuds de noms ou de serveurs de métadonnées.

RustFS écrit les données et métadonnées ensemble comme des objets, sans nécessiter une base de données de métadonnées. De plus, RustFS effectue toutes les fonctions (codage d'effacement, vérification bitrot, chiffrement) comme des opérations en ligne, strictement cohérentes. Le résultat est que RustFS est exceptionnellement résilient.

Chaque cluster RustFS est une collection de serveurs RustFS distribués avec un processus par nœud. RustFS s'exécute dans l'espace utilisateur comme un processus unique et utilise des coroutines légères pour une haute concurrence. Les disques sont regroupés en ensembles d'effacement (voir le calculateur d'effacement ici) et les objets sont placés sur ces ensembles en utilisant des algorithmes de hachage déterministes.

RustFS est conçu pour des services de stockage cloud multi-centres de données à grande échelle. Chaque locataire exploite son propre cluster RustFS, complètement isolé des autres locataires, ce qui leur permet de les protéger de toute perturbation due aux mises à niveau, mises à jour et événements de sécurité. Chaque locataire évolue indépendamment par fédération de clusters à travers les emplacements géographiques.

