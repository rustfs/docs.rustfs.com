---
title: "SSE-S3"
description: "为 RustFS 存储桶和对象写入配置由服务器管理的 SSE-S3 加密。"
---

SSE-S3 使用 S3 `AES256` 加密模式。RustFS 为每个加密对象生成唯一的数据加密密钥，并使用配置的 KMS 服务封装该密钥。客户端无需提供或保留加密密钥。

## 要求

- 配置并启动 [KMS](./kms.md)，创建其默认密钥，并在启用 SSE-S3 之前验证该密钥可用。
- 安装并配置 [`rc`](/operations/rc)。
- 创建目标存储桶，并验证普通对象写入能够成功。

:::warning[KMS 必须可用]

即使 KMS 不可用，RustFS 也会接受 SSE-S3 存储桶默认设置，但之后加密对象写入会失败。将存储桶用于生产数据之前，请验证一次加密写入和读取。

:::

## 设置存储桶默认加密

对未指定对象级加密模式的新写入应用 SSE-S3：

```bash
rc bucket encryption set rustfs/my-bucket --mode sse-s3
rc bucket encryption info rustfs/my-bucket
```

报告的模式应为 `SSE-S3`。

上传并读取一个测试对象：

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

## 显式加密单个对象

在不更改存储桶默认设置的情况下，对单个目标应用 SSE-S3：

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-s3 rustfs/my-bucket/hello.txt
```

对于递归写入，加密选择器必须与目标前缀完全匹配：

```bash
rc object copy ./reports/ rustfs/my-bucket/reports/ --recursive \
	--enc-s3 rustfs/my-bucket/reports/
```

## 清除存储桶默认设置

移除默认规则：

```bash
rc bucket encryption clear rustfs/my-bucket
rc bucket encryption info rustfs/my-bucket
```

清除或更改存储桶默认设置只影响之后的写入，不会解密或重写现有对象。

## 请求约定

S3 客户端使用以下请求启用 SSE-S3：

```http
x-amz-server-side-encryption: AES256
```

对象级请求会覆盖该次写入的存储桶默认设置。如果未提供对象级模式，RustFS 会从存储桶加密配置中确定有效模式。

## 后续步骤

需要显式 KMS 密钥 ID 时，请使用 [SSE-KMS](./kms.md#verify-kms-backed-encryption)；也可比较使用客户端持有密钥的 [SSE-C](./sse-c.md)。