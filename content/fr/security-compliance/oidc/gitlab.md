---
title: "GitLab"
description: "Configurez GitLab comme fournisseur d’identité OpenID Connect pour l’authentification unique de la Console RustFS."
---

RustFS s’intègre à **GitLab** via le flux Authorization Code d’OpenID Connect (OIDC). Les exemples de cette page utilisent l’identifiant de fournisseur RustFS par défaut, `default`.

## Prérequis

Avant de commencer, préparez :

- Une [instance GitLab installée](https://about.gitlab.com/install/) et un accès à sa zone d’administration.
- Un déploiement RustFS avec une origine HTTPS publique pour la Console.
- Une politique RustFS à affecter aux utilisateurs GitLab. Les exemples utilisent `consoleAdmin` ; en production, utilisez une politique qui n’accorde que les autorisations requises par vos utilisateurs.

## Vue d’ensemble

Le flux de connexion dans le navigateur est le suivant :

1. RustFS envoie une demande de code d’autorisation avec un défi Proof Key for Code Exchange (PKCE) S256.
2. GitLab authentifie l’utilisateur et redirige le navigateur vers RustFS avec `code` et `state`.
3. RustFS échange le code auprès du point de terminaison de jeton de GitLab.
4. RustFS vérifie la signature du jeton d’identité, l’émetteur, l’audience, l’expiration et le nonce.
5. RustFS affecte la politique locale de gestion des identités et des accès (IAM) configurée et émet des identifiants temporaires pour la session Console.

GitLab authentifie l’utilisateur, tandis que les politiques RustFS autorisent les opérations S3 et d’administration.

Les exemples utilisent les valeurs suivantes. Remplacez les noms d’hôte et le secret client pour votre environnement :

| Réglage | Exemple |
| --- | --- |
| Émetteur GitLab (issuer) | `https://gitlab.example.com` |
| ID d’application GitLab | `<gitlab-application-id>` |
| Origine publique RustFS | `https://rustfs.example.com` |
| URL de rappel RustFS | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## Configuration

### Configuration de GitLab

#### Créer l’application OAuth

1. Connectez-vous à GitLab en tant qu’administrateur.
2. Ouvrez **Admin Area** (zone d’administration), sélectionnez **Applications**, puis **New application**.
3. Saisissez `RustFS OIDC` comme nom d’application.
4. Réglez **Redirect URI** sur l’URL de rappel RustFS exacte :

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

5. Activez **Confidential**.
6. Activez **Trusted** pour ignorer l’invite d’autorisation de l’utilisateur pour cette application à l’échelle de l’instance.
7. Sélectionnez les portées `openid`, `profile` et `email`.
8. Enregistrez l’application, puis copiez l’ID et le secret d’application générés.

Consultez la [documentation du fournisseur OAuth GitLab](https://docs.gitlab.com/integration/oauth_provider/) pour les détails d’administration des applications.

![Zone d’administration GitLab montrant l’application OAuth d’instance RustFS OIDC comme approuvée et confidentielle](./images/gitlab-oidc-configuration.png)

:::note[Environnement de test illustré]

La capture montre une URL de rappel HTTP issue d’un environnement de test. Utilisez l’URL de rappel HTTPS publique de votre déploiement RustFS.

:::

### Configuration de RustFS

Configurez le fournisseur GitLab au moyen de variables d’environnement.

#### Configurer avec des variables d’environnement

Ajoutez le fournisseur GitLab et l’origine publique du navigateur à l’environnement du service RustFS :

```ini title="/etc/default/rustfs"
RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://gitlab.example.com"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="<gitlab-application-id>"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<gitlab-application-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="GitLab"
RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
RUSTFS_IDENTITY_OPENID_ROLE_POLICY="consoleAdmin"
```

Redémarrez RustFS après avoir appliqué la configuration.

`RUSTFS_BROWSER_REDIRECT_URL` doit contenir le schéma et l’autorité publics, sans chemin. Cette variable contrôle la redirection de succès de la Console et l’URL de repli lors de la déconnexion. L’URL de rappel du fournisseur doit correspondre exactement à l’URL enregistrée dans GitLab.

:::warning[Limitez la politique affectée]

`RUSTFS_IDENTITY_OPENID_ROLE_POLICY` affecte la même politique RustFS à chaque utilisateur qui se connecte via ce fournisseur. Remplacez `consoleAdmin` par une politique qui n’accorde que les autorisations requises par vos utilisateurs GitLab.

:::

Avec un reverse proxy ou un répartiteur de charge, conservez la chaîne de requête du rappel et acheminez les requêtes d’autorisation et de rappel vers le même nœud RustFS. L’état OIDC en cours (`state`) est local à ce nœud.

## Vérification

### Vérifier la découverte GitLab

Interrogez le document de découverte GitLab :

```bash
curl -fsS "https://gitlab.example.com/.well-known/openid-configuration" | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri,
  scopes_supported,
  code_challenge_methods_supported
}'
```

Vérifiez que :

- `issuer` vaut `https://gitlab.example.com`.
- `authorization_endpoint`, `token_endpoint` et `jwks_uri` sont présents.
- `scopes_supported` contient `openid`, `profile` et `email`.
- `code_challenge_methods_supported` contient `S256`.

### Vérifier le fournisseur RustFS

Après le redémarrage de RustFS, vérifiez que le fournisseur est disponible :

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

La réponse devrait inclure le fournisseur `default` avec le nom d’affichage `GitLab`.

### Tester la connexion à la Console

Ouvrez la Console RustFS et sélectionnez **GitLab**, ou ouvrez directement le point de terminaison d’autorisation :

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

![Page de connexion de la Console RustFS montrant l’option Login with GitLab](./images/rustfs-console-gitlab-oidc.png)

Vérifiez le flux complet :

1. Le navigateur redirige vers GitLab.
2. L’utilisateur se connecte et autorise l’application lorsque l’invite s’affiche.
3. GitLab redirige vers l’URL de rappel RustFS avec `code` et `state`.
4. RustFS valide le jeton d’identité et crée la session Console.
5. La Console s’ouvre avec la politique RustFS configurée.

Si GitLab signale une non-correspondance de l’URI de redirection, confirmez que l’URI enregistrée dans l’application GitLab correspond exactement à `RUSTFS_IDENTITY_OPENID_REDIRECT_URI`.

## Étapes suivantes

- Consultez [Utilisateurs, groupes et politiques](../iam/policies.md) avant de choisir la politique affectée aux utilisateurs GitLab.
- Consultez les [notes de sécurité de la Console](/fr/administration/console) avant d’exposer publiquement le point de terminaison de connexion.
