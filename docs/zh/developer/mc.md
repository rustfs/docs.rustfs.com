---
title: "用 MinIO Client 管理 RustFS 对象"
description: "用 MinIO Client 对 RustFS 对象进行管理​"
---

# MinIO Client（`mc`）

MinIO Client（`mc`）是 MinIO 官方提供的命令行工具，用于管理 MinIO 对象存储服务。`mc` 可以与 MinIO、Amazon S3 和其他兼容 S3 的对象存储服务进行交互，提供了一种简单、高效的方式来管理对象存储服务中的数据。由于 MinIO 是 S3 兼容的，所以 `mc` 也可以用于管理 RustFS 对象。

前提条件：

- 一个可用的 RustFS 实例。可参考[安装指南](../installation/index.md)进行安装。
- 已安装 `mc` 工具。
- 可用的[访问密钥](../administration/iam/access-token.md)。

## 用 `mc` 操作 RustFS 

首先需要使用 `mc alias` 命令配置 RustFS 的别名：

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

返回响应：

```
Added `rustfs` successfully.
```

接下来，可以使用 `mc` 操作别名 `rustfs` 来进行存储桶的创建/删除、文件的上传/下载等。

### 列出存储桶

使用 `mc ls` 列出当前 RustFS 实例下的所有存储桶：

```
mc ls rustfs
```

返回响应：

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### 创建存储桶

用 `mc mb` 命令创建存储桶：

```
mc mb rustfs/bucket-creation-by-mc
```

返回响应：  

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### 删除存储桶

使用 `mc rb` 命令删除存储桶：

```
mc rb rustfs/bucket-creation-by-mc
```

返回响应：

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### 上传文件到存储桶

使用 `mc cp` 命令上传文件到存储桶：

```
mc cp file_name rustfs/bucket-creation-by-mc
```

返回响应：

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### 删除存储桶中的文件

使用 `mc rm` 命令删除存储桶中的文件：

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

返回响应：

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### 下载存储中的文件

使用 `mc get` 命令下载存储桶中的文件：

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

返回响应：

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```

