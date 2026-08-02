---
title: "控制台"
description: "启用 RustFS 控制台，将其连接到服务器并安全登录。"
---

**RustFS 控制台**是 RustFS 的 Web 管理界面。使用本页可启用控制台、打开登录页面并选择合适的登录方式。存储桶、对象和身份管理的详细操作请参阅各自的文档章节。

## 启用控制台

控制台默认启用并监听端口 `9001`，与端口 `9000` 上的 S3 API 分开。你可以使用以下环境变量显式设置其行为：

```ini title="/etc/default/rustfs"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
```

更改这些值后请重启 RustFS。如果不应运行控制台，请设置 `RUSTFS_CONSOLE_ENABLE=false`。

对应的命令行选项是 `--console-enable` 和 `--console-address`。完整的服务器配置请参阅 [CLI 参考](/reference/cli)和[环境变量参考](/reference/environment-variables)。

## 打开控制台

打开以下地址，并将 `<server-ip>` 替换为 RustFS 服务器地址：

```text
http://<server-ip>:9001
```

![提供密钥、STS 和 OIDC 登录选项的 RustFS 控制台登录页面](./images/rustfs-console-login.png)

本地部署请使用 `http://localhost:9001`。Windows 和 macOS 桌面启动器改用端口 `7001`。

如果登录页面无法连接目标 RustFS 服务，请选择 **Server Configuration** 或打开 `/config`。输入可从外部访问的 RustFS 服务地址，并在健康检查成功后保存。**Reset** 会清除已保存的地址；**Skip** 会返回登录页面且不作更改。

## 登录

显示的登录方式取决于部署配置：

- **Key Login** 使用为 RustFS 部署配置的访问密钥和秘密密钥。这是本地管理员的标准登录方式。
- **STS Login** 使用临时安全令牌服务（Security Token Service，STS）凭证。仅当身份工作流已签发有效会话令牌时使用。
- 配置 OpenID Connect（OIDC）提供商后会显示 **OIDC Login**。选择提供商，并通过身份提供商完成身份验证。

登录后，控制台会打开账户有权访问的第一个页面。菜单和操作因账户策略及已启用的平台功能而异；缺少某个菜单不一定表示控制台出错。

如果登录失败，请先检查所选登录方式、凭证、目标服务器地址和账户状态，再重试。

:::warning[不要暴露默认凭证]

未配置自定义凭证时，RustFS 会回退到 `rustfsadmin` / `rustfsadmin`。仅在一次性本地测试中使用这些默认值。在允许其他用户访问控制台前，请配置唯一的访问密钥和高强度秘密密钥。

:::

## 运维注意事项

- 在可信网络之外开放控制台前，请使用 [TLS](/integration/tls-configured)。
- 限制对控制台监听器的网络访问，仅在需要跨源访问时配置[控制台 CORS](/administration/cors)。
- 控制台会话继承已登录身份的权限。日常操作请使用最小权限账户。
- 退出登录或会话过期后会返回登录页面。不要在共享浏览器中保存管理员凭证。

## 管理工作流

- [创建和管理存储桶](/administration/data/bucket/creation)
- [上传和管理对象](/administration/data/object/creation)
- [管理访问密钥](/security-compliance/iam/access-token)
- [配置身份与访问管理](/security-compliance/iam)

## 后续步骤

在可信网络之外开放控制台前，请查看[安全检查清单](/installation/requirement/checklists/security-checklists)。如需使用 OIDC 登录，请继续阅读 [OIDC 配置指南](/security-compliance/oidc)。