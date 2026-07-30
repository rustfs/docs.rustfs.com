---
title: "生命周期管理"
description: "使用 rc 命令行客户端配置、检查和维护 RustFS 对象生命周期规则。"
---

RustFS 生命周期管理将过期和转换规则应用于存储桶中的对象。本页介绍如何使用 `rc` 管理这些规则、验证转换，以及为已转换的数据恢复临时本地副本。

开始前，请[安装 `rc`](/operations/rc)，配置名为 `local` 的别名并创建 `my-bucket`。如需转换对象，请先在[分层存储](/administration/data/tiered-storage)中注册目标，并记下其大写层级名称。

:::note[异步评估]

生命周期规则不会立即处理每个符合条件的对象。[对象扫描器](/administration/data/object/scanner)会在后台评估生命周期任务。

:::

## 添加过期规则

让 `logs/` 前缀下的对象在创建 30 天后过期：

```bash
rc bucket lifecycle rule add local/my-bucket \
	--prefix logs/ \
	--expiry-days 30
```

该命令会创建一条已启用的规则，并返回生成的规则 ID。需要编辑或删除这条特定规则时，请记录该 ID。

## 添加转换规则

在 90 天后将对象数据移至已注册的 `COLDTIER` 层级：

```bash
rc bucket lifecycle rule add local/my-bucket \
	--transition-days 90 \
	--storage-class COLDTIER
```

`--storage-class` 必须与已注册的层级名称匹配。添加规则不会创建层级，也不会将 AWS 存储类标签验证为 RustFS 层级。

可以在一条规则中组合过期和转换选项。仅对已启用版本控制的存储桶使用非当前版本选项：

```bash
rc bucket lifecycle rule add local/my-bucket \
	--noncurrent-transition-days 30 \
	--noncurrent-transition-storage-class COLDTIER \
	--noncurrent-expiry-days 365
```

## 检查和更新规则

列出当前规则，并记下要更改规则的 ID：

```bash
rc bucket lifecycle rule list local/my-bucket
```

更改规则的过期时间，或在不删除规则的情况下将其禁用：

```bash
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--expiry-days 60
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--disable true
```

按 ID 删除一条规则。仅当确实要删除存储桶的完整生命周期配置时使用 `--all`：

```bash
rc bucket lifecycle rule remove local/my-bucket --id <rule-id>
rc bucket lifecycle rule remove local/my-bucket --all
```

## 导出和导入规则

批量更改前，导出存储桶的生命周期配置：

```bash
rc bucket lifecycle rule export local/my-bucket > lifecycle.json
```

导入文件会替换发送到存储桶的生命周期配置。应用前请检查 JSON：

```bash
rc bucket lifecycle rule import local/my-bucket lifecycle.json
```

## 确认生命周期转换

对象满足生命周期规则的条件后，在源集群上检查该对象：

```bash
aws s3api head-object \
	--bucket my-bucket \
	--key hello.txt \
	--endpoint-url http://localhost:9000
```

转换完成后，响应会将已注册的层级名称报告为存储类：

```json
{
	"StorageClass": "COLDTIER"
}
```

响应可能包含其他对象元数据。转换完成前，`StorageClass` 可能不存在，也可能尚未报告为 `COLDTIER`。

照常通过源 RustFS 端点读取对象：

```bash
aws s3 cp \
	s3://my-bucket/hello.txt \
	/path/to/hello.txt \
	--endpoint-url http://localhost:9000
```

RustFS 通过源存储桶和对象键读取已转换的数据。应用无需直接访问目标存储桶。

## 恢复本地副本

请求已转换对象的临时本地副本，并保留七天：

```bash
rc bucket lifecycle restore local/my-bucket/hello.txt --days 7
```

回迁副本期间，`HEAD` 会报告 `x-amz-restore: ongoing-request="true"`。完成后，它会报告 `ongoing-request="false"` 和到期日期。在恢复进行期间再次提交恢复请求会返回 `RestoreAlreadyInProgress`。

恢复期限到期后，RustFS 会删除本地恢复副本及其恢复元数据。已转换的对象仍可从远程层级访问。

## 命令兼容性

最新版本的 `rc` 也接受 `rc ilm` 作为兼容别名。对于新命令和脚本，我们建议使用名词优先的 `rc bucket lifecycle` 形式：

```bash
rc bucket lifecycle --help
rc bucket lifecycle rule --help
rc bucket lifecycle tier --help
```

## 后续步骤

查看[分层存储](/administration/data/tiered-storage)以监控或维护远程层级，并使用[创建对象](/administration/data/object/creation)为生命周期规则创建测试对象。