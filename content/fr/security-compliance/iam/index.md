---
title: "Gestion des identités et des accès"
description: "Présentation de la gestion des identités et des accès (IAM) de RustFS : types d’identité, association des politiques et sémantique d’évaluation des politiques."
---

RustFS inclut un système intégré de gestion des identités et des accès (IAM), modelé sur le langage de politiques d’AWS IAM. Chaque requête — accès aux données S3, opération de la Console ou appel à l’API d’administration — est authentifiée à l’aide d’un identifiant, puis autorisée selon les politiques associées à cette identité.

## Types d’identité

RustFS distingue les types d’identité suivants :

| Identité | Créée par | Usage typique |
| --- | --- | --- |
| Identifiants racine | Variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` au démarrage du serveur | Configuration initiale et administration d’urgence (break-glass). Le compte racine contourne l’évaluation des politiques d’identité IAM (sémantique de propriétaire). |
| Utilisateurs IAM | Console ou API d’administration (`add-user`) | Comptes nommés de longue durée pour des personnes ou des applications. |
| Groupes | Console ou API d’administration (`update-group-members`) | Associer un même ensemble de politiques à plusieurs utilisateurs à la fois. Les utilisateurs héritent des politiques de chaque groupe auquel ils appartiennent. |
| Comptes de service (clés d’accès) | Console ou API d’administration (`add-service-account`) | Identifiants dérivés qui appartiennent à un utilisateur parent. Ils héritent des autorisations du parent, facultativement restreintes encore par une politique de session intégrée, et peuvent comporter une expiration. |
| Identifiants temporaires STS | Appels STS `AssumeRole` / `AssumeRoleWithWebIdentity` | Identifiants de courte durée (15 minutes à 12 heures), avec une clé d’accès, une clé secrète et un jeton de session. |
| Identités OIDC externes | Fournisseurs OpenID Connect (Keycloak, Authing et d’autres IdP OIDC standards) | Authentification unique de la Console. Les claims du jeton d’identité sont associés aux noms de politiques RustFS, et RustFS émet des identifiants STS. |

:::warning

Les identifiants racine contournent les politiques d’identité IAM, mais les politiques de compartiment (bucket) peuvent encore refuser les requêtes S3 du compte racine. Seuls `GetBucketPolicy`, `PutBucketPolicy` et `DeleteBucketPolicy` contournent un refus de politique de compartiment, afin que le propriétaire puisse rétablir l’accès. Utilisez les identifiants racine uniquement pour initialiser le déploiement, puis créez des utilisateurs IAM et des comptes de service pour le travail quotidien.

:::

## Association des politiques aux identités

Les politiques sont des documents JSON nommés, stockés dans RustFS. L’association fonctionne comme suit :

- **Association à un utilisateur** — un ou plusieurs noms de politiques sont associés à un utilisateur IAM (`set-user-or-group-policy`, ou le point de terminaison `idp/builtin/policy/attach` qui accepte une liste de politiques).
- **Association à un groupe** — le même mécanisme avec `isGroup=true` ; chaque membre du groupe reçoit les politiques du groupe en plus des siennes.
- **Comptes de service** — ils n’ont pas leurs propres associations de politiques. Ils sont évalués selon les politiques combinées de l’utilisateur parent. Si le compte de service a été créé avec un document de politique explicite, cette politique de session s’applique comme restriction supplémentaire (les deux doivent autoriser).
- **Sessions STS** — elles héritent des politiques de l’identité parente. Le paramètre de requête `Policy` de `AssumeRole` peut intégrer une politique de session supplémentaire qui restreint encore les identifiants temporaires.
- **Identités OIDC** — les valeurs des claims `groups`/`roles` du jeton d’identité sont comparées aux noms de politiques RustFS ; les politiques correspondantes régissent les identifiants STS émis.

RustFS fournit ces politiques intégrées (prédéfinies) : `readwrite`, `readonly`, `writeonly`, `diagnostics` et `consoleAdmin`. Consultez [Utilisateurs, groupes et politiques](./policies.md) pour leur contenu et pour rédiger des politiques personnalisées.

## Sémantique d’évaluation des politiques [#policy-evaluation-semantics]

Lorsqu’une identité possède plusieurs politiques associées, RustFS fusionne leurs instructions (en supprimant les doublons) et évalue le document fusionné :

1. **Un refus explicite l’emporte.** Toutes les instructions `Deny` sont vérifiées en premier ; si une instruction `Deny` correspondante s’applique à la requête, la requête est rejetée, indépendamment de tout `Allow`.
2. **Raccourci du propriétaire.** Le compte racine contourne l’évaluation des politiques d’identité IAM ; les contrôles et exceptions de politique de compartiment décrits ci-dessus s’appliquent toujours.
3. **Autorisation explicite obligatoire.** Sinon, au moins une instruction `Allow` doit correspondre à l’action et à la ressource demandées.
4. **Refus par défaut.** Si aucune instruction ne correspond, la requête est refusée.

Pour les comptes de service et les sessions STS qui portent une politique de session, l’autorisation effective est l’intersection : les politiques du parent et la politique de session doivent toutes deux autoriser la requête.

## Dans cette section

- [Utilisateurs, groupes et politiques](./policies.md) — gestion des utilisateurs et des groupes, format du document de politique et politiques intégrées.
- [Comptes de service et STS](./sts.md) — clés d’accès dérivées et identifiants temporaires via `AssumeRole`.
- [Clés d’accès](./access-token.md) — création et suppression de clés d’accès depuis la Console.
