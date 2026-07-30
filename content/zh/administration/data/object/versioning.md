---
title: "版本控制"
description: "使用 rc 和控制台启用存储桶版本控制、恢复早期对象版本并管理删除标记。"
---

RustFS 存储桶版本控制会保留同一对象键的多个版本。使用它可从意外覆盖和删除中恢复，也是对象锁定和存储桶复制的先决条件。

## 概述

启用版本控制后：

- 每次向现有键上传或复制内容都会创建新的版本 ID。
- 常规删除会创建删除标记，而不会删除旧版本。
- 不带版本 ID 读取对象键时，会返回最新的可见版本；如果最新条目是删除标记，则返回 `NotFound`。
- 读取或删除特定版本需要其版本 ID。

暂停版本控制会停止常规创建新版本 ID，但会保留现有版本和删除标记。暂停并不等同于禁用版本控制或删除版本历史记录。

## 在控制台中配置

### 创建存储桶时启用

1. 打开 **Buckets** 并选择 **Create Bucket**。
2. 输入存储桶名称。
3. 启用 **Version**。
4. 选择 **Create**。

### 为现有存储桶启用或暂停版本控制

1. 打开 **Buckets**，找到存储桶并选择 **Settings**。
2. 在 **Data Protection** 下找到 **Versioning**。
3. 根据需要启用或暂停版本控制。

设置页面会显示 `Enabled`、`Suspended` 或 `Disabled`，并注明暂停会保留现有版本。

### 浏览和恢复版本

1. 打开存储桶；需要查看被删除标记隐藏的键时，启用 **Show Deleted Objects**。
2. 选择对象名称以打开 **Object Details**。
3. 选择 **Versions**，检查可用版本和删除标记。
4. 下载所需版本并重新上传，使其内容成为最新版本。

## 使用 rc

创建存储桶并启用版本控制：

```bash
rc bucket create rustfs/my-bucket
rc bucket version enable rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

上传同一键的两个版本：

```bash
printf 'version one\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt

printf 'version two\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt --overwrite
```

列出版本，并记录要恢复版本的 ID：

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

下载早期版本的内容并将其作为新的最新版本上传，以恢复该版本：

```bash
rc object show rustfs/my-bucket/hello.txt \
	--version-id <version-id> > /tmp/hello-restored.txt

rc object copy /tmp/hello-restored.txt \
	rustfs/my-bucket/hello.txt --overwrite
```

删除当前键以创建删除标记，然后检查该标记：

```bash
rc object remove rustfs/my-bucket/hello.txt --force
rc bucket version list rustfs/my-bucket/hello.txt --json
```

最新条目应显示 `is_delete_marker: true`。早期版本仍可通过版本 ID 访问。

当不再希望常规写入创建带编号的新版本时，暂停版本控制：

```bash
rc bucket version suspend rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

:::warning[rc 0.1.29 版本删除限制]

`rc object remove --versions` 会出现在 `rc 0.1.29` 帮助输出中，但会返回 `not implemented`。请使用控制台或 S3 SDK 永久删除选定的版本 ID。除非已验证保留、复制和恢复要求，否则不要删除完整的版本历史记录。

:::

## 验证

启用版本控制后：

1. 使用不同内容向同一键上传两次。
2. 运行 `rc bucket version list`，确认两个条目具有不同的版本 ID。
3. 使用 `rc object show --version-id` 获取每个版本并比较其内容。
4. 删除不带版本 ID 的键，并确认出现删除标记。
5. 按版本 ID 获取旧版本，确认该版本仍可恢复。

## 运维注意事项

- 覆盖和删除会保留旧数据，因此版本控制会增加存储用量。
- 只有在定义恢复期和保留期后，才为非当前版本配置生命周期规则。
- 存储桶复制要求源存储桶和目标存储桶均启用版本控制。
- 对象锁定依赖版本控制，并保护单个版本。
- 在启用版本控制的存储桶中，完成分段上传会创建一个新对象版本。

## 后续步骤

- [使用对象锁定保护版本](./object-lock.md)
- [上传大型对象](./multipart-upload.md)
- [管理存储桶生命周期](../lifecycle-management.md)