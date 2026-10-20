---
title: "VictoriaMetrics"
description: "Sauvegardez les instantanés VictoriaMetrics vers RustFS avec vmbackup."
---

Ce guide connecte [VictoriaMetrics](https://github.com/VictoriaMetrics/VictoriaMetrics) — la base de données de séries temporelles compatible avec Prometheus — à **RustFS** via `vmbackup` et `vmrestore`. Vous allez exécuter une instance à nœud unique, importer des métriques, créer un instantané immédiat, le sauvegarder vers un compartiment (bucket) RustFS, puis restaurer les données dans un répertoire neuf. Le flux a été validé avec les images `victoria-metrics`, `vmbackup` et `vmrestore` v1.x face à `rustfs/rustfs-x86-musl:v2.3.1`.

Vous avez besoin de Docker. Ce déploiement est destiné aux tests d’intégration locaux, pas à la production.

## Schéma d’architecture

```mermaid
flowchart LR
	Import["Prometheus import API"] --> VM["VictoriaMetrics :8428"]
	VM -->|"instant snapshot"| Backup["vmbackup"]
	Backup -->|"S3 API"| RustFS["RustFS :9000"]
	RustFS -->|"restore"| Restore["vmrestore"]
```

`vmbackup` charge (upload) un instantané cohérent à un instant donné du répertoire de stockage vers n’importe quel point de terminaison compatible avec S3. `vmrestore` inverse le processus et produit un répertoire de données qu’une instance VictoriaMetrics peut ouvrir directement.

## 1. Exécuter VictoriaMetrics

Créez le compartiment et démarrez une instance à nœud unique :

```bash
rc mb rustfs/vm-backups

docker run -d --name vm --network oo-rustfs_default -p 8428:8428 \
  -v vm-data:/storage \
  victoriametrics/victoria-metrics:latest \
  -storageDataPath=/storage -retentionPeriod=100y
```

## 2. Importer des métriques

Écrivez quelques échantillons via l’API d’import Prometheus :

```bash
echo "vm_demo_metric 123" | curl -s --data-binary @- http://localhost:8428/api/v1/import/prometheus
echo "vm_demo_metric 456" | curl -s --data-binary @- http://localhost:8428/api/v1/import/prometheus
```

Le point de terminaison répond `204 No Content`. Confirmez que les données sont interrogeables :

```bash
curl -s "http://localhost:8428/api/v1/export?match[]=vm_demo_metric"
```

```text
{"metric":{"__name__":"vm_demo_metric"},"values":[123,456],"timestamps":[1790680894604,1790680894619]}
```

## 3. Créer un instantané

Demandez à VictoriaMetrics un instantané cohérent :

```bash
curl -s http://localhost:8428/snapshot/create
```

```text
{"status":"ok","snapshot":"20260929112134-18D9C6C76704F913"}
```

## 4. Sauvegarder l’instantané vers RustFS

Exécutez `vmbackup` sur le même volume de stockage, en remplaçant les valeurs d’identifiants indicatives. Le nom de l’instantané provient de l’étape 3 :

```bash
docker run --rm --network oo-rustfs_default \
  -e AWS_ACCESS_KEY_ID=<your-access-key> \
  -e AWS_SECRET_ACCESS_KEY=<your-secret-key> \
  --volumes-from vm \
  victoriametrics/vmbackup:latest \
  -storageDataPath=/storage \
  -snapshotName=20260929112134-18D9C6C76704F913 \
  -dst=s3://vm-backups/demo \
  -customS3Endpoint=http://<your-rustfs-endpoint>:9000
```

```text
backup ... to S3{bucket: "vm-backups", dir: "demo/"} is complete; uploaded 760 bytes
```

`-customS3Endpoint` redirige le SDK AWS vers RustFS ; les points de terminaison personnalisés sont adressés automatiquement par des requêtes en adressage de type chemin (path-style). Définissez `AWS_EC2_METADATA_DISABLED=true` sur les hôtes sans service de métadonnées EC2 afin d’éviter les délais de recherche d’identifiants.

## 5. Vérifier et restaurer

Listez le préfixe du compartiment :

```bash
rc ls rustfs/vm-backups/demo/
```

```text
backup_complete.ignore
backup_metadata.ignore
data/
metadata/
```

`backup_complete.ignore` marque une sauvegarde complète. Restaurez-la dans un répertoire neuf :

```bash
docker run --rm --network oo-rustfs_default \
  -e AWS_ACCESS_KEY_ID=<your-access-key> \
  -e AWS_SECRET_ACCESS_KEY=<your-secret-key> \
  -v /opt/vm-restore:/restore \
  victoriametrics/vmrestore:latest \
  -src=s3://vm-backups/demo \
  -storageDataPath=/restore \
  -customS3Endpoint=http://<your-rustfs-endpoint>:9000
```

```text
restored 760 bytes from backup in 0.055 seconds
```

Le répertoire restauré contient `data/`, `metadata/` et un fichier de verrou — exactement ce qu’une instance VictoriaMetrics attend pour `-storageDataPath`.

![Sauvegarde VictoriaMetrics stockée dans la Console RustFS](./images/rustfs-vm-backups.png)

## 6. Arrêter ou réinitialiser

Pour arrêter la démonstration tout en conservant les objets du compartiment :

```bash
docker rm -f vm
docker volume rm vm-data
```

Pour supprimer les sauvegardes stockées :

```bash
rc rm rustfs/vm-backups/ --recursive --force
```

## Dépannage

### `vmbackup` reste bloqué au démarrage ou ne trouve pas les identifiants

Le SDK AWS interroge le service de métadonnées EC2 lorsque les identifiants d’environnement sont absents. Sur les machines sans IMDS, exportez `AWS_EC2_METADATA_DISABLED=true` à côté des variables de clé.

### Les parties de la sauvegarde sont de nouveau chargées à chaque exécution

`vmbackup` effectue des sauvegardes incrémentales en comparant les hachages des fichiers locaux et distants. Restaurer vers un répertoire neuf, puis exécuter `vmbackup` depuis celui-ci, charge de nouveau l’ensemble des fichiers ; conservez le répertoire de données d’origine pour les exécutions incrémentales.

### La requête ne renvoie rien juste après l’import

Les imports sont acceptés de façon asynchrone et le point de terminaison de requête instantanée peut prendre du retard sur un nœud unique chargé. Vérifiez avec `/api/v1/export` (ou attendez quelques secondes) avant de créer l’instantané.

## Étapes suivantes

- Consultez les [notes de compatibilité S3](/fr/administration/protocols/s3) avant d’adopter d’autres composants VictoriaMetrics.
- Créez des identifiants de production dédiés avec la [gestion des clés d’accès](/fr/security-compliance/iam/access-token).
- Suivez la [documentation vmbackup](https://docs.victoriametrics.com/vmbackup/) pour planifier les sauvegardes et purger les anciens instantanés.
