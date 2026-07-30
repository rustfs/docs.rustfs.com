---
title: "CORS 配置"
description: "为 RustFS S3 API 和控制台配置允许的浏览器来源。"
---

跨源资源共享（Cross-Origin Resource Sharing，CORS）控制哪些浏览器来源可以访问 RustFS S3 API 和控制台。请分别配置每个监听器，然后重启 RustFS 以应用环境变量更改。

## S3 API 来源

将 `RUSTFS_CORS_ALLOWED_ORIGINS` 设置为以逗号分隔的可信来源列表：

```ini title="/etc/default/rustfs"
RUSTFS_CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

未设置此变量或变量为空时，S3 端点不会添加通用 CORS 响应头。显式来源列表允许来自匹配来源且携带凭证的浏览器请求。

可以将该值设置为 `*`，以允许来自任何来源的请求。通配符模式不允许浏览器携带凭证。

:::warning[生产环境请使用显式来源]

对于发送凭证的应用，请使用以逗号分隔的允许列表。仅对不需要浏览器携带凭证请求的公共资源使用 `*`。

:::

## 控制台来源

控制台使用单独的变量：

```ini title="/etc/default/rustfs"
RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS="https://admin.example.com"
```

如果多个浏览器来源需要访问控制台，请使用以逗号分隔的列表。仅在必须允许任何来源时设置 `*`。

## 验证响应

发送带有 `Origin` 请求头的请求，并检查 CORS 响应头：

```bash
curl -i \
  -H "Origin: https://app.example.com" \
  http://localhost:9000/
```

确认 `Access-Control-Allow-Origin` 包含预期来源。使用未列出的来源重复检查，并确认该来源未获允许。

## 后续步骤

有关已验证的默认值和配置格式，请参阅[环境变量参考](/reference/environment-variables#cors)。