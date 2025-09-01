---
title: "Vérification d'Objets et Récupération Automatique"
description: "Ce document présente la conception et l'implémentation de la fonctionnalité d'auto-guérison des objets RustFS dans une architecture serveur unique multi-disques, incluant la signification, les principes, les processus, la configuration et le dépannage des pannes courantes de l'auto-guérison."
---

# Vérification d'Objets et Récupération Automatique

## Architecture RustFS et Conception de l'Auto-Guérison

### Architecture Serveur Unique Multi-Disques

RustFS adopte une conception serveur unique multi-disques, organisant plusieurs disques en un pool de stockage logique, fournissant des services de stockage d'objets. Chaque objet lors de l'écriture est divisé en plusieurs fragments de données (shard) et fragments redondants, et distribué sur différents disques, pour améliorer la fiabilité et les performances.

### Principes de Conception de l'Auto-Guérison

1. **Vérification de l'Intégrité des Données** : Combiné au mécanisme de somme de contrôle (checksum) pour assurer la cohérence des fragments de données d'objet lors de la lecture, par exemple ZFS vérifie la somme de contrôle de chaque bloc de données lors de la lecture, et effectue des réparations en cas d'échec de vérification.
2. **Redondance et Effacement des Fragments** : Génère des fragments redondants grâce au code d'effacement (erasure coding), quand certains fragments de données sont perdus ou corrompus, peut utiliser les fragments redondants pour reconstruire l'objet original.
3. **Auto-Guérison Multi-Niveau Déclenchée** : Inclut l'auto-guérison en ligne lors de la lecture, l'auto-guérison par scan en arrière-plan et l'auto-guérison déclenchée manuellement, pour équilibrer performance et fiabilité des données.

## Principe de l'Auto-Guérison des Objets

### Vérification et Effacement

RustFS lors de la phase d'écriture d'objet, divise l'objet en *k* fragments de données et *m* fragments redondants, selon les paramètres d'effacement spécifiés distribués sur *n=k+m* périphériques de stockage. Lors de la lecture, si des fragments sont trouvés corrompus ou manquants, ils peuvent être reconstruits à partir d'autres fragments intacts.

### Vérification et Réparation des Données (Scrub & Repair)

RustFS effectue périodiquement une vérification légère (light scrub) et une vérification profonde (deep scrub) sur le pool de stockage :
- **Vérification Légère** compare les métadonnées d'objet et la taille des fragments, marque rapidement les corruptions détectées.
- **Vérification Profonde** lit les données de fragments bit par bit et vérifie les sommes de contrôle, peut détecter et réparer les problèmes de blocs défectueux cachés ou de bit rot.

Quand le scan de données découvre des incohérences, RustFS appelle automatiquement le processus de Réparation, reconstruit les fragments corrompus avec des fragments redondants, et écrit les fragments réparés sur le disque original ou un disque de sauvegarde, garantissant que les données soient intactes lors du prochain accès.

## Processus d'Auto-Guérison

### Auto-Guérison en Ligne lors de la Lecture

À chaque fois qu'un client exécute une requête `GET` ou `HEAD`, RustFS vérifie d'abord tous les fragments de données de l'objet correspondant :
1. Si tous les fragments de données sont intacts, retourne directement les données.
2. S'il y a des fragments manquants ou corrompus, le système calcule les fragments manquants selon les fragments redondants et les répare, puis retourne l'objet complet au client.
Ce mécanisme est cohérent avec le processus d'auto-guérison lors de la lecture de MinIO, capable de réparer transparentement les données sans affecter les requêtes client.

### Auto-Guérison par Scan en Arrière-Plan

RustFS intègre un scanner d'objets, qui parcourt par hachage 1/1024 des objets dans le pool de stockage pour vérification d'intégrité :
- Le scanner d'objets exécute périodiquement (fréquence configurable) une vérification légère ;
- Si une corruption est découverte, déclenche immédiatement le processus de reconstruction d'auto-guérison.
Par défaut, ne fait pas de vérification profonde de bit rot, pour réduire la surcharge de ressources, la fonction de vérification profonde peut être activée selon les besoins.

### Auto-Guérison Déclenchée Manuellement

Les administrateurs peuvent exécuter une auto-guérison complète via des outils de ligne de commande :

```bash
rc admin heal start --all
```
Cette opération scannera l'ensemble du pool de stockage et effectuera une vérification et réparation complète de tous les objets, consomme beaucoup de ressources, devrait être utilisée avec prudence pendant les heures creuses.

## Exemples d'Utilisation

```bash
# Voir l'état actuel d'auto-guérison
rc admin heal status
# Démarrer l'auto-guérison d'un bucket spécifique
rc admin heal start --bucket photos
# Arrêter la tâche d'auto-guérison en cours
rc admin heal stop
```

## Résumé

L'auto-guérison des objets RustFS combine la conception mature de systèmes comme MinIO, Ceph et ZFS, grâce au processus de vérification et réparation à déclenchement multi-niveau, capable de traiter efficacement les problèmes de corruption de fragments, panne de disque et bit rot dans les environnements mono-machine multi-disque et multi-machine multi-disque, garantissant la haute fiabilité et haute disponibilité du stockage d'objets.