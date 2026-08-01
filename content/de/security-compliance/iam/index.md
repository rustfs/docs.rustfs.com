---
title: "RustFS IAM Management"
description: "Overview of RustFS Identity and Access Management (IAM): identity types, policy attachment, and policy evaluation semantics."
---

RustFS ships a built-in Identity and Access Management (IAM) system modeled on the AWS IAM policy language. Every request — S3 data access, Console operation, or admin API call — is authenticated against a credential and then authorized against the policies attached to that identity.

## Identity Types

RustFS distinguishes the following identity types:

| Identity | Created by | Typical use |
| --- | --- | --- |
| Root credentials | `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables at server start | Initial setup and break-glass administration. The root account bypasses policy checks (owner semantics). |
| IAM users | Console or admin API (`add-user`) | Long-term named accounts for people or applications. |
| Groups | Console or admin API (`update-group-members`) | Attach one policy set to many users at once. Users inherit the policies of every group they belong to. |
| Service accounts (access keys) | Console or admin API (`add-service-account`) | Derived credentials that belong to a parent user. They inherit the parent's permissions, optionally restricted further by an embedded session policy, and can carry an expiration time. |
| STS temporary credentials | `AssumeRole` / `AssumeRoleWithWebIdentity` STS calls | Short-lived credentials (15 minutes to 12 hours) with an access key, secret key, and session token. |
| External OIDC identities | OpenID Connect providers (Keycloak, Authing, and other standard OIDC IdPs) | Console SSO. ID token claims are mapped to RustFS policy names, and RustFS issues STS credentials. |

:::warning

Root credentials cannot be restricted by policies. Use them only to bootstrap the deployment, then create IAM users and service accounts for day-to-day work.

:::

## How Policies Attach to Identities

Policies are named JSON documents stored in RustFS. Attachment works as follows:

- **User binding** — one or more policy names are attached to an IAM user (`set-user-or-group-policy`, or the `idp/builtin/policy/attach` endpoint which accepts a list of policies).
- **Group binding** — the same mechanism with `isGroup=true`; every member of the group receives the group's policies in addition to their own.
- **Service accounts** — do not get their own policy bindings. They evaluate under the parent user's combined policies. If the service account was created with an explicit policy document, that session policy is applied as an additional restriction (both must allow).
- **STS sessions** — inherit the parent identity's policies. The `Policy` request parameter of `AssumeRole` can embed an additional session policy that further restricts the temporary credentials.
- **OIDC identities** — the ID token's `groups`/`roles` claim values are matched against RustFS policy names; the matched policies govern the issued STS credentials.

RustFS ships these built-in (canned) policies: `readwrite`, `readonly`, `writeonly`, `diagnostics`, and `consoleAdmin`. See [Users, Groups, and Policies](./policies.md) for their contents and for writing custom policies.

## Policy Evaluation Semantics

When an identity has multiple attached policies, RustFS merges their statements (dropping duplicates) and evaluates the merged document:

1. **Explicit deny wins.** All `Deny` statements are checked first; if any matching `Deny` statement applies to the request, the request is rejected regardless of any `Allow`.
2. **Owner shortcut.** The root (owner) account is allowed once no explicit deny matched.
3. **Explicit allow required.** Otherwise, at least one `Allow` statement must match the requested action and resource.
4. **Default deny.** If no statement matches, the request is denied.

For service accounts and STS sessions carrying a session policy, the effective permission is the intersection: the parent's policies and the session policy must both allow the request.

## In This Section

- [Users, Groups, and Policies](./policies.md) — managing users and groups, the policy document format, and built-in policies.
- [Service Accounts and STS](./sts.md) — derived access keys and temporary credentials via `AssumeRole`.
- [Access Keys](./access-token.md) — creating and deleting access keys from the Console.
