---
title: "SSE-KMS"
description: "Configurez SSE-KMS avec un backend KMS local ou HashiCorp Vault pour RustFS."
---

Le service de gestion des clés (Key Management Service, KMS) de RustFS génère et enveloppe les clés de chiffrement des données propres à chaque objet, pour [SSE-S3](./sse-s.md) et SSE-KMS. Ce guide configure SSE-KMS au démarrage du serveur avec un magasin de clés local, Vault KV v2 ou Vault Transit.

## Prérequis

- Installez et configurez [`rc`](/fr/operations/rc) pour le flux de vérification du chiffrement.
- Sauvegardez toutes les données existantes et le matériel de clés KMS avant de modifier la configuration de chiffrement.
- Appliquez le même backend KMS et le même ID de clé par défaut à chaque nœud RustFS.
- Utilisez un gestionnaire de processus ou de secrets qui injecte les secrets sans les ajouter au dépôt de code source.
- Pour Vault, activez les moteurs de secrets requis, créez un jeton de moindre privilège et rendez Vault accessible depuis chaque nœud RustFS.
- Provisionnez une clé principale KMS avant de configurer son ID comme clé par défaut de RustFS.

:::warning[La perte de la clé rend les objets chiffrés illisibles]

RustFS ne conserve pas de copie récupérable de votre clé principale KMS en dehors du backend configuré. Sauvegardez les fichiers de clés locaux et leur clé principale, ou protégez les données Vault et les identifiants de récupération, avant d’écrire des objets chiffrés.

:::

## Choisir un backend

| Backend | `RUSTFS_KMS_BACKEND` | Stockage et enveloppement des clés | Usage prévu |
| --- | --- | --- | --- |
| Local | `local` | Fichiers de clés sur l’hôte RustFS | Développement, tests ou déploiement mono-hôte soigneusement sauvegardé |
| Vault KV2 | `vault` ou `vault-kv2` | Matériel de clé principale dans Vault KV v2 ; enveloppement des clés de données dans RustFS | Stockage centralisé des clés |
| Vault Transit | `vault-transit` | Opérations cryptographiques via Vault Transit | Gestion centralisée des clés de production, sans le mode de backend KV2 |

SSE-S3 et SSE-KMS exigent tous deux que le service KMS soit en cours d’exécution. Configurer seulement la valeur par défaut d’un compartiment (bucket) ne suffit pas à faire réussir les écritures chiffrées lorsque le KMS est indisponible.

## Configurer le backend local

Créez un répertoire de clés en chemin absolu, appartenant au compte de service RustFS :

```bash
sudo install -d -m 0700 -o rustfs -g rustfs /var/lib/rustfs/kms
```

Ajoutez les réglages KMS au fichier d’environnement RustFS sur chaque nœud :

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=local
RUSTFS_KMS_KEY_DIR=/var/lib/rustfs/kms
RUSTFS_KMS_LOCAL_MASTER_KEY=<your-kms-master-key>
```

`RUSTFS_KMS_KEY_DIR` est exigé au démarrage du serveur RustFS. Le backend local écrit les fichiers de clés avec des permissions réservées au propriétaire. RustFS rejette les valeurs par défaut de développement, telles qu’un répertoire de clés temporaire ou une clé principale locale absente, sauf si vous définissez explicitement `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` ; n’activez jamais cette dérogation en production.

Redémarrez RustFS après la mise à jour de l’environnement. Cela démarre le backend KMS, mais ne crée pas de clé principale :

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager
```

## Configurer Vault KV2

Activez un moteur KV v2 pour le matériel de clé principale et les métadonnées. RustFS lit le matériel de clé principale et enveloppe les clés de données localement ; ce backend n’appelle pas Vault Transit. Configurez chaque nœud RustFS :

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-kv2
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_KV_MOUNT=secret
RUSTFS_KMS_VAULT_KEY_PREFIX=rustfs/kms/keys
```

Le point de montage KV vaut `secret` par défaut et le préfixe de clé vaut `rustfs/kms/keys` ; les variables ci-dessus permettent de choisir d’autres chemins. Utilisez un jeton Vault autorisé pour les chemins de données et de métadonnées KV configurés. `RUSTFS_KMS_VAULT_MOUNT_PATH` est obsolète et inutilisé pour le backend KV2.

Le matériel de clé principale est encodé en Base64 dans KV2. Toute identité disposant d’un accès en lecture KV sur le chemin de la clé peut récupérer la clé principale en clair : restreignez donc cet accès aux identités RustFS de confiance.

RustFS valide l’URL Vault et rejette les valeurs par défaut de développement non sécurisées, sauf si `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` est défini. En production, utilisez HTTPS et un certificat auquel les hôtes RustFS font confiance.

## Configurer Vault Transit

Activez le moteur Transit et configurez chaque nœud RustFS :

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-transit
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

Vault Transit conserve les versions historiques des clés : la rotation d’une clé Transit ne rend donc pas, à elle seule, illisibles les objets enveloppés avec une version antérieure. Laissez les anciennes versions activées tant que des objets en dépendent.

## Créer et sélectionner la clé par défaut

`RUSTFS_KMS_DEFAULT_KEY_ID` sélectionne une clé existante ; elle n’en crée pas. Démarrez le backend KMS sans cette variable, créez la clé, puis seulement ensuite ajoutez la variable et redémarrez RustFS.

Lorsque le `rc` installé expose les commandes de cycle de vie KMS, créez et inspectez une clé avec :

```bash
rc admin kms status rustfs
rc admin kms key create rustfs --name rustfs-default-key
rc admin kms key status rustfs rustfs-default-key
```

Ajoutez ensuite le même ID de clé par défaut sur chaque nœud RustFS :

```ini title="/etc/default/rustfs"
RUSTFS_KMS_DEFAULT_KEY_ID=rustfs-default-key
```

Redémarrez chaque nœud de façon cohérente après avoir modifié la valeur par défaut.

Pour Vault Transit, vous pouvez aussi créer la clé Transit nommée directement dans Vault avant de la configurer comme valeur par défaut :

```bash
vault write -f transit/keys/rustfs-default-key
```

:::note[Exigences de version de rc]

`rc 0.1.29` n’inclut pas `rc admin kms` ; il ne prend en charge que les commandes de chiffrement de compartiment et d’objet utilisées ci-dessous. Exécutez `rc admin --help` avant de suivre les commandes de cycle de vie des clés. Si la famille de commandes KMS est absente, utilisez une version plus récente de `rc` qui l’inclut, ou provisionnez la clé via l’API d’administration KMS native de RustFS.

:::

## Vérifier le chiffrement reposant sur le KMS

Créez un compartiment de test, configurez SSE-KMS avec la clé par défaut, chargez (upload) un objet et relisez-le :

```bash
rc bucket create rustfs/my-bucket
rc bucket encryption set rustfs/my-bucket --mode sse-kms
rc bucket encryption info rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

Pour sélectionner une clé KMS précise, définissez-la sur la valeur par défaut du compartiment ou sur l’écriture individuelle :

```bash
rc bucket encryption set rustfs/my-bucket \
	--mode sse-kms \
	--key-id rustfs-default-key

rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-kms rustfs/my-bucket/hello.txt=rustfs-default-key
```

Le sélecteur placé avant `=` doit correspondre exactement à la destination transmise à `rc object copy`.

## Effectuer la rotation et récupérer les clés

- **Jeton Vault :** émettez un jeton de remplacement, mettez à jour chaque nœud RustFS, redémarrez de façon cohérente, vérifiez les lectures et écritures chiffrées, puis révoquez l’ancien jeton.
- **Clé Vault Transit :** effectuez la rotation de la clé Transit dans Vault. Les nouvelles opérations d’enveloppement utilisent la nouvelle version, tandis que Vault conserve les versions antérieures pour le déchiffrement.
- **Matériel de clé local ou Vault KV2 :** sauvegardez le matériel actuel avant la rotation et vérifiez que les objets écrits avant et après la rotation restent lisibles.
- **Objets existants :** la rotation d’une clé principale ne réécrit pas les données des objets. Chaque objet conserve la clé de données enveloppée, stockée avec ses métadonnées de chiffrement.

Ne supprimez ni ne désactivez une ancienne version de clé principale tant que vous n’avez pas établi qu’aucun objet conservé n’en dépend.

## Étapes suivantes

Configurez [SSE-S3](./sse-s.md), ou utilisez [SSE-C](./sse-c.md) lorsque le client doit conserver le contrôle de la clé de chiffrement.
