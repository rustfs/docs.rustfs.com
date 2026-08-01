---
title: "WebDAV"
description: "Configure the RustFS WebDAV gateway and access buckets and objects with WebDAV clients."
---

RustFS includes a Web Distributed Authoring and Versioning (WebDAV) gateway that exposes buckets and objects to WebDAV clients over HTTP or HTTPS. You can browse buckets, create collections, and upload, download, rename, or delete objects while RustFS enforces the permissions of the authenticated Identity and Access Management (IAM) user.

WebDAV support is compiled into the standard RustFS binary, but the gateway is disabled at runtime by default. You must enable and configure it before connecting a client.

## Overview

The gateway maps WebDAV paths to RustFS resources:

| WebDAV path | RustFS resource |
| --- | --- |
| `/` | All buckets visible to the authenticated user |
| `/my-bucket/` | The `my-bucket` bucket |
| `/my-bucket/hello.txt` | The `hello.txt` object in `my-bucket` |
| `/my-bucket/docs/hello.txt` | The `docs/hello.txt` object in `my-bucket` |

RustFS supports the following operations through the gateway:

| Method | Operation |
| --- | --- |
| `PROPFIND` | List buckets or objects and read metadata |
| `MKCOL` | Create a bucket or a directory prefix |
| `PUT` | Upload an object |
| `GET` | Download an object |
| `HEAD` | Read object metadata |
| `MOVE` | Rename or move an object or directory |
| `DELETE` | Delete an object, directory, or bucket |

Use `PROPFIND`, not `GET`, to list a collection. The current gateway returns `405 Method Not Allowed` for `GET` requests to directories.

WebDAV uses HTTP Basic authentication. Enter a RustFS access key as the username and its secret key as the password. The gateway authenticates the credentials against RustFS IAM and applies the user's S3 policies to each operation.

:::warning[Protect credentials]

Basic authentication does not encrypt credentials. Disable TLS only for isolated local testing. Use HTTPS for every remote or production connection.

:::

## Configuration

Configure the gateway with environment variables before starting RustFS:

| Variable | Description | Default |
| --- | --- | --- |
| `RUSTFS_WEBDAV_ENABLE` | Enables the WebDAV gateway. | `false` |
| `RUSTFS_WEBDAV_ADDRESS` | Bind address for WebDAV connections. | `0.0.0.0:8080` |
| `RUSTFS_WEBDAV_TLS_ENABLED` | Enables TLS for the WebDAV listener. | `true` |
| `RUSTFS_WEBDAV_CERTS_DIR` | Certificate directory used by the RustFS TLS runtime. Required when TLS is enabled. | Not set |
| `RUSTFS_WEBDAV_MAX_BODY_SIZE` | Maximum request body size in bytes. Must be greater than zero. | `5368709120` (5 GiB) |

The standard RustFS build enables the WebDAV compile-time feature. If you build RustFS with `--no-default-features`, include the feature explicitly:

```bash
cargo build --release --features webdav
```

### Local testing without TLS

The following example starts RustFS with an HTTP WebDAV listener on port `8080`:

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=127.0.0.1:8080
export RUSTFS_WEBDAV_TLS_ENABLED=false
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Binding to `127.0.0.1` prevents other hosts from connecting to the unencrypted test endpoint.

### HTTPS

For a remote or production connection, enable TLS and provide a certificate directory:

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=0.0.0.0:8080
export RUSTFS_WEBDAV_TLS_ENABLED=true
export RUSTFS_WEBDAV_CERTS_DIR=/path/to/certs

rustfs /path/to/data
```

If TLS is enabled without `RUSTFS_WEBDAV_CERTS_DIR`, or the directory does not exist, WebDAV initialization fails. See [Configure TLS](/integration/tls-configured) for certificate preparation guidance.

Allow inbound TCP traffic to the configured WebDAV port. This listener is separate from the S3 API and Console listeners.

## Usage

The following commands use an HTTP endpoint for local testing. Replace the endpoint and credentials with your HTTPS WebDAV endpoint and an IAM user that has the required bucket and object permissions.

Set reusable shell variables without placing the secret directly in each command:

```bash
export WEBDAV_URL=http://127.0.0.1:8080
export WEBDAV_USER=<your-access-key>
read -s WEBDAV_PASSWORD
export WEBDAV_PASSWORD
```

### List buckets

Send `PROPFIND` with `Depth: 1` to list the buckets visible to the user:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/"
```

### Create a bucket

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/"
```

Bucket names must follow the same naming rules as buckets created through the S3 API.

### Upload and download an object

Upload `/path/to/hello.txt`:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--upload-file /path/to/hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

Download the object:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--output hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

### Create and list a directory

WebDAV directories below a bucket map to object key prefixes:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/docs/"

curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/my-bucket/docs/"
```

### Rename an object

Use `MOVE` with a destination path on the same WebDAV endpoint:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MOVE \
	--header "Destination: $WEBDAV_URL/my-bucket/greeting.txt" \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

The IAM user needs permission to read and delete the source and to write the destination. If authorization fails, RustFS leaves the source unchanged.

### Delete an object or bucket

Delete an object:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/greeting.txt"
```

Delete the bucket after removing its contents:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/"
```

### Connect a desktop client

Use the WebDAV endpoint in a client that supports Basic authentication:

| Client | Connection address |
| --- | --- |
| GNOME Files | `dav://<host>:8080/` for HTTP or `davs://<host>:8080/` for HTTPS |
| macOS Finder | `http://<host>:8080/` or `https://<host>:8080/` |
| Windows File Explorer | `https://<host>:8080/` |

Enter the RustFS access key and secret key when the client prompts for credentials. Client behavior and supported WebDAV methods vary; use `curl` to isolate server-side errors when troubleshooting.

## Next steps

- [Manage credentials](/operations/credentials)
- [Configure TLS](/integration/tls-configured)
- [Check service status](/operations/status-check)