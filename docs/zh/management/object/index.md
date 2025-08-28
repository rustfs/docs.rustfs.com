---
title: "RustFS 对象管理"
description: "RustFS 对象管理介绍,包括对象的创建/删除、对象版本、对象锁、对象分享、对象扫描等.​"
---

# RustFS 对象管理

对象（Object）是 RustFS 存储的基本单元，包含数据、元数据和唯一标识符（Object Key）。数据以对象的形式存储。本章节详细分享 RustFS 对象全生命周期管理的内容，内容包括：

- [对象上传](./creation.md)
- [对象删除](./deletion.md)
- 对象版本
- 对象锁
- 对象分享
- [对象扫描](./scanner.md)