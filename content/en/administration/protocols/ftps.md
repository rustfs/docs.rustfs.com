---
title: "FTP(S)"
description: "Configure the RustFS FTP or FTPS gateway and manage buckets and objects with FTP clients."
---

RustFS includes an FTP gateway that exposes buckets and objects to standard FTP clients. You can run it as unencrypted FTP for isolated local testing or as explicit FTP over TLS (FTPS) for encrypted connections. RustFS authenticates each session against Identity and Access Management (IAM) and applies the user's S3 policies to storage operations.

FTP and FTPS support is compiled into the standard RustFS binary, but both listeners are disabled at runtime by default. Enable only the listener you intend to use.

## Overview

The gateway maps FTP paths to RustFS resources:

| FTP path | RustFS resource |
| --- | --- |
| `/` | All buckets visible to the authenticated user |
| `/my-bucket/` | The `my-bucket` bucket |
| `/my-bucket/hello.txt` | The `hello.txt` object in `my-bucket` |

The following FTP operations are supported:

| FTP command | Operation |
| --- | --- |
| `LIST` | List buckets at the root or objects and prefixes in a bucket |
| `MKD` | Create a bucket |
| `CWD` | Enter a bucket |
| `STOR` | Upload an object |
| `RETR` | Download an object |
| `DELE` | Delete an object |
| `RMD` | Recursively delete a bucket and its objects |

RustFS does not currently support FTP rename operations or uploads that append to an existing object. Because S3 storage has no native working-directory or POSIX directory model, some client-specific filesystem operations may not behave like a traditional FTP server.

Enter a RustFS access key as the FTP username and its secret key as the password. Invalid usernames and passwords both return `530 Not logged in`. After login, RustFS checks the IAM user's S3 permissions for each operation.

:::danger[Plain FTP exposes credentials]

FTP sends credentials and data without encryption. Bind plain FTP to a loopback or isolated test network only. Use FTPS for every remote or production connection.

:::

:::warning[Bucket deletion is recursive]

The current `RMD` implementation deletes the objects in the target bucket before deleting the bucket. Confirm the path before running `rmdir` in an FTP client.

:::

## Configuration

FTP and FTPS use separate listeners and environment variables.

### FTP variables

| Variable | Description | Default |
| --- | --- | --- |
| `RUSTFS_FTP_ENABLE` | Enables the unencrypted FTP listener. | `false` |
| `RUSTFS_FTP_ADDRESS` | Bind address for FTP control connections. | `0.0.0.0:8021` |
| `RUSTFS_FTP_PASSIVE_PORTS` | Inclusive passive data port range in `start-end` format. | `40000-50000` |
| `RUSTFS_FTP_EXTERNAL_IP` | Public IP or hostname advertised to passive clients when RustFS is behind NAT. | Not set |

### FTPS variables

| Variable | Description | Default |
| --- | --- | --- |
| `RUSTFS_FTPS_ENABLE` | Enables the explicit FTPS listener. | `false` |
| `RUSTFS_FTPS_ADDRESS` | Bind address for FTPS control connections. | `0.0.0.0:8022` |
| `RUSTFS_FTPS_TLS_ENABLED` | Enables TLS on the FTPS listener. Keep this enabled for FTPS. | `true` |
| `RUSTFS_FTPS_CERTS_DIR` | Directory containing the FTPS certificate and private key. Required for FTPS. | Not set |
| `RUSTFS_FTPS_PASSIVE_PORTS` | Inclusive passive data port range in `start-end` format. | `40000-50000` |
| `RUSTFS_FTPS_EXTERNAL_IP` | Public IP or hostname advertised to passive clients when RustFS is behind NAT. | Not set |

The standard RustFS build enables the `ftps` compile-time feature, which provides both FTP and FTPS. If you build RustFS with `--no-default-features`, include the feature explicitly:

```bash
cargo build --release --features ftps
```

### Local testing with FTP

Start an unencrypted FTP listener on the loopback interface:

```bash
export RUSTFS_FTP_ENABLE=true
export RUSTFS_FTP_ADDRESS=127.0.0.1:8021
export RUSTFS_FTP_PASSIVE_PORTS=40000-40010
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Binding to `127.0.0.1` prevents remote hosts from connecting to the unencrypted listener.

### Prepare a test certificate

FTPS expects `rustfs_cert.pem` and `rustfs_key.pem` in the certificate directory. For local testing, create a short-lived self-signed certificate:

```bash
mkdir -p /path/to/ftps-certs

openssl req -x509 -newkey rsa:2048 -nodes \
	-keyout /path/to/ftps-certs/rustfs_key.pem \
	-out /path/to/ftps-certs/rustfs_cert.pem \
	-days 7 \
	-subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Use a certificate issued by a trusted certificate authority in production. Protect `rustfs_key.pem` from unauthorized access and ensure the certificate subject alternative names match the host clients use.

### Start FTPS

Configure an explicit FTPS listener:

```bash
export RUSTFS_FTPS_ENABLE=true
export RUSTFS_FTPS_ADDRESS=0.0.0.0:8022
export RUSTFS_FTPS_TLS_ENABLED=true
export RUSTFS_FTPS_CERTS_DIR=/path/to/ftps-certs
export RUSTFS_FTPS_PASSIVE_PORTS=40000-50000

rustfs /path/to/data
```

RustFS requires TLS on both the FTPS control and data channels. Configure clients for **explicit FTP over TLS**, sometimes labeled **FTPES** or **Require explicit FTP over TLS**. Implicit FTPS is not the mode implemented by this listener.

If the certificate directory is missing, does not exist, or does not contain a usable certificate and key, FTPS initialization fails. See [Configure TLS](/integration/tls-configured) for general certificate guidance.

### Configure passive connections

FTP uses the control port for commands and a separate data connection for listings and file transfers. For passive mode:

1. Allow inbound TCP traffic to the configured control port.
2. Allow inbound TCP traffic to every port in the configured passive range.
3. Set `RUSTFS_FTP_EXTERNAL_IP` or `RUSTFS_FTPS_EXTERNAL_IP` when clients connect through NAT or a load balancer.

For example, an FTPS server behind NAT can advertise its public hostname:

```bash
export RUSTFS_FTPS_EXTERNAL_IP=storage.example.com
export RUSTFS_FTPS_PASSIVE_PORTS=40000-40100
```

Use the corresponding FTP-prefixed variables for the plain FTP listener. RustFS supports both active and passive transfer modes, but passive mode is generally easier to operate through client firewalls.

## Usage

The examples use [`lftp`](https://lftp.yar.ru/) and the canonical `my-bucket` and `hello.txt` names. The IAM user must have the S3 permissions required for each operation.

### Connect with FTP

Use plain FTP only with the loopback test listener:

```bash
lftp -u <your-access-key> ftp://127.0.0.1:8021
```

Enter the secret key when `lftp` prompts for a password.

### Connect with FTPS

Connect to the explicit FTPS listener and require encryption for control and data connections:

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	open ftp://storage.example.com:8022
'
```

Enter the secret key when prompted. Keep certificate verification enabled in production.

For the self-signed local test certificate only, connect to `localhost` and disable certificate verification for that session:

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	set ssl:verify-certificate no;
	open ftp://localhost:8022
'
```

:::warning

Do not disable certificate verification in production. Install the issuing CA in the client trust store instead.

:::

### List buckets and create a bucket

At the `lftp` prompt, list the visible buckets and create `my-bucket`:

```text
lftp> cls -1 /
lftp> mkdir my-bucket
lftp> cd my-bucket
```

Bucket names must follow the same naming rules as buckets created through the S3 API.

### Upload and download an object

Upload `/path/to/hello.txt`, list the bucket, and download the object:

```text
lftp> put /path/to/hello.txt -o hello.txt
lftp> ls
lftp> get hello.txt -o hello.txt
```

The upload replaces an object with the same key. Appending to an existing object is not supported.

### Delete an object and bucket

Delete the object, return to the root, and delete the bucket:

```text
lftp> rm hello.txt
lftp> cd /
lftp> rmdir my-bucket
```

Remember that `rmdir` recursively removes remaining objects from the bucket before deleting it.

### Connect other clients

Use these settings in graphical FTP clients such as FileZilla or Cyberduck:

| Setting | FTP test listener | FTPS listener |
| --- | --- | --- |
| Protocol | FTP | FTP over TLS (explicit) |
| Host | `127.0.0.1` | Your FTPS hostname |
| Port | `8021` | `8022` |
| Username | RustFS access key | RustFS access key |
| Password | RustFS secret key | RustFS secret key |
| Transfer mode | Passive | Passive |

If login succeeds but directory listings or transfers time out, check the passive port firewall rules and external IP setting first.

## Next steps

- [Manage credentials](/operations/credentials)
- [Configure TLS](/integration/tls-configured)
- [Check service status](/operations/status-check)