---
title: "Fluentd"
description: "Envoyez les événements de journaux Fluentd vers RustFS avec le plugin de sortie S3."
---

Ce guide connecte [Fluentd](https://github.com/fluent/fluentd) — le collecteur de données open source — à **RustFS** via le plugin de sortie `out_s3`. Vous allez exécuter Fluentd avec une source tail, mettre les événements de journaux en tampon, puis vérifier que les objets vidés sont stockés dans RustFS. Le flux a été validé avec `fluent/fluentd:v1.17-1`, `fluent-plugin-s3` 1.8.6 et `rustfs/rustfs-x86-musl:v2.3.1`.

Vous avez besoin de Docker. Ce déploiement est destiné aux tests d’intégration locaux, pas à la production.

## Schéma d’architecture

```mermaid
flowchart LR
	App["Application"] -->|"writes lines"| File["app.log"]
	File -->|tail| Fluentd["Fluentd"]
	Fluentd -->|"gzip objects"| RustFS["RustFS :9000"]
```

La source tail lit les nouvelles lignes de `app.log` et les transmet à la sortie S3, qui met les événements en tampon selon une clé temporelle et charge (upload) un objet gzip par fenêtre de vidage.

## 1. Créer les fichiers du projet

Créez d’abord le compartiment (bucket) — Fluentd ne crée pas les compartiments :

```bash
rc alias set rustfs http://<your-rustfs-endpoint>:9000 <your-access-key> <your-secret-key>
rc mb rustfs/fluentd-data
```

L’image officielle de Fluentd s’exécute avec un utilisateur non root et ne peut pas installer de gems au démarrage ; construisez donc une petite image avec le plugin S3 :

```dockerfile title="Dockerfile"
FROM fluent/fluentd:v1.17-1
USER root
RUN gem install fluent-plugin-s3 --no-document
USER fluent
```

Créez la configuration Fluentd, en remplaçant les deux valeurs d’identifiants indicatives :

```nginx title="fluent.conf"
<source>
  @type tail
  path /var/log/app.log
  pos_file /var/log/app.log.pos
  tag rustfs.demo
  <parse>
    @type none
  </parse>
</source>

<match **>
  @type s3
  aws_key_id <your-access-key>
  aws_sec_key <your-secret-key>
  s3_bucket fluentd-data
  s3_endpoint http://rustfs:9000/
  s3_region us-east-1
  force_path_style true
  path fluentd-logs
  <buffer>
    @type memory
    timekey 30s
    timekey_wait 0s
    flush_mode immediate
  </buffer>
</match>
```

`force_path_style true` est requis — sans cela, le plugin construit `fluentd-data.rustfs` comme nom d’hôte et chaque requête échoue avec une erreur DNS. À l’intérieur du réseau Compose, le nom d’hôte est `rustfs` ; depuis l’hôte, utilisez `http://localhost:9000/`.

Construisez l’image et démarrez Fluentd sur le même réseau Docker que RustFS :

```bash
docker build -t fluentd-rustfs .
mkdir -p logs
docker run -d --name fluentd --network oo-rustfs_default \
  -v "$PWD/fluent.conf":/fluentd/etc/fluent.conf:ro \
  -v "$PWD/logs":/var/log fluentd-rustfs
```

## 2. Produire des événements de journaux

Ajoutez des lignes au fichier surveillé :

```bash
echo "rustfs fluentd demo line 1" >> logs/app.log
echo "rustfs fluentd demo line 2" >> logs/app.log
```

Avec une clé temporelle de 30 secondes et le mode de vidage immédiat, chaque fenêtre charge un objet gzip peu après sa fermeture. Attendez environ une minute.

## 3. Vérifier les objets dans RustFS

Listez le compartiment :

```bash
rc ls rustfs/fluentd-data/ -r
```

Chaque fenêtre de vidage produit un objet compressé en gzip :

```text
fluentd-logs20260921154400_0.gz
fluentd-logs20260921154400_1.gz
```

Relisez un objet pour confirmer que les événements sont intacts :

```bash
rc cat rustfs/fluentd-data/fluentd-logs20260921154400_0.gz | gunzip
```

![Objets de journaux Fluentd stockés dans la Console RustFS](./images/rustfs-fluentd-logs.png)

## 4. Arrêter ou réinitialiser le déploiement

Arrêtez Fluentd en conservant les données :

```bash
docker rm -f fluentd
```

Les objets restent dans le compartiment `fluentd-data`. Pour les supprimer, supprimez le compartiment :

```bash
rc rb rustfs/fluentd-data --force
```

## Dépannage

### `Unknown output plugin 's3'`

Le plugin n’est pas installé. Vérifiez que le Dockerfile installe `fluent-plugin-s3` en tant que `root` avant de revenir à l’utilisateur `fluent` — une installation au démarrage du conteneur avec l’utilisateur par défaut échoue avec des erreurs de permission.

### `Failed to open TCP connection to fluentd-data.rustfs`

L’adressage de type hôte virtuel est utilisé. Ajoutez `force_path_style true` à la sortie `s3` afin que le compartiment reste dans le chemin de l’URL.

### Le worker plante dans une boucle de redémarrage

La sortie échoue de façon brutale lorsque le compartiment n’existe pas. Créez `fluentd-data` avant de démarrer Fluentd et consultez le journal de démarrage :

```bash
docker logs fluentd | grep -iE "error|bucket" | tail
```

## Étapes suivantes

- Consultez les [notes de compatibilité S3](/fr/administration/protocols/s3) avant d’adopter d’autres sorties Fluentd.
- Créez des identifiants de production dédiés avec la [gestion des clés d’accès](/fr/security-compliance/iam/access-token).
- Suivez la [documentation de fluent-plugin-s3](https://github.com/fluent/fluent-plugin-s3) pour les formats de clé d’objet et les options de compression.
