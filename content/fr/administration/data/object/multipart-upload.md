---
title: "Chargement partitionné"
description: "Chargez les objets volumineux par parties, suivez les tâches de chargement dans la Console et vérifiez les objets terminés avec rc."
---

Le chargement partitionné (multipart upload) découpe un objet en parties, les charge (upload) indépendamment, puis les assemble sur le serveur. Utilisez-le pour les objets volumineux, les transferts qu’il est possible de réessayer, et les chargements depuis le navigateur qui nécessitent un suivi de progression et une annulation.

## Vue d’ensemble

Le flux S3 de chargement partitionné comporte trois phases obligatoires :

1. **CreateMultipartUpload** renvoie un ID de chargement.
2. **UploadPart** charge des parties numérotées et renvoie un ETag pour chaque partie.
3. **CompleteMultipartUpload** soumet les numéros de partie ordonnés et les ETag afin de créer l’objet final.

Interrompez un chargement inachevé avec **AbortMultipartUpload** afin que les parties temporaires ne continuent pas de consommer du stockage.

RustFS accepte les numéros de partie de `1` à `10000`. `ListParts` et `ListMultipartUploads` renvoient au plus 1 000 entrées par réponse et utilisent des marqueurs pour la pagination. L’objet terminé n’apparaît qu’une fois la requête de finalisation réussie.

## Charger dans la Console

1. Connectez-vous à la Console RustFS et ouvrez le compartiment (bucket) de destination.
2. Sélectionnez **Upload File/Folder**.
3. Saisissez éventuellement un **Current Prefix**.
4. Sélectionnez **Select File** ou **Select Folder**, puis choisissez le contenu à charger.
5. Vérifiez les noms et les tailles sélectionnés, puis sélectionnez **Start Upload**.

![boîte de dialogue de chargement de la Console avec un fichier volumineux sélectionné](./images/multipart-upload-console.png)

La boîte de dialogue de chargement de la Console accepte jusqu’à 10 000 fichiers et indique un maximum de 512 GB pour un seul fichier. Il s’agit de limites de chargement de la Console ; les clients S3 peuvent avoir des limites locales différentes.

Une fois le chargement démarré, **Task Management** regroupe les tâches selon les états Pending, Processing, Completed, Failed et Canceled. Chaque tâche en cours de traitement affiche la progression et une action **Cancel**. L’annulation d’une tâche de chargement partitionné active interrompt la requête de partie en cours et marque la tâche comme annulée.

Actualisez le compartiment une fois le chargement terminé, et confirmez la taille de l’objet ainsi que sa date de modification.

## Utiliser rc

Chargez un objet et vérifiez-le avec `rc` :

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object stat rustfs/my-bucket/hello.txt --json
```

:::note[Limites du chargement partitionné dans rc 0.1.29]

`rc 0.1.29` n’expose pas de commandes pour créer un chargement, charger une partie, le finaliser, lister les parties ou l’interrompre. Un `rc object copy` de 20 MiB, validé, a utilisé une seule requête `PutObject` plutôt qu’un chargement partitionné. Utilisez la Console ou un SDK S3 lorsqu’un comportement explicite de chargement partitionné est requis ; utilisez `rc object stat` pour vérifier l’objet terminé.

:::

Pour un compartiment avec gestion des versions, répertoriez la version créée par un chargement partitionné terminé :

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
```

RustFS renvoie un ID de version lorsque la finalisation du chargement partitionné réussit dans un compartiment avec gestion des versions.

## Opérations S3 de chargement partitionné

Utilisez un SDK S3 qui prend en charge ces opérations standard :

| Phase | Opération S3 | Valeurs requises |
| --- | --- | --- |
| Lancement | `CreateMultipartUpload` | Compartiment, clé, métadonnées, chiffrement et paramètres facultatifs de verrouillage d’objet. |
| Chargement | `UploadPart` | Compartiment, clé, ID de chargement, numéro de partie et corps. Conservez l’ETag renvoyé. |
| Inspection | `ListParts` | Compartiment, clé et ID de chargement. Paginez si nécessaire. |
| Finalisation | `CompleteMultipartUpload` | Numéros de partie ordonnés et leurs ETag exacts. |
| Annulation | `AbortMultipartUpload` | Compartiment, clé et ID de chargement. |
| Découverte | `ListMultipartUploads` | Compartiment et préfixe facultatif. Paginez si nécessaire. |

Ne réutilisez pas un ID de chargement pour une autre clé. Soumettez les parties terminées dans l’ordre croissant des numéros de partie et conservez chaque ETag exactement tel qu’il a été renvoyé.

## Vérification

Après la finalisation :

```bash
rc object stat rustfs/my-bucket/hello.txt --json
rc object show rustfs/my-bucket/hello.txt > /tmp/hello-downloaded.txt
cmp /path/to/hello.txt /tmp/hello-downloaded.txt
```

Confirmez que `size_bytes` correspond au fichier local et que `cmp` se termine avec succès. Pour un compartiment avec gestion des versions, confirmez aussi que `rc bucket version list` renvoie un ID de version.

## Dépannage

| Symptôme | Vérification |
| --- | --- |
| Le chargement reste à l’état Processing | Vérifiez la connectivité du navigateur et laissez l’onglet de la Console ouvert ; annulez puis réessayez lorsque la connexion est interrompue. |
| Une requête de partie échoue | Réessayez cette partie avec le même ID de chargement et le même numéro de partie, puis utilisez le dernier ETag renvoyé. |
| La finalisation signale une partie non valide | Vérifiez les numéros de partie soumis, leur ordre et les ETag par rapport à `ListParts`. |
| L’objet est absent après le chargement des parties | Envoyez `CompleteMultipartUpload` ; les parties chargées, à elles seules, ne créent pas l’objet. |
| Le stockage temporaire continue d’augmenter | Répertoriez les chargements incomplets et interrompez ceux qui ne sont plus nécessaires. |
| La finalisation échoue sur une clé verrouillée | Vérifiez la rétention de verrouillage d’objet ou la conservation légale (Legal Hold) sur la version de destination actuelle. |

## Étapes suivantes

- [Créer et inspecter des objets](./creation.md)
- [Gérer les versions d’objet](./versioning.md)
- [Protéger les objets avec le verrouillage d’objet](./object-lock.md)
