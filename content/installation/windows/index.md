---
title: "Installing RustFS on Windows"
description: "Use Windows one-click startup for RustFS."
---

## 1. Preparation

:::note

Windows startup **mode** only supports single-node single-disk mode, more suitable for development, debugging, and testing environments.

:::

1. For detailed introduction about startup modes, please refer to [Installation Modes](../linux/quick-start.md#mode);

2. Download the installation package, modify permissions, and start.

## 2. Download

Download the latest release from [GitHub Releases](https://github.com/rustfs/rustfs/releases) or the [official download page](https://rustfs.com/download/).

## 3. Modify Permissions

Please confirm that this program has relevant execution permissions in the Windows operating system.

## Double-click the Startup Icon

1. Double-click the startup icon;

2. Click configure disk;

3. Click "Start Service", and RustFS service starts successfully.

![windows startup](./images/windows-setup.jpg)

## 4. Modify Configuration

Click the modify button (gear-shaped button) in the upper right corner to modify:

1. Server default port;

2. Default administrator username and password;

3. Specified disk directory;

![RustFS windows configuration](./images/setting.jpg)

## 5. Access Console

After successful startup, visit `http://127.0.0.1:7001` to access the console.

:::note

Port `7001` applies to the Windows desktop launcher. If you run the standalone `rustfs` server binary instead, the console listens on port `9001` by default.

:::
