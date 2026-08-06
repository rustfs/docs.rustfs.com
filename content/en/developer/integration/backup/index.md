---
title: "Backup"
description: "Connect backup tools to RustFS through S3-compatible object storage interfaces."
---

Use **RustFS** as the object storage backend for backup tools that store repository data in an S3-compatible service.

## Systems

- [Restic](./restic.md)

Keep backup jobs in a dedicated bucket and prefix, and use credentials scoped to the required bucket operations.