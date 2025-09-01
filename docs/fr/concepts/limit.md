---
title: "Limitations d'Utilisation"
description: "RustFS est un stockage d'objets simple, efficace et distribué. Il est 100% compatible S3, un logiciel open source publié sous licence Apache2."
---

# Limitations d'Utilisation

## I. Limitations de l'API S3

> Les normes suivantes respectent strictement les standards du protocole S3.

| Élément | Spécification |
| --------------------- | ---------------------------------- |
| Taille maximale d'objet | 5 TiB |
| Taille minimale d'objet | 0 B |
| Taille maximale d'objet pour une opération PUT unique | Upload non fragmenté : 500 GiB ; Upload fragmenté : 5 TiB |
| Nombre maximal de fragments par upload | 10 000 |
| Plage de taille des fragments | 5 MiB à 5 GiB ; le dernier fragment peut faire de 0 B à 5 GiB |
| Nombre maximal de fragments retournés par requête de liste des fragments | 10 000 |
| Nombre maximal d'objets retournés par requête de liste des objets | 1 000 |
| Nombre maximal d'uploads fragmentés retournés par requête de liste des uploads fragmentés | 1 000 |
| Longueur maximale du nom de seau | 63 caractères |
| Longueur maximale du nom d'objet | 1024 caractères |
| Longueur maximale de chaque segment de nom d'objet séparé par `/` | 255 caractères |
| Nombre maximal de versions pour un objet unique | 10 000 (configurable) |

---


## II. Limitations du Codage d'Effacement

> Les paramètres EC sont configurés selon l'algorithme EC basé sur la matrice de Reed-Solomon. Référez-vous à la configuration des paramètres EC réels.

| Élément | Spécification |
| ---------------------------- | ------------------------------ |
| Nombre maximal de serveurs par cluster | Illimité |
| Nombre minimal de serveurs | 1 |
| Nombre minimal de lecteurs par serveur quand il y a 1 serveur | 1 (applicable pour un déploiement à nœud unique et lecteur unique, ne peut pas fournir de fiabilité ou disponibilité supplémentaire) |
| Nombre minimal de lecteurs par serveur quand il y a 2 serveurs ou plus | 1 |
| Nombre maximal de lecteurs par serveur | Illimité |
| Quorum de lecture | N/2 |
| Quorum d'écriture | (N/2) + 1 |


---

## III. Limitations de Nommage des Objets

### Limitations du Système de Fichiers et du Système d'Exploitation

Les noms d'objets dans RustFS sont principalement limités par le système d'exploitation et le système de fichiers sous-jacents. Par exemple, Windows et certains autres systèmes d'exploitation limitent l'utilisation de certains caractères spéciaux, tels que `^`, `*`, `|`, `\`, `/`, `&`, `"` ou `;`.

Veuillez vous référer à la documentation pertinente selon votre système d'exploitation et système de fichiers spécifiques pour obtenir la liste complète des limitations.

RustFS recommande d'utiliser un système d'exploitation Linux basé sur le système de fichiers XFS en environnement de production pour une meilleure performance et compatibilité.

### Gestion des Conflits de Nommage

Dans RustFS, les applications doivent assigner des clés uniques et non conflictuelles à tous les objets. Cela inclut éviter de créer des objets dont les noms peuvent entrer en conflit avec les noms d'objets parents ou frères. RustFS retournera un ensemble vide lors de l'exécution d'opérations LIST à l'emplacement du conflit.

Par exemple, les opérations suivantes causeront des conflits de namespace :

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Conflit avec le préfixe d'objet existant

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Conflit avec l'objet existant
```

Bien que vous puissiez exécuter des opérations GET ou HEAD sur ces objets, les conflits de noms causeront le retour d'un ensemble de résultats vide lors de l'exécution d'opérations LIST sur le chemin `hello/2025/first/`.

