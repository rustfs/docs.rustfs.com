---
title: "数据加密"
description: "查阅经过验证的 RustFS 服务端加密和密钥管理参考资料。"
---

RustFS 为对象存储服务中保存的数据提供服务端加密选项。使用本节选择符合安全要求的密钥管理模型。

## 加密选项

- [SSE-S3](./sse-s.md)介绍使用 S3 `AES256` 模式、由服务器管理的服务端加密。
- [SSE-C](./sse-c.md)介绍使用客户提供密钥的服务端加密。
- [SSE-KMS](./kms.md)介绍 Local、Vault KV2 和 Vault Transit 密钥管理后端。

有关当前已经验证的 KMS 配置方式，请参阅 [CLI 参考](/reference/cli)和[环境变量参考](/reference/environment-variables)。