---
title: "rclone"
description: "将 rclone 连接到 RustFS，并执行基本对象操作。"
---

[rclone](https://rclone.org/) 是一个用于在云存储中同步文件的命令行程序，支持 RustFS 实现的 S3 协议。

## 安装

```bash
curl https://rclone.org/install.sh | sudo bash
```

也可以参阅[官方安装指南](https://rclone.org/install/)。

## 配置

在 `~/.config/rclone/rclone.conf` 中添加远程存储。请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 使用路径样式寻址，因此必须设置 `force_path_style = true`：

```ini title="~/.config/rclone/rclone.conf"
[rustfs]
type = s3
provider = Other
access_key_id = <your-access-key>
secret_access_key = <your-secret-key>
endpoint = http://localhost:9000
region = us-east-1
force_path_style = true
```

## 验证

创建存储桶：

```bash
rclone mkdir rustfs:my-bucket
```

上传文件：

```bash
rclone copy /path/to/hello.txt rustfs:my-bucket
```

列出存储桶及其内容：

```bash
rclone lsd rustfs:
rclone ls rustfs:my-bucket
```

```text
          -1 2026-07-15 10:30:00        -1 my-bucket
       12 hello.txt
```

## 后续步骤

使用 [S3 SDK](../sdk/index.md) 构建与 RustFS 对接的应用程序，或使用 [`rc`](/operations/rc) 管理对象。