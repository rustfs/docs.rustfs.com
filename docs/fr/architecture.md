---
title: "Architecture RustFS"
description: "Introduction à l'architecture RustFS"
---

# Architecture RustFS

RustFS est un système de stockage d'objets similaire au bien connu AWS S3. En tant que produit de remplacement de MinIO, RustFS s'inspire de l'architecture simple, légère, évolutive et élégante de MinIO.

Les objets peuvent être des documents, des vidéos, des fichiers PDF, etc. Pour stocker des objets, MinIO fournit une solution évolutive, flexible et efficace pour stocker, accéder et gérer les données. Sa compatibilité avec l'API AWS S3 permet une intégration transparente avec les applications basées sur AWS S3.

Le diagramme d'architecture est le suivant :

![Diagramme d'architecture RustFS](./images/s2-1.png)

Ceci est l'architecture de base de RustFS. La grille distribuée est une architecture informatique qui utilise plusieurs nœuds pour exécuter une seule tâche. Les nœuds sont connectés les uns aux autres via un réseau, ce qui leur permet de communiquer entre eux.

## Conception de cohérence

En mode distribué et en mode machine unique, toutes les opérations de lecture et d'écriture suivent strictement le modèle de cohérence read-after-write.

## Concepts importants dans RustFS

**Object (Objet)** : L'objet de base stocké dans RustFS, comme des fichiers, des flux d'octets, n'importe quoi...

**Bucket (Seau)** : L'espace logique utilisé pour stocker les objets. Les données entre chaque bucket sont mutuellement isolées. Pour le client, cela équivaut à un dossier de niveau supérieur pour placer des fichiers.

**Drive (Lecteur)** : Le disque qui stocke les données, passé en paramètre lors du démarrage de RustFS. Toutes les données d'objets dans RustFS seront stockées dans les lecteurs.

**Set (Ensemble)** : Un groupe de lecteurs. Le déploiement distribué divise automatiquement en un ou plusieurs ensembles selon l'échelle du cluster, et les lecteurs dans chaque ensemble sont distribués à différents emplacements. Un objet est stocké sur un ensemble. (Certains endroits appellent aussi la combinaison d'ensembles **Strips** — bandes).

Par conséquent, lors de la conception de l'architecture et du déploiement d'équipements, il faut noter que :

1. Un objet est stocké sur un ensemble ;

2. Un cluster est divisé en plusieurs ensembles ;

3. Le nombre de lecteurs contenus dans un ensemble est fixe, calculé automatiquement par le système basé sur l'échelle du cluster par défaut ;

4. Les lecteurs dans un ensemble sont distribués autant que possible sur différents nœuds ;

## Remerciements spéciaux

L'architecture de stockage distribué traditionnelle doit avoir : des nœuds Master, des nœuds MetaData et des nœuds Data Node. Cette conception de mode rend le déploiement des utilisateurs très complexe. En même temps, sans une riche expérience de gestion de stockage distribué, une fois les métadonnées perdues, il y a un risque de perte de données.

Tous les nœuds sont dans une relation de niveau égal, simplifiant grandement la conception de l'architecture et éliminant les préoccupations concernant la perte de métadonnées, pouvant être démarré avec une seule commande.

Sans perdre l'élégance, la simplicité et la fiabilité, RustFS adopte la même conception d'architecture que MinIO.

Merci à MinIO pour le concept d'architecture proposé, qui a grandement facilité les utilisateurs du monde entier et promu le protocole S3.