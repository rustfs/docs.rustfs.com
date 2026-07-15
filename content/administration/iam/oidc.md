---
title: "External Identity (OIDC)"
description: "Connect the RustFS Console to Keycloak, Authing, or any standard OpenID Connect provider for single sign-on."
---

RustFS supports standard OpenID Connect (OIDC) for Console login. Any standards-compliant provider works; this guide uses Keycloak and Authing as worked examples. The examples use the default RustFS provider id, `default`.

## Integration Model

RustFS expects a provider that offers issuer metadata (`.well-known/openid-configuration`), an authorization endpoint, a token endpoint, a JWKS (or another verifiable ID token signature path), and an authorization-code flow that returns an `id_token`.

The browser login flow is:

1. The user opens the RustFS OIDC authorize endpoint (`/rustfs/admin/v3/oidc/authorize/<provider>`).
2. RustFS creates `state`, `nonce`, and a PKCE S256 challenge, then redirects the browser to the provider.
3. The provider redirects back to `/rustfs/admin/v3/oidc/callback/<provider>` with `code` and `state`.
4. RustFS exchanges the code with `client_id`, `client_secret`, and the PKCE verifier.
5. RustFS validates the ID token signature, issuer, audience, expiry, and nonce.
6. RustFS maps ID token claim values to RustFS policy names and issues one-hour STS credentials for the Console.

RustFS does not call the provider's authorization APIs for object or admin authorization. Authorization is handled entirely by RustFS policies after claims are mapped.

## Claim Mapping

RustFS reads `groups` or `roles` claims from the ID token and maps each value to a RustFS policy name. Keep claim values equal to policy names:

| Claim value | RustFS policy | Purpose |
| --- | --- | --- |
| `consoleAdmin` | `consoleAdmin` | Full Console, admin, KMS, and S3 access. |
| `readwrite` | `readwrite` | S3 read/write access. |
| `readonly` | `readonly` | S3 read-only access. |
| `writeonly` | `writeonly` | S3 write-only access. |
| `diagnostics` | `diagnostics` | Diagnostic admin access. |

If a login succeeds but no claim value matches a RustFS policy (and no group is mapped), the STS exchange is rejected.

## RustFS Configuration

Configure the provider and the public browser origin through environment variables, then restart RustFS:

```bash
export RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

export RUSTFS_IDENTITY_OPENID_ENABLE=on
export RUSTFS_IDENTITY_OPENID_CONFIG_URL="<ISSUER_URL>"
export RUSTFS_IDENTITY_OPENID_CLIENT_ID="<CLIENT_ID>"
export RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<CLIENT_SECRET>"
export RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
export RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
export RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
export RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="My IdP"
export RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM="groups"
export RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"
export RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
export RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
```

For short-lived connectivity testing only, you may temporarily add:

```bash
export RUSTFS_IDENTITY_OPENID_ROLE_POLICY="consoleAdmin"
```

:::warning

Do not keep `role_policy=consoleAdmin` in production unless every user of this client should receive full Console access. Claim-to-policy mapping is the production authorization model.

:::

If the deployment manages configuration through compatible admin commands, the same keys can be set with `mc admin config set <alias> identity_openid enable=on config_url=... client_id=... client_secret=... scopes=... redirect_uri=... redirect_uri_dynamic=off display_name=... groups_claim=... roles_claim=... email_claim=... username_claim=...` followed by `mc admin service restart <alias>`.

:::note

`RUSTFS_BROWSER_REDIRECT_URL` is a process environment variable, not an `identity_openid` provider key. Configure it in the RustFS service environment even when the provider is stored through admin config.

:::

### Named Providers

To register more than one provider (or use a provider id other than `default`), suffix the provider-specific environment variables with the provider id and register the matching callback URL at the IdP:

```bash
export RUSTFS_IDENTITY_OPENID_ENABLE_keycloak=on
export RUSTFS_IDENTITY_OPENID_CONFIG_URL_keycloak="https://keycloak.example.com/realms/rustfs"
export RUSTFS_IDENTITY_OPENID_CLIENT_ID_keycloak="rustfs-console"
export RUSTFS_IDENTITY_OPENID_CLIENT_SECRET_keycloak="<KEYCLOAK_CLIENT_SECRET>"
export RUSTFS_IDENTITY_OPENID_SCOPES_keycloak="openid,profile,email"
export RUSTFS_IDENTITY_OPENID_REDIRECT_URI_keycloak="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/keycloak"
export RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC_keycloak=off
export RUSTFS_IDENTITY_OPENID_DISPLAY_NAME_keycloak="Keycloak"
export RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM_keycloak="groups"
```

`RUSTFS_BROWSER_REDIRECT_URL` remains global and is not suffixed per provider.

### Redirect URL Priority

RustFS builds browser-facing URLs with this priority:

1. Provider `redirect_uri`, when configured, is used for the OIDC callback URL sent to the IdP.
2. `RUSTFS_BROWSER_REDIRECT_URL`, when configured, is used as the public origin for OIDC callback generation when no provider `redirect_uri` exists, and for Console success redirects and logout fallback redirects.
3. Request headers are used only when provider dynamic redirects are enabled and no browser redirect URL is configured.

For reverse-proxy or load-balancer deployments, set `RUSTFS_BROWSER_REDIRECT_URL` to avoid depending on `Host` and `X-Forwarded-Proto`. OIDC authorize and callback requests must reach the same RustFS node, because in-flight OIDC `state` is local to the node — configure session affinity on the load balancer.

## Example: Keycloak

Example values: realm `rustfs`, issuer `https://keycloak.example.com/realms/rustfs`, client id `rustfs-console`, callback `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default`.

1. Create or select the `rustfs` realm and verify discovery:

   ```bash
   curl -fsS "https://keycloak.example.com/realms/rustfs/.well-known/openid-configuration" \
     | jq '.issuer,.authorization_endpoint,.token_endpoint,.jwks_uri'
   ```

2. Create a client: `Client type` = `OpenID Connect`, `Client ID` = `rustfs-console`, enable `Client authentication` and `Standard flow`, disable `Implicit flow`, `Direct access grants`, and `Service accounts roles`. Set `Valid redirect URIs` to the exact RustFS callback URL, `Web origins` to `https://rustfs.example.com`, and PKCE Code Challenge Method to `S256`. Copy the client secret from `Credentials`.
3. Map groups to policies: create Keycloak groups named after RustFS policies (e.g. `consoleAdmin`, `readonly`), add users, and add a `Group Membership` mapper to the client scope with `Token Claim Name` = `groups`, `Full group path` = `Off`, `Add to ID token` = `On`, `Multivalued` = `On`.
4. Configure RustFS with `RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://keycloak.example.com/realms/rustfs"` and the client id/secret as shown above, then restart.

:::note

Keep `Full group path` disabled. RustFS policy names cannot contain `/`, so `/consoleAdmin` will not map to the `consoleAdmin` policy. If you use Keycloak roles instead of groups, emit a flat top-level `roles` claim (via a `User Realm Role` or `User Client Role` mapper) and set `RUSTFS_IDENTITY_OPENID_ROLES_CLAIM=roles` — RustFS does not parse Keycloak's nested `realm_access.roles` claim. RustFS submits the client secret in the token request body, so do not disable `client_secret_post`.

:::

## Example: Authing

Example values: application domain `https://example.authing.cn`, issuer `https://example.authing.cn/oidc`, App ID as `client_id`, App Secret as `client_secret`.

1. Create a self-hosted application named `RustFS Console`; record the App ID, App Secret, issuer, and discovery URL. Authing deployments use different issuer paths (`/oidc` or `/oauth/oidc`) — always copy the issuer from the Authing console.
2. Protocol settings: Protocol = OpenID Connect, Grant type = Authorization Code, Response type = `code`, token endpoint authentication = `client_secret_post`, PKCE = allow or require `S256`, ID token signing algorithm = `RS256` recommended.
3. Register the exact callback URL `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default`.
4. Assign users roles named after RustFS policies and confirm the ID token contains, for example:

   ```json
   {
     "roles": ["consoleAdmin"]
   }
   ```

5. Configure RustFS with `RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email,roles"` and `RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"`, then restart.

## Validation

Verify provider discovery, then check that the provider is visible to RustFS:

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

Test the browser flow by opening:

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

Expected result: redirect to the IdP, sign in, redirect back to `/rustfs/admin/v3/oidc/callback/default?code=...&state=...`, RustFS validates the ID token, issues STS credentials, and the browser lands on the Console with the mapped permissions.

## Troubleshooting

| Symptom | Common cause | Fix |
| --- | --- | --- |
| `/oidc/providers` does not show the provider | Provider did not load, or RustFS was not restarted | Check environment variables and restart RustFS. |
| IdP reports a redirect mismatch | Registered redirect URI differs from the RustFS callback URL | Use the exact callback URL including the provider id. |
| Callback reports missing `code` or `state` | Proxy dropped the query string | Preserve the full callback URL and query string. |
| Token exchange fails | Wrong client secret or token auth method | Confirm the client is confidential and accepts `client_secret_post`. |
| RustFS reports no `id_token` | Missing `openid` scope or non-OIDC flow | Include `openid` and use the authorization code flow. |
| ID token verification fails | Issuer, audience, signing algorithm, or JWKS mismatch | Compare discovery metadata with the RustFS config; prefer `RS256`. |
| Login succeeds but access is denied | No claim value matched a RustFS policy | Emit `groups` or `roles` as a flat ID token claim matching policy names. |
| Console redirects to an internal host | Missing `RUSTFS_BROWSER_REDIRECT_URL` | Set it to the public browser origin. |
| Invalid or expired OIDC state | Callback reached a different RustFS node | Configure load-balancer session affinity for authorize and callback. |

## Production Checklist

- The IdP and RustFS use HTTPS.
- The registered redirect URI is the exact callback URL, not a wildcard.
- `RUSTFS_BROWSER_REDIRECT_URL` is set to the public RustFS browser origin.
- `RUSTFS_IDENTITY_OPENID_REDIRECT_URI` matches the registered callback URL.
- PKCE S256 is enabled or required.
- Users receive `groups` or `roles` claims that match RustFS policy names.
- `role_policy=consoleAdmin` is not used as a permanent production shortcut.
- The load balancer preserves query strings and pins authorize/callback requests to one node.
