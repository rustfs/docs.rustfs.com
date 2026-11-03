---
title: "CocoIndex"
description: "RustFS バケットに保存した文書を CocoIndex で埋め込みにインデックスする。"
---

このガイドは、AI パイプライン向けの増分インデックスエンジン [CocoIndex](https://github.com/cocoindex-io/cocoindex) を、ドキュメントソースとして **RustFS** に接続します。バケットのプレフィックスから markdown ファイルを一覧し、チャンク化して埋め込みを生成し、Postgres に保存してインデックスをクエリするフローを構築します。このワークフローは CocoIndex `1.0.26` がカスタム S3 エンドポイント経由で RustFS バケットから読み取る形で検証しました。

Python 3.11 以上と、フローのターゲットおよび状態のための `pgvector` 拡張付き Postgres が必要です。

## アーキテクチャ

```mermaid
flowchart LR
	RustFS["RustFS :9000"] -->|"S3 source: *.md"| Flow["CocoIndex flow"]
	Flow -->|"chunks + embeddings"| PG["Postgres + pgvector"]
	Query["semantic query"] --> PG
```

CocoIndex は自分で作成する aiobotocore クライアント経由でソースオブジェクトを読むため、S3 互換エンドポイントなら何でも使えます。パススタイルアドレッシングの RustFS も例外ではありません。増分更新は内容が変わったファイルだけを再処理し、安定した S3 パスをキーにします。

## 1. 環境を準備する

S3 コネクタ付きの CocoIndex と埋め込みスタックをインストールします：

```bash
python3 -m venv .venv
./.venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
./.venv/bin/pip install "cocoindex[amazon_s3]" asyncpg pgvector numpy python-dotenv sentence-transformers
```

ソース文書をバケットのプレフィックスへアップロードします。接続プレースホルダーをすべて置き換えてください：

```bash
aws s3 cp ./docs s3://my-bucket/cocoindex-docs/ --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

```text
upload: docs/rag-basics.md to s3://my-bucket/cocoindex-docs/rag-basics.md
upload: docs/rustfs-overview.md to s3://my-bucket/cocoindex-docs/rustfs-overview.md
```

## 2. フローを書く

環境ファイルとフローを作成します。S3 クライアントは `AWS_ENDPOINT_URL` を設定した状態で作成し、aiobotocore は S3 互換エンドポイントとしてこれを扱います：

```ini title=".env"
S3_BUCKET=my-bucket
S3_PREFIX=cocoindex-docs/
AWS_ENDPOINT_URL=http://<your-rustfs-endpoint>:9000
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_DEFAULT_REGION=us-east-1
COCOINDEX_DB=postgres://cocoindex:cocoindex@localhost:5432/cocoindex
POSTGRES_URL=postgres://cocoindex:cocoindex@localhost:5432/cocoindex
```

```python title="main.py"
import asyncio, os, sys
from dataclasses import dataclass
from typing import AsyncIterator, Annotated

import aiobotocore.session
import asyncpg
from dotenv import load_dotenv
from numpy.typing import NDArray
from pgvector.asyncpg import register_vector

load_dotenv()

import cocoindex as coco
from cocoindex.connectors import amazon_s3, postgres
from cocoindex.ops.sentence_transformers import SentenceTransformerEmbedder
from cocoindex.ops.text import RecursiveSplitter
from cocoindex.resources.chunk import Chunk
from cocoindex.resources.file import PatternFilePathMatcher

DATABASE_URL = os.environ["POSTGRES_URL"]
TABLE_NAME = "rustfs_doc_embeddings"
PG_SCHEMA_NAME = "coco_examples"
S3_BUCKET = os.environ["S3_BUCKET"]
S3_PREFIX = os.getenv("S3_PREFIX", "")
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
PG_DB = coco.ContextKey[asyncpg.Pool]("db")
S3_CLIENT = coco.ContextKey[object]("s3_client")
EMBEDDER = coco.ContextKey[SentenceTransformerEmbedder]("embedder", detect_change=True)

_splitter = RecursiveSplitter()

@coco.lifespan
async def coco_lifespan(builder: coco.EnvironmentBuilder) -> AsyncIterator[None]:
    async with asyncpg.create_pool(DATABASE_URL, init=register_vector) as pool:
        builder.provide(PG_DB, pool)
        builder.provide(EMBEDDER, SentenceTransformerEmbedder(EMBED_MODEL))
        session = aiobotocore.session.get_session()
        async with session.create_client("s3") as s3_client:
            builder.provide(S3_CLIENT, s3_client)
            yield

@dataclass
class DocEmbedding:
    id: int
    filename: str
    text: str
    embedding: Annotated[NDArray, EMBEDDER]

@coco.fn
async def process_chunk(chunk: Chunk, filename: str, table: postgres.TableTarget[DocEmbedding]) -> None:
    table.declare_row(row=DocEmbedding(
        id=abs(hash(f"{filename}:{chunk.start.char_offset}")) % (10 ** 9),
        filename=filename, text=chunk.text,
        embedding=await coco.use_context(EMBEDDER).embed(chunk.text),
    ))

@coco.fn(memo=True)
async def process_file(file: amazon_s3.S3File, table: postgres.TableTarget[DocEmbedding]) -> None:
    text = await file.read_text()
    chunks = _splitter.split(text, chunk_size=2000, chunk_overlap=500, language="markdown")
    await coco.map(process_chunk, chunks, file.file_path.path.as_posix(), table)

@coco.fn
async def app_main() -> None:
    target_table = await postgres.mount_table_target(
        PG_DB, table_name=TABLE_NAME,
        table_schema=await postgres.TableSchema.from_class(DocEmbedding, primary_key=["id"]),
        pg_schema_name=PG_SCHEMA_NAME,
    )
    client = coco.use_context(S3_CLIENT)
    files = amazon_s3.list_objects(client, S3_BUCKET, prefix=S3_PREFIX,
                                   path_matcher=PatternFilePathMatcher(included_patterns=["**/*.md"]))
    await coco.mount_each(process_file, files.items(), target_table)

app = coco.App(coco.AppConfig(name="RustFSDocs"), app_main)

TOP_K = 5


async def query_once(
    pool: asyncpg.Pool,
    embedder: SentenceTransformerEmbedder,
    query: str,
    *,
    top_k: int = TOP_K,
) -> None:
    query_vec = await embedder.embed(query)
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            f"""
            SELECT filename, text, embedding <=> $1 AS distance
            FROM "{PG_SCHEMA_NAME}"."{TABLE_NAME}"
            ORDER BY distance ASC
            LIMIT $2
            """,
            query_vec,
            top_k,
        )
    for r in rows:
        score = 1.0 - float(r["distance"])
        print(f"[{score:.3f}] {r['filename']}")
        print(f"    {r['text']}")
        print("---")


async def query(initial_query: str | None = None) -> None:
    embedder = SentenceTransformerEmbedder(EMBED_MODEL)
    async with asyncpg.create_pool(DATABASE_URL, init=register_vector) as pool:
        if initial_query is not None:
            await query_once(pool, embedder, initial_query)
            return
        while True:
            q = input("Enter search query (or Enter to quit): ").strip()
            if not q:
                break
            await query_once(pool, embedder, q)


if __name__ == "__main__":
    initial = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else None
    asyncio.run(query(initial))
```

## 3. RustFS からインデックスを構築する

```bash
set -a && . ./.env && set +a
./.venv/bin/cocoindex update main
```

```text
✅ app_main: 1 total | 1 added
✅ process_file: 2 total | 2 added
```

2 つの markdown ファイルが RustFS バケットから読み込まれ、チャンク化されて Postgres に埋め込まれました。`main.py` のエントリポイントでインデックスを検索します。スクリプトは `.env` を読み込み、同じモデルで質問の埋め込みを計算し、最も近いチャンクを表示します：

```bash
./.venv/bin/python main.py "what does RustFS expose"
```

```text
[0.163] rag-basics.md
    Retrieval augmented generation combines a retriever and a generator.
---
```

クエリがヒットするチャンクの正本（source of truth）はバケットです。RustFS 内のファイルを編集して `cocoindex update main` を再実行すれば、変更部分だけが増分で再インデックスされます。

![RustFS コンソール上の CocoIndex ソース文書](./images/rustfs-cocoindex-source.png)

## 4. 停止またはリセット

インデックス済みの文書を削除するには：

```bash
aws s3 rm s3://my-bucket/cocoindex-docs --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

## トラブルシューティング

### `Environment settings must provide Settings.db_path`

CocoIndex は自身の状態も Postgres に保持します。`COCOINDEX_DB`（ターゲットには `POSTGRES_URL`）を、`pgvector` 拡張が有効なデータベースに向けてください。

### フローからの `InvalidAccessKeyId` や接続タイムアウト

フロー実行前に環境変数がエクスポートされていません（`set -a && . ./.env && set +a`）。`AWS_ENDPOINT_URL` にはスキーマが必須で、認証情報は標準の `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` のペアで渡します。

### フローがファイルを 1 つも見つけられない

プレフィックスとマッチャーを確認してください。`list_objects` は `S3_PREFIX` を走査し、`included_patterns` で絞り込みます。`aws s3 ls s3://my-bucket/cocoindex-docs/` でオブジェクトの存在を確認してください。

## 次のステップ

- 追加のソースを接続する前に [S3 互換性についての注意](/administration/protocols/s3) を確認してください。
- [アクセスキー管理](/security-compliance/iam/access-token) で本番用の専用認証情報を作成してください。
- [CocoIndex Amazon S3 コネクタのドキュメント](https://cocoindex.io/docs/connectors/amazon_s3) に従い、パスマッチャー・サイズ制限・ライブ更新を活用してください。
