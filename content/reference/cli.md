---
title: "CLI Reference"
description: "Reference for the rustfs command-line interface, including the server, info, and tls subcommands, key flags with environment variable equivalents, and volume path syntax."
---

The `rustfs` binary ships three subcommands. Running `rustfs` with no subcommand starts the server.

## Subcommands

| Command | Description |
| --- | --- |
| `rustfs server [OPTIONS] <VOLUMES>...` | Start the object storage server (default when no subcommand is given). |
| `rustfs info [--all] [--json] [system\|runtime\|build\|config\|deps]` | Display system, runtime, build, configuration, or dependency information. |
| `rustfs tls inspect --path <DIR>` | Inspect a TLS certificate directory layout and parsing status. |

```bash title="Examples"
rustfs server /data/rustfs
rustfs info --all --json
rustfs tls inspect --path /etc/rustfs/tls
```

### Legacy invocation compatibility

Arguments are preprocessed for backward compatibility, so older invocation styles keep working:

| Legacy form | Interpreted as |
| --- | --- |
| `rustfs /data` | `rustfs server /data` |
| `rustfs --address :9000 /data` | `rustfs server --address :9000 /data` |
| `rustfs` (no arguments) | `rustfs server` with volumes read from `RUSTFS_VOLUMES` |
| `rustfs --info` | `rustfs info` |
| `rustfs help` | `rustfs --help` |

## Server flags

Every server flag has an environment variable equivalent; the flag wins when both are set.

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `<VOLUMES>...` (positional) | `RUSTFS_VOLUMES` | required | Storage volumes or endpoints, space-separated. |
| `--address` | `RUSTFS_ADDRESS` | `:9000` | S3 API bind address (`ADDRESS:PORT`, IP or hostname). |
| `--server-domains` | `RUSTFS_SERVER_DOMAINS` | unset | Comma-separated domains for virtual-hosted-style requests. |
| `--access-key` | `RUSTFS_ACCESS_KEY` | unset | Root access key (conflicts with `--access-key-file`). |
| `--access-key-file` | `RUSTFS_ACCESS_KEY_FILE` | unset | File containing the root access key. |
| `--secret-key` | `RUSTFS_SECRET_KEY` | unset | Root secret key (conflicts with `--secret-key-file`). |
| `--secret-key-file` | `RUSTFS_SECRET_KEY_FILE` | unset | File containing the root secret key. |
| `--console-enable` | `RUSTFS_CONSOLE_ENABLE` | `true` | Enable the embedded web console. |
| `--console-address` | `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Console bind address. |
| `--obs-endpoint` | `RUSTFS_OBS_ENDPOINT` | empty | OTLP/HTTP base URL for traces, metrics, and logs. |
| `--tls-path` | `RUSTFS_TLS_PATH` | unset | TLS certificate directory for the API and console. |
| `--license` | `RUSTFS_LICENSE` | unset | License string. |
| `--region` | `RUSTFS_REGION` | unset | Service region reported to clients. |
| `--kms-enable` | `RUSTFS_KMS_ENABLE` | `false` | Enable KMS server-side encryption. |
| `--kms-backend` | `RUSTFS_KMS_BACKEND` | `local` | KMS backend: `local`, `vault` / `vault-kv2`, `vault-transit`. |
| `--kms-key-dir` | `RUSTFS_KMS_KEY_DIR` | unset | Key directory for the local KMS backend. |
| `--kms-local-master-key` | `RUSTFS_KMS_LOCAL_MASTER_KEY` | unset | Master key for local KMS key-file encryption. |
| `--kms-vault-address` | `RUSTFS_KMS_VAULT_ADDRESS` | unset | Vault address for the Vault backends. |
| `--kms-vault-token` | `RUSTFS_KMS_VAULT_TOKEN` | unset | Vault token for the Vault backends. |
| `--kms-vault-mount-path` | `RUSTFS_KMS_VAULT_MOUNT_PATH` | unset | Vault mount path. |
| `--kms-default-key-id` | `RUSTFS_KMS_DEFAULT_KEY_ID` | unset | Default KMS key ID for encryption. |
| `--kms-allow-insecure-dev-defaults` | `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Allow development-only insecure KMS defaults. |
| `--buffer-profile` | `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Workload profile for adaptive buffer sizing. |
| `--buffer-profile-disable` | `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Use legacy fixed-size buffers. |

:::note
If neither `--access-key`/`--secret-key` nor their file variants are provided, the server falls back to the built-in default credentials (`rustfsadmin`/`rustfsadmin`) and logs a warning. Set real credentials for any non-throwaway deployment.
:::

## Volume syntax

Volumes are passed as positional arguments (or via `RUSTFS_VOLUMES`) and are space-separated.

### Ellipses expansion

A volume token may contain one or more `{N...M}` ranges, which expand numerically:

```bash title="Ellipses expansion"
# Expands to /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
rustfs server /data/rustfs{0...3}

# Multi-node: expands across hosts and disks
rustfs server http://node{1...4}:9000/data/rustfs{0...3}
```

Rules verified from the parser:

- The range format is `{N...M}` where `N` and `M` are decimal or hexadecimal positive integers and `M` must be greater than `N`.
- A single token may carry multiple ranges (e.g. host range plus disk range); all combinations are expanded.
- The maximum expanded size of one range is 10,000 entries.

### Multiple pools

Separate server pools are expressed as space-separated groups of endpoints. Each argument (one per space) forms its own expansion group:

```bash title="Two pools"
rustfs server http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...3}
```

When set through the environment, the same string goes into `RUSTFS_VOLUMES`:

```bash title="Via environment"
export RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
rustfs server
```
