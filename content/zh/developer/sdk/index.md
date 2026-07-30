---
title: "RustFS SDK 概述"
description: "概述 RustFS 支持的 S3 SDK。"
---

RustFS 是兼容 S3 协议的分布式对象存储系统。你可以：

- 通过控制台管理界面管理 RustFS。
- 通过 S3 客户端管理 RustFS。
- 通过 SDK 在业务侧实现对象存储操作和管理。

目前，RustFS 提供的 SDK 指南包括：

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Golang SDK](./go.md)

## 术语

Amazon S3（Simple Storage Service，简单存储服务）是首个得到广泛采用的对象存储服务，其 API 已成为对象存储的事实标准。在本文档中，“S3”指该协议。

## SDK 建议

我们建议使用 AWS 官方 S3 SDK。这些 SDK 成熟、维护良好并经过充分优化。

如果你熟悉并信任某个供应商的 SDK，也可以使用它。

部分第三方 SDK 可能采用非标准实现。我们建议避免使用未严格遵循 S3 标准的 SDK。

## 与 MinIO SDK 的兼容性

是的，RustFS 与 MinIO SDK 完全兼容。

如果你正在使用 MinIO SDK，可以修改 Endpoint、AK 和 SK，以直接兼容 RustFS。

## 处理不兼容的 SDK

如果遇到不支持标准 S3、MinIO 或 RustFS 的 SDK：

我们建议改用标准 AWS S3 SDK。