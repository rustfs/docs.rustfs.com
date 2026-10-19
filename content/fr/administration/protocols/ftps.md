---
title: "FTP(S)"
description: "Configurez la passerelle FTP ou FTPS de RustFS et gérez les compartiments et les objets avec des clients FTP."
---

RustFS inclut une passerelle FTP qui expose les compartiments (buckets) et les objets aux clients FTP standard. Vous pouvez l’exécuter en FTP non chiffré pour des tests locaux isolés, ou en FTP explicite sur TLS (FTPS) pour des connexions chiffrées. RustFS authentifie chaque session auprès de la gestion des identités et des accès (IAM) et applique les politiques S3 de l’utilisateur aux opérations de stockage.

La prise en charge de FTP et de FTPS est compilée dans le binaire RustFS standard, mais les deux écouteurs sont désactivés par défaut à l’exécution. N’activez que l’écouteur que vous comptez utiliser.

## Vue d’ensemble

La passerelle associe les chemins FTP aux ressources RustFS :

| Chemin FTP | Ressource RustFS |
| --- | --- |
| `/` | Tous les compartiments visibles par l’utilisateur authentifié |
| `/my-bucket/` | Le compartiment `my-bucket` |
| `/my-bucket/hello.txt` | L’objet `hello.txt` dans `my-bucket` |

Les opérations FTP suivantes sont prises en charge :

| Commande FTP | Opération |
| --- | --- |
| `LIST` | Répertorier les compartiments à la racine, ou les objets et les préfixes dans un compartiment |
| `MKD` | Créer un compartiment |
| `CWD` | Entrer dans un compartiment |
| `STOR` | Charger un objet |
| `RETR` | Télécharger un objet |
| `DELE` | Supprimer un objet |
| `RMD` | Supprimer récursivement un compartiment et ses objets |

RustFS ne prend actuellement en charge ni le renommage FTP ni les chargements qui ajoutent du contenu à un objet existant. Comme le stockage S3 n’a pas de répertoire de travail natif ni de modèle de répertoires POSIX, certaines opérations de système de fichiers propres à un client peuvent ne pas se comporter comme sur un serveur FTP classique.

Saisissez une clé d’accès RustFS comme nom d’utilisateur FTP et la clé secrète correspondante comme mot de passe. Un nom d’utilisateur non valide et un mot de passe non valide renvoient tous deux `530 Not logged in`. Après la connexion, RustFS vérifie les autorisations S3 de l’utilisateur IAM pour chaque opération.

:::danger[Le FTP en clair expose les identifiants]

Le FTP envoie les identifiants et les données sans chiffrement. Liez le FTP en clair uniquement à une interface de bouclage ou à un réseau de test isolé. Utilisez FTPS pour toute connexion distante ou de production.

:::

:::warning[La suppression d’un compartiment est récursive]

L’implémentation actuelle de `RMD` supprime les objets du compartiment cible avant de supprimer le compartiment. Confirmez le chemin avant d’exécuter `rmdir` dans un client FTP.

:::

## Configuration

FTP et FTPS utilisent des écouteurs et des variables d’environnement distincts.

### Variables FTP

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `RUSTFS_FTP_ENABLE` | Active l’écouteur FTP non chiffré. | `false` |
| `RUSTFS_FTP_ADDRESS` | Adresse d’écoute des connexions de contrôle FTP. | `0.0.0.0:8021` |
| `RUSTFS_FTP_PASSIVE_PORTS` | Plage inclusive de ports de données en mode passif, au format `start-end`. | `40000-50000` |
| `RUSTFS_FTP_EXTERNAL_IP` | Adresse IP publique ou nom d’hôte annoncé aux clients passifs lorsque RustFS se trouve derrière un NAT. | Non définie |

### Variables FTPS

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `RUSTFS_FTPS_ENABLE` | Active l’écouteur FTPS explicite. | `false` |
| `RUSTFS_FTPS_ADDRESS` | Adresse d’écoute des connexions de contrôle FTPS. | `0.0.0.0:8022` |
| `RUSTFS_FTPS_TLS_ENABLED` | Active TLS sur l’écouteur FTPS. Laissez cette option activée pour FTPS. | `true` |
| `RUSTFS_FTPS_CERTS_DIR` | Répertoire contenant le certificat FTPS et la clé privée. Obligatoire pour FTPS. | Non définie |
| `RUSTFS_FTPS_PASSIVE_PORTS` | Plage inclusive de ports de données en mode passif, au format `start-end`. | `40000-50000` |
| `RUSTFS_FTPS_EXTERNAL_IP` | Adresse IP publique ou nom d’hôte annoncé aux clients passifs lorsque RustFS se trouve derrière un NAT. | Non définie |

La compilation RustFS standard active la fonctionnalité de compilation `ftps`, qui fournit à la fois FTP et FTPS. Si vous compilez RustFS avec `--no-default-features`, incluez la fonctionnalité explicitement :

```bash
cargo build --release --features ftps
```

### Tests locaux avec FTP

Démarrez un écouteur FTP non chiffré sur l’interface de bouclage :

```bash
export RUSTFS_FTP_ENABLE=true
export RUSTFS_FTP_ADDRESS=127.0.0.1:8021
export RUSTFS_FTP_PASSIVE_PORTS=40000-40010
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

La liaison à `127.0.0.1` empêche les hôtes distants de se connecter à l’écouteur non chiffré.

### Préparer un certificat de test

FTPS attend `rustfs_cert.pem` et `rustfs_key.pem` dans le répertoire de certificats. Pour un test local, créez un certificat autosigné de courte durée :

```bash
mkdir -p /path/to/ftps-certs

openssl req -x509 -newkey rsa:2048 -nodes \
	-keyout /path/to/ftps-certs/rustfs_key.pem \
	-out /path/to/ftps-certs/rustfs_cert.pem \
	-days 7 \
	-subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

En production, utilisez un certificat émis par une autorité de certification de confiance. Protégez `rustfs_key.pem` contre tout accès non autorisé et assurez-vous que les noms alternatifs du sujet du certificat correspondent à l’hôte utilisé par les clients.

### Démarrer FTPS

Configurez un écouteur FTPS explicite :

```bash
export RUSTFS_FTPS_ENABLE=true
export RUSTFS_FTPS_ADDRESS=0.0.0.0:8022
export RUSTFS_FTPS_TLS_ENABLED=true
export RUSTFS_FTPS_CERTS_DIR=/path/to/ftps-certs
export RUSTFS_FTPS_PASSIVE_PORTS=40000-50000

rustfs /path/to/data
```

RustFS exige TLS à la fois sur le canal de contrôle et sur le canal de données FTPS. Configurez les clients pour **explicit FTP over TLS**, parfois libellé **FTPES** ou **Require explicit FTP over TLS**. Le FTPS implicite n’est pas le mode implémenté par cet écouteur.

Si le répertoire de certificats est absent, n’existe pas ou ne contient pas un certificat et une clé utilisables, l’initialisation de FTPS échoue. Consultez [Configurer TLS](/fr/integration/tls-configured) pour des indications générales sur les certificats.

### Configurer les connexions passives

FTP utilise le port de contrôle pour les commandes et une connexion de données distincte pour les listes et les transferts de fichiers. Pour le mode passif :

1. Autorisez le trafic TCP entrant vers le port de contrôle configuré.
2. Autorisez le trafic TCP entrant vers chaque port de la plage passive configurée.
3. Définissez `RUSTFS_FTP_EXTERNAL_IP` ou `RUSTFS_FTPS_EXTERNAL_IP` lorsque les clients se connectent à travers un NAT ou un répartiteur de charge.

Par exemple, un serveur FTPS derrière un NAT peut annoncer son nom d’hôte public :

```bash
export RUSTFS_FTPS_EXTERNAL_IP=storage.example.com
export RUSTFS_FTPS_PASSIVE_PORTS=40000-40100
```

Utilisez les variables préfixées par FTP correspondantes pour l’écouteur FTP en clair. RustFS prend en charge les modes de transfert actif et passif, mais le mode passif est en général plus simple à exploiter à travers les pare-feu des clients.

## Utilisation

Les exemples utilisent [`lftp`](https://lftp.yar.ru/) ainsi que les noms canoniques `my-bucket` et `hello.txt`. L’utilisateur IAM doit disposer des autorisations S3 requises pour chaque opération.

### Se connecter en FTP

Utilisez le FTP en clair uniquement avec l’écouteur de test en bouclage :

```bash
lftp -u <your-access-key> ftp://127.0.0.1:8021
```

Saisissez la clé secrète lorsque `lftp` demande un mot de passe.

### Se connecter en FTPS

Connectez-vous à l’écouteur FTPS explicite et exigez le chiffrement des connexions de contrôle et de données :

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	open ftp://storage.example.com:8022
'
```

Saisissez la clé secrète lorsque vous y êtes invité. Laissez la vérification des certificats activée en production.

Pour le seul certificat de test local autosigné, connectez-vous à `localhost` et désactivez la vérification des certificats pour cette session :

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	set ssl:verify-certificate no;
	open ftp://localhost:8022
'
```

:::warning

Ne désactivez pas la vérification des certificats en production. Installez plutôt l’autorité de certification émettrice dans le magasin de confiance du client.

:::

### Répertorier les compartiments et créer un compartiment

À l’invite `lftp`, répertoriez les compartiments visibles et créez `my-bucket` :

```text
lftp> cls -1 /
lftp> mkdir my-bucket
lftp> cd my-bucket
```

Les noms de compartiment doivent suivre les mêmes règles de nommage que les compartiments créés via l’API S3.

### Charger et télécharger un objet

Chargez `/path/to/hello.txt`, répertoriez le compartiment, puis téléchargez l’objet :

```text
lftp> put /path/to/hello.txt -o hello.txt
lftp> ls
lftp> get hello.txt -o hello.txt
```

Le chargement remplace un objet de même clé. L’ajout de contenu à un objet existant n’est pas pris en charge.

### Supprimer un objet et un compartiment

Supprimez l’objet, revenez à la racine, puis supprimez le compartiment :

```text
lftp> rm hello.txt
lftp> cd /
lftp> rmdir my-bucket
```

N’oubliez pas que `rmdir` retire récursivement les objets restants du compartiment avant de le supprimer.

### Connecter d’autres clients

Utilisez ces paramètres dans les clients FTP graphiques tels que FileZilla ou Cyberduck :

| Paramètre | Écouteur de test FTP | Écouteur FTPS |
| --- | --- | --- |
| Protocole | FTP | FTP sur TLS (explicite) |
| Hôte | `127.0.0.1` | Votre nom d’hôte FTPS |
| Port | `8021` | `8022` |
| Nom d’utilisateur | Clé d’accès RustFS | Clé d’accès RustFS |
| Mot de passe | Clé secrète RustFS | Clé secrète RustFS |
| Mode de transfert | Passif | Passif |

Si la connexion réussit, mais que le listage des répertoires ou les transferts expirent, vérifiez d’abord les règles de pare-feu des ports passifs et le paramètre d’adresse IP externe.

## Étapes suivantes

- [Gérer les identifiants](/fr/operations/credentials)
- [Configurer TLS](/fr/integration/tls-configured)
- [Vérifier l’état du service](/fr/operations/status-check)
