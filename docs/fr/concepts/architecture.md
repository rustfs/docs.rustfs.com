---
title: "Architecture de RustFS"
description: "Introduction à l'architecture de RustFS"
---

# Architecture de RustFS

RustFS est un système de stockage d'objets similaire au bien connu AWS S3. En tant qu'alternative à MinIO, RustFS fait référence à l'architecture propre, légère, évolutive et élégante de MinIO.

Les objets peuvent être des documents, des vidéos, des fichiers PDF, et plus encore. Pour le stockage d'objets, MinIO fournit une solution évolutive, flexible et efficace pour stocker, accéder et gérer les données. Sa compatibilité avec l'API AWS S3 permet une intégration transparente avec les applications basées sur AWS S3.

Le diagramme d'architecture est le suivant :

![Diagramme d'architecture RustFS](./images/s2-1.png)

Il s'agit de l'architecture de base de RustFS. Un maillage distribué est une architecture informatique qui utilise plusieurs nœuds pour effectuer une seule tâche. Les nœuds sont connectés les uns aux autres via un réseau, leur permettant de communiquer entre eux.

## Conception de la cohérence

En mode distribué et mono-machine, toutes les opérations de lecture et d'écriture suivent strictement le modèle de cohérence lecture-après-écriture.

## Concepts importants dans RustFS

**Objet** : L'objet de base stocké dans RustFS, comme les fichiers, les flux d'octets, n'importe quoi...

**Bucket** : L'espace logique utilisé pour stocker les objets. Les données entre chaque bucket sont mutuellement isolées. Pour les clients, c'est équivalent à un dossier de niveau supérieur pour stocker les fichiers.

**Drive** : Le disque qui stocke les données, passé comme paramètre lors du démarrage de RustFS. Toutes les données d'objet dans RustFS seront stockées dans les drives.

**Set** : Une collection de drives. Le déploiement distribué se divise automatiquement en un ou plusieurs sets basés sur l'échelle du cluster, et les drives de chaque set sont distribués dans différents emplacements. Un objet est stocké dans un set.

Par conséquent, lors de la conception de l'architecture et du déploiement de l'équipement, vous devez considérer :

1. Un objet est stocké dans un set ;
2. Un cluster est divisé en plusieurs sets ;
3. Le nombre de drives dans un set est fixe, calculé automatiquement par le système basé sur l'échelle du cluster par défaut ;
4. Les drives dans un set sont distribués sur différents nœuds autant que possible ;

## Remerciements spéciaux

Tous les nœuds sont dans des relations pair-à-pair, simplifiant grandement la conception architecturale et éliminant les préoccupations concernant la perte de métadonnées. Il peut être démarré avec une seule commande.

Sans perdre l'élégance, la simplicité et la fiabilité, RustFS adopte la même conception architecturale que MinIO.

Merci à MinIO pour le concept architectural proposé, qui a grandement facilité les utilisateurs du monde entier et promu le protocole S3.

