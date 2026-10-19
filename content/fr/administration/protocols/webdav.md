---
title: "WebDAV"
description: "Configurez la passerelle WebDAV de RustFS et accédez aux compartiments et aux objets avec des clients WebDAV."
---

RustFS inclut une passerelle Web Distributed Authoring and Versioning (WebDAV) qui expose les compartiments (buckets) et les objets aux clients WebDAV sur HTTP ou HTTPS. Vous pouvez parcourir les compartiments, créer des collections, puis charger, télécharger, renommer ou supprimer des objets, tandis que RustFS applique les autorisations de l’utilisateur authentifié de la gestion des identités et des accès (IAM).

La prise en charge de WebDAV est compilée dans le binaire RustFS standard, mais la passerelle est désactivée par défaut à l’exécution. Vous devez l’activer et la configurer avant de connecter un client.

## Vue d’ensemble

La passerelle associe les chemins WebDAV aux ressources RustFS :

| Chemin WebDAV | Ressource RustFS |
| --- | --- |
| `/` | Tous les compartiments visibles par l’utilisateur authentifié |
| `/my-bucket/` | Le compartiment `my-bucket` |
| `/my-bucket/hello.txt` | L’objet `hello.txt` dans `my-bucket` |
| `/my-bucket/docs/hello.txt` | L’objet `docs/hello.txt` dans `my-bucket` |

RustFS prend en charge les opérations suivantes via la passerelle :

| Méthode | Opération |
| --- | --- |
| `PROPFIND` | Répertorier les compartiments ou les objets, et lire les métadonnées |
| `MKCOL` | Créer un compartiment ou un préfixe de répertoire |
| `PUT` | Charger un objet |
| `GET` | Télécharger un objet |
| `HEAD` | Lire les métadonnées d’un objet |
| `MOVE` | Renommer ou déplacer un objet ou un répertoire |
| `DELETE` | Supprimer un objet, un répertoire ou un compartiment |

Utilisez `PROPFIND`, et non `GET`, pour répertorier une collection. La passerelle actuelle renvoie `405 Method Not Allowed` pour les requêtes `GET` vers des répertoires.

WebDAV utilise l’authentification HTTP Basic. Saisissez une clé d’accès RustFS comme nom d’utilisateur et la clé secrète correspondante comme mot de passe. La passerelle authentifie les identifiants auprès de l’IAM RustFS et applique les politiques S3 de l’utilisateur à chaque opération.

:::warning[Protégez les identifiants]

L’authentification Basic ne chiffre pas les identifiants. Ne désactivez TLS que pour des tests locaux isolés. Utilisez HTTPS pour toute connexion distante ou de production.

:::

## Configuration

Configurez la passerelle avec des variables d’environnement avant de démarrer RustFS :

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `RUSTFS_WEBDAV_ENABLE` | Active la passerelle WebDAV. | `false` |
| `RUSTFS_WEBDAV_ADDRESS` | Adresse d’écoute des connexions WebDAV. | `0.0.0.0:8080` |
| `RUSTFS_WEBDAV_TLS_ENABLED` | Active TLS pour l’écouteur WebDAV. | `true` |
| `RUSTFS_WEBDAV_CERTS_DIR` | Répertoire de certificats utilisé par le moteur TLS de RustFS. Obligatoire lorsque TLS est activé. | Non définie |
| `RUSTFS_WEBDAV_MAX_BODY_SIZE` | Taille maximale du corps de requête, en octets. Doit être supérieure à zéro. | `5368709120` (5 GiB) |

La compilation RustFS standard active la fonctionnalité de compilation WebDAV. Si vous compilez RustFS avec `--no-default-features`, incluez la fonctionnalité explicitement :

```bash
cargo build --release --features webdav
```

### Tests locaux sans TLS

L’exemple suivant démarre RustFS avec un écouteur WebDAV en HTTP sur le port `8080` :

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=127.0.0.1:8080
export RUSTFS_WEBDAV_TLS_ENABLED=false
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

La liaison à `127.0.0.1` empêche les autres hôtes de se connecter au point de terminaison de test non chiffré.

### HTTPS

Pour une connexion distante ou de production, activez TLS et indiquez un répertoire de certificats :

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=0.0.0.0:8080
export RUSTFS_WEBDAV_TLS_ENABLED=true
export RUSTFS_WEBDAV_CERTS_DIR=/path/to/certs

rustfs /path/to/data
```

Si TLS est activé sans `RUSTFS_WEBDAV_CERTS_DIR`, ou si le répertoire n’existe pas, l’initialisation de WebDAV échoue. Consultez [Configurer TLS](/fr/integration/tls-configured) pour préparer les certificats.

Autorisez le trafic TCP entrant vers le port WebDAV configuré. Cet écouteur est distinct de ceux de l’API S3 et de la Console.

## Utilisation

Les commandes suivantes utilisent un point de terminaison HTTP pour les tests locaux. Remplacez le point de terminaison et les identifiants par votre point de terminaison WebDAV HTTPS et par un utilisateur IAM disposant des autorisations requises sur les compartiments et les objets.

Définissez des variables shell réutilisables sans placer le secret directement dans chaque commande :

```bash
export WEBDAV_URL=http://127.0.0.1:8080
export WEBDAV_USER=<your-access-key>
read -s WEBDAV_PASSWORD
export WEBDAV_PASSWORD
```

### Répertorier les compartiments

Envoyez `PROPFIND` avec `Depth: 1` pour répertorier les compartiments visibles par l’utilisateur :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/"
```

### Créer un compartiment

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/"
```

Les noms de compartiment doivent suivre les mêmes règles de nommage que les compartiments créés via l’API S3.

### Charger et télécharger un objet

Chargez `/path/to/hello.txt` :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--upload-file /path/to/hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

Téléchargez l’objet :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--output hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

### Créer et répertorier un répertoire

Les répertoires WebDAV situés sous un compartiment correspondent à des préfixes de clé d’objet :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/docs/"

curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/my-bucket/docs/"
```

### Renommer un objet

Utilisez `MOVE` avec un chemin de destination sur le même point de terminaison WebDAV :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MOVE \
	--header "Destination: $WEBDAV_URL/my-bucket/greeting.txt" \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

L’utilisateur IAM doit être autorisé à lire et à supprimer la source, ainsi qu’à écrire la destination. Si l’autorisation échoue, RustFS laisse la source inchangée.

### Supprimer un objet ou un compartiment

Supprimez un objet :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/greeting.txt"
```

Supprimez le compartiment après en avoir retiré le contenu :

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/"
```

### Connecter un client de bureau

Utilisez le point de terminaison WebDAV dans un client qui prend en charge l’authentification Basic :

| Client | Adresse de connexion |
| --- | --- |
| GNOME Files | `dav://<host>:8080/` pour HTTP ou `davs://<host>:8080/` pour HTTPS |
| macOS Finder | `http://<host>:8080/` ou `https://<host>:8080/` |
| Windows File Explorer | `https://<host>:8080/` |

Saisissez la clé d’accès et la clé secrète RustFS lorsque le client demande les identifiants. Le comportement du client et les méthodes WebDAV prises en charge varient ; utilisez `curl` pour isoler les erreurs côté serveur lors du dépannage.

## Étapes suivantes

- [Gérer les identifiants](/fr/operations/credentials)
- [Configurer TLS](/fr/integration/tls-configured)
- [Vérifier l’état du service](/fr/operations/status-check)
