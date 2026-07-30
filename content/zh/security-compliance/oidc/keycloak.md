---
title: "Keycloak"
description: "将 Keycloak 配置为 OpenID Connect 身份提供商，实现 RustFS 控制台单点登录。"
---

RustFS 通过 OpenID Connect（OIDC）授权码流程与 **Keycloak** 集成。本页示例使用 RustFS 默认提供商 ID `default`。

## 概述

浏览器登录流程如下：

1. RustFS 发送包含授权码交换证明（Proof Key for Code Exchange，PKCE）S256 质询的授权码请求。
2. Keycloak 验证用户身份，并使用 `code` 和 `state` 将浏览器重定向到 RustFS。
3. RustFS 在 Keycloak 令牌端点交换授权码。
4. RustFS 验证 ID 令牌的签名、签发者、受众、有效期和 nonce。
5. RustFS 将 ID 令牌声明值映射到本地 RustFS 身份与访问管理（IAM）策略，并为控制台会话签发临时凭证。

Keycloak 负责验证用户身份，RustFS 策略则负责授权 S3 操作和管理操作。RustFS 不使用 Keycloak Authorization Services 对对象或控制台操作进行授权。

示例使用以下值。请根据你的环境替换主机名和客户端密钥：

| 设置 | 示例 |
| --- | --- |
| Keycloak realm | `rustfs` |
| Keycloak issuer | `https://keycloak.example.com/realms/rustfs` |
| Keycloak client ID | `rustfs-console` |
| Public RustFS origin | `https://rustfs.example.com` |
| RustFS callback URL | `https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default` |

## 配置

### Keycloak 配置

#### 创建 realm 和客户端

1. 打开 Keycloak Admin Console，创建或选择 `rustfs` realm。
2. 打开 **Clients**，创建客户端 ID 为 `rustfs-console` 的 OpenID Connect 客户端。
3. 启用 **Client authentication** 和 **Standard flow**。
4. 禁用未使用的流程，包括 **Implicit flow**、**Direct access grants** 和 **Service accounts roles**。
5. 将 **Valid redirect URIs** 设置为精确的 RustFS 回调 URL：

  ```text
  https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default
  ```

6. 将 **Web origins** 设置为 RustFS 公共源：

  ```text
  https://rustfs.example.com
  ```

7. 将 **Proof Key for Code Exchange Code Challenge Method** 设置为 `S256`。
8. 保存客户端，并从 **Credentials** 复制其密钥。

RustFS 在令牌请求正文中提交客户端密钥。不要应用会禁用 `client_secret_post` 的 Keycloak 客户端策略。

#### 将 Keycloak 组映射到 RustFS 策略

RustFS 将 ID 令牌 `groups` 声明中的值映射到 RustFS 策略名称。创建与用户所需策略匹配的 Keycloak 组，例如 `consoleAdmin`、`readwrite` 或 `readonly`，然后将用户分配到这些组。

向专用客户端范围添加 **Group Membership** 映射器，并将其附加到 `rustfs-console`：

| 映射器字段 | 值 |
| --- | --- |
| Name | `rustfs-groups` |
| Token Claim Name | `groups` |
| Full group path | Off |
| Add to ID token | On |
| Add to access token | On |
| Add to userinfo | On |
| Multivalued | On |

保持禁用 **Full group path**。`/consoleAdmin` 这样的值与名为 `consoleAdmin` 的 RustFS 策略不匹配。

:::note[使用 Keycloak 角色]

如果使用 realm 或客户端角色而不是组，请添加一个角色映射器，输出扁平的顶层 `roles` 数组。RustFS 不解析 Keycloak 嵌套的 `realm_access.roles` 声明。

:::

### RustFS 配置

通过环境变量配置 Keycloak 提供商。

#### 使用环境变量配置

将 Keycloak 提供商和公共浏览器源添加到 RustFS 服务环境：

```ini title="/etc/default/rustfs"
RUSTFS_BROWSER_REDIRECT_URL="https://rustfs.example.com"

RUSTFS_IDENTITY_OPENID_ENABLE=on
RUSTFS_IDENTITY_OPENID_CONFIG_URL="https://keycloak.example.com/realms/rustfs"
RUSTFS_IDENTITY_OPENID_CLIENT_ID="rustfs-console"
RUSTFS_IDENTITY_OPENID_CLIENT_SECRET="<keycloak-client-secret>"
RUSTFS_IDENTITY_OPENID_SCOPES="openid,profile,email"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI="https://rustfs.example.com/rustfs/admin/v3/oidc/callback/default"
RUSTFS_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC=off
RUSTFS_IDENTITY_OPENID_DISPLAY_NAME="Keycloak"
RUSTFS_IDENTITY_OPENID_GROUPS_CLAIM="groups"
RUSTFS_IDENTITY_OPENID_ROLES_CLAIM="roles"
RUSTFS_IDENTITY_OPENID_EMAIL_CLAIM="email"
RUSTFS_IDENTITY_OPENID_USERNAME_CLAIM="preferred_username"
```

应用配置后重启 RustFS。

`RUSTFS_BROWSER_REDIRECT_URL` 必须包含不带路径的公共 scheme 和 authority。它控制控制台成功重定向和注销回退 URL。提供商回调 URL 必须与 Keycloak 中注册的 URL 完全匹配。

:::warning[在生产环境中映射声明]

不要将 `RUSTFS_IDENTITY_OPENID_ROLE_POLICY=consoleAdmin` 用作永久捷径。请将 Keycloak 组或角色映射到 RustFS 策略，确保每个用户只获得所需权限。

:::

使用反向代理或负载均衡器时，请保留回调查询字符串，并将授权请求和回调请求路由到同一个 RustFS 节点。进行中的 OIDC `state` 位于该节点本地。

## 验证

### 验证 Keycloak 发现信息

查询 realm 发现文档：

```bash
curl -fsS "https://keycloak.example.com/realms/rustfs/.well-known/openid-configuration" | jq '{
  issuer,
  authorization_endpoint,
  token_endpoint,
  jwks_uri,
  code_challenge_methods_supported,
  token_endpoint_auth_methods_supported
}'
```

确认：

- `issuer` 为 `https://keycloak.example.com/realms/rustfs`。
- 存在 `authorization_endpoint`、`token_endpoint` 和 `jwks_uri`。
- `code_challenge_methods_supported` 包含 `S256`。
- 令牌端点支持在请求正文中进行客户端密钥身份验证。

### 验证 RustFS 提供商

重启 RustFS 后，检查提供商是否可用：

```bash
curl -fsS "https://rustfs.example.com/rustfs/admin/v3/oidc/providers" | jq
```

响应应包含 `default` 提供商，其显示名称为 `Keycloak`。

### 测试控制台登录

打开 RustFS 控制台并选择 **Keycloak**，或直接打开授权端点：

```text
https://rustfs.example.com/rustfs/admin/v3/oidc/authorize/default
```

验证完整流程：

1. 浏览器重定向到 Keycloak。
2. 用户登录。
3. Keycloak 使用 `code` 和 `state` 重定向到 RustFS 回调 URL。
4. RustFS 验证 ID 令牌并创建控制台会话。
5. 控制台以从用户 `groups` 或 `roles` 声明映射的权限打开。

如果身份验证成功但访问被拒绝，请确认 ID 令牌包含扁平的 `groups` 或 `roles` 声明，并且每个值都与现有 RustFS 策略名称完全匹配。

## 后续步骤

- 分配 Keycloak 组之前，请查看[用户、组和策略](../iam/policies.md)。
- 公开登录端点之前，请查看[控制台安全说明](/administration/console)。