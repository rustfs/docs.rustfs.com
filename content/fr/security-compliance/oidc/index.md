---
title: "OIDC"
description: "Comprenez comment RustFS utilise les fournisseurs OpenID Connect pour l’authentification unique de la Console."
---

RustFS prend en charge OpenID Connect (OIDC) pour l’authentification unique de la Console. Utilisez cette vue d’ensemble pour comprendre le flux d’authentification, préparer un fournisseur d’identité et choisir un guide de configuration propre à un fournisseur.

## Fonctionnement d’OIDC

RustFS utilise le flux Authorization Code d’OIDC avec Proof Key for Code Exchange (PKCE) :

1. RustFS envoie une demande d’autorisation avec un défi PKCE S256.
2. Le fournisseur d’identité vous authentifie et renvoie un code d’autorisation à l’URL de rappel de RustFS.
3. RustFS échange le code auprès du point de terminaison de jeton du fournisseur.
4. RustFS vérifie la signature du jeton d’identité, l’émetteur, l’audience, l’expiration et le nonce.
5. RustFS associe les claims de jeton configurés à des politiques locales de gestion des identités et des accès (IAM) et crée une session Console avec des identifiants temporaires.

Le fournisseur d’identité vous authentifie, tandis que les politiques RustFS autorisent les opérations S3 et d’administration.

## Exigences du fournisseur

Avant de configurer un fournisseur, préparez :

- Une URL de découverte OIDC qui expose les points de terminaison d’autorisation, de jeton et de jeu de clés JSON Web (JWKS).
- Un client confidentiel qui prend en charge le flux Authorization Code, PKCE S256 et l’authentification par secret client dans le corps de la requête de jeton.
- Une URL de rappel exacte de la forme `https://<rustfs-host>/rustfs/admin/v3/oidc/callback/<provider-id>`.
- Une origine HTTPS publique pour la Console RustFS.
- Un claim de groupe ou de rôle plat dont les valeurs correspondent à des noms de politiques RustFS existants.

Utilisez un client dédié à RustFS et n’accordez à chaque identité que les politiques dont elle a besoin.

## Guides des fournisseurs

- [Configurer Keycloak](/fr/security-compliance/oidc/keycloak) comme fournisseur OIDC pour la Console RustFS.
- [Configurer GitLab](/fr/security-compliance/oidc/gitlab) comme fournisseur OIDC pour la Console RustFS.

## Étapes suivantes

- Consultez [Utilisateurs, groupes et politiques](/fr/security-compliance/iam/policies) avant d’associer les claims du fournisseur d’identité.
- Consultez les [notes de sécurité de la Console](/fr/administration/console) avant d’exposer publiquement le point de terminaison de connexion.
