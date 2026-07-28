---
title: "OIDC"
description: "Understand how RustFS uses OpenID Connect providers for Console single sign-on."
---

RustFS supports OpenID Connect (OIDC) for Console single sign-on. Use this overview to understand the authentication flow, prepare an identity provider, and choose a provider-specific configuration guide.

## How OIDC works

RustFS uses the OIDC Authorization Code Flow with Proof Key for Code Exchange (PKCE):

1. RustFS sends an authorization request with an S256 PKCE challenge.
2. The identity provider authenticates you and returns an authorization code to the RustFS callback URL.
3. RustFS exchanges the code at the provider's token endpoint.
4. RustFS verifies the ID token signature, issuer, audience, expiry, and nonce.
5. RustFS maps configured token claims to local Identity and Access Management (IAM) policies and creates a Console session with temporary credentials.

The identity provider authenticates you, while RustFS policies authorize S3 and administration operations.

## Provider requirements

Before configuring a provider, prepare:

- An OIDC discovery URL that exposes the authorization, token, and JSON Web Key Set (JWKS) endpoints.
- A confidential client that supports the Authorization Code Flow, S256 PKCE, and client-secret authentication in the token request body.
- An exact callback URL in the form `https://<rustfs-host>/rustfs/admin/v3/oidc/callback/<provider-id>`.
- A public HTTPS origin for the RustFS Console.
- A flat group or role claim whose values match existing RustFS policy names.

Use a dedicated client for RustFS and grant each identity only the policies it requires.

## Provider guides

- [Configure Keycloak](/security-compliance/oidc/keycloak) as an OIDC provider for the RustFS Console.

## Next steps

- Review [users, groups, and policies](/security-compliance/iam/policies) before mapping identity-provider claims.
- Review the [Console security notes](/administration/console) before exposing the login endpoint publicly.
