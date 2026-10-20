---
title: "Gestion des versions"
description: "Activez la gestion des versions d’un compartiment, récupérez d’anciennes versions d’objet et gérez les marqueurs de suppression avec rc et la Console."
---

La gestion des versions d’un compartiment (bucket) dans RustFS conserve plusieurs versions de la même clé d’objet. Utilisez-la pour revenir d’un écrasement accidentel ou d’une suppression accidentelle, et pour satisfaire les prérequis du verrouillage d’objet et de la réplication de compartiment.

## Vue d’ensemble

Lorsque la gestion des versions est activée :

- Chaque chargement (upload) ou copie vers une clé existante crée un nouvel ID de version.
- Une suppression normale crée un marqueur de suppression au lieu de retirer les versions antérieures.
- La lecture de la clé sans ID de version renvoie la dernière version visible, ou `NotFound` lorsque la dernière entrée est un marqueur de suppression.
- La lecture ou la suppression d’une version précise exige son ID de version.

La suspension de la gestion des versions interrompt la création normale de nouveaux ID de version, mais conserve les versions existantes et les marqueurs de suppression. Suspendre n’équivaut pas à désactiver ni à supprimer l’historique des versions.

## Configurer dans la Console

### Activer à la création du compartiment

1. Ouvrez **Buckets** et sélectionnez **Create Bucket**.
2. Saisissez le nom du compartiment.
3. Activez **Version**.
4. Sélectionnez **Create**.

### Activer ou suspendre la gestion des versions d’un compartiment existant

1. Ouvrez **Buckets**, localisez le compartiment et sélectionnez **Settings**.
2. Sous **Data Protection**, repérez **Versioning**.
3. Activez la gestion des versions, ou suspendez-la selon le besoin.

La page de paramètres indique `Enabled`, `Suspended` ou `Disabled`. Elle précise aussi que la suspension conserve les versions existantes.

### Parcourir et récupérer les versions

1. Ouvrez le compartiment et activez **Show Deleted Objects** lorsque vous devez voir les clés masquées par des marqueurs de suppression.
2. Sélectionnez le nom d’un objet pour ouvrir **Object Details**.
3. Sélectionnez **Versions** pour inspecter les versions disponibles et les marqueurs de suppression.
4. Téléchargez la version voulue et chargez-la de nouveau afin que son contenu devienne la dernière version.

## Utiliser rc

Créez un compartiment et activez la gestion des versions :

```bash
rc bucket create rustfs/my-bucket
rc bucket version enable rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

Chargez deux versions de la même clé :

```bash
printf 'version one\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt

printf 'version two\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt --overwrite
```

Répertoriez les versions et notez l’ID de version à récupérer :

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

Restaurez une version antérieure en téléchargeant son contenu et en le chargeant comme nouvelle dernière version :

```bash
rc object show rustfs/my-bucket/hello.txt \
	--version-id <version-id> > /tmp/hello-restored.txt

rc object copy /tmp/hello-restored.txt \
	rustfs/my-bucket/hello.txt --overwrite
```

Supprimez la clé actuelle pour créer un marqueur de suppression, puis inspectez-le :

```bash
rc object remove rustfs/my-bucket/hello.txt --force
rc bucket version list rustfs/my-bucket/hello.txt --json
```

La dernière entrée devrait afficher `is_delete_marker: true`. Les versions antérieures restent disponibles par ID de version.

Suspendez la gestion des versions lorsque vous ne souhaitez plus que les écritures normales créent de nouvelles versions numérotées :

```bash
rc bucket version suspend rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

:::warning[Limite de suppression de version dans rc 0.1.29]

`rc object remove --versions` figure dans l’aide de `rc 0.1.29`, mais renvoie `not implemented`. Utilisez la Console ou un SDK S3 pour supprimer définitivement les ID de version choisis. Ne supprimez pas un historique de versions complet, sauf si vous avez vérifié les exigences de rétention, de réplication et de récupération.

:::

## Vérification

Après avoir activé la gestion des versions :

1. Chargez deux fois la même clé avec des contenus différents.
2. Exécutez `rc bucket version list` et confirmez que les deux entrées ont des ID de version distincts.
3. Récupérez chaque version avec `rc object show --version-id` et comparez son contenu.
4. Supprimez la clé sans ID de version et confirmez qu’un marqueur de suppression apparaît.
5. Récupérez une version antérieure par son ID de version pour confirmer qu’elle reste récupérable.

## Considérations d’exploitation

- La gestion des versions augmente l’usage du stockage, car les écrasements et les suppressions conservent les données antérieures.
- Ne configurez les règles de cycle de vie des versions non actuelles qu’après avoir défini les périodes de récupération et de rétention.
- La réplication de compartiment exige la gestion des versions sur le compartiment source et sur le compartiment de destination.
- Le verrouillage d’objet dépend de la gestion des versions et protège chaque version.
- La finalisation d’un chargement partitionné crée une nouvelle version d’objet dans un compartiment avec gestion des versions.

## Étapes suivantes

- [Protéger les versions avec le verrouillage d’objet](./object-lock.md)
- [Charger des objets volumineux](./multipart-upload.md)
- [Gérer le cycle de vie du compartiment](../lifecycle-management.md)
