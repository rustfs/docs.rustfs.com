---
title: "虚拟主机风格"
description: "配置 RustFS S3 虚拟主机风格和路径风格。"
---

RustFS 遵循 S3 协议。S3 支持两种请求模式：

1. 虚拟主机风格
2. 路径风格

两者的区别在于存储桶名称的位置。

## 路径风格

路径风格是默认模式。在路径风格中，存储桶名称位于端点之后。

示例（存储桶：`test`，主机：`rustfs.yourdomain.com`）：

```text
http://rustfs.yourdomain.com/test
```

**注意**：路径风格无需配置。

## 虚拟主机风格

在虚拟主机风格中，存储桶名称是域名的一部分。

示例（存储桶：`test`，主机：`rustfs.yourdomain.com`）：

```text
http://test.rustfs.yourdomain.com/
```

### 配置

1. **DNS**：配置通配符 DNS 解析（例如，将 `*.rustfs.yourdomain.com` 指向服务器 IP）。
2. **配置**：修改配置文件（Linux：`/etc/default/rustfs`，Docker/K8s：环境变量）。
3. **设置域名**：设置 `RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com"`。
4. **重启**：重启服务（`systemctl restart rustfs`）。

### 域名中的端口（可选）

虚拟主机路由应用于 S3 API 监听器（默认端口为 9000）；RustFS 会自动匹配携带 S3 监听器自身端口的 `Host` 标头。只有当客户端通过**不同的**端口（例如经由代理）访问 RustFS 时，才需要在 `RUSTFS_SERVER_DOMAINS` 中包含该端口。

示例（`rustfs.yourdomain.com:8000`）：

```ini
RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com:8000"
```

这样可确保以下请求：

```text
http://my-bucket.rustfs.yourdomain.com:8000/
```

能够在虚拟主机风格模式下正确解析。

> ⚠️ 注意：`RUSTFS_SERVER_DOMAINS` 的值必须与客户端请求使用的 **Host 标头**完全匹配（如果包含端口，也必须匹配端口）