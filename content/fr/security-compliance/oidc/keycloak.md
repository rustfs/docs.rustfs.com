---
title: "Keycloak"
description: "Configure Keycloak as an OpenID Connect identity provider for RustFS Console single sign-on."
---

RustFS integrates with **Keycloak** through the OpenID Connect (OIDC) Authorization Code Flow. The examples on this page use the default RustFS provider ID, `default`.

## Overview

The browser login flow is:

1. RustFS sends an authorization-code request with a Proof Key for Code Exchange (PKCE) S256 challenge.
2. Keycloak authenticates the user and redirects the browser to RustFS with `code` and `state`.
3. RustFS exchanges the code at the Keycloak token endpoint.
4. RustFS verifies the ID token signature, issuer, audience, expiry, and nonce.
5. RustFS maps ID token claim values to local RustFS Identity and Access Management (IAM) policies and issues temporary credentials for the Console session.

Keycloak authenticates the user, while RustFS policies authorize S3 and administration operations. RustFS does not use Keycloak Authorization Services for object or Console authorization.

The examples use the following values. Replace the hostnames and client secret for your environment:

| Setting | Example |
| --- | --- |
| Keycloak realm | `rustfs` |
| Keycloak issuer | `https://keycloak.example.com/realms/rustfs` |
| Keycloak client ID | `rustfs-console` |
| Public RustFS origin | `https://rustfs.example.com` |
| RustFS callback URL | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## Configuration

### Keycloak configuration

#### Create the realm and client

1. Open the Keycloak Admin Console and create or select the `rustfs` realm.
2. Open **Clients** and create an OpenID Connect client with the client ID `rustfs-console`.
3. Enable **Client authentication** and **Standard flow**.
4. Disable unused flows, including **Implicit flow**, **Direct access grants**, and **Service accounts roles**.
5. Set **Valid redirect URIs** to the exact RustFS callback URL:

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

6. Set **Web origins** to the public RustFS origin:

  ```text
  https://rustfs.example.com
  ```

7. Set **Proof Key for Code Exchange Code Challenge Method** to `S256`.
8. Save the client and copy its secret from **Credentials**.

RustFS submits the client secret in the token request body. Do not apply a Keycloak client policy that disables `client_secret_post`.

#### Map Keycloak groups to RustFS policies

RustFS maps values in the ID token `groups` claim to RustFS policy names. Create Keycloak groups that match the policies required by your users, such as `consoleAdmin`, `readwrite`, or `readonly`, then assign users to those groups.

Add a **Group Membership** mapper to a dedicated client scope and attach it to `rustfs-console`:

| Mapper field | Value |
| --- | --- |
| Name | `rustfs-groups` |
| Token Claim Name | `groups` |
| Full group path | Off |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |
| Multivalued | On |

Keep **Full group path** disabled. A value such as `/consoleAdmin` does not match the RustFS policy named `consoleAdmin`.

:::note[Using Keycloak roles]

If you use realm or client roles instead of groups, add a role mapper that emits a flat top-level `roles` array. RustFS does not parse Keycloak's nested `realm_access.roles` claim.

:::

### RustFS configuration

Configure the Keycloak provider through environment variables.

#### Configure with environment variables

Add the Keycloak provider and public browser origin to the RustFS service environment:

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

Restart RustFS after applying the configuration.

`RUSTFS_BROWSER_REDIRECT_URL` must contain the public scheme and authority without a path. It controls the Console success redirect and logout fallback URL. The provider callback URL must exactly match the URL registered in Keycloak.

:::warning[Map claims in production]

Do not use `RUSTFS_IDENTITY_OPENID_ROLE_POLICY=consoleAdmin` as a permanent shortcut. Map Keycloak groups or roles to RustFS policies so each user receives only the required permissions.

:::

For a reverse proxy or load balancer, preserve the callback query string and route the authorize and callback requests to the same RustFS node. The in-flight OIDC `state` is local to that node.

## Verification

### Verify Keycloak discovery

Query the realm discovery document:

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

Confirm that:

- `issuer` is `https://keycloak.example.com/realms/rustfs`.
- `authorization_endpoint`, `token_endpoint`, and `jwks_uri` are present.
- `code_challenge_methods_supported` includes `S256`.
- The token endpoint supports client-secret authentication in the request body.

### Verify the RustFS provider

After restarting RustFS, check that the provider is available:

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

The response should include the `default` provider with the display name `Keycloak`.

### Test Console login

Open the RustFS Console and select **Keycloak**, or open the authorization endpoint directly:

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

Verify the complete flow:

1. The browser redirects to Keycloak.
2. The user signs in.
3. Keycloak redirects to the RustFS callback URL with `code` and `state`.
4. RustFS validates the ID token and creates the Console session.
5. The Console opens with the permissions mapped from the user's `groups` or `roles` claim.

If authentication succeeds but access is denied, confirm that the ID token contains a flat `groups` or `roles` claim and that each value exactly matches an existing RustFS policy name.

## Next steps

- Review [users, groups, and policies](../iam/policies.md) before assigning Keycloak groups.
- Review the [Console security notes](/administration/console) before exposing the login endpoint publicly.
