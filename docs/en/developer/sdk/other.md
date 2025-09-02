---
title: "Other SDKs"
description: "This article mainly explains the usage of various other language SDKs in RustFS."
---

# Other SDKs

If AWS S3 doesn't officially support your language, you can adopt the following strategies to integrate with RustFS:

## 1. Use HTTP Interface Direct Requests (Based on S3 API Protocol)

The S3 protocol is a standard RESTful API. You can encapsulate access logic yourself using any language that supports HTTP requests (such as C, Rust, Lua, Erlang).

### Key points include:

* **Signature Algorithm**: Implement AWS Signature Version 4 signature (more complex)
* **Construct correct Headers and Canonical Request**
* **Use HTTPS/HTTP client to send requests**

👉 Recommended to reference open-source project signature implementations, for example:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Call CLI Tools or Middleware Services of Existing SDKs

If you don't want to implement signatures yourself, you can:

### 2.1. Use AWS CLI tools with existing language support:

For example, call through Shell:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Or write a simple relay service using Node.js/Python SDK, and your language uploads/downloads by calling this service.

### 2.2. Set up a Proxy (such as Flask, FastAPI, Express)

Let clients that don't support S3 call your encapsulated HTTP API:

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. Find Third-Party Community SDKs

Although AWS doesn't have official SDKs, some language communities have developed unofficial S3 clients. For example:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (deprecated) or `aws-sdk-rust`
* OCaml: May implement through `cohttp` yourself
* Delphi: Has commercial libraries supporting S3 protocol

Community SDKs vary greatly in stability, so you should evaluate activity, documentation, and compatibility before use.

---

## 4. Delegate Core Upload Logic to Platform Hosting

For example:

* Delegate frontend (Web/Mobile) upload tasks to browser or App side execution (using presigned URLs)
* Backend uses Node.js/Python/Go and other proxies to implement upload logic

---

## Summary Recommendations

| Scenario | Recommended Solution |
| ------------- | ---------------------------------- |
| Need complete control/embedded environment | Implement Signature V4 self-signing |
| Weak language support but has Shell | Call upload through AWS CLI |
| Can deploy relay service | Use Python/Node to build S3 API gateway |
| Frontend upload | Use presigned URLs |
