---
title: "SFTP"
description: "Build, configure, and use the RustFS SFTP gateway to access buckets and objects with SFTP clients."
---

RustFS includes an SSH File Transfer Protocol (SFTP) gateway that exposes buckets and objects to SFTP clients over an encrypted SSH connection. You can list and create buckets and upload, download, rename, or delete objects while RustFS enforces the permissions of the authenticated Identity and Access Management (IAM) user.

SFTP is an optional compile-time feature and is not included in the default RustFS build. Build RustFS with the `sftp` or `full` feature before enabling the listener. The listener is disabled at runtime by default.

## Overview

The gateway maps SFTP paths to RustFS resources:

| SFTP path | RustFS resource |
| --- | --- |
| `/` | All buckets visible to the authenticated user |
| `/my-bucket/` | The `my-bucket` bucket |
| `/my-bucket/hello.txt` | The `hello.txt` object in `my-bucket` |
| `/my-bucket/docs/hello.txt` | The `docs/hello.txt` object in `my-bucket` |

Creating or removing a directory directly below `/` creates or removes a bucket. Directories below a bucket map to object key prefixes and do not exist as independent filesystem directories.

RustFS supports the following operations through the SFTP gateway:

| SFTP operation | RustFS operation |
| --- | --- |
| List `/` | List visible buckets |
| List a bucket or prefix | List objects and prefixes |
| `mkdir` at `/` | Create a bucket |
| `put` | Upload an object |
| `get` | Download an object |
| `rename` | Copy an object and then delete the source |
| `rm` | Delete an object |
| `rmdir` at `/` | Delete an empty bucket |

Enter a RustFS access key as the SFTP username and its secret key as the password. RustFS checks the IAM user's S3 policies for every operation.

:::warning[Password authentication only]

The SFTP gateway does not support client public-key authentication or anonymous access. SSH host keys identify the server; they do not authenticate clients. Do not configure an `authorized_keys` file for RustFS SFTP.

:::

## Configuration

### Build with SFTP support

Build RustFS with the SFTP feature:

```bash
cargo build --release --features sftp
```

To enable all optional RustFS features, including SFTP, use `--features full` instead. Setting `RUSTFS_SFTP_ENABLE=true` has no effect in a binary built without the `sftp` feature.

### SFTP variables

| Variable | Description | Default |
| --- | --- | --- |
| `RUSTFS_SFTP_ENABLE` | Enables the SFTP listener. | `false` |
| `RUSTFS_SFTP_ADDRESS` | Bind address for SFTP connections. | `0.0.0.0:2222` |
| `RUSTFS_SFTP_HOST_KEY_DIR` | Directory containing at least one unencrypted SSH private host key. Required when SFTP is enabled. | Not set |
| `RUSTFS_SFTP_READ_ONLY` | Rejects operations that modify buckets or objects. | `false` |
| `RUSTFS_SFTP_IDLE_TIMEOUT` | SSH inactivity timeout in seconds. Must be greater than zero. | `600` |
| `RUSTFS_SFTP_PART_SIZE` | Multipart upload part size in bytes. | `16777216` (16 MiB) |

The default port `2222` avoids the privileged SSH port `22`. The address can use IPv4 or IPv6 syntax, for example `127.0.0.1:2222` or `[::]:2222`.

### Prepare a host key

Create a persistent host-key directory and generate an Ed25519 host key:

```bash
mkdir -p /path/to/sftp-keys
ssh-keygen -t ed25519 \
	-f /path/to/sftp-keys/ssh_host_ed25519_key \
	-N ""
chmod 600 /path/to/sftp-keys/ssh_host_ed25519_key*
```

The host key must not use a passphrase. RustFS also accepts decodable ECDSA and RSA private host keys.

On Unix, every regular file in the host-key directory must be accessible only by its owner. The `ssh-keygen` command also creates a `.pub` file; either keep it with owner-only permissions as shown or remove it because RustFS does not read it. RustFS refuses to start if the directory is missing, contains no usable private key, or contains a regular file with group or other permission bits set.

:::warning[Protect the host key]

Keep the same host key across restarts so clients can verify the server identity. Restrict access to the account that runs RustFS and back up the key securely. A changed host key causes clients to display a possible man-in-the-middle warning.

:::

### Start the SFTP listener

The following example starts SFTP on the loopback interface for local testing:

```bash
export RUSTFS_SFTP_ENABLE=true
export RUSTFS_SFTP_ADDRESS=127.0.0.1:2222
export RUSTFS_SFTP_HOST_KEY_DIR=/path/to/sftp-keys
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

For remote connections, bind to an appropriate network interface and allow inbound TCP traffic to the configured SFTP port. This listener is separate from the S3 API and Console listeners.

## Usage

The following examples use the OpenSSH `sftp` client, the canonical `my-bucket` and `hello.txt` names, and a local listener on port `2222`.

### Connect

```bash
sftp -P 2222 <your-access-key>@127.0.0.1
```

Enter the RustFS secret key when prompted for the password. On the first connection, verify the displayed host-key fingerprint before accepting it.

### List and create buckets

At the `sftp` prompt, list the buckets visible to the IAM user and create `my-bucket`:

```text
sftp> ls /
sftp> mkdir /my-bucket
sftp> cd /my-bucket
```

Bucket names must follow the same naming rules as buckets created through the S3 API. Files cannot be created directly under `/`.

### Upload and download an object

Upload `/path/to/hello.txt`, list the bucket, and download the object:

```text
sftp> put /path/to/hello.txt /my-bucket/hello.txt
sftp> ls /my-bucket
sftp> get /my-bucket/hello.txt hello.txt
```

Uploads must be sequential from the beginning of the file. Resume, append, in-place edits, and segmented multi-connection uploads of one object are not supported.

### Rename an object

```text
sftp> rename /my-bucket/hello.txt /my-bucket/greeting.txt
```

RustFS implements rename as a server-side copy followed by deletion of the source. The operation is not atomic, and renaming a bucket is not supported. The IAM user needs permission to read and delete the source and to write the destination.

### Delete an object and bucket

Delete the object and then remove the empty bucket:

```text
sftp> rm /my-bucket/greeting.txt
sftp> rmdir /my-bucket
```

RustFS does not recursively delete a non-empty bucket through SFTP.

### Connect a desktop client

Use these settings in graphical clients such as FileZilla, Cyberduck, or WinSCP:

| Setting | Value |
| --- | --- |
| Protocol | SFTP (SSH File Transfer Protocol) |
| Host | Your RustFS SFTP hostname |
| Port | `2222`, or the port in `RUSTFS_SFTP_ADDRESS` |
| Username | RustFS access key |
| Password | RustFS secret key |
| Authentication | Password |

Configure the client for whole-file, single-connection uploads. Symbolic links and POSIX ownership, permission, or timestamp changes are not supported because the gateway maps SFTP operations to object storage.

## Next steps

- [Manage credentials](/operations/credentials)
- [Check service status](/operations/status-check)
- [Configure lifecycle management](/administration/data/lifecycle-management)