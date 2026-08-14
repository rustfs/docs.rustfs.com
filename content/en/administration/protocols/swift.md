---
title: "OpenStack Swift"
description: "Build RustFS with the optional Swift API and connect it to OpenStack Keystone authentication."
---

RustFS can expose an OpenStack Swift-compatible API on the same HTTP endpoint as its S3 API. Use this guide to build the optional `swift` feature, configure Keystone token validation, and verify basic account, container, and object operations.

:::warning[Compatibility scope]

Swift support is optional and does not cover every OpenStack Swift behavior. Account `HEAD` requests and non-JSON listing formats are not implemented. Validate your client workflow before using the API in production.

:::

## How Swift maps to RustFS

Swift requests use `/v1/AUTH_<project-id>/...` on the RustFS S3 API endpoint:

| Swift resource | Request path | RustFS mapping |
| --- | --- | --- |
| Account | `/v1/AUTH_<project-id>` | The authenticated Keystone project |
| Container | `/v1/AUTH_<project-id>/<container>` | A project-isolated RustFS bucket |
| Object | `/v1/AUTH_<project-id>/<container>/<object>` | An object in the mapped bucket |

The project ID in the URL must match the project ID in the validated Keystone token. RustFS accepts the token in either `X-Auth-Token` or `X-Storage-Token`.

The confirmed core operations are:

| Scope | Operations |
| --- | --- |
| Account | List containers, update account metadata |
| Container | Create, list, inspect, update metadata, delete |
| Object | Upload, download, range download, inspect, update metadata, copy, delete |

## Build with Swift support

The default RustFS feature set does not include Swift. Build it explicitly from the `rustfs/rustfs` repository:

```bash
cargo build --release --features swift
```

The resulting binary serves Swift paths on the configured S3 API address. There is no separate Swift listener or Swift-specific port.

## Configure Keystone

Enable Keystone and set its authentication endpoint before starting RustFS:

```bash
export RUSTFS_KEYSTONE_ENABLE=true
export RUSTFS_KEYSTONE_AUTH_URL=https://keystone.example.com
export RUSTFS_KEYSTONE_VERSION=v3
export RUSTFS_KEYSTONE_VERIFY_SSL=true
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `RUSTFS_KEYSTONE_ENABLE` | Enables Keystone token validation. | `false` |
| `RUSTFS_KEYSTONE_AUTH_URL` | Sets the Keystone authentication endpoint. Required when Keystone is enabled. | Not set |
| `RUSTFS_KEYSTONE_VERSION` | Selects the Keystone API version. | `v3` |
| `RUSTFS_KEYSTONE_VERIFY_SSL` | Verifies the Keystone TLS certificate. | `true` |
| `RUSTFS_KEYSTONE_CACHE_SIZE` | Sets the maximum token-cache entry count. | `10000` |
| `RUSTFS_KEYSTONE_CACHE_TTL` | Sets the token-cache lifetime in seconds. | `300` |
| `RUSTFS_KEYSTONE_TIMEOUT` | Sets the Keystone request timeout in seconds. | `30` |

We recommend keeping TLS verification enabled. RustFS returns `401 Unauthorized` when Keystone rejects a supplied token; it does not fall back to local credentials for that request.

## Verify the API

Obtain a scoped token and project ID from Keystone, then set these shell variables:

```bash
export SWIFT_TOKEN='<your-keystone-token>'
export SWIFT_ACCOUNT='AUTH_<your-project-id>'
export SWIFT_URL="http://localhost:9000/v1/${SWIFT_ACCOUNT}"
```

List the containers visible to the project:

```bash
curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}"
```

Create `my-bucket`, upload `hello.txt`, and download it:

```bash
curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket"

curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	--upload-file /path/to/hello.txt \
	"${SWIFT_URL}/my-bucket/hello.txt"

curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket/hello.txt"
```

A request to an `AUTH_<project-id>` account that does not match the token project returns `403 Forbidden`.

## Next steps

- [Review the S3 compatibility matrix](/en/reference/s3-compatibility)
- [Manage RustFS credentials](/en/operations/credentials)
- [Configure TLS for RustFS](/en/integration/tls-configured)
