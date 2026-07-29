---
title: "Upgrade"
description: "Plan and perform RustFS upgrades while preserving cluster availability."
---

Choose the upgrade workflow that matches how you deploy RustFS. For multi-node clusters, replace one node or pod at a time and wait for it to report ready before continuing.

## Deployment methods

- [Binary Upgrade](./binary/index.md) covers systemd-managed executable replacement and rollback.
- [Container Upgrade](./container/index.md) covers image replacement with persistent data volumes.
- [Kubernetes Upgrade](./kubernetes/index.md) covers Helm- and Operator-managed workloads.

Before any upgrade, read the target release notes and confirm the cluster is healthy.