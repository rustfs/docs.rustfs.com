---
title: "Gestion des identifiants"
description: "Configurez et effectuez la rotation des identifiants racine RustFS, définissez le secret RPC entre nœuds et utilisez les alias d’environnement compatibles avec MinIO."
---

## Identifiants racine

RustFS lit sa paire d’identifiants racine (administration) depuis :

```bash
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Si aucune des deux n’est fournie, le serveur revient à la valeur intégrée par défaut `rustfsadmin` / `rustfsadmin`.

:::warning[Choisissez des identifiants racine sûrs]

[AWS Signature Version 4 (SigV4)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-signing-elements.html) incorpore la clé d’accès dans une portée d’identifiants délimitée par des barres obliques :

`<access-key>/<date>/<region>/<service>/aws4_request`

N’incluez pas `/` dans `RUSTFS_ACCESS_KEY`, car cela fait analyser incorrectement la clé d’accès et la portée d’identifiants. Nous recommandons de n’utiliser que des lettres ASCII majuscules et des chiffres (`A-Z`, `0-9`), conformément au format généré par RustFS. N’utilisez pas une sortie Base64 non modifiée comme clé d’accès ; utilisez une valeur aléatoire forte distincte pour `RUSTFS_SECRET_KEY`.

Les identifiants par défaut `rustfsadmin` sont publics et bien connus. Le point d’entrée du conteneur affiche un avertissement, mais démarre tout de même. Définissez toujours des identifiants autres que ceux par défaut avant d’exposer les ports 9000/9001 au-delà de localhost. De plus, un cluster multi-nœuds qui s’exécute avec une paire entièrement par défaut **doit** définir `RUSTFS_RPC_SECRET` (voir ci-dessous) — le serveur refuse de dériver l’authentification RPC entre nœuds à partir de la clé secrète par défaut.

:::

## Injection par fichier (secrets Docker/Kubernetes)

Au lieu de placer les secrets dans l’environnement, indiquez à RustFS des fichiers qui les contiennent :

```bash
RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
```

Des indicateurs CLI équivalents existent (`--access-key-file`, `--secret-key-file`). Règles appliquées par le point d’entrée du conteneur :

- Seule la **première ligne** du fichier est lue ; les blancs environnants et les caractères CR (fichiers édités en CRLF) sont rognés. Un fichier sans saut de ligne final est valide.
- Définir à la fois la variable directe et la variante `_FILE` pour le même identifiant est une erreur bloquante : `Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.`
- Une valeur vide, un fichier vide ou un fichier illisible est une erreur bloquante (exit 1).
- Un fichier qui contient la valeur par défaut `rustfsadmin` déclenche le même avertissement que la variable directe.

```yaml title="docker-compose example with secrets"
services:
  rustfs:
    image: rustfs/rustfs:latest
    environment:
      - RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
      - RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
    secrets:
      - rustfs_access_key
      - rustfs_secret_key
secrets:
  rustfs_access_key:
    file: ./secrets/access_key.txt
  rustfs_secret_key:
    file: ./secrets/secret_key.txt
```

## Rotation des identifiants racine

Tous les nœuds d’un cluster doivent s’exécuter avec la **même** paire d’identifiants racine — l’authentification RPC entre nœuds en est dérivée, sauf si `RUSTFS_RPC_SECRET` est défini explicitement.

:::note

La procédure pas à pas ci-dessous est une pratique opérationnelle standard, composée de blocs vérifiés (configuration par environnement ou par fichier, plus les signaux vérifiés d’état de préparation du redémarrage progressif) ; RustFS ne documente pas actuellement d’API de rotation en ligne des identifiants racine.

:::

1. Si ce n’est pas déjà fait, définissez un `RUSTFS_RPC_SECRET` explicite (même valeur sur tous les nœuds) **avant** la rotation. Cela découple l’authentification entre nœuds de la paire d’identifiants, si bien que le cluster tolère des nœuds qui exécutent temporairement un mélange d’anciens et de nouveaux identifiants racine pendant le redémarrage progressif.
2. Mettez à jour le fichier d’environnement ou le secret sur **chaque** nœud avec les nouveaux `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (ou les fichiers derrière les variantes `_FILE`).
3. Redémarrez les nœuds **un par un**, en attendant que chacun renvoie `200` depuis `GET /health/ready` sur le port 9000 avant de redémarrer le suivant.
4. Mettez à jour chaque client, configuration de SDK et automatisation qui utilisait l’ancienne paire.
5. Vérifiez : signez une requête avec les anciens identifiants et confirmez qu’elle est rejetée.

## RUSTFS_RPC_SECRET (authentification RPC entre nœuds)

Les nœuds d’un cluster distribué authentifient leur trafic RPC interne avec un secret partagé :

- Si `RUSTFS_RPC_SECRET` est défini, cette valeur est utilisée directement. Définissez la **même valeur sur chaque nœud**.
- S’il n’est pas défini, le secret est **dérivé** (HMAC) de la paire clé d’accès / clé secrète active — c’est pourquoi tous les nœuds doivent partager les mêmes identifiants racine.
- La dérivation **échoue en mode fermé** lorsque la clé secrète est la valeur par défaut `rustfsadmin` : un secret publiquement connu produirait un secret RPC publiquement calculable, que n’importe quel pair réseau pourrait utiliser pour forger des signatures entre nœuds. Dans cette configuration, le RPC entre nœuds ne peut pas s’authentifier tant que vous ne définissez pas `RUSTFS_RPC_SECRET` ou que vous ne configurez pas un `RUSTFS_SECRET_KEY` autre que celui par défaut.

Quand le définir explicitement :

- les clusters multi-nœuds qui s’exécutent (temporairement ou non) avec les identifiants racine par défaut ;
- avant la rotation des identifiants racine, afin de garder l’authentification entre nœuds stable pendant le déploiement ;
- les environnements où vous souhaitez une authentification entre nœuds indépendante du cycle de vie de l’identifiant racine S3.

```bash
# Same value on every node
RUSTFS_RPC_SECRET=<your-rpc-secret>
```

## Alias de compatibilité

Pour une migration sans renommage, RustFS accepte les variables d’identifiants sous les noms historiques et les noms compatibles avec MinIO lorsque les noms canoniques `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` ne sont pas définis :

| Alias accepté | Variable canonique |
| --- | --- |
| `RUSTFS_ROOT_USER` (historique) | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` (historique) | `RUSTFS_SECRET_KEY` |
| `MINIO_ROOT_USER` | `RUSTFS_ROOT_USER` → `RUSTFS_ACCESS_KEY` |
| `MINIO_ROOT_PASSWORD` | `RUSTFS_ROOT_PASSWORD` → `RUSTFS_SECRET_KEY` |

La correspondance du préfixe `MINIO_` couvre une liste d’autorisation plus large de variables (adresse, adresse de la Console, paramètres de webhook d’audit, et d’autres), appliquée au démarrage sous la forme de « correspondances de compatibilité à préfixe externe ».

:::note

Les alias sont dépréciés. Lorsqu’un alias est utilisé, le serveur journalise une fois un avertissement de la forme `Environment variable MINIO_ROOT_USER is deprecated, use RUSTFS_ROOT_USER instead`. Utilisez les noms canoniques préfixés par `RUSTFS_` dans les nouveaux déploiements ; le nom canonique l’emporte toujours lorsque les deux sont définis.

:::

## Au-delà de l’identifiant racine

L’accès quotidien ne devrait pas utiliser la paire racine. Créez des utilisateurs, des groupes, des politiques et des comptes de service au périmètre limité par la Console sur le port 9001 ou par les API d’administration IAM, et réservez l’identifiant racine aux opérations d’administration. Consultez la documentation IAM dans la section administration.
