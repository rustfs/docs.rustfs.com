---
title: "s3cmd"
description: "将 s3cmd 连接到 RustFS，并从命令行执行基本对象操作。"
---

[s3cmd](https://s3tools.org/s3cmd) 是适用于 S3 兼容存储的命令行客户端。使用一个简短的配置文件即可将其指向您的 RustFS 端点。

## 安装

```bash
# macOS
brew install s3cmd
# Debian/Ubuntu
sudo apt install s3cmd
# or via pip
pip install s3cmd
```

## 配置

创建 `~/.s3cfg`。请将 `localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 使用路径样式寻址，因此请将存储桶主机设置为相同端点：

```ini title="~/.s3cfg"
[default]
access_key = <your-access-key>
secret_key = <your-secret-key>
host_base = localhost:9000
host_bucket = localhost:9000
use_https = False
signature_v2 = False
```

:::note

如果您已[配置 TLS](../../integration/tls-configured.md)，请设置 `use_https = True` 并指向端口 `9000`。

:::

## 验证

创建存储桶、上传文件并列出其内容：

```bash
s3cmd mb s3://my-bucket
s3cmd put /path/to/hello.txt s3://my-bucket/hello.txt
s3cmd ls s3://my-bucket
```

```text
upload: '/path/to/hello.txt' -> 's3://my-bucket/hello.txt'  [1 of 1]
2026-07-16 10:00        12   s3://my-bucket/hello.txt
```

## 后续步骤

请参阅 [SDK 概述](../sdk/index.md)以连接应用程序，或使用 [`rc`](/operations/rc) 管理对象。