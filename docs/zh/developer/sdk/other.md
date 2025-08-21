---
title: "其他 SDK"
description: "本文主要讲解 RustFS 中其他各种语言的 SDK 的使用。"
---

# 其他 SDK


如果 AWS S3 官方没有支持你所使用的语言，可以采用以下几种策略来对接 RustFS：


## 1. 使用 HTTP 接口直接请求（基于 S3 API 协议）

S3 协议是标准的 RESTful API。你可以通过任意支持 HTTP 请求的语言（例如 C、Rust、Lua、Erlang）自己封装访问逻辑。

### 关键点包括：

* **签名算法**：实现 AWS Signature Version 4 签名（较复杂）
* **构造正确的 Header 和 Canonical Request**
* **使用 HTTPS / HTTP 客户端发送请求**

👉 推荐参考开源项目的签名实现，例如：

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. 调用已有 SDK 的 CLI 工具或中间服务

如果你不想自己实现签名，可以：

### 2.1. 使用已有语言支持的 AWS CLI 工具：

比如通过 Shell 调用：

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

或者用 Node.js/Python SDK 写一个简易中转服务，你的语言通过调用这个服务上传/下载。

### 2.2. 搭建一个 Proxy（比如 Flask、FastAPI、Express）

让不支持 S3 的客户端调用你封装的 HTTP API：

```http
POST /upload -> 服务内部调用 SDK 上传对象到 RustFS
GET /presigned-url -> 生成预签名 URL 给前端/客户端用
```

---

## 3. 寻找第三方社区 SDK

虽然 AWS 没有官方 SDK，但有些语言社区开发了非官方 S3 客户端。例如：

* Haskell: `amazonka-s3`
* Rust: `rusoto`（已弃用）或 `aws-sdk-rust`
* OCaml: 可能通过 `cohttp` 自行实现
* Delphi：有商业库支持 S3 协议

社区 SDK 的稳定性差异较大，使用前应评估活跃度、文档和兼容性。

---

## 4.将核心上传逻辑交由平台托管

例如：

* 将前端（Web/Mobile）上传任务交给浏览器或 App 端执行（用预签名 URL）
* 后台使用 Node.js/Python/Go 等代理实现上传逻辑

---

## 总结建议

| 场景 | 推荐方案 |
| ------------- | ---------------------------------- |
| 需要完全控制/嵌入式环境 | 实现 Signature V4 自签名 |
| 语言弱支持但有 Shell | 通过 AWS CLI 调用上传 |
| 可部署中转服务 | 使用 Python/Node 构建 S3 API 网关 |
| 前端上传 | 使用预签名 URL |
