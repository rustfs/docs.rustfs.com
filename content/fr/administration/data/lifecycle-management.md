---
title: "Gestion du cycle de vie"
description: "Configurez, inspectez et maintenez les règles de cycle de vie des objets RustFS avec le client en ligne de commande rc."
---

La gestion du cycle de vie RustFS applique des règles d’expiration et de transition aux objets d’un compartiment (bucket). Cette page montre comment gérer ces règles avec `rc`, vérifier une transition et restaurer une copie locale temporaire des données transférées.

Avant de commencer, [installez `rc`](/fr/operations/rc), configurez un alias nommé `local` et créez `my-bucket`. Pour faire transiter des objets, enregistrez d’abord la cible dans [Stockage hiérarchisé](/fr/administration/data/tiered-storage) et notez son nom de niveau en majuscules.

:::note[Évaluation asynchrone]

Les règles de cycle de vie ne traitent pas immédiatement chaque objet éligible. Le [scanner d’objets](/fr/administration/data/object/scanner) évalue le travail de cycle de vie en arrière-plan.

:::

## Ajouter une règle d’expiration

Faites expirer les objets du préfixe `logs/` 30 jours après leur création :

```bash
rc bucket lifecycle rule add local/my-bucket \
	--prefix logs/ \
	--expiry-days 30
```

La commande crée une règle activée et renvoie l’ID de règle généré. Notez cet ID si vous devez modifier ou supprimer cette règle précise.

## Ajouter une règle de transition

Déplacez les données d’objet vers le niveau enregistré `COLDTIER` au bout de 90 jours :

```bash
rc bucket lifecycle rule add local/my-bucket \
	--transition-days 90 \
	--storage-class COLDTIER
```

`--storage-class` doit correspondre au nom d’un niveau enregistré. L’ajout de la règle ne crée pas le niveau et ne valide pas un libellé de classe de stockage AWS en tant que niveau RustFS.

Vous pouvez combiner des options d’expiration et de transition dans une même règle. N’utilisez les options de versions non actuelles que pour un compartiment dont la gestion des versions est activée :

```bash
rc bucket lifecycle rule add local/my-bucket \
	--noncurrent-transition-days 30 \
	--noncurrent-transition-storage-class COLDTIER \
	--noncurrent-expiry-days 365
```

## Inspecter et mettre à jour les règles

Listez les règles actuelles et notez l’ID de la règle à modifier :

```bash
rc bucket lifecycle rule list local/my-bucket
```

Modifiez la durée d’expiration d’une règle, ou désactivez-la sans la supprimer :

```bash
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--expiry-days 60
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--disable true
```

Supprimez une règle par son ID. N’utilisez `--all` que si vous avez l’intention de supprimer toute la configuration de cycle de vie du compartiment :

```bash
rc bucket lifecycle rule remove local/my-bucket --id <rule-id>
rc bucket lifecycle rule remove local/my-bucket --all
```

## Exporter et importer les règles

Exportez la configuration de cycle de vie du compartiment avant une modification groupée :

```bash
rc bucket lifecycle rule export local/my-bucket > lifecycle.json
```

L’importation d’un fichier remplace la configuration de cycle de vie envoyée au compartiment. Examinez le JSON avant de l’appliquer :

```bash
rc bucket lifecycle rule import local/my-bucket lifecycle.json
```

## Confirmer une transition de cycle de vie

Lorsqu’un objet devient éligible au regard de sa règle de cycle de vie, inspectez-le sur le cluster source :

```bash
aws s3api head-object \
	--bucket my-bucket \
	--key hello.txt \
	--endpoint-url http://localhost:9000
```

Une fois la transition terminée, la réponse indique le nom du niveau enregistré comme classe de stockage :

```json
{
	"StorageClass": "COLDTIER"
}
```

La réponse peut contenir d’autres métadonnées d’objet. Avant la fin de la transition, `StorageClass` peut être absent ou ne pas encore indiquer `COLDTIER`.

Lisez l’objet via le point de terminaison RustFS source, comme d’habitude :

```bash
aws s3 cp \
	s3://my-bucket/hello.txt \
	/path/to/hello.txt \
	--endpoint-url http://localhost:9000
```

RustFS lit les données transférées via le compartiment source et la clé d’objet. Les applications n’ont pas besoin de s’adresser directement au compartiment cible.

## Restaurer une copie locale

Demandez une copie locale temporaire d’un objet transféré et conservez-la pendant sept jours :

```bash
rc bucket lifecycle restore local/my-bucket/hello.txt --days 7
```

Pendant le rapatriement, `HEAD` indique `x-amz-restore: ongoing-request="true"`. Une fois l’opération terminée, il indique `ongoing-request="false"` avec une date d’expiration. Une seconde restauration soumise alors qu’une restauration est en cours renvoie `RestoreAlreadyInProgress`.

À l’expiration de la période de restauration, RustFS supprime la copie locale restaurée et ses métadonnées de restauration. L’objet transféré reste disponible depuis le niveau distant.

## Compatibilité des commandes

La dernière version de `rc` accepte aussi `rc ilm` comme alias de compatibilité. Nous recommandons la forme `rc bucket lifecycle`, qui place le nom en premier, pour les nouvelles commandes et les scripts :

```bash
rc bucket lifecycle --help
rc bucket lifecycle rule --help
rc bucket lifecycle tier --help
```

## Étapes suivantes

Consultez [Stockage hiérarchisé](/fr/administration/data/tiered-storage) pour surveiller ou maintenir les niveaux distants, et utilisez la [création d’objets](/fr/administration/data/object/creation) pour créer des objets de test d’une règle de cycle de vie.
