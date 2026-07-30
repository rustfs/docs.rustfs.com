---
title: "Install RustFS on Windows"
description: "Install a local RustFS instance on Windows with RustFS Launcher or the standalone server binary."
---

This guide provides two ways to run **RustFS** on Windows: use the graphical **RustFS Launcher**, or download and run the standalone server binary from PowerShell. Both methods create a local, single-node instance suitable for evaluation, development, and testing.

:::note[Deployment scope]

These procedures run RustFS as a desktop process, not as a Windows service. For a production or distributed deployment, use the [Linux installation guides](/installation/linux).

:::

## 1. Check the prerequisites

Before you begin, make sure that:

- You are using 64-bit Windows on an x86-64 processor. Launcher currently bundles the Windows x86-64 RustFS binary.
- You have permission to install or run applications and to write to the selected data directory.
- TCP ports `9000` and `9001` are available, or you have selected two other unused ports.
- You have created a dedicated data directory, such as `D:\rustfs\data`.

:::warning[Protect the data directory]

Use an empty directory on a disk with enough free space. Do not store unrelated files in this directory, and do not edit RustFS data files while the server is running.

:::

## 2. Choose an installation method

| Method | Use it when | Management model |
| --- | --- | --- |
| RustFS Launcher | You want a graphical setup and built-in log viewer. | Launcher starts and stops the bundled RustFS process. |
| Standalone binary | You want explicit PowerShell commands or scripting. | The PowerShell session owns the RustFS process. |

## Install with RustFS Launcher

### 3. Download and install Launcher

1. Open the [RustFS Launcher Releases page](https://github.com/rustfs/launcher/releases).
2. Select the latest release and download its Windows x86-64 installer from **Assets**. Do not download **Source code**, which is for building Launcher from source.
3. Double-click the installer and follow the prompts.
4. Open **RustFS Launcher** from the Start menu if it does not open automatically.

If Microsoft Defender SmartScreen displays a warning, verify that the installer came from the official `rustfs/launcher` Releases page before allowing it to run. Do not disable Windows security features globally.

### 4. Configure Launcher

Configure the fields in the Launcher window:

| Section | Field | Recommended value | Description |
| --- | --- | --- | --- |
| Dataset Mount | Data Path | `D:\rustfs\data` | Existing directory where RustFS stores object data. |
| Ports & Access | API Port | `9000` | S3-compatible API port. |
| Ports & Access | Host | `127.0.0.1` | Restricts access to this computer. |
| Ports & Access | Console Endpoint | Enabled | Enables the web Console; Launcher disables it by default. |
| Ports & Access | Console Port | `9001` | Console port, which must differ from the API port. |
| Credentials | Access Key | `<your-access-key>` | Administrator access key for this instance. |
| Credentials | Secret Key | `<your-secret-key>` | Administrator secret key for this instance. |

Select the data directory with **Browse** or drag it into Launcher. Launcher requires the directory to exist before startup.

Replace the credential placeholders with your own values. Launcher initially displays default local-test credentials; do not retain them on a computer accessible by other users.

:::warning[Network exposure]

Keep **Host** set to `127.0.0.1` unless another computer must connect to RustFS. A non-loopback address exposes the API and Console on the corresponding network interfaces. Configure Windows Defender Firewall and strong credentials before allowing remote access.

:::

### 5. Start and verify RustFS

1. Select **Launch RustFS**.
2. Wait for Launcher to report that the configured endpoint is online.
3. Open `http://localhost:9001` and sign in with the access key and secret key that you configured.
4. Use `http://localhost:9000` as the endpoint for S3-compatible clients.

![RustFS Launcher showing the service online with API port 9000, Console port 9001, and successful startup logs](./images/windows-rustfs-launcher.jpg)

If you changed the host or ports, use those values instead. The Console URL is available only when **Console Endpoint** is enabled.

Launcher locks its configuration while it manages a running process. It also creates a `logs` directory next to the data directory. For example, a data path of `D:\rustfs\data` places server log files under `D:\rustfs\logs`.

### 6. Stop or exit Launcher

Select **Stop RustFS** before changing configuration, disconnecting the data disk, or shutting down Windows.

Closing the Launcher window hides it in the Windows system tray; it does not stop RustFS. To stop the managed process and exit Launcher, right-click the tray icon and select **Quit**. Select **Show**, or left-click the tray icon, to restore the window.

## Install the standalone binary

### 7. Download and extract the binary

1. Open the [RustFS Releases page](https://github.com/rustfs/rustfs/releases).
2. Select the required release and download the Windows x86-64 ZIP archive from **Assets**. The asset name begins with `rustfs-windows-x86_64`.
3. Open PowerShell and create directories for the program and its data:

```powershell
New-Item -ItemType Directory -Force -Path C:\rustfs\bin
New-Item -ItemType Directory -Force -Path D:\rustfs\data
```

4. Extract the downloaded archive. Replace `<version>` with the version in the downloaded filename:

```powershell
Expand-Archive -Path "$HOME\Downloads\rustfs-windows-x86_64-<version>.zip" -DestinationPath C:\rustfs\bin -Force
```

5. Confirm that the extracted binary runs:

```powershell
Set-Location C:\rustfs\bin
.\rustfs.exe --help
```

If the archive extracts `rustfs.exe` into a nested directory, change to that directory or move the executable into `C:\rustfs\bin` before continuing.

### 8. Start the standalone server

Set credentials only for the current PowerShell session, then start RustFS with explicit addresses:

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

Keep the PowerShell window open while RustFS is running. Press `Ctrl+C` in that window to stop the server.

:::tip[Credential handling]

Session environment variables avoid placing credentials directly in the command line. For repeated or automated use, prefer the `RUSTFS_ACCESS_KEY_FILE` and `RUSTFS_SECRET_KEY_FILE` environment variables and protect those files with Windows access controls.

:::

### 9. Verify the standalone server

Open `http://localhost:9001` and sign in with the configured credentials. Use `http://localhost:9000` as the endpoint for S3-compatible clients. RustFS defaults to path-style addressing, so configure clients accordingly.

To perform an end-to-end check, create a bucket named `my-bucket`, upload `hello.txt`, and confirm that the object appears in the bucket.

## Confirm a successful installation

Whether you used Launcher or the standalone binary, a successful Console sign-in opens the **Buckets** page. From here, you can create `my-bucket` and begin storing objects.

![RustFS Console Buckets page after a successful sign-in](./images/rustfs-console-login.png)

## Troubleshooting

### Windows blocks the installer or executable

Confirm that the file came from the official RustFS GitHub organization. Inspect the file's **Properties** dialog and, when Windows provides the option, select **Unblock** only after verifying the source.

### The data path is rejected

Confirm that the directory exists and that your Windows account has read and write access. Launcher does not create the selected data directory for you.

### The API or Console port is unavailable

The ports must be numbers from `1` to `65535`, must differ from each other, and must not already be in use. Inspect the default ports in PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 9000,9001 -ErrorAction SilentlyContinue
```

Stop the conflicting application or select unused ports, then start RustFS again.

### The Console does not open

For Launcher, confirm that **Console Endpoint** is enabled. For the standalone binary, confirm that the process is still running and that `--console-enable true` is present. The current Console default is port `9001`; port `7001` is not used by the current Launcher configuration.

### Launcher reports an external RustFS process

Another process is listening on the configured API address, but Launcher did not start it. Stop that process or choose another API port. Launcher cannot stop a process it does not manage.

### RustFS exits after launch

In Launcher, inspect both the application and RustFS tabs in the built-in log viewer. For a standalone installation, inspect the PowerShell output. Common causes include a missing data directory, insufficient permissions, or a port conflict.

## Next steps

- Review the [S3 API guide](/administration/protocols/s3) before connecting a client.
- Learn how to [create a bucket](/administration/data/bucket/creation).
- See [status checks](/operations/status-check) for additional verification methods.
- Use the [Linux installation guides](/installation/linux) for a production-oriented deployment.
