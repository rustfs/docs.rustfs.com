---
title: "在 Windows 上安装 RustFS"
description: "使用 RustFS Launcher 或独立服务器二进制文件在 Windows 上安装本地 RustFS 实例。"
---

本指南提供两种在 Windows 上运行 **RustFS** 的方式：使用图形化 **RustFS Launcher**，或通过 PowerShell 下载并运行独立服务器二进制文件。两种方式都会创建适合评估、开发和测试的本地单节点实例。

:::note[部署范围]

这些步骤将 RustFS 作为桌面进程运行，而不是 Windows 服务。对于生产或分布式部署，请使用 [Linux 安装指南](/installation/linux)。

:::

## 1. 检查前提条件

开始前请确保：

- 在 x86-64 处理器上使用 64 位 Windows。Launcher 当前捆绑 Windows x86-64 RustFS 二进制文件。
- 你有权安装或运行应用程序，并可写入所选数据目录。
- TCP 端口 `9000` 和 `9001` 可用，或已选择另外两个未使用的端口。
- 已创建专用数据目录，例如 `D:\rustfs\data`。

:::warning[保护数据目录]

使用具有足够可用空间的磁盘上的空目录。不要在此目录中存储无关文件，也不要在服务器运行时编辑 RustFS 数据文件。

:::

## 2. 选择安装方式

| 方式 | 适用场景 | 管理模式 |
| --- | --- | --- |
| RustFS Launcher | 需要图形化设置和内置日志查看器。 | Launcher 启动和停止捆绑的 RustFS 进程。 |
| 独立二进制文件 | 需要明确的 PowerShell 命令或脚本。 | PowerShell 会话管理 RustFS 进程。 |

## 使用 RustFS Launcher 安装

### 3. 下载并安装 Launcher

1. 打开 [RustFS Launcher Releases 页面](https://github.com/rustfs/launcher/releases)。
2. 选择最新版本，从 **Assets** 下载 Windows x86-64 安装程序。不要下载用于从源代码构建 Launcher 的 **Source code**。
3. 双击安装程序并按照提示操作。
4. 如果未自动打开，请从开始菜单打开 **RustFS Launcher**。

如果 Microsoft Defender SmartScreen 显示警告，请先验证安装程序来自官方 `rustfs/launcher` Releases 页面，再允许其运行。不要全局禁用 Windows 安全功能。

### 4. 配置 Launcher

在 Launcher 窗口中配置以下字段：

| 区域 | 字段 | 推荐值 | 说明 |
| --- | --- | --- | --- |
| Dataset Mount | Data Path | `D:\rustfs\data` | RustFS 存储对象数据的现有目录。 |
| Ports & Access | API Port | `9000` | S3 兼容 API 端口。 |
| Ports & Access | Host | `127.0.0.1` | 将访问限制在此计算机。 |
| Ports & Access | Console Endpoint | Enabled | 启用 Web 控制台；Launcher 默认禁用。 |
| Ports & Access | Console Port | `9001` | 控制台端口，必须与 API 端口不同。 |
| Credentials | Access Key | `<your-access-key>` | 此实例的管理员访问密钥。 |
| Credentials | Secret Key | `<your-secret-key>` | 此实例的管理员秘密密钥。 |

使用 **Browse** 选择数据目录，或将其拖入 Launcher。启动前该目录必须已存在。

将凭证占位符替换为自己的值。Launcher 最初显示本地测试默认凭证；不要在其他用户可访问的计算机上保留这些凭证。

:::warning[网络暴露]

除非其他计算机必须连接 RustFS，否则请将 **Host** 保持为 `127.0.0.1`。非环回地址会在相应网络接口上公开 API 和控制台。允许远程访问前，请配置 Windows Defender Firewall 和强凭证。

:::

### 5. 启动并验证 RustFS

1. 选择 **Launch RustFS**。
2. 等待 Launcher 报告配置的端点已在线。
3. 打开 `http://localhost:9001`，使用配置的访问密钥和秘密密钥登录。
4. 将 `http://localhost:9000` 用作 S3 兼容客户端的端点。

![RustFS Launcher 显示服务已上线、API 端口 9000、控制台端口 9001 和成功启动日志](./images/windows-rustfs-launcher.jpg)

如果更改了主机或端口，请使用更改后的值。仅当启用 **Console Endpoint** 时，控制台 URL 才可用。

Launcher 管理运行中的进程时会锁定配置。它还会在数据目录旁创建 `logs` 目录。例如，数据路径 `D:\rustfs\data` 会将服务器日志放在 `D:\rustfs\logs` 下。

### 6. 停止或退出 Launcher

更改配置、断开数据盘或关闭 Windows 前，请选择 **Stop RustFS**。

关闭 Launcher 窗口只会将其隐藏到 Windows 系统托盘，不会停止 RustFS。要停止受管进程并退出 Launcher，请右键单击托盘图标并选择 **Quit**。选择 **Show** 或左键单击托盘图标可恢复窗口。

## 安装独立二进制文件

### 7. 下载并解压二进制文件

1. 打开 [RustFS Releases 页面](https://github.com/rustfs/rustfs/releases)。
2. 选择所需版本，从 **Assets** 下载 Windows x86-64 ZIP 压缩包。资源名称以 `rustfs-windows-x86_64` 开头。
3. 打开 PowerShell，为程序和数据创建目录：

```powershell
New-Item -ItemType Directory -Force -Path C:\rustfs\bin
New-Item -ItemType Directory -Force -Path D:\rustfs\data
```

4. 解压下载的压缩包。将 `<version>` 替换为下载文件名中的版本：

```powershell
Expand-Archive -Path "$HOME\Downloads\rustfs-windows-x86_64-<version>.zip" -DestinationPath C:\rustfs\bin -Force
```

5. 确认解压后的二进制文件可以运行：

```powershell
Set-Location C:\rustfs\bin
.\rustfs.exe --help
```

如果压缩包将 `rustfs.exe` 解压到嵌套目录，请切换到该目录，或在继续前将可执行文件移至 `C:\rustfs\bin`。

### 8. 启动独立服务器

仅为当前 PowerShell 会话设置凭证，然后使用明确地址启动 RustFS：

```powershell
$env:RUSTFS_ACCESS_KEY = "<your-access-key>"
$env:RUSTFS_SECRET_KEY = "<your-secret-key>"

Set-Location C:\rustfs\bin
.\rustfs.exe server `
	--address "127.0.0.1:9000" `
	--console-enable true `
	--console-address "127.0.0.1:9001" `
	"D:\rustfs\data"
```

RustFS 运行期间请保持 PowerShell 窗口打开。在该窗口中按 `Ctrl+C` 可停止服务器。

:::tip[凭证处理]

会话环境变量可避免将凭证直接放在命令行中。对于重复或自动化使用，建议使用 `RUSTFS_ACCESS_KEY_FILE` 和 `RUSTFS_SECRET_KEY_FILE` 环境变量，并通过 Windows 访问控制保护这些文件。

:::

### 9. 验证独立服务器

打开 `http://localhost:9001` 并使用配置的凭证登录。将 `http://localhost:9000` 用作 S3 兼容客户端的端点。RustFS 默认使用路径式寻址，请相应配置客户端。

要执行端到端检查，请创建名为 `my-bucket` 的存储桶、上传 `hello.txt`，并确认该对象出现在存储桶中。

## 确认安装成功

无论使用 Launcher 还是独立二进制文件，成功登录控制台后都会打开 **Buckets** 页面。你可以在此创建 `my-bucket` 并开始存储对象。

![成功登录后的 RustFS 控制台 Buckets 页面](./images/rustfs-console-login.png)

## 故障排除

### Windows 阻止安装程序或可执行文件

确认文件来自 RustFS 官方 GitHub 组织。检查文件的 **Properties** 对话框；Windows 提供该选项时，仅在验证来源后选择 **Unblock**。

### 数据路径被拒绝

确认目录存在，并且 Windows 账户具有读写权限。Launcher 不会为你创建所选数据目录。

### API 或控制台端口不可用

端口必须是 `1` 到 `65535` 之间的数字，彼此不同且未被占用。在 PowerShell 中检查默认端口：

```powershell
Get-NetTCPConnection -LocalPort 9000,9001 -ErrorAction SilentlyContinue
```

停止冲突的应用程序或选择未使用的端口，然后重新启动 RustFS。

### 控制台无法打开

使用 Launcher 时，确认已启用 **Console Endpoint**。使用独立二进制文件时，确认进程仍在运行且包含 `--console-enable true`。当前控制台默认端口为 `9001`；当前 Launcher 配置不使用端口 `7001`。

### Launcher 报告外部 RustFS 进程

另一个进程正在监听配置的 API 地址，但并非由 Launcher 启动。请停止该进程或选择其他 API 端口。Launcher 无法停止不受其管理的进程。

### RustFS 启动后退出

在 Launcher 中检查内置日志查看器的应用程序和 RustFS 选项卡。对于独立安装，请检查 PowerShell 输出。常见原因包括数据目录缺失、权限不足或端口冲突。

## 后续步骤

- 连接客户端前查看 [S3 API 指南](/administration/protocols/s3)。
- 了解如何[创建存储桶](/administration/data/bucket/creation)。
- 查看[状态检查](/operations/status-check)，了解其他验证方法。
- 对于面向生产的部署，请使用 [Linux 安装指南](/installation/linux)。