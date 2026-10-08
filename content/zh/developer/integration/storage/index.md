---
title: "存储"
description: "将 RustFS 用作存储系统与存储网关的 S3 后端。"
---

将 **RustFS** 用作在对象存储之上构建的存储系统与存储网关的后端。

## 系统

- [lakeFS](./lakefs.md)
- [OpenDAL](./opendal.md)
- [ZeroFS](./zerofs.md)
- [s3fs](./s3fs.md)
- [SFTPGo](./sftpgo.md)
- [Alluxio](./alluxio.md)

请为每个系统使用专用的桶和前缀，并为凭证仅授予所需桶操作的权限。
