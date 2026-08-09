---
title: "API OpenStack Swift"
description: "Compilez RustFS avec l’API Swift facultative et raccordez-la à l’authentification OpenStack Keystone."
---

RustFS peut exposer une API compatible avec OpenStack Swift sur le même point de terminaison HTTP que son API S3. Ce guide explique comment compiler la fonctionnalité facultative `swift`, configurer la validation des jetons Keystone et vérifier les opérations de base sur les comptes, les conteneurs et les objets.

:::warning[Périmètre de compatibilité]

La prise en charge de Swift est facultative et ne couvre pas tous les comportements d’OpenStack Swift. Les requêtes `HEAD` au niveau du compte et les formats de liste autres que JSON ne sont pas implémentés. Validez le fonctionnement de votre client avant d’utiliser cette API en production.

:::

## Correspondance entre Swift et RustFS

Les requêtes Swift utilisent le chemin `/v1/AUTH_<project-id>/...` sur le point de terminaison de l’API S3 de RustFS :

| Ressource Swift | Chemin de requête | Correspondance RustFS |
| --- | --- | --- |
| Compte | `/v1/AUTH_<project-id>` | Projet Keystone authentifié |
| Conteneur | `/v1/AUTH_<project-id>/<container>` | Compartiment RustFS isolé par projet |
| Objet | `/v1/AUTH_<project-id>/<container>/<object>` | Objet du compartiment correspondant |

L’ID de projet dans l’URL doit correspondre à celui du jeton Keystone validé. RustFS accepte le jeton dans `X-Auth-Token` ou `X-Storage-Token`.

Les opérations principales confirmées sont les suivantes :

| Portée | Opérations |
| --- | --- |
| Compte | Répertorier les conteneurs, mettre à jour les métadonnées du compte |
| Conteneur | Créer, répertorier, inspecter, mettre à jour les métadonnées, supprimer |
| Objet | Charger, télécharger, télécharger une plage, inspecter, mettre à jour les métadonnées, copier, supprimer |

## Compiler avec la prise en charge de Swift

Swift ne fait pas partie des fonctionnalités RustFS activées par défaut. Compilez-la explicitement depuis le dépôt `rustfs/rustfs` :

```bash
cargo build --release --features swift
```

Le binaire obtenu sert les chemins Swift sur l’adresse configurée pour l’API S3. Il n’existe ni écouteur Swift séparé ni port propre à Swift.

## Configurer Keystone

Activez Keystone et définissez son point de terminaison d’authentification avant de démarrer RustFS :

```bash
export RUSTFS_KEYSTONE_ENABLE=true
export RUSTFS_KEYSTONE_AUTH_URL=https://keystone.example.com
export RUSTFS_KEYSTONE_VERSION=v3
export RUSTFS_KEYSTONE_VERIFY_SSL=true
```

| Variable | Rôle | Valeur par défaut |
| --- | --- | --- |
| `RUSTFS_KEYSTONE_ENABLE` | Active la validation des jetons Keystone. | `false` |
| `RUSTFS_KEYSTONE_AUTH_URL` | Définit le point de terminaison d’authentification Keystone ; obligatoire lorsque Keystone est activé. | Non définie |
| `RUSTFS_KEYSTONE_VERSION` | Sélectionne la version de l’API Keystone. | `v3` |
| `RUSTFS_KEYSTONE_VERIFY_SSL` | Vérifie le certificat TLS de Keystone. | `true` |
| `RUSTFS_KEYSTONE_CACHE_SIZE` | Définit le nombre maximal d’entrées du cache de jetons. | `10000` |
| `RUSTFS_KEYSTONE_CACHE_TTL` | Définit la durée de vie du cache de jetons en secondes. | `300` |
| `RUSTFS_KEYSTONE_TIMEOUT` | Définit le délai d’expiration des requêtes Keystone en secondes. | `30` |

Nous recommandons de conserver la vérification TLS. Lorsque Keystone rejette un jeton fourni, RustFS renvoie `401 Unauthorized` et n’utilise pas les informations d’identification locales pour cette requête.

## Vérifier l’API

Obtenez auprès de Keystone un jeton limité à un projet et l’ID de ce projet, puis définissez les variables shell suivantes :

```bash
export SWIFT_TOKEN='<your-keystone-token>'
export SWIFT_ACCOUNT='AUTH_<your-project-id>'
export SWIFT_URL="http://localhost:9000/v1/${SWIFT_ACCOUNT}"
```

Répertoriez les conteneurs visibles par le projet :

```bash
curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}"
```

Créez `my-bucket`, chargez `hello.txt`, puis téléchargez l’objet :

```bash
curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket"

curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	--upload-file /path/to/hello.txt \
	"${SWIFT_URL}/my-bucket/hello.txt"

curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket/hello.txt"
```

Une requête vers un compte `AUTH_<project-id>` qui ne correspond pas au projet du jeton reçoit `403 Forbidden`.

## Étapes suivantes

- [Consulter la matrice de compatibilité S3](/fr/reference/s3-compatibility)
- [Gérer les informations d’identification RustFS](/fr/operations/credentials)
- [Configurer TLS pour RustFS](/fr/integration/tls-configured)
