---
title: "PyIceberg"
description: "PyIceberg を使用して、RustFS S3 Tables の REST カタログ経由で Iceberg テーブルを作成し、読み書きします。"
---

**PyIceberg** を使用して RustFS S3 Tables カタログに名前空間とテーブルを作成し、2 行を追加してから、テーブルの再読み込み後にデータを検証します。このチュートリアルでは、PyIceberg `0.10.0`、Python `3.12`、明示的に設定したアクセス認証情報を使用します。

## 前提条件

- [S3 Tables の設定](/administration/data/s3-tables)を完了し、`my-bucket` を作成して有効にします。アカウントと TLS の要件も満たしてください。
- そのガイドで設定した `RUSTFS_ENDPOINT`、`AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`、`AWS_DEFAULT_REGION` を維持します。

## 1. クライアントをインストールする

ディレクトリと分離された Python 環境を作成します。

```bash
mkdir rustfs-s3-tables
cd rustfs-s3-tables
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'pyiceberg[pyarrow]==0.10.0' boto3
```

## 2. カタログ接続を設定する

次の接続モジュールを保存します。RustFS の[検証済みクライアント例](https://github.com/rustfs/rustfs/blob/7e0c67111b97703d47e23719b0264a739c8acea8/scripts/table-catalog/pyiceberg_smoke.py)と同じ S3 SigV4 の署名方式を使用し、初回のカタログ検出リクエストと後続の REST リクエストの両方に署名します。

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

`s3.force-virtual-addressing=false` は、このカスタムエンドポイントに対して PyIceberg の PyArrow ファイル実装でパス形式のアドレス指定を選択します。

:::note[クライアントのバージョン]

アダプターは PyIceberg の `_init_sigv4` フックをオーバーライドし、カタログのコンストラクターが完了する前の検出リクエストにも署名します。このモジュールでは指定された PyIceberg バージョンを維持し、変更する前にチュートリアル全体を再実行してください。

:::

## 3. テーブルを作成して読み取る

サンプルは名前空間 `analytics` とテーブル `events` を作成し、どちらかがすでに存在すると停止します。名前空間の各セグメントとテーブル名は 1–64 文字の ASCII 文字列とし、小文字の英字、数字、`_`、`-` のみを使用できます。先頭と末尾は英字または数字にする必要があります。名前空間全体は、ドットを含めて 512 文字以内です。

別の名前を使う場合は、`example.py` 内の `identifier` と、以下の確認および削除コマンド内の名前を変更します。

次のプログラムを同じディレクトリに保存します。

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

実行します。

```bash
python example.py
```

出力には、2 行分の完全なデータと現在のメタデータオブジェクトの S3 URI が含まれます。

```text
rows: [{"id": 1, "payload": "alpha"}, {"id": 2, "payload": "beta"}]
metadata: s3://my-bucket/<metadata-object-key>
```

生成されるメタデータのオブジェクトキーは実行ごとに異なります。検証の成功は、カタログからテーブルを再読み込みし、S3 経由でデータファイルを読み取れたことを意味します。テーブルの作成に成功しただけでは、この 2 点は検証できません。

## 4. サンプルを確認または登録解除する

同じ接続モジュールを使用し、新しい Python プロセスからテーブルを一覧表示します。

```bash
python - <<'PY'
from rustfs_catalog import catalog

print(catalog.list_tables("analytics"))
PY
```

結果には `("analytics", "events")` が含まれているはずです。

:::note[カタログエントリのみを削除]

以下のコマンドは、このチュートリアルのテーブルエントリと、削除後に空になる名前空間を削除します。バケットと基になるオブジェクトは残ります。データのクリーンアップが必要な場合は、実行前に計画してください。`drop_table` の後は、テーブルメンテナンスでテーブルを見つけられなくなります。[メンテナンスとデータ保護](/administration/data/s3-tables)を参照してください。

:::

```bash
python - <<'PY'
from rustfs_catalog import catalog

catalog.drop_table(("analytics", "events"))
catalog.drop_namespace("analytics")
PY
```

## 次のステップ

- クライアント操作は [PyIceberg API ドキュメント](https://py.iceberg.apache.org/api/)を参照し、各操作が RustFS のサポート範囲に含まれるか確認します。
- 別のカタログサービスを管理している場合は、[外部 Iceberg カタログとの連携](/developer/integration/big-data/iceberg)を使用します。
