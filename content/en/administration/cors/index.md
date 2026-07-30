---
title: "CORS Configuration"
description: "Configure allowed browser origins for the RustFS S3 API and Console."
---

Cross-Origin Resource Sharing (CORS) controls which browser origins can access the RustFS S3 API and Console. Configure each listener separately, then restart RustFS to apply the environment changes.

## S3 API origins

Set `RUSTFS_CORS_ALLOWED_ORIGINS` to a comma-separated list of trusted origins:

```ini title="/etc/default/rustfs"
RUSTFS_CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

When this variable is unset or empty, the S3 endpoint does not add generic CORS response headers. A list of explicit origins allows credentialed browser requests from matching origins.

You can set the value to `*` to allow requests from any origin. Wildcard mode does not allow browser credentials.

:::warning[Use explicit origins in production]

Use a comma-separated allowlist for applications that send credentials. Reserve `*` for public resources that do not require credentialed browser requests.

:::

## Console origins

The Console uses a separate variable:

```ini title="/etc/default/rustfs"
RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS="https://admin.example.com"
```

Use a comma-separated list when more than one browser origin must access the Console. Set `*` only when any origin must be allowed.

## Verify the response

Send a request with an `Origin` header and inspect the CORS response headers:

```bash
curl -i \
  -H "Origin: https://app.example.com" \
  http://localhost:9000/
```

Confirm that `Access-Control-Allow-Origin` contains the expected origin. Repeat the check with an unlisted origin and confirm that it is not allowed.

## Next steps

See the [environment variable reference](/reference/environment-variables#cors) for the verified defaults and configuration formats.