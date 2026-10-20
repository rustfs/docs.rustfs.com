---
title: "Comptes de service et STS"
description: "Comptes de service RustFS (clés d’accès dérivées) et identifiants temporaires via l’API STS AssumeRole."
---

RustFS propose deux mécanismes pour émettre des identifiants dérivés d’une identité existante : les **comptes de service** (clés d’accès de longue durée appartenant à un utilisateur parent) et les **identifiants temporaires STS** (clés de courte durée accompagnées d’un jeton de session).

## Comptes de service

Un compte de service est une paire clé d’accès/clé secrète qui appartient à un utilisateur IAM parent (ou au compte racine). Il s’authentifie comme une clé ordinaire, mais il est autorisé en tant que son parent :

- **Politique héritée (par défaut).** Si le compte de service est créé sans politique, il hérite de ce que les politiques combinées de l’utilisateur parent autorisent au moment de la requête.
- **Politique liée à la session.** Si un document de politique est fourni à la création, il est intégré au compte de service. Les requêtes doivent alors être autorisées à la fois par les politiques du parent et par la politique intégrée.
- **Expiration.** Un horodatage d’expiration facultatif (RFC 3339) peut être défini ; l’identifiant cesse de fonctionner après cette date.

Les comptes de service ne peuvent pas appeler `AssumeRole`, et une clé d’accès de compte de service ne peut pas être transformée en utilisateur IAM ordinaire.

Dans la Console, les comptes de service se gèrent sur la page **Access Keys** (clés d’accès) — voir [Gestion des clés d’accès](./access-token.md). L’API d’administration expose :

| Opération | Méthode et chemin | Remarques |
| --- | --- | --- |
| Créer un compte de service | `PUT /rustfs/admin/v3/add-service-account` | Corps ci-dessous. Également servi sur `/add-service-accounts`. Exige `admin:CreateServiceAccount` lors de la création pour un autre utilisateur (`targetUser`). |
| Lister les comptes de service | `GET /rustfs/admin/v3/list-service-accounts?user=<name>` | Exige `admin:ListServiceAccounts` pour lister les comptes d’un autre utilisateur. |
| Lister les clés d’accès (en lot) | `GET /rustfs/admin/v3/list-access-keys-bulk` | Permet de filtrer uniquement les utilisateurs, uniquement les comptes de service ou uniquement les clés STS. |
| Détail d’un compte de service | `GET /rustfs/admin/v3/info-service-account?accessKey=<key>` | Renvoie le nom, la description, le parent, l’expiration et la politique de session (ou `impliedPolicy: true` en cas d’héritage). |
| Détail d’un compte temporaire | `GET /rustfs/admin/v3/temporary-account-info?accessKey=<key>` | Pour les clés émises par STS. |
| Détail d’une clé d’accès | `GET /rustfs/admin/v3/info-access-key?accessKey=<key>` | Recherche unifiée parmi les utilisateurs, les comptes de service et les clés STS. |
| Mettre à jour un compte de service | `POST /rustfs/admin/v3/update-service-account?accessKey=<key>` | Peut effectuer la rotation de la clé secrète, modifier l’état, le nom, la description ou l’expiration, ou remplacer la politique. |
| Supprimer un compte de service | `DELETE /rustfs/admin/v3/delete-service-account?accessKey=<key>` | Également servi sur `/delete-service-accounts`. Les appelants non administrateurs ne peuvent supprimer que leurs propres comptes de service. |

Corps de création (tous les champs sont facultatifs, sauf mention contraire) :

```json
{
  "policy": { "Version": "2012-10-17", "Statement": [] },
  "targetUser": "alice",
  "accessKey": "myserviceaccount",
  "secretKey": "mysecret",
  "name": "ci-pipeline",
  "description": "Key used by CI",
  "expiration": "2027-01-01T00:00:00Z"
}
```

:::note

Omettez `accessKey`/`secretKey` pour que RustFS génère une paire aléatoire. Omettez `policy` pour créer un compte de service à politique héritée. `targetUser` exige des privilèges d’administrateur ; les utilisateurs ordinaires créent des comptes de service pour eux-mêmes.

:::

## Identifiants temporaires STS

RustFS implémente un point de terminaison STS compatible avec AWS à la racine du serveur (`POST /` avec des paramètres encodés en formulaire). Deux actions sont prises en charge :

- `AssumeRole` — pour les identités IAM existantes, signée avec SigV4.
- `AssumeRoleWithWebIdentity` — pour les identités OIDC, authentifiée par le JWT lui-même (voir [Identité externe (OIDC)](../oidc/index.md)).

### AssumeRole

La requête doit être signée (AWS Signature V4) par un identifiant IAM de longue durée — les identifiants temporaires et les comptes de service ne peuvent pas appeler `AssumeRole`. Avec l’autorisation IAM intégrée, RustFS évalue `sts:AssumeRole` pour les utilisateurs IAM ordinaires en mode refus uniquement : un `Deny` explicite correspondant rejette la requête, mais un `Allow` distinct n’est pas exigé. L’utilisateur doit avoir au moins une association de politique d’utilisateur ou de groupe applicable, et tous les noms de politiques associés doivent être résolus.

Paramètres de formulaire :

| Paramètre | Obligatoire | Description |
| --- | --- | --- |
| `Action` | Oui | `AssumeRole`. |
| `Version` | Oui | Doit être `2011-06-15`. |
| `DurationSeconds` | Non | Durée de vie des identifiants, en secondes. Valeur par défaut : 3600 (1 heure) ; les valeurs sont ramenées à l’intervalle 900 (15 minutes) à 43200 (12 heures). |
| `Policy` | Non | Politique de session intégrée (JSON) qui restreint encore les identifiants temporaires. |
| `RoleArn`, `RoleSessionName`, `ExternalId` | Non | Acceptés pour la compatibilité avec AWS. |

Exemple :

```bash
curl -s -X POST "https://rustfs.example.com/" \
  --user "$ACCESS_KEY:$SECRET_KEY" \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  -d "Action=AssumeRole" \
  -d "Version=2011-06-15" \
  -d "DurationSeconds=3600"
```

La réponse est un document XML `AssumeRoleResponse` contenant `AccessKeyId`, `SecretAccessKey`, `SessionToken` et `Expiration`. Utilisez les trois valeurs pour les requêtes S3 suivantes (le jeton de session se place dans `X-Amz-Security-Token`).

L’identifiant temporaire hérite des politiques de l’appelant ; le `parent` de l’identifiant est la clé d’accès appelante. Si un paramètre `Policy` a été fourni, il est stocké dans la session et appliqué comme restriction supplémentaire.

### AssumeRoleWithWebIdentity

Utilisée par le flux OIDC ; aucune signature SigV4 n’est nécessaire, car le JWT du fournisseur d’identité constitue l’authentification :

| Paramètre | Obligatoire | Description |
| --- | --- | --- |
| `Action` | Oui | `AssumeRoleWithWebIdentity`. |
| `Version` | Oui | Doit être `2011-06-15`. |
| `WebIdentityToken` | Oui | Jeton d’identité OIDC émis par un fournisseur configuré. |
| `DurationSeconds` | Non | Même valeur par défaut et même bornage 900–43200 que pour `AssumeRole`. |
| `Policy` | Non | Politique de session intégrée facultative. |

RustFS vérifie le jeton auprès du fournisseur configuré (signature, émetteur, audience, expiration), associe ses claims `groups`/`roles` aux noms de politiques RustFS et rejette la requête si aucune politique ni aucun groupe ne peut être associé. La réponse est un document XML `AssumeRoleWithWebIdentityResponse` avec les mêmes champs d’identifiants, plus `SubjectFromWebIdentityToken`.

:::warning

Gardez `DurationSeconds` aussi court que votre charge de travail le permet ; un identifiant temporaire divulgué reste valide jusqu’à son expiration.

:::
