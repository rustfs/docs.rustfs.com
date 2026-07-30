---
title: "SSE-C"
description: "使用客户提供的 AES-256 密钥对 RustFS 对象进行加密和解密。"
---

SSE-C 使用客户端在每次写入和读取请求中提供的 256 位密钥加密对象。RustFS 会验证并在该请求中使用密钥，但不会持久保存明文客户密钥。SSE-C 不使用 RustFS KMS 后端。

## 要求

- 安装并配置 [`rc`](/operations/rc)。
- 安装 OpenSSL，以运行密钥生成示例。
- 使用 HTTPS，确保客户密钥在传输过程中加密。
- 将客户密钥存储在密钥管理器中，并维护每个对象与其密钥之间的映射。

:::warning[每次读取都需要使用同一个密钥]

如果丢失 SSE-C 密钥，RustFS 无法恢复该密钥，对象也将无法读取。绝不要记录或提交该密钥，也不要通过未加密的连接发送密钥。

:::

## 准备客户密钥

通过十六进制中间值生成 32 个随机字节，然后派生 Base64 密钥及其经 Base64 编码的 MD5 校验和：

```bash
SSE_C_KEY_HEX=$(openssl rand -hex 32)
SSE_C_KEY_B64=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p | openssl base64 -A)
SSE_C_KEY_MD5=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p \
	| openssl dgst -md5 -binary | openssl base64 -A)
```

将这些值移入获准使用的密钥管理流程。不要将其输出到终端或 shell 历史记录。

## 上传加密对象

`rc 0.1.29` 没有专用的 SSE-C 选项。它的签名自定义标头选项可以发送三个 S3 SSE-C 标头：

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

需要使用以下请求标头：

| 标头 | 值 |
| --- | --- |
| `x-amz-server-side-encryption-customer-algorithm` | `AES256` |
| `x-amz-server-side-encryption-customer-key` | Base64 编码的 32 字节密钥 |
| `x-amz-server-side-encryption-customer-key-md5` | 原始密钥 MD5 摘要的 Base64 编码值 |

## 读取加密对象

在读取和元数据请求中提供相同的三个标头：

```bash
rc object show rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

已经使用 `rc 0.1.29` 对 RustFS 验证了相同的工作流程：上传对象、使用原始密钥读取对象，并将返回的字节与源文件进行比较。

:::warning[保护命令参数]

通用 `-H` 方法会将展开后的标头值放入 `rc` 进程参数，主机上的其他进程可能看到这些参数。对于生产自动化，请优先使用能够通过受保护内存或凭证提供程序接收 SSE-C 密钥材料的 S3 SDK，不要使用命令行参数。

:::

## 清除 shell 变量

操作完成后，从 shell 环境中移除密钥材料：

```bash
unset SSE_C_KEY_HEX SSE_C_KEY_B64 SSE_C_KEY_MD5
```

更改存储桶的 SSE-S3 或 SSE-KMS 默认设置不会改变 SSE-C 对象。SSE-C 由每个单独请求中的客户密钥标头选择，并对该请求具有优先权。

## 后续步骤

比较使用服务器管理加密的 [SSE-S3](./sse-s.md)，以及使用显式 KMS 后端密钥管理的 [KMS](./kms.md)。