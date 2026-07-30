---
title: "AWS CLI"
description: "将 AWS CLI 连接到 RustFS，并执行基本对象操作。"
---

[AWS CLI](https://docs.aws.amazon.com/cli/) 是 Amazon 官方的 S3 命令行工具，可通过 `--endpoint-url` 标志与 RustFS 配合使用。

## 安装

请按照[官方安装指南](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)操作；也可以在 macOS 上运行：

```bash
brew install awscli
```

## 配置

设置您的[访问密钥](../../security-compliance/iam/access-token.md)和区域：

```bash
aws configure
```

```text
AWS Access Key ID [None]: <your-access-key>
AWS Secret Access Key [None]: <your-secret-key>
Default region name [None]: us-east-1
Default output format [None]: json
```

在每条命令中通过 `--endpoint-url` 传入您的 RustFS 地址。请将 `http://localhost:9000` 替换为您的服务器地址。设置 `--endpoint-url` 后，AWS CLI 会使用 RustFS 所要求的路径样式寻址。

:::note

如果您在安装时未设置凭证，本地测试的默认值为 `rustfsadmin` / `rustfsadmin`，切勿在一次性本地试用之外使用这些凭证。

:::

## 验证

创建存储桶：

```bash
aws s3 mb s3://my-bucket --endpoint-url http://localhost:9000
```

```text
make_bucket: my-bucket
```

上传文件：

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/ --endpoint-url http://localhost:9000
```

```text
upload: ../path/to/hello.txt to s3://my-bucket/hello.txt
```

列出存储桶内容：

```bash
aws s3 ls s3://my-bucket --endpoint-url http://localhost:9000
```

```text
2026-07-15 10:30:00         12 hello.txt
```

## 后续步骤

使用 [S3 SDK](../sdk/index.md) 构建与 RustFS 对接的应用程序，或使用 [`rc`](/operations/rc) 管理对象。