---
title: "Service Accounts and STS"
description: "RustFS service accounts (derived access keys) and temporary credentials via the STS AssumeRole API."
---

RustFS provides two mechanisms for issuing credentials that are derived from an existing identity: **service accounts** (long-lived access keys owned by a parent user) and **STS temporary credentials** (short-lived keys with a session token).

## Service Accounts

A service account is an access key/secret key pair that belongs to a parent IAM user (or to the root account). It authenticates like a normal key but is authorized as its parent:

- **Inherited policy (default).** If the service account is created without a policy, it inherits whatever the parent user's combined policies allow at request time.
- **Session-bound policy.** If a policy document is supplied at creation, it is embedded into the service account. Requests must then be allowed by *both* the parent's policies and the embedded policy.
- **Expiration.** An optional expiration timestamp (RFC 3339) can be set; the credential stops working after that time.

Service accounts cannot call `AssumeRole`, and a service account access key cannot be turned into a regular IAM user.

In the Console, service accounts are managed on the **Access Keys** page — see [Access Key Management](./access-token.md). The admin API exposes:

| Operation | Method and path | Notes |
| --- | --- | --- |
| Create service account | `PUT /rustfs/admin/v3/add-service-account` | Body below. Also served at `/add-service-accounts`. Requires `admin:CreateServiceAccount` when creating for another user (`targetUser`). |
| List service accounts | `GET /rustfs/admin/v3/list-service-accounts?user=<name>` | Requires `admin:ListServiceAccounts` to list another user's accounts. |
| List access keys (bulk) | `GET /rustfs/admin/v3/list-access-keys-bulk` | Supports filtering to users only, service accounts only, or STS keys only. |
| Service account details | `GET /rustfs/admin/v3/info-service-account?accessKey=<key>` | Returns name, description, parent, expiration, and the session policy (or `impliedPolicy: true` when inherited). |
| Temporary account details | `GET /rustfs/admin/v3/temporary-account-info?accessKey=<key>` | For STS-issued keys. |
| Access key details | `GET /rustfs/admin/v3/info-access-key?accessKey=<key>` | Unified lookup across users, service accounts, and STS keys. |
| Update service account | `POST /rustfs/admin/v3/update-service-account?accessKey=<key>` | Can rotate the secret, change status, name, description, expiration, or replace the policy. |
| Delete service account | `DELETE /rustfs/admin/v3/delete-service-account?accessKey=<key>` | Also served at `/delete-service-accounts`. Non-admin callers can delete only their own service accounts. |

Creation body (all fields optional unless noted):

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

Omit `accessKey`/`secretKey` to have RustFS generate a random pair. Omit `policy` to create an inherited-policy service account. `targetUser` requires admin privileges; regular users create service accounts for themselves.

:::

## STS Temporary Credentials

RustFS implements an AWS-compatible STS endpoint at the server root (`POST /` with form-encoded parameters). Two actions are supported:

- `AssumeRole` — for existing IAM identities, signed with SigV4.
- `AssumeRoleWithWebIdentity` — for OIDC identities, authenticated by the JWT itself (see [External Identity (OIDC)](../oidc/index.md)).

### AssumeRole

The request must be signed (AWS Signature V4) by a long-term IAM credential — temporary credentials and service accounts cannot call `AssumeRole`. The calling identity also needs the `sts:AssumeRole` action allowed by its policies (all built-in policies include it).

Form parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `Action` | Yes | `AssumeRole`. |
| `Version` | Yes | Must be `2011-06-15`. |
| `DurationSeconds` | No | Credential lifetime in seconds. Default 3600 (1 hour); values are clamped to the range 900 (15 minutes) to 43200 (12 hours). |
| `Policy` | No | An inline session policy (JSON) that further restricts the temporary credentials. |
| `RoleArn`, `RoleSessionName`, `ExternalId` | No | Accepted for AWS compatibility. |

Example:

```bash
curl -s -X POST "https://rustfs.example.com/" \
  --user "$ACCESS_KEY:$SECRET_KEY" \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  -d "Action=AssumeRole" \
  -d "Version=2011-06-15" \
  -d "DurationSeconds=3600"
```

The response is an XML `AssumeRoleResponse` containing `AccessKeyId`, `SecretAccessKey`, `SessionToken`, and `Expiration`. Use all three values on subsequent S3 requests (the session token goes in `X-Amz-Security-Token`).

The temporary credential inherits the caller's policies; the `parent` of the credential is the calling access key. If a `Policy` parameter was supplied, it is stored in the session and applied as an additional restriction.

### AssumeRoleWithWebIdentity

Used by the OIDC flow; no SigV4 signature is needed because the identity provider's JWT is the authentication:

| Parameter | Required | Description |
| --- | --- | --- |
| `Action` | Yes | `AssumeRoleWithWebIdentity`. |
| `Version` | Yes | Must be `2011-06-15`. |
| `WebIdentityToken` | Yes | The OIDC ID token issued by a configured provider. |
| `DurationSeconds` | No | Same default and 900–43200 clamping as `AssumeRole`. |
| `Policy` | No | Optional inline session policy. |

RustFS verifies the token against the configured provider (signature, issuer, audience, expiry), maps its `groups`/`roles` claims to RustFS policy names, and rejects the request if no policies or groups can be mapped. The response is an XML `AssumeRoleWithWebIdentityResponse` with the same credential fields plus `SubjectFromWebIdentityToken`.

:::warning

Keep `DurationSeconds` as short as your workload allows; a leaked temporary credential remains valid until its expiration.

:::
