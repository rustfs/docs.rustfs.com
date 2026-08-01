---
title: "SSE-KMS"
description: "Configure SSE-KMS with a local or HashiCorp Vault KMS backend for RustFS."
---

RustFS Key Management Service (KMS) generates and wraps per-object data encryption keys for [SSE-S3](./sse-s.md) and SSE-KMS. This guide configures SSE-KMS at server startup with a local key store, Vault KV v2 plus Transit, or Vault Transit.

## Requirements

- Install and configure [`rc`](/operations/rc) for the encryption verification workflow.
- Back up all existing data and KMS key material before changing encryption configuration.
- Apply the same KMS backend and default key ID to every RustFS node.
- Use a process manager or secret manager that injects secrets without committing them to source control.
- For Vault, enable the required secrets engines, create a least-privilege token, and make Vault reachable from every RustFS node.
- Provision a KMS master key before configuring its ID as the RustFS default key.

:::warning[Key loss makes encrypted objects unreadable]

RustFS does not store a recoverable copy of your KMS master key outside the configured backend. Back up local key files and their master key, or protect Vault data and recovery credentials, before writing encrypted objects.

:::

## Choose a backend

| Backend | `RUSTFS_KMS_BACKEND` | Key storage and wrapping | Intended use |
| --- | --- | --- | --- |
| Local | `local` | Key files on the RustFS host | Development, testing, or a carefully backed-up single-host deployment |
| Vault KV2 | `vault` or `vault-kv2` | Metadata in Vault KV v2; wrapping through Vault Transit | Centralized production key management |
| Vault Transit | `vault-transit` | Cryptographic operations through Vault Transit | Centralized production key management without the KV2 backend mode |

SSE-S3 and SSE-KMS both require the KMS service to be running. Configuring a bucket default alone does not make encrypted writes succeed when KMS is unavailable.

## Configure the local backend

Create an absolute key directory owned by the RustFS service account:

```bash
sudo install -d -m 0700 -o rustfs -g rustfs /var/lib/rustfs/kms
```

Add the KMS settings to the RustFS environment file on every node:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=local
RUSTFS_KMS_KEY_DIR=/var/lib/rustfs/kms
RUSTFS_KMS_LOCAL_MASTER_KEY=<your-kms-master-key>
```

`RUSTFS_KMS_KEY_DIR` is required by the RustFS server startup path. The local backend writes key files with owner-only permissions. RustFS rejects development defaults such as a temporary key directory or missing local master key unless you explicitly set `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true`; never enable that override in production.

Restart RustFS after updating the environment. This starts the KMS backend but does not create a master key:

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager
```

## Configure Vault KV2

Enable a KV v2 engine for key metadata and a Transit engine for key wrapping. Then configure every RustFS node:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-kv2
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

The server startup interface uses `secret` as the KV mount and `rustfs/kms/keys` as the key prefix. Use a Vault token that can read and write that KV path and perform the required Transit operations.

RustFS validates the Vault URL and rejects insecure development defaults unless `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true` is set. Use HTTPS and a certificate trusted by the RustFS hosts in production.

## Configure Vault Transit

Enable the Transit engine and configure every RustFS node:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-transit
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

Vault Transit retains historical key versions, so rotating a Transit key does not by itself make objects wrapped with an older version unreadable. Keep old versions enabled for as long as objects depend on them.

## Create and select the default key

`RUSTFS_KMS_DEFAULT_KEY_ID` selects an existing key; it does not create one. Start the KMS backend without this variable, create the key, and only then add the variable and restart RustFS.

When your installed `rc` exposes the KMS lifecycle commands, create and inspect a key with:

```bash
rc admin kms status rustfs
rc admin kms key create rustfs --name rustfs-default-key
rc admin kms key status rustfs rustfs-default-key
```

Then add the same default key ID on every RustFS node:

```ini title="/etc/default/rustfs"
RUSTFS_KMS_DEFAULT_KEY_ID=rustfs-default-key
```

Restart every node consistently after changing the default.

For Vault Transit, you can alternatively create the named Transit key directly in Vault before configuring it as the default:

```bash
vault write -f transit/keys/rustfs-default-key
```

:::note[rc version boundary]

The tested `rc 0.1.29` on the validation host does not expose `rc admin kms`; it supports only the bucket and object encryption commands used below. Run `rc admin --help` before following the key lifecycle commands. If the KMS command family is absent, use a newer `rc` release that includes it or provision the key through the native RustFS KMS Admin API.

:::

## Verify KMS-backed encryption

Create a test bucket, configure SSE-KMS with the default key, upload an object, and read it back:

```bash
rc bucket create rustfs/my-bucket
rc bucket encryption set rustfs/my-bucket --mode sse-kms
rc bucket encryption info rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

To select a specific KMS key, set it on the bucket default or the individual write:

```bash
rc bucket encryption set rustfs/my-bucket \
	--mode sse-kms \
	--key-id rustfs-default-key

rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-kms rustfs/my-bucket/hello.txt=rustfs-default-key
```

The selector before `=` must exactly match the destination passed to `rc object copy`.

## Rotate and recover keys

- **Vault token:** issue a replacement token, update every RustFS node, restart consistently, verify encrypted reads and writes, and then revoke the old token.
- **Vault Transit key:** rotate the Transit key in Vault. New wrapping operations use the new version while Vault retains older versions for decryption.
- **Local or Vault KV2 key material:** back up the current material before rotation and verify that objects written before and after rotation remain readable.
- **Existing objects:** rotating a master key does not rewrite object data. Each object keeps the wrapped data key stored with its encryption metadata.

Do not delete or disable an old master-key version until you have established that no retained object depends on it.

## Next steps

Configure [SSE-S3](./sse-s.md), or use [SSE-C](./sse-c.md) when the client must retain control of the encryption key.