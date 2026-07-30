---
title: "其他 SDK"
description: "介绍如何在 RustFS 中使用其他语言的 SDK。"
---

如果 AWS S3 未正式支持你的编程语言，可以采用以下策略与 RustFS 集成：

## 1. 直接请求 HTTP 接口（基于 S3 API 协议）

S3 协议是一套标准 RESTful API。你可以使用任何支持 HTTP 请求的语言（例如 C、Rust、Lua、Erlang）自行封装访问逻辑。

### 要点包括：

* **签名算法**：实现 AWS Signature Version 4 签名（较复杂）
* **构造正确的标头和规范请求**
* **使用 HTTPS/HTTP 客户端发送请求**

👉 建议参考开源项目的签名实现，例如：

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. 调用现有 SDK 的 CLI 工具或中间件服务

如果不想自行实现签名，可以：

### 2.1. 使用已有语言支持调用 AWS CLI 工具：

例如，通过 Shell 调用：

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

或者使用 Node.js/Python SDK 编写简单的中继服务，让你的语言通过调用该服务上传或下载文件。

### 2.2. 设置代理（例如 Flask、FastAPI、Express）

让不支持 S3 的客户端调用你封装的 HTTP API：

```http
POST /upload -> Service internally calls SDK to upload objects to RustFS
GET /presigned-url -> Generate presigned URL for frontend/client use
```

---

## 3. 寻找第三方社区 SDK

虽然 AWS 没有提供官方 SDK，但部分语言社区开发了非官方 S3 客户端。例如：

* Haskell：`amazonka-s3`
* Rust：`rusoto`（已弃用）或 `aws-sdk-rust`
* OCaml：可通过 `cohttp` 自行实现
* Delphi：有支持 S3 协议的商业库

社区 SDK 的稳定性差异很大，因此使用前应评估其活跃度、文档和兼容性。

---

## 4. 将核心上传逻辑交由平台托管

例如：

* 将前端（Web/移动端）上传任务交给浏览器或 App 端执行（使用预签名 URL）
* 后端使用 Node.js/Python/Go 等代理实现上传逻辑

---

## 建议汇总

| 场景 | 建议方案 |
| ------------- | ---------------------------------- |
| 需要完全控制或使用嵌入式环境 | 自行实现 Signature V4 签名 |
| 语言支持较弱但可使用 Shell | 通过 AWS CLI 调用上传 |
| 可以部署中继服务 | 使用 Python/Node 构建 S3 API 网关 |
| 前端上传 | 使用预签名 URL |