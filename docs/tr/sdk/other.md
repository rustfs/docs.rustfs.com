---
title: "Other SDKs"
description: "This document primarily explains the usage of various language SDKs in RustFS."
---

# Other SDKs

If AWS S3 officially doesn't support the language you're using, you can adopt the following strategies to integrate with RustFS:

## 1. Direct HTTP Interface Requests (Based on S3 API Protocol)

The S3 protocol is a standard RESTful API. You can encapsulate access logic yourself using any language that supports HTTP requests (such as C, Rust, Lua, Erlang).

### Key points include

* **Signature Algorithm**: Implement AWS Signature Version 4 signing (complex)
* **Construct Correct Headers and Canonical Requests**
* **Use HTTPS/HTTP clients to send requests**

👉 Recommend referring to signature implementations from open source projects, for example:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Call CLI Tools or Intermediate Services from Existing SDKs

If you don't want to implement signing yourself, you can:

### 2.1. Use AWS CLI tools supported by existing languages

For example, call through Shell:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Or write a simple relay service using Node.js/Python SDK, and your language calls this service for upload/download.

### 2.2. Set up a Proxy (e.g., Flask, FastAPI, Express)

Let clients that don't support S3 call your wrapped HTTP API:

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URLs for frontend/client use
```

---

## 3. Look for Third-Party Community SDKs

Although AWS doesn't have official SDKs, some language communities have developed unofficial S3 clients. For example:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (deprecated) or `aws-sdk-rust`
* OCaml: Possibly implement through `cohttp`
* Delphi: Commercial libraries supporting S3 protocol

Community SDK stability varies greatly; evaluate activity, documentation, and compatibility before use.

---

## 4. Delegate Core Upload Logic to Platform Hosting

For example:

* Delegate frontend (Web/Mobile) upload tasks to browser or app execution (using presigned URLs)
* Backend uses Node.js/Python/Go proxy to implement upload logic

---

## Summary Recommendations

| Scenario | Recommended Solution |
| ------------- | ---------------------------------- |
| Need full control/embedded environment | Implement Signature V4 self-signing |
| Weak language support but has Shell | Call uploads through AWS CLI |
| Can deploy relay service | Build S3 API gateway using Python/Node |
| Frontend uploads | Use presigned URLs |
