---
title: "Installing RustFS on Windows"
description: "One-click startup of RustFS using Windows."
---

# Installing RustFS on Windows

## 1. Preparation

Please understand:

> Windows startup **mode** only supports single node single disk mode, more suitable for development, debugging and testing environments.

1. For detailed introduction about Windows startup mode, please refer to [Startup Modes](../mode/);

2. Download the installation package, modify permissions, and start.

## 2. Download

Go to the official website download page and download the latest RustFS installation package.

## 3. Modify Permissions

Please ensure this program has relevant execution permissions in the Windows operating system.

## Double-click Startup Icon

1. Double-click the startup icon;

2. Click configure disk;

3. Click "Start Service", RustFS service starts successfully.

<img src="./images/windows-setup.jpg" alt="Windows startup" />

## 4. Modify Configuration

Click the modify button (gear-shaped button) in the upper right corner to modify:

1. Server default port;

2. Default administrator username and password;

3. Specified disk directory;

<img src="./images/setting.jpg" alt="RustFS Windows configuration" />

## 5. Access Console

After successful startup, visit `http://127.0.0.1:7001` to access the console.
