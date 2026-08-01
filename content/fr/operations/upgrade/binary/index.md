---
title: "Binary Upgrade"
description: "Upgrade RustFS binary deployments one node at a time while preserving cluster availability."
---

Use a rolling upgrade to replace the RustFS executable on each node without taking the entire cluster offline. Before you begin, read the target release notes and confirm every node is healthy.

## Before you upgrade

Check readiness on every node:

```bash
curl -fsS http://<node-hostname>:9000/health/ready
```

Back up the service configuration and retain the currently running executable for rollback:

```bash
sudo cp /etc/default/rustfs /etc/default/rustfs.bak
sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
```

## Upgrade each node

Upgrade one node at a time. Do not continue until the restarted node reports ready.

```bash
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

Repeat the procedure for each remaining node.

## Roll back

If the new version fails validation, restore the previous executable on one node at a time and wait for readiness before continuing:

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

## Next steps

Review [Status Check](/operations/status-check) for additional post-upgrade validation.