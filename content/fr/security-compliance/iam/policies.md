---
title: "Utilisateurs, groupes et politiques"
description: "Cette page décrit l’administration des utilisateurs et des groupes IAM RustFS, le format JSON des documents de politique, les opérateurs de condition et les politiques intégrées."
---

Cette page couvre l’administration IAM au quotidien : création d’utilisateurs et de groupes, association de politiques et rédaction de documents de politique personnalisés.

## Prérequis

- Installez [`rc`](/fr/operations/rc) avant d’utiliser les commandes d’administration RustFS.
- Configurez un alias avec des identifiants autorisés à effectuer les actions `admin:*` correspondantes.

## Gérer les utilisateurs

Les utilisateurs se gèrent depuis la Console (section **Identity** de la navigation de gauche), avec `rc admin` ou via l’API REST d’administration. Les points de terminaison d’administration natifs se trouvent sous le préfixe `/rustfs/admin/v3`. Les requêtes doivent être signées (AWS Signature V4) par un identifiant dont les politiques autorisent l’action `admin:*` correspondante.

| Opération | Méthode et chemin | Remarques |
| --- | --- | --- |
| Créer ou mettre à jour un utilisateur | `PUT /rustfs/admin/v3/add-user?accessKey=<name>` | Corps JSON : `{"secretKey": "...", "status": "enabled"}` ; `policy` est facultatif. Exige `admin:CreateUser`. |
| Lister les utilisateurs | `GET /rustfs/admin/v3/list-users` | Exige `admin:ListUsers`. |
| Détail d’un utilisateur | `GET /rustfs/admin/v3/user-info?accessKey=<name>` | Exige `admin:GetUser`. |
| Activer ou désactiver un utilisateur | `PUT /rustfs/admin/v3/set-user-status?accessKey=<name>&status=<enabled\|disabled>` | Vous ne pouvez pas modifier l’état de l’identifiant qui effectue l’appel. |
| Supprimer un utilisateur | `DELETE /rustfs/admin/v3/remove-user?accessKey=<name>` | Exige `admin:DeleteUser`. |
| Exporter les données IAM | `GET /rustfs/admin/v3/export-iam` | Exporte les utilisateurs, les groupes, les politiques et les associations. |
| Importer les données IAM | `PUT /rustfs/admin/v3/import-iam` | Restaure un jeu de données exporté. |

:::note

Un nom d’utilisateur (clé d’accès) ne doit pas contenir d’espace et ne peut pas être identique à la clé d’accès racine. La clé secrète est obligatoire lors de la création d’un utilisateur.

:::

## Gérer les groupes

Les groupes rassemblent des utilisateurs afin qu’une seule association de politique couvre tous les membres. L’appartenance et l’état d’un groupe se gèrent avec ces points de terminaison (la Console propose les équivalents sous **Identity**) :

| Opération | Méthode et chemin | Remarques |
| --- | --- | --- |
| Lister les groupes | `GET /rustfs/admin/v3/groups` | Exige `admin:ListGroups`. |
| Détail d’un groupe | `GET /rustfs/admin/v3/group?group=<name>` | Exige `admin:GetGroup`. |
| Ajouter ou retirer des membres | `PUT /rustfs/admin/v3/update-group-members` | Corps JSON ci-dessous. L’ajout de membres à un groupe inexistant crée ce groupe. Exige `admin:AddUserToGroup` / `admin:RemoveUserFromGroup`. |
| Activer ou désactiver un groupe | `PUT /rustfs/admin/v3/set-group-status?group=<name>&status=<enabled\|disabled>` | Exige `admin:EnableGroup` / `admin:DisableGroup`. |
| Supprimer un groupe | `DELETE /rustfs/admin/v3/group/{group}` | Échoue tant que le groupe contient encore des membres. |

Corps de mise à jour de l’appartenance :

```json
{
  "group": "developers",
  "members": ["alice", "bob"],
  "isRemove": false
}
```

Réglez `isRemove` sur `true` pour retirer les membres indiqués au lieu de les ajouter. Les utilisateurs temporaires (STS) et l’identifiant racine ne peuvent pas être ajoutés à un groupe.

## Associer des politiques

Une association relie une politique nommée à un utilisateur ou à un groupe :

| Opération | Méthode et chemin | Remarques |
| --- | --- | --- |
| Définir la politique d’un utilisateur ou d’un groupe | `PUT /rustfs/admin/v3/set-user-or-group-policy?policyName=<policy>&userOrGroup=<name>&isGroup=<true\|false>` | Remplace l’association. Également exposé sur `/rustfs/admin/v3/set-policy`. Exige `admin:AttachUserOrGroupPolicy`. |
| Associer des politiques | `POST /rustfs/admin/v3/idp/builtin/policy/attach` | Corps JSON : `{"policies": ["readonly"], "user": "alice"}` (ou `"group"`). S’ajoute à l’association existante. |
| Dissocier des politiques | `POST /rustfs/admin/v3/idp/builtin/policy/detach` | Même forme de corps ; retire des politiques de l’association. |
| Lister les associations de politiques | `GET /rustfs/admin/v3/idp/builtin/policy-entities` | Indique quels utilisateurs et groupes possèdent quelles politiques. |

## Gérer les documents de politique

| Opération | Méthode et chemin | Remarques |
| --- | --- | --- |
| Lister les politiques | `GET /rustfs/admin/v3/list-canned-policies` | Le détail exige le périmètre `admin:GetPolicy`. |
| Détail d’une politique | `GET /rustfs/admin/v3/info-canned-policy?name=<policy>` | Renvoie le document JSON. |
| Créer ou remplacer une politique | `PUT /rustfs/admin/v3/add-canned-policy?name=<policy>` | Le corps de la requête est le document JSON de la politique. Exige `admin:CreatePolicy`. |
| Supprimer une politique | `DELETE /rustfs/admin/v3/remove-canned-policy?name=<policy>` | Exige `admin:DeletePolicy`. |

## Format du document de politique

Un document de politique est un objet JSON comportant les champs `Version` et `Statement`. La seule valeur acceptée pour `Version` est `2012-10-17`.

Chaque instruction prend en charge :

| Champ | Obligatoire | Description |
| --- | --- | --- |
| `Sid` | Non | Identifiant de l’instruction. |
| `Effect` | Oui | `Allow` ou `Deny`. |
| `Action` | Oui (ou `NotAction`) | Noms d’actions ; les caractères génériques sont autorisés (par exemple `s3:Get*`). |
| `NotAction` | Non | Correspond à toutes les actions sauf celles de la liste. |
| `Resource` | Oui pour les actions S3 (ou `NotResource`) | ARN de la forme `arn:aws:s3:::bucket` ou `arn:aws:s3:::bucket/prefix/*`. |
| `NotResource` | Non | Correspond à toutes les ressources sauf celles de la liste. |
| `Condition` | Non | Opérateurs de condition indexés par des clés de contexte. |

Les noms d’actions portent un préfixe d’espace de noms : `s3:*` pour les opérations sur les objets et les compartiments (par exemple `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:GetBucketLocation`, `s3:ListAllMyBuckets`), `admin:*` pour les opérations de gestion, `sts:AssumeRole` pour STS et `kms:*` pour la gestion des clés.

Les opérateurs de condition pris en charge sont : `StringEquals`, `StringNotEquals`, `StringEqualsIgnoreCase`, `StringNotEqualsIgnoreCase`, `StringLike`, `StringNotLike`, `ArnEquals`, `ArnNotEquals`, `ArnLike`, `ArnNotLike`, `BinaryEquals`, `IpAddress`, `NotIpAddress`, `Null`, `Bool`, `NumericEquals`, `NumericNotEquals`, `NumericLessThan`, `NumericLessThanEquals`, `NumericGreaterThan`, `NumericGreaterThanEquals`, `DateEquals`, `DateNotEquals`, `DateLessThan`, `DateLessThanEquals`, `DateGreaterThan` et `DateGreaterThanEquals`. Tout opérateur peut recevoir le suffixe `IfExists` (la condition est satisfaite lorsque la clé de contexte référencée est absente).

### Exemple : accès en lecture seule à un compartiment

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::reports"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::reports/*"]
    }
  ]
}
```

### Exemple : lecture et écriture limitées à un préfixe

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::app-data"],
      "Condition": {
        "StringLike": {
          "s3:prefix": ["tenant-42/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::app-data/tenant-42/*"]
    }
  ]
}
```

### Exemple : accès complet, suppression refusée

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    },
    {
      "Effect": "Deny",
      "Action": ["s3:DeleteObject", "s3:DeleteObjectVersion", "s3:DeleteBucket"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    }
  ]
}
```

:::note

Un `Deny` explicite l’emporte toujours sur `Allow` : la seconde instruction s’applique donc aux opérations de suppression, même si `s3:*` les inclut. Voir la [sémantique d’évaluation](./index.md#sémantique-dévaluation-des-politiques).

:::

## Politiques intégrées

RustFS définit cinq politiques intégrées, associables sans les créer au préalable :

| Politique | Autorisations |
| --- | --- |
| `readwrite` | Toutes les actions S3 (`s3:*`) sur toutes les ressources, plus `sts:AssumeRole`. |
| `readonly` | `s3:GetBucketLocation`, `s3:GetObject` et `s3:GetBucketQuota` sur toutes les ressources, plus `sts:AssumeRole`. |
| `writeonly` | `s3:PutObject` sur toutes les ressources, plus `sts:AssumeRole`. |
| `diagnostics` | Actions d’administration de diagnostic (`admin:Profiling`, `admin:ServerTrace`, `admin:ConsoleLog`, `admin:ServerInfo`, `admin:TopLocksInfo`, `admin:OBDInfo`, `admin:Prometheus`, `admin:BandwidthMonitor`), plus `sts:AssumeRole`. |
| `consoleAdmin` | Toutes les actions d’administration (`admin:*`), toutes les actions KMS (`kms:*`), toutes les actions S3 (`s3:*`), plus `sts:AssumeRole`. |

:::warning

La politique intégrée `readonly` ne comprend ni `s3:ListBucket` ni `s3:ListAllMyBuckets`. L’autorisation `s3:GetBucketLocation` vous permet de voir les noms des compartiments dans RustFS, et `s3:GetObject` vous permet de récupérer des objets dont vous connaissez la clé. Pour lister les objets d’un compartiment, ajoutez une politique personnalisée accordant `s3:ListBucket` sur ce compartiment.

:::
