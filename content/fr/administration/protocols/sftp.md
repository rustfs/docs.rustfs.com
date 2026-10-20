---
title: "SFTP"
description: "Compilez, configurez et utilisez la passerelle SFTP de RustFS pour accéder aux compartiments et aux objets avec des clients SFTP."
---

RustFS inclut une passerelle SSH File Transfer Protocol (SFTP) qui expose les compartiments (buckets) et les objets aux clients SFTP sur une connexion SSH chiffrée. Vous pouvez répertorier et créer des compartiments, puis charger, télécharger, renommer ou supprimer des objets, tandis que RustFS applique les autorisations de l’utilisateur authentifié de la gestion des identités et des accès (IAM).

SFTP est une fonctionnalité de compilation facultative et n’est pas incluse dans la compilation RustFS par défaut. Compilez RustFS avec la fonctionnalité `sftp` ou `full` avant d’activer l’écouteur. L’écouteur est désactivé par défaut à l’exécution.

## Vue d’ensemble

La passerelle associe les chemins SFTP aux ressources RustFS :

| Chemin SFTP | Ressource RustFS |
| --- | --- |
| `/` | Tous les compartiments visibles par l’utilisateur authentifié |
| `/my-bucket/` | Le compartiment `my-bucket` |
| `/my-bucket/hello.txt` | L’objet `hello.txt` dans `my-bucket` |
| `/my-bucket/docs/hello.txt` | L’objet `docs/hello.txt` dans `my-bucket` |

La création ou la suppression d’un répertoire directement sous `/` crée ou supprime un compartiment. Les répertoires situés sous un compartiment correspondent à des préfixes de clé d’objet et n’existent pas comme répertoires de système de fichiers indépendants.

RustFS prend en charge les opérations suivantes via la passerelle SFTP :

| Opération SFTP | Opération RustFS |
| --- | --- |
| Lister `/` | Répertorier les compartiments visibles |
| Lister un compartiment ou un préfixe | Répertorier les objets et les préfixes |
| `mkdir` à `/` | Créer un compartiment |
| `put` | Charger un objet |
| `get` | Télécharger un objet |
| `rename` | Copier un objet, puis supprimer la source |
| `rm` | Supprimer un objet |
| `rmdir` à `/` | Supprimer un compartiment vide |

Saisissez une clé d’accès RustFS comme nom d’utilisateur SFTP et la clé secrète correspondante comme mot de passe. RustFS vérifie les politiques S3 de l’utilisateur IAM pour chaque opération.

:::warning[Authentification par mot de passe uniquement]

La passerelle SFTP ne prend en charge ni l’authentification du client par clé publique ni l’accès anonyme. Les clés d’hôte SSH identifient le serveur ; elles n’authentifient pas les clients. Ne configurez pas de fichier `authorized_keys` pour le SFTP de RustFS.

:::

## Configuration

### Compiler avec la prise en charge de SFTP

Compilez RustFS avec la fonctionnalité SFTP :

```bash
cargo build --release --features sftp
```

Pour activer toutes les fonctionnalités facultatives de RustFS, y compris SFTP, utilisez plutôt `--features full`. Définir `RUSTFS_SFTP_ENABLE=true` n’a aucun effet dans un binaire compilé sans la fonctionnalité `sftp`.

### Variables SFTP

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `RUSTFS_SFTP_ENABLE` | Active l’écouteur SFTP. | `false` |
| `RUSTFS_SFTP_ADDRESS` | Adresse d’écoute des connexions SFTP. | `0.0.0.0:2222` |
| `RUSTFS_SFTP_HOST_KEY_DIR` | Répertoire contenant au moins une clé d’hôte privée SSH non chiffrée. Obligatoire lorsque SFTP est activé. | Non définie |
| `RUSTFS_SFTP_READ_ONLY` | Rejette les opérations qui modifient les compartiments ou les objets. | `false` |
| `RUSTFS_SFTP_IDLE_TIMEOUT` | Délai d’inactivité SSH, en secondes. Doit être supérieur à zéro. | `600` |
| `RUSTFS_SFTP_PART_SIZE` | Taille des parties du chargement partitionné, en octets. | `16777216` (16 MiB) |

Le port par défaut `2222` évite le port SSH privilégié `22`. L’adresse peut utiliser la syntaxe IPv4 ou IPv6, par exemple `127.0.0.1:2222` ou `[::]:2222`.

### Préparer une clé d’hôte

Créez un répertoire persistant pour les clés d’hôte et générez une clé d’hôte Ed25519 :

```bash
mkdir -p /path/to/sftp-keys
ssh-keygen -t ed25519 \
	-f /path/to/sftp-keys/ssh_host_ed25519_key \
	-N ""
chmod 600 /path/to/sftp-keys/ssh_host_ed25519_key*
```

La clé d’hôte ne doit pas avoir de phrase secrète. RustFS accepte aussi les clés d’hôte privées ECDSA et RSA décodables.

Sous Unix, chaque fichier ordinaire du répertoire de clés d’hôte ne doit être accessible que par son propriétaire. La commande `ssh-keygen` crée aussi un fichier `.pub` ; conservez-le avec des droits limités au propriétaire, comme indiqué, ou retirez-le, car RustFS ne le lit pas. RustFS refuse de démarrer si le répertoire est absent, s’il ne contient aucune clé privée utilisable, ou s’il contient un fichier ordinaire dont des bits de permission de groupe ou des autres sont positionnés.

:::warning[Protégez la clé d’hôte]

Conservez la même clé d’hôte d’un redémarrage à l’autre, afin que les clients puissent vérifier l’identité du serveur. Limitez l’accès au compte qui exécute RustFS et sauvegardez la clé de façon sûre. Une clé d’hôte modifiée amène les clients à afficher un avertissement de possible attaque de l’homme du milieu (man-in-the-middle).

:::

### Démarrer l’écouteur SFTP

L’exemple suivant démarre SFTP sur l’interface de bouclage pour un test local :

```bash
export RUSTFS_SFTP_ENABLE=true
export RUSTFS_SFTP_ADDRESS=127.0.0.1:2222
export RUSTFS_SFTP_HOST_KEY_DIR=/path/to/sftp-keys
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Pour les connexions distantes, liez l’écouteur à une interface réseau appropriée et autorisez le trafic TCP entrant vers le port SFTP configuré. Cet écouteur est distinct de ceux de l’API S3 et de la Console.

## Utilisation

Les exemples suivants utilisent le client `sftp` d’OpenSSH, les noms canoniques `my-bucket` et `hello.txt`, ainsi qu’un écouteur local sur le port `2222`.

### Connexion

```bash
sftp -P 2222 <your-access-key>@127.0.0.1
```

Saisissez la clé secrète RustFS lorsque le mot de passe est demandé. Lors de la première connexion, vérifiez l’empreinte de clé d’hôte affichée avant de l’accepter.

### Répertorier et créer des compartiments

À l’invite `sftp`, répertoriez les compartiments visibles par l’utilisateur IAM et créez `my-bucket` :

```text
sftp> ls /
sftp> mkdir /my-bucket
sftp> cd /my-bucket
```

Les noms de compartiment doivent suivre les mêmes règles de nommage que les compartiments créés via l’API S3. Aucun fichier ne peut être créé directement sous `/`.

### Charger et télécharger un objet

Chargez `/path/to/hello.txt`, répertoriez le compartiment, puis téléchargez l’objet :

```text
sftp> put /path/to/hello.txt /my-bucket/hello.txt
sftp> ls /my-bucket
sftp> get /my-bucket/hello.txt hello.txt
```

Les chargements doivent être séquentiels, depuis le début du fichier. La reprise, l’ajout, la modification sur place et les chargements segmentés sur plusieurs connexions d’un même objet ne sont pas pris en charge.

### Renommer un objet

```text
sftp> rename /my-bucket/hello.txt /my-bucket/greeting.txt
```

RustFS implémente le renommage comme une copie côté serveur suivie de la suppression de la source. L’opération n’est pas atomique, et le renommage d’un compartiment n’est pas pris en charge. L’utilisateur IAM doit être autorisé à lire et à supprimer la source, ainsi qu’à écrire la destination.

### Supprimer un objet et un compartiment

Supprimez l’objet, puis retirez le compartiment vide :

```text
sftp> rm /my-bucket/greeting.txt
sftp> rmdir /my-bucket
```

RustFS ne supprime pas récursivement un compartiment non vide via SFTP.

### Connecter un client de bureau

Utilisez ces paramètres dans les clients graphiques tels que FileZilla, Cyberduck ou WinSCP :

| Paramètre | Valeur |
| --- | --- |
| Protocole | SFTP (SSH File Transfer Protocol) |
| Hôte | Votre nom d’hôte SFTP RustFS |
| Port | `2222`, ou le port indiqué dans `RUSTFS_SFTP_ADDRESS` |
| Nom d’utilisateur | Clé d’accès RustFS |
| Mot de passe | Clé secrète RustFS |
| Authentification | Mot de passe |

Configurez le client pour des chargements de fichiers complets sur une seule connexion. Les liens symboliques ainsi que les modifications de propriétaire, de permissions ou d’horodatage POSIX ne sont pas pris en charge, car la passerelle traduit les opérations SFTP en stockage objet.

## Étapes suivantes

- [Gérer les identifiants](/fr/operations/credentials)
- [Vérifier l’état du service](/fr/operations/status-check)
- [Configurer la gestion du cycle de vie](/fr/administration/data/lifecycle-management)
