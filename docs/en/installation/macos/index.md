---
title: "Installing RustFS on macOS"
description: "This document primarily explains the quick startup method for RustFS on macOS"
---

# Installing RustFS on macOS

On macOS, you can use three methods for installation:

1. Docker
2. Graphical one-click startup package
3. Binary package

> This document primarily explains using the RustFS **graphical one-click startup package** for quick RustFS startup.

## 1. Preparation

Please understand:

> **Graphical startup mode** only supports single node single disk mode, more suitable for development, debugging and testing environments.

1. For detailed introduction about startup modes, please refer to [Startup Modes](../mode/);

2. Download the installation package, modify permissions, and start.

## 2. Download

Go to the official website download page and download the latest RustFS installation package.

## 3. Modify Permissions

Please ensure this program has relevant execution permissions in the macOS operating system.

## Double-click Startup Icon

1. Double-click the startup icon;

2. Click configure disk;

3. Click "Start Service", RustFS service starts successfully.

<img src="./images/macos-setup.jpg" alt="macOS startup" />

## 4. Modify Configuration

Click the modify button (gear-shaped button) in the upper right corner to modify:

1. Server default port;

2. Default administrator username and password;

3. Specified disk directory;

<img src="./images/setting.jpg" alt="RustFS macOS configuration" />

## 5. Access Console

After successful startup, visit `http://127.0.0.1:7001` to access the console.
