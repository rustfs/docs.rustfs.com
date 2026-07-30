---
title: "快速入门"
description: "使用一键脚本安装 RustFS、登录控制台并存储第一个对象，整个过程约需十分钟。"
---

本指南将带你从一台空白 Linux 服务器开始，完成 RustFS 安装、登录控制台、创建存储桶并上传第一个对象。生产规划（多节点布局、硬件规格）特意留到[后续步骤](#next-steps)中介绍。

**前提条件**

- 一台配备 `systemd` 的 Linux 服务器（x86_64 或 aarch64），以及 root 或 sudo 权限
- 已安装 `unzip`，并可访问外部网络以下载软件包
- 你的计算机可访问端口 `9000`（S3 API）和 `9001`（控制台）
- 工作站上已安装 [`rc`](/operations/rc)，用于命令行验证流程

## 1. 安装并启动 RustFS

运行官方安装脚本：

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

该脚本会将二进制文件安装到 `/usr/local/bin/rustfs`，注册 `rustfs` systemd 服务并启动它。默认情况下，数据存储在 `/data/rustfs0`，服务监听端口 `9000`（S3 API）和 `9001`（控制台）；安装期间可以调整数据路径和端口。成功后会输出类似以下摘要：

```text
RustFS has been installed and started successfully!
Service port: 9000,  Console port: 9001,  Data directory: /data/rustfs0

[SECURITY WARNING] Please change the default value for RUSTFS_ACCESS_KEY/RUSTFS_SECRET_KEY immediately ...
  Config file: /etc/default/rustfs
```

## 2. 设置凭证

生成的配置文件包含占位凭证。设置自己的访问密钥和秘密密钥，然后重启服务：

```ini title="/etc/default/rustfs" {1,2}
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>   ; e.g. output of: openssl rand -base64 24
```

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager   # should report: active (running)
```

:::warning[不要保留默认凭证]

如果未设置 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`，服务器会回退到内置默认值 `rustfsadmin` / `rustfsadmin`。该值只能用于一次性本地测试，绝不能用于他人可访问的环境。

:::

## 3. 登录控制台

在浏览器中打开 `http://<server-ip>:9001`，使用步骤 2 中的访问密钥和秘密密钥登录。

![RustFS 控制台登录页面](./images/console.jpg)

## 4. 创建存储桶并上传文件

1. 在控制台首页选择 **Create Bucket**，输入名称（例如 `my-bucket`）并确认。
2. 打开存储桶，使用上传操作添加任意本地文件。
3. 单击上传的对象查看详情。此时对象存储已可正常使用。

更喜欢命令行？配置 [`rc`](/operations/rc)，然后执行相同操作：

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
rc bucket create rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
/path/to/hello.txt -> rustfs/my-bucket/hello.txt
```

<a id="mode"></a>

## 后续步骤

快速安装以**单节点单磁盘（SNSD）**模式运行 RustFS。该模式没有冗余，适合评估和开发。接下来可以：

- **规划生产部署**：选择拓扑并按照相应指南操作：
  - [单节点单磁盘（SNSD）](./single-node-single-disk.md)：开发和小型工作负载
  - [单节点多磁盘（SNMD）](./single-node-multiple-disk.md)：单台计算机上的磁盘级容错
  - [多节点多磁盘（MNMD）](./multiple-node-multiple-disk.md)：生产级可用性和扩展能力，并完成[安装前检查清单](../requirement/checklists/index.md)
- **偏好使用容器？** 请[使用容器安装](../container/index.mdx)
- **连接应用程序**：参阅 [SDK 和示例](../../developer/sdk/index.md)