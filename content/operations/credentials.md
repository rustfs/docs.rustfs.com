---
title: "Credential Management"
description: "This article covers configuring RustFS root credentials via environment variables and secret files, rotating them safely, the internode RPC secret, and the MinIO-compatible environment aliases."
---

## Root Credentials

RustFS reads its root (admin) credential pair from:

```bash
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

If neither is provided, the server falls back to the built-in default `rustfsadmin` / `rustfsadmin`.

:::warning
The default `rustfsadmin` credentials are public and well-known. The container entrypoint prints a warning but still starts. Always set non-default credentials before exposing ports 9000/9001 beyond localhost. Additionally, a multi-node cluster running with an all-default pair **must** set `RUSTFS_RPC_SECRET` (see below) — the server refuses to derive internode RPC auth from the default secret key.
:::

## File-Based Injection (Docker/Kubernetes Secrets)

Instead of putting secrets into the environment, point RustFS at files containing them:

```bash
RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
```

Equivalent CLI flags exist (`--access-key-file`, `--secret-key-file`). Rules enforced by the container entrypoint:

- Only the **first line** of the file is read; surrounding whitespace and CR characters (CRLF-edited files) are trimmed. A file without a trailing newline is valid.
- Setting both the direct variable and the `_FILE` variant for the same credential is a hard error: `Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.`
- An empty value, an empty file, or an unreadable file is a hard error (exit 1).
- A file containing the default `rustfsadmin` value triggers the same warning as the direct variable.

```yaml title="docker-compose example with secrets"
services:
  rustfs:
    image: rustfs/rustfs:latest
    environment:
      - RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
      - RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
    secrets:
      - rustfs_access_key
      - rustfs_secret_key
secrets:
  rustfs_access_key:
    file: ./secrets/access_key.txt
  rustfs_secret_key:
    file: ./secrets/secret_key.txt
```

## Rotating the Root Credentials

All nodes of a cluster must run with the **same** root credential pair — internode RPC authentication is derived from it unless `RUSTFS_RPC_SECRET` is set explicitly.

:::note
The step-by-step procedure below is standard operational practice composed from verified building blocks (env/file configuration plus the verified rolling-restart readiness signals); RustFS does not currently document an online root-credential rotation API.
:::

1. If you have not already, set an explicit `RUSTFS_RPC_SECRET` (same value on all nodes) **before** the rotation. This decouples internode auth from the credential pair, so the cluster tolerates nodes temporarily running with mixed old/new root credentials during the rolling restart.
2. Update the environment file / secret on **every** node with the new `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (or the files behind the `_FILE` variants).
3. Restart nodes **one at a time**, waiting for each to return `200` from `GET /health/ready` on port 9000 before restarting the next.
4. Update every client, SDK configuration, and automation that used the old pair.
5. Verify: sign a request with the old credentials and confirm it is rejected.

## RUSTFS_RPC_SECRET (Internode RPC Auth)

Nodes of a distributed cluster authenticate their internal RPC traffic with a shared secret:

- If `RUSTFS_RPC_SECRET` is set, that value is used directly. Set the **same value on every node**.
- If it is unset, the secret is **derived** (HMAC) from the active access/secret key pair — which is why all nodes must share the same root credentials.
- Derivation **fails closed** when the secret key is the default `rustfsadmin`: a publicly known secret would yield a publicly computable RPC secret that any network peer could use to forge internode signatures. In that configuration internode RPC cannot authenticate until you either set `RUSTFS_RPC_SECRET` or configure a non-default `RUSTFS_SECRET_KEY`.

When to set it explicitly:

- multi-node clusters that (temporarily or otherwise) run with default root credentials;
- before rotating root credentials, to keep internode auth stable during the rollout;
- environments where you want internode auth independent of the S3 root credential lifecycle.

```bash
# Same value on every node
RUSTFS_RPC_SECRET=<your-rpc-secret>
```

## Compatibility Aliases

For drop-in migration, RustFS accepts credential variables under legacy and MinIO-compatible names when the canonical `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` are not set:

| Accepted alias | Canonical variable |
| --- | --- |
| `RUSTFS_ROOT_USER` (legacy) | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` (legacy) | `RUSTFS_SECRET_KEY` |
| `MINIO_ROOT_USER` | `RUSTFS_ROOT_USER` → `RUSTFS_ACCESS_KEY` |
| `MINIO_ROOT_PASSWORD` | `RUSTFS_ROOT_PASSWORD` → `RUSTFS_SECRET_KEY` |

The `MINIO_` prefix mapping covers a broader allowlist of variables (address, console address, audit webhook settings, and more), applied at startup as "external-prefix compatibility mappings".

:::note
Aliases are deprecated. When one is used, the server logs a one-time warning of the form `Environment variable MINIO_ROOT_USER is deprecated, use RUSTFS_ROOT_USER instead`. Use the `RUSTFS_`-prefixed canonical names in new deployments; the canonical name always wins when both are set.
:::

## Beyond the Root Credential

Day-to-day access should not use the root pair. Create scoped users, groups, policies, and service accounts through the console on port 9001 or the IAM admin APIs, and reserve the root credential for administrative operations. See the IAM documentation in the administration section.
