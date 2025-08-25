---
title: "Windows 安装 RustFS"
description: "使用 Windows 一键启动 RustFS。"
---

# Windows 安装 RustFS

## 一、准备工作

请了解：

> Windows 启动 **模式** 只支持单机单盘模式，更适用于开发、调试和测试环境。


1. 关于 Windows 启动模式的详细介绍，请参考 [启动模式](../linux/index.md#mode;

2. 下载安装包，修改权限，并进行启动。


## 二、下载

前往官网下载页面，下载最新版 RustFS 安装包。


## 三、修改权限

请确认在 windows 操作系统中，本程序有相关的执行权限。


## 双击启动图标

1. 双击启动图标；

2. 点击配置磁盘；

3. 点击"Start Service"，RustFS 服务启动成功。


<img src="./images/windows-setup.jpg" alt="windows 启动" />



## 四、修改配置

点击右上脚的修改按钮（齿轮状按钮），可以修改：

1. 服务器默认端口；

2. 默认管理员的用户名和密码；

3. 指定的磁盘目录；

<img src="./images/setting.jpg" alt="RustFS windows 配置" />



## 五、访问 Console


启动成功后，访问 `http://127.0.0.1:7001`，即可访问控制台。
