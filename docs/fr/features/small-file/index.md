---
title: "Optimisation des Petits Fichiers"
description: "Créer un stockage d'objets en mémoire pour les charges de travail ultra-haute performance en utilisant la DRAM du serveur"
---

# Optimisation des Petits Fichiers

> Créer un stockage d'objets en mémoire pour les charges de travail ultra-haute performance

Utiliser la DRAM du serveur pour créer un pool de mémoire partagée distribuée pour les charges de travail nécessitant une performance élevée d'IOPS et de débit.

## Contexte

L'optimisation des petits fichiers de RustFS est très adaptée aux charges de travail nécessitant des performances d'IOPS et de débit. Dans les architectures modernes, cela signifie de plus en plus les charges de travail AI/ML. Sans cache, les opérations I/O peuvent devenir un goulot d'étranglement pour les GPU.

Avec le cache d'entreprise, les buckets contenant les ensembles de données d'entraînement, de validation et de test peuvent être maintenus en mémoire pour fournir un accès basé sur la mémoire.

## Caractéristiques

### 🗃️ Cache d'Objets Dédié

L'optimisation des petits fichiers de RustFS est spécifiquement dédiée au cache des objets de fichiers.
Si un objet ne se trouve pas dans le cache d'objets existant, il récupérera automatiquement cet objet, le mettra en cache pour les demandes futures et retournera l'objet à l'appelant.

### 💾 Algorithme de Hachage Cohérent

L'optimisation des petits fichiers de RustFS priorise le contenu.
Elle utilise un algorithme de hachage cohérent pour distribuer les données d'objets mis en cache à travers un cluster de nœuds de cache (appelés pairs). Le hachage cohérent garantit que les objets peuvent être facilement trouvés basés sur la clé de l'objet. Cela résulte en une relation un-à-un entre la clé de l'objet et le nœud qui garde l'objet mis en cache. Il garantit également que les nœuds contiennent la même quantité de données, pour qu'il n'y ait pas de situation où un nœud est surchargé tandis que d'autres sont inactifs. Cependant, plus important encore, il distribue les objets de manière à ce que si des nœuds sont ajoutés ou supprimés, seule une réorganisation minimale soit nécessaire pour aligner le système.

### 🧹 Gestion de Mémoire Cache Rotatif

RustFS utilise un cache rotatif pour la gestion de mémoire. RustFS utilise le cache rotatif pour maintenir la taille totale du cache dans les limites spécifiées dans la configuration d'optimisation des petits fichiers. Si l'ajout d'un nouvel objet causait que la taille du cache dépasse la limite spécifiée, un ou plusieurs objets sont supprimés basés sur l'horodatage indiquant quand l'objet a été demandé pour la dernière fois.

### 🔄 Mise à Jour Automatique des Versions

Mise à jour automatique des nouvelles versions d'objets. Si un objet mis en cache a été mis à jour, le stockage d'objets RustFS mettra automatiquement à jour le cache avec la nouvelle version de l'objet.

### 🧩 Intégration API Transparente

L'optimisation des petits fichiers de RustFS est une extension en arrière-plan de RustFS. Étant donné que l'optimisation des petits fichiers est une extension de RustFS, les développeurs n'ont pas besoin d'apprendre une nouvelle API. Les développeurs utilisent la même API qu'avant. Si l'objet demandé est en cache, RustFS l'obtiendra automatiquement depuis le cache. Si un objet devrait être mis en cache et c'est la première fois qu'il est demandé, alors RustFS l'obtiendra depuis le stockage d'objets, le retournera à l'appelant et le placera en cache pour les demandes ultérieures.

