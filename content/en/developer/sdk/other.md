---
title: "Other SDKs"
description: "Learn how to connect to RustFS from languages without an official AWS SDK."
---

If AWS does not provide an official SDK for your language, you can use one of the following approaches to integrate with RustFS:

## 1. Send HTTP requests directly to the S3 API

The S3 protocol is a standard RESTful API. You can implement the client logic yourself in any language that can send HTTP requests (such as C, Rust, Lua, or Erlang).

### Key steps

* **Request signing**: Implement AWS Signature Version 4 (the most complex part).
* **Headers and canonical request**: Build the canonical request and the required headers.
* **HTTP client**: Send the signed request with an HTTP or HTTPS client.

We recommend consulting existing open-source implementations of request signing, such as:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Use the AWS CLI or a service built on an existing SDK

If you don't want to implement signatures yourself, you can:

### 2.1. Call the AWS CLI

For example, run the following command from your application using a shell:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Alternatively, build a small relay service with an SDK for Node.js or Python, then call it from your application to upload or download objects.

### 2.2. Run a proxy service (for example, Flask, FastAPI, or Express)

Expose an HTTP API that clients without S3 support can call:

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. Find Third-Party Community SDKs

For languages without an official AWS SDK, look for community-maintained S3 clients. For example:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (deprecated) or `aws-sdk-rust`
* OCaml: Build your own client on top of `cohttp`
* Delphi: Commercial libraries with S3 support are available

Community SDKs vary greatly in stability, so you should evaluate activity, documentation, and compatibility before use.

---

## 4. Upload directly from clients with presigned URLs

For example:

* Use presigned URLs to upload directly from a browser or mobile app.
* Implement the upload logic in a backend service (for example, Node.js, Python, or Go)

---

## Choose an approach

| Situation | Recommended approach |
| ------------- | ---------------------------------- |
| You need full control, or you target an embedded environment | Implement SigV4 signing yourself |
| Limited SDK support, but a shell is available | Upload with the AWS CLI |
| You can deploy a relay service | Build a small S3 gateway with Python or Node.js |
| Frontend upload | Use presigned URLs |
