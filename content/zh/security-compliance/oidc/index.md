---
title: "OIDC"
description: "了解 RustFS 如何使用 OpenID Connect 提供商实现控制台单点登录。"
---

RustFS 支持使用 OpenID Connect（OIDC）实现控制台单点登录。通过本概述了解身份验证流程、准备身份提供商，并选择特定提供商的配置指南。

## OIDC 的工作原理

RustFS 使用带有授权码交换证明（Proof Key for Code Exchange，PKCE）的 OIDC 授权码流程：

1. RustFS 发送包含 S256 PKCE 质询的授权请求。
2. 身份提供商验证你的身份，并将授权码返回到 RustFS 回调 URL。
3. RustFS 在提供商的令牌端点交换授权码。
4. RustFS 验证 ID 令牌的签名、签发者、受众、有效期和 nonce。
5. RustFS 将配置的令牌声明映射到本地身份与访问管理（IAM）策略，并使用临时凭证创建控制台会话。

身份提供商负责验证你的身份，RustFS 策略则负责授权 S3 操作和管理操作。

## 提供商要求

配置提供商之前，请准备：

- 一个 OIDC 发现 URL，该 URL 公开授权端点、令牌端点和 JSON Web 密钥集（JWKS）端点。
- 一个机密客户端，支持授权码流程、S256 PKCE，以及在令牌请求正文中进行客户端密钥身份验证。
- 一个格式为 `https://<rustfs-host>/rustfs/admin/v3/oidc/callback/<provider-id>` 的精确回调 URL。
- RustFS 控制台的公共 HTTPS 源。
- 一个扁平的组或角色声明，其值与现有 RustFS 策略名称匹配。

为 RustFS 使用专用客户端，并只为每个身份授予其所需的策略。

## 提供商指南

- [配置 Keycloak](/security-compliance/oidc/keycloak)，将其用作 RustFS 控制台的 OIDC 提供商。

## 后续步骤

- 映射身份提供商声明之前，请查看[用户、组和策略](/security-compliance/iam/policies)。
- 公开登录端点之前，请查看[控制台安全说明](/administration/console)。