---
title: "RustFS SDK 概述"
description: "RustFS 可以使用哪些 S3 的 SDK？在这篇文章中进行了详细的说明。"
---

# SDK 概述

RustFS 是 100% 兼容 S3 协议的分布式对象存储软件。 用户可以通过：

1. Console 控制台管理 RustFS；
2. 可以通过 S3 客户端管理 RustFS；
3. 也可以通过 SDK 在业务端实现对于对象存储的操作和管理。

目前 RustFS 提供的 SDK 包括：

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Golang SDK](./go.md)

## 阅读前名词解释

S3 是亚马逊最早开放和推出的对象存储的产品名称。并且，他开放了他的全部协议和规范。后来，几乎所有的对象存储都遵循了 S3 的协议和规范。有时人们把 S3 称为对象存储，有的时候又简称 S3 为对象存储协议。

## 1. SDK 推荐

由于市面上已经有太多的经过多年维护的 SDK 了。如 AWS S3 SDK 经过多年的调试和调优。他的性能、错误几乎为 0。因此，我们推荐您直接使用标准的 AWS 的 S3 SDK 直接控制 RustFS 与 RustFS 进行通信。

如果您有熟悉的 SDK 和信任和 SDK 厂商的产品您均可以使用。

由于中国云厂商在很多地方进行了”魔改“。有很多最新的 S3 的技术不支持。因此，在全球很多对象存储的产品都不太推荐中国很多云厂商的 SDK。



## 2. MinIO 的 SDK 可以与 RustFS 直接通信吗？

可以。

我们针对 MinIO 的 SDK 进行了全面的适配和兼容。

如果您正在使用 MinIO 的 SDK，可以修改 Endpoint 和 AK、SK 后直接兼容 RustFS。


## 3. 如果有其他不兼容的 SDK 怎么办？

我们使用某个云厂商的 SDK，他对于最新的 S3、MinIO 和 RustFS 均不支持应该怎么处理呢？
请您尽快更换 SDK，在业务端重新进行匹配和升级。


