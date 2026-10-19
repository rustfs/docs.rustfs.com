---
title: "Référence CLI"
description: "Référence des sous-commandes rustfs, des indicateurs du serveur, des équivalents en variables d’environnement et de la syntaxe des chemins de volume."
---

Le binaire `rustfs` fournit six sous-commandes. L’exécution de `rustfs` sans sous-commande démarre le serveur.

## Sous-commandes

| Commande | Description |
| --- | --- |
| `rustfs server [OPTIONS] <VOLUMES>...` | Démarre le serveur de stockage objet (comportement par défaut lorsqu’aucune sous-commande n’est fournie). |
| `rustfs info [--all] [--json] [system\|runtime\|build\|config\|deps]` | Affiche les informations sur le système, l’exécution, la compilation, la configuration ou les dépendances. |
| `rustfs tls inspect --path <DIR>` | Inspecte la disposition d’un répertoire de certificats TLS et l’état de son analyse. |
| `rustfs diagnose [OPTIONS] <PATHS>...` | Analyse les fichiers journaux et signale les causes d’échec probables. |
| `rustfs inspect <COMMAND>` | Inspecte les métadonnées de compartiment (bucket) persistées, sans serveur en cours d’exécution. |
| `rustfs connect <COMMAND>` | Configure l’intégration sortante RustFS Connect. |

```bash title="Examples"
rustfs server /data/rustfs
rustfs info --all --json
rustfs tls inspect --path /etc/rustfs/tls
```

### Compatibilité des invocations historiques

Les arguments sont prétraités pour la rétrocompatibilité, afin que les anciens styles d’invocation continuent de fonctionner :

| Forme historique | Interprétée comme |
| --- | --- |
| `rustfs /data` | `rustfs server /data` |
| `rustfs --address :9000 /data` | `rustfs server --address :9000 /data` |
| `rustfs` (sans argument) | `rustfs server` avec les volumes lus depuis `RUSTFS_VOLUMES` |
| `rustfs --info` | `rustfs info` |
| `rustfs help` | `rustfs --help` |

## Indicateurs du serveur

Chaque indicateur du serveur possède une variable d’environnement équivalente ; l’indicateur l’emporte lorsque les deux sont définis.

| Indicateur | Variable d’environnement | Valeur par défaut | Description |
| --- | --- | --- | --- |
| `<VOLUMES>...` (positionnel) | `RUSTFS_VOLUMES` | obligatoire | Volumes ou points de terminaison de stockage, séparés par des espaces. |
| `--address` | `RUSTFS_ADDRESS` | `:9000` | Adresse d’écoute de l’API S3 (`ADDRESS:PORT`, adresse IP ou nom d’hôte). |
| `--server-domains` | `RUSTFS_SERVER_DOMAINS` | non définie | Domaines séparés par des virgules pour les requêtes en adressage de type hôte virtuel. |
| `--access-key` | `RUSTFS_ACCESS_KEY` | non définie | Clé d’accès racine (incompatible avec `--access-key-file`). |
| `--access-key-file` | `RUSTFS_ACCESS_KEY_FILE` | non définie | Fichier contenant la clé d’accès racine. |
| `--secret-key` | `RUSTFS_SECRET_KEY` | non définie | Clé secrète racine (incompatible avec `--secret-key-file`). |
| `--secret-key-file` | `RUSTFS_SECRET_KEY_FILE` | non définie | Fichier contenant la clé secrète racine. |
| `--console-enable` | `RUSTFS_CONSOLE_ENABLE` | `true` | Active la console web intégrée. |
| `--console-address` | `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Adresse d’écoute de la Console. |
| `--obs-endpoint` | `RUSTFS_OBS_ENDPOINT` | vide | URL de base OTLP/HTTP pour les traces, les métriques et les journaux. |
| `--tls-path` | `RUSTFS_TLS_PATH` | non définie | Répertoire de certificats TLS pour l’API et la Console. |
| `--license` | `RUSTFS_LICENSE` | non définie | Chaîne de licence. |
| `--region` | `RUSTFS_REGION` | non définie | Région du service signalée aux clients. |
| `--kms-enable` | `RUSTFS_KMS_ENABLE` | `false` | Active le chiffrement côté serveur KMS. |
| `--kms-backend` | `RUSTFS_KMS_BACKEND` | `local` | Backend KMS : `local`, `vault` / `vault-kv2`, `vault-transit`. |
| `--kms-key-dir` | `RUSTFS_KMS_KEY_DIR` | non définie | Répertoire de clés du backend KMS local. |
| `--kms-local-master-key` | `RUSTFS_KMS_LOCAL_MASTER_KEY` | non définie | Clé principale pour le chiffrement des fichiers de clés du KMS local. |
| `--kms-vault-address` | `RUSTFS_KMS_VAULT_ADDRESS` | non définie | Adresse Vault pour les backends Vault. |
| `--kms-vault-token` | `RUSTFS_KMS_VAULT_TOKEN` | non définie | Jeton Vault pour les backends Vault. |
| `--kms-vault-mount-path` | `RUSTFS_KMS_VAULT_MOUNT_PATH` | non définie | Point de montage Transit pour `vault-transit` (vaut `transit` par défaut) ; obsolète et inutilisé pour `vault` / `vault-kv2`. |
| `--kms-default-key-id` | `RUSTFS_KMS_DEFAULT_KEY_ID` | non définie | ID de clé KMS par défaut pour le chiffrement. |
| `--kms-allow-insecure-dev-defaults` | `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Autorise les valeurs par défaut KMS non sécurisées, réservées au développement. |
| `--buffer-profile` | `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Profil de charge pour le dimensionnement adaptatif des tampons. |
| `--buffer-profile-disable` | `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Utilise les tampons de taille fixe historiques. |

:::note

Si ni `--access-key`/`--secret-key` ni leurs variantes fichier ne sont fournis, le serveur revient aux identifiants par défaut intégrés (`rustfsadmin`/`rustfsadmin`) et journalise un avertissement. Définissez de véritables identifiants pour tout déploiement qui n’est pas à usage jetable.

:::

## Syntaxe des volumes

Les volumes sont transmis comme arguments positionnels (ou via `RUSTFS_VOLUMES`) et sont séparés par des espaces.

### Expansion des ellipses

Un jeton de volume peut contenir une ou plusieurs plages `{N...M}`, qui s’étendent numériquement :

```bash title="Ellipses expansion"
# Expands to /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
rustfs server /data/rustfs{0...3}

# Multi-node: expands across hosts and disks
rustfs server http://node{1...4}:9000/data/rustfs{0...3}
```

Règles vérifiées dans l’analyseur :

- Le format de plage est `{N...M}`, où `N` et `M` sont des entiers positifs décimaux ou hexadécimaux et où `M` doit être supérieur à `N`.
- Un seul jeton peut porter plusieurs plages (par exemple une plage d’hôtes et une plage de disques) ; toutes les combinaisons sont développées.
- La taille maximale développée d’une plage est de 10 000 entrées.

### Plusieurs pools

Des pools de serveurs distincts s’expriment comme des groupes de points de terminaison séparés par des espaces. Chaque argument (un par espace) forme son propre groupe d’expansion :

```bash title="Two pools"
rustfs server http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...3}
```

Lorsqu’elle est définie via l’environnement, la même chaîne est placée dans `RUSTFS_VOLUMES` :

```bash title="Via environment"
export RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
rustfs server
```
