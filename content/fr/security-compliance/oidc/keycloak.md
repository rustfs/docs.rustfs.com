---
title: "Keycloak"
description: "Configurez Keycloak comme fournisseur d’identité OpenID Connect pour l’authentification unique de la Console RustFS."
---

RustFS s’intègre à **Keycloak** via le flux Authorization Code d’OpenID Connect (OIDC). Les exemples de cette page utilisent l’identifiant de fournisseur RustFS par défaut, `default`.

## Vue d’ensemble

Le flux de connexion dans le navigateur est le suivant :

1. RustFS envoie une demande de code d’autorisation avec un défi Proof Key for Code Exchange (PKCE) S256.
2. Keycloak authentifie l’utilisateur et redirige le navigateur vers RustFS avec `code` et `state`.
3. RustFS échange le code auprès du point de terminaison de jeton de Keycloak.
4. RustFS vérifie la signature du jeton d’identité, l’émetteur, l’audience, l’expiration et le nonce.
5. RustFS associe les claims du jeton d’identité à des politiques locales de gestion des identités et des accès (IAM) RustFS, puis émet des identifiants temporaires pour la session Console.

Keycloak authentifie l’utilisateur, tandis que les politiques RustFS autorisent les opérations S3 et d’administration. RustFS n’utilise pas les Authorization Services de Keycloak pour l’autorisation des objets ou de la Console.

Les exemples utilisent les valeurs suivantes. Remplacez les noms d’hôte et le secret client pour votre environnement :

| Réglage | Exemple |
| --- | --- |
| Domaine Keycloak (realm) | `rustfs` |
| Émetteur Keycloak (issuer) | `https://keycloak.example.com/realms/rustfs` |
| ID client Keycloak | `rustfs-console` |
| Origine publique RustFS | `https://rustfs.example.com` |
| URL de rappel RustFS | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## Configuration

### Configuration de Keycloak

#### Créer le domaine et le client

1. Ouvrez la console d’administration Keycloak, puis créez ou sélectionnez le domaine `rustfs`.
2. Ouvrez **Clients** et créez un client OpenID Connect dont l’ID client est `rustfs-console`.
3. Activez **Client authentication** et **Standard flow**.
4. Désactivez les flux inutilisés, notamment **Implicit flow**, **Direct access grants** et **Service accounts roles**.
5. Réglez **Valid redirect URIs** sur l’URL de rappel RustFS exacte :

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

6. Réglez **Web origins** sur l’origine publique RustFS :

  ```text
  https://rustfs.example.com
  ```

7. Réglez **Proof Key for Code Exchange Code Challenge Method** sur `S256`.
8. Enregistrez le client et copiez son secret depuis **Credentials**.

RustFS transmet le secret client dans le corps de la requête de jeton. N’appliquez pas une politique client Keycloak qui désactive `client_secret_post`.

#### Associer les groupes Keycloak aux politiques RustFS

RustFS associe les valeurs du claim `groups` du jeton d’identité aux noms de politiques RustFS. Créez des groupes Keycloak qui correspondent aux politiques requises par vos utilisateurs, par exemple `consoleAdmin`, `readwrite` ou `readonly`, puis affectez les utilisateurs à ces groupes.

Ajoutez un mapper **Group Membership** à un périmètre de client (client scope) dédié et attachez-le à `rustfs-console` :

| Champ du mapper | Valeur |
| --- | --- |
| Name | `rustfs-groups` |
| Token Claim Name | `groups` |
| Full group path | Off |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |
| Multivalued | On |

Laissez **Full group path** désactivé. Une valeur telle que `/consoleAdmin` ne correspond pas à la politique RustFS nommée `consoleAdmin`.

:::note[Utiliser des rôles Keycloak]

Si vous utilisez des rôles de domaine ou de client plutôt que des groupes, ajoutez un mapper de rôles qui émet un tableau `roles` plat à la racine du jeton. RustFS n’analyse pas le claim imbriqué `realm_access.roles` de Keycloak.

:::

### Configuration de RustFS

Configurez le fournisseur Keycloak au moyen de variables d’environnement.

#### Configurer avec des variables d’environnement

Ajoutez le fournisseur Keycloak et l’origine publique du navigateur à l’environnement du service RustFS :

```ini title="/etc/default/rustfs"
RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://keycloak.example.com/realms/rustfs"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="rustfs-console"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<keycloak-client-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="Keycloak"
RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM="groups"
RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"
RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
```

Redémarrez RustFS après avoir appliqué la configuration.

:::note[Keycloak sur un réseau privé]

Si Keycloak se résout en une adresse IP privée ou de boucle locale, ajoutez son origine à `RUSTFS_OUTBOUND_ALLOW_ORIGINS` dans l’environnement du service RustFS. Par exemple, pour un service Docker nommé `kc` sur le port `8080` :

```ini
RUSTFS_OUTBOUND_ALLOW_ORIGINS="http://kc:8080"
```

Utilisez le format `scheme://host:port`, sans chemin tel que `/realms/rustfs`. Séparez les origines par des virgules et ajoutez toute autre origine privée utilisée par `jwks_uri` ou `token_endpoint` dans le document de découverte. Redémarrez RustFS après cette modification. Les points de terminaison publics qui se résolvent en adresses IP publiques ne nécessitent pas cette liste d’autorisation.

Sans l’autorisation requise, la découverte échoue au démarrage et le fournisseur reste indisponible pour la connexion à la Console et pour STS, même si sa configuration indique `enabled: true`.

:::

`RUSTFS_BROWSER_REDIRECT_URL` doit contenir le schéma et l’autorité publics, sans chemin. Cette variable contrôle la redirection de succès de la Console et l’URL de repli lors de la déconnexion. L’URL de rappel du fournisseur doit correspondre exactement à l’URL enregistrée dans Keycloak.

:::warning[Associer les claims en production]

N’utilisez pas `RUSTFS_IDENTITY_OPENID_ROLE_POLICY=consoleAdmin` comme raccourci permanent. Associez les groupes ou les rôles Keycloak à des politiques RustFS afin que chaque utilisateur ne reçoive que les autorisations requises.

:::

Avec un reverse proxy ou un répartiteur de charge, conservez la chaîne de requête du rappel et acheminez les requêtes d’autorisation et de rappel vers le même nœud RustFS. L’état OIDC en cours (`state`) est local à ce nœud.

## Vérification

### Vérifier la découverte Keycloak

Interrogez le document de découverte du domaine :

```bash
curl -fsS "https://keycloak.example.com/realms/rustfs/.well-known/openid-configuration" | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri,
  code_challenge_methods_supported,
  token_endpoint_auth_methods_supported
}'
```

Vérifiez que :

- `issuer` vaut `https://keycloak.example.com/realms/rustfs`.
- `authorization_endpoint`, `token_endpoint` et `jwks_uri` sont présents.
- `code_challenge_methods_supported` contient `S256`.
- Le point de terminaison de jeton accepte l’authentification par secret client dans le corps de la requête.

### Vérifier le fournisseur RustFS

Après le redémarrage de RustFS, vérifiez que le fournisseur est disponible :

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

La réponse devrait inclure le fournisseur `default` avec le nom d’affichage `Keycloak`.

### Tester la connexion à la Console

Ouvrez la Console RustFS et sélectionnez **Keycloak**, ou ouvrez directement le point de terminaison d’autorisation :

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

Vérifiez le flux complet :

1. Le navigateur redirige vers Keycloak.
2. L’utilisateur se connecte.
3. Keycloak redirige vers l’URL de rappel RustFS avec `code` et `state`.
4. RustFS valide le jeton d’identité et crée la session Console.
5. La Console s’ouvre avec les autorisations associées au claim `groups` ou `roles` de l’utilisateur.

Si l’authentification réussit mais que l’accès est refusé, confirmez que le jeton d’identité contient un claim `groups` ou `roles` plat et que chaque valeur correspond exactement au nom d’une politique RustFS existante.

## Étapes suivantes

- Consultez [Utilisateurs, groupes et politiques](../iam/policies.md) avant d’affecter des groupes Keycloak.
- Consultez les [notes de sécurité de la Console](/fr/administration/console) avant d’exposer publiquement le point de terminaison de connexion.
