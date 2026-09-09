---
title: "PyIceberg"
description: "使用 PyIceberg 通过 RustFS S3 Tables REST 目录创建、写入和读取 Iceberg 表。"
---

使用 **PyIceberg** 在 RustFS S3 Tables 目录中创建命名空间和表，追加两行数据，并在重新加载表后验证内容。本教程使用 PyIceberg `0.10.0`、Python `3.12` 和显式配置的访问凭证。

## 开始之前

- 完成 [S3 Tables 配置](/administration/data/s3-tables)，创建并启用 `my-bucket`，并满足其中的账户和 TLS 要求。
- 按该指南保留 `RUSTFS_ENDPOINT`、`AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY` 和 `AWS_DEFAULT_REGION` 环境变量。

## 1. 安装客户端

创建工作目录和隔离的 Python 环境：

```bash
mkdir rustfs-s3-tables
cd rustfs-s3-tables
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'pyiceberg[pyarrow]==0.10.0' boto3
```

## 2. 配置目录连接

保存以下连接模块。它采用 RustFS [已验证客户端示例](https://github.com/rustfs/rustfs/blob/7e0c67111b97703d47e23719b0264a739c8acea8/scripts/table-catalog/pyiceberg_smoke.py)中的 S3 SigV4 签名方式，同时签署初始目录发现请求和后续 REST 请求。

```python title="rustfs_catalog.py"
import hashlib
import os

from botocore.auth import S3SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.credentials import Credentials
from pyiceberg.catalog.rest import RestCatalog
from requests.adapters import HTTPAdapter

endpoint = os.environ["RUSTFS_ENDPOINT"].rstrip("/")
region = os.environ["AWS_DEFAULT_REGION"]
access_key = os.environ["AWS_ACCESS_KEY_ID"]
secret_key = os.environ["AWS_SECRET_ACCESS_KEY"]
credentials = Credentials(access_key, secret_key)


class RustFSSigV4Adapter(HTTPAdapter):
    def add_headers(self, request, **kwargs):
        body = request.body or b""
        if isinstance(body, str):
            body = body.encode("utf-8")
        request.headers["x-amz-content-sha256"] = hashlib.sha256(body).hexdigest()
        request.headers.pop("connection", None)
        signed = AWSRequest(
            method=request.method,
            url=request.url,
            data=body,
            headers=dict(request.headers),
        )
        S3SigV4Auth(credentials, "s3", region).add_auth(signed)
        request.headers.update(signed.headers)


class RustFSRestCatalog(RestCatalog):
    def _init_sigv4(self, session):
        session.mount(self.uri, RustFSSigV4Adapter())


catalog = RustFSRestCatalog(
    "rustfs",
    **{
        "uri": f"{endpoint}/iceberg",
        "warehouse": "my-bucket",
        "prefix": "my-bucket",
        "rest.sigv4-enabled": "true",
        "rest.signing-name": "s3",
        "rest.signing-region": region,
        "py-io-impl": "pyiceberg.io.pyarrow.PyArrowFileIO",
        "s3.endpoint": endpoint,
        "s3.access-key-id": access_key,
        "s3.secret-access-key": secret_key,
        "s3.region": region,
        "s3.force-virtual-addressing": "false",
    },
)
```

`s3.force-virtual-addressing=false` 会让 PyIceberg 的 PyArrow 文件实现使用路径式寻址。

:::note[客户端版本]

适配器覆盖 PyIceberg 的 `_init_sigv4` 钩子，使目录构造完成前发出的发现请求也带有签名。使用此模块时请保留固定的 PyIceberg 版本，升级前重新运行完整教程。

:::

## 3. 创建并读取表

示例创建命名空间 `analytics` 和表 `events`，任一资源已存在时都会停止。命名空间的每一段和表名均须为 1–64 个 ASCII 字符，仅允许小写字母、数字、`_`、`-`，且首尾必须是字母或数字。命名空间总长（含点号）不超过 512 个字符。

使用其他名称时，请修改 `example.py` 中的 `identifier`，并同步修改下方查看和移除命令中的名称。

将以下程序保存到同一目录：

```python title="example.py"
import json

import pyarrow as pa

from rustfs_catalog import catalog

identifier = ("analytics", "events")
schema = pa.schema(
    [
        pa.field("id", pa.int64(), nullable=False),
        pa.field("payload", pa.string(), nullable=False),
    ]
)
expected = [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]

catalog.create_namespace(identifier[0])
catalog.create_table(identifier, schema=schema)
table = catalog.load_table(identifier)
table.append(pa.Table.from_pylist(expected, schema=schema))

loaded = catalog.load_table(identifier)
actual = sorted(loaded.scan().to_arrow().to_pylist(), key=lambda row: row["id"])
assert actual == expected, f"Unexpected table contents: {actual}"
print("rows:", json.dumps(actual))
print("metadata:", loaded.metadata_location)
```

运行程序：

```bash
python example.py
```

输出包含两行完整数据，以及当前元数据对象的 S3 URI：

```text
rows: [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]
metadata: s3://my-bucket/<metadata-object-key>
```

生成的元数据对象键会有所不同。验证成功意味着程序已从目录重新加载表，并通过 S3 读取数据文件；仅创建表成功无法验证这两个结果。

## 4. 查看或注销示例

使用同一连接模块，在新的 Python 进程中列出表：

```bash
python - <<'PY'
from rustfs_catalog import catalog

print(catalog.list_tables("analytics"))
PY
```

结果应包含 `("analytics", "events")`。

:::note[仅移除目录条目]

以下命令移除本教程的表条目及其随后为空的命名空间，保留存储桶和底层对象。如需清理数据，请先规划：执行 `drop_table` 后，表维护将无法找到该表。请参阅[维护与数据保护](/administration/data/s3-tables)。

:::

```bash
python - <<'PY'
from rustfs_catalog import catalog

catalog.drop_table(("analytics", "events"))
catalog.drop_namespace("analytics")
PY
```

## 后续步骤

- 参考 [PyIceberg API 文档](https://py.iceberg.apache.org/api/)使用客户端操作，并逐项确认是否在 RustFS 支持范围内。
- 如果自行管理独立目录服务，请使用[外部 Iceberg 目录集成](/developer/integration/big-data/iceberg)。
