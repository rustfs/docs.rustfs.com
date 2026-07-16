# Installing RustFS on macOS (/installation/macos)







On macOS, you can use three methods for installation:

1. Docker
2. Graphical one-click startup package
3. Binary package

> This article mainly explains how to use the RustFS **graphical one-click startup package** to quickly launch RustFS.

<div className="fd-steps">
  <div className="fd-step">
    ## Preparation [#1-preparation]

    <Callout type="info">
      **Graphical startup mode** only supports single-node single-disk mode, more suitable for development, debugging, and testing environments.
    </Callout>

    1. For detailed introduction about startup modes, please refer to [Installation Modes](../linux/quick-start.md#mode)
    2. Download the installation package, modify permissions, and start.
  </div>

  <div className="fd-step">
    ## Download [#2-download]

    Go to the official website download page and download the latest RustFS installation package.
  </div>

  <div className="fd-step">
    ## Modify Permissions [#3-modify-permissions]

    Please confirm that this program has relevant execution permissions in the macOS operating system.
  </div>

  <div className="fd-step">
    ## Start the Service [#4-start-the-service]

    1. Double-click the startup icon
    2. Click configure disk
    3. Click "Start Service", and RustFS service starts successfully.

        <img alt="macos startup" src="__img0" />
  </div>

  <div className="fd-step">
    ## Modify Configuration [#5-modify-configuration]

    Click the modify button (gear-shaped button) in the upper right corner to modify:

    1. Server default port
    2. Default administrator username and password
    3. Specified disk directory

        <img alt="RustFS macOS configuration" src="__img1" />
  </div>

  <div className="fd-step">
    ## Access Console [#6-access-console]

    After successful startup, visit `http://127.0.0.1:7001` to access the console.

    <Callout type="info">
      Port `7001` applies to the macOS desktop launcher. If you run the standalone `rustfs` server binary instead, the console listens on port `9001` by default.
    </Callout>
  </div>
</div>
