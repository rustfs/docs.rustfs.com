---
title: "CocoIndex"
description: "用 CocoIndex 把存放在 RustFS 桶中的文档索引成向量。"
---

本指南将面向 AI 管道的增量索引引擎 [CocoIndex](https://github.com/cocoindex-io/cocoindex) 连接到 **RustFS** 作为文档源。你将构建一个流：从桶前缀列出 markdown 文件、分块并向量化、把向量存进 Postgres，最后查询索引。整个流程使用 CocoIndex `1.0.26` 通过自定义 S3 端点从 RustFS 桶读取验证通过。

你需要 Python 3.11+ 和带 `pgvector` 扩展的 Postgres（流的与状态存储）。

## 架构

```mermaid
flowchart LR
	RustFS["RustFS :9000"] -->|"S3 source: *.md"| Flow["CocoIndex flow"]
	Flow -->|"chunks + embeddings"| PG["Postgres + pgvector"]
	Query["semantic query"] --> PG
```

CocoIndex 通过你自建的 aiobotocore 客户端读取源对象，因此任何 S3 兼容端点都能用——包括路径样式寻址的 RustFS。增量更新只处理内容变化的文件，以稳定的 S3 路径为键。

## 1. 准备环境

安装带 S3 连接器的 CocoIndex 和 embedding 栈：

```bash
python3 -m venv .venv
./.venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
./.venv/bin/pip install "cocoindex[amazon_s3]" asyncpg pgvector numpy python-dotenv sentence-transformers
```

把源文档上传到桶前缀，替换全部连接占位符：

```bash
aws s3 cp ./docs s3://my-bucket/cocoindex-docs/ --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

```text
upload: docs/rag-basics.md to s3://my-bucket/cocoindex-docs/rag-basics.md
upload: docs/rustfs-overview.md to s3://my-bucket/cocoindex-docs/rustfs-overview.md
```

## 2. 编写流

创建环境文件和流。S3 客户端在 `AWS_ENDPOINT_URL` 已设置时创建，aiobotocore 会据此指向 S3 兼容端点：

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

## 3. 从 RustFS 构建索引

```bash
set -a && . ./.env && set +a
./.venv/bin/cocoindex update main
```

```text
✅ app_main: 1 total | 1 added
✅ process_file: 2 total | 2 added
```

两个 markdown 文件都从 RustFS 桶读出、分块并向量化进 Postgres。用 `main.py` 的入口查询索引。脚本会加载 `.env`，用同一模型计算问题的嵌入，并打印最近的 chunk：

```bash
./.venv/bin/python main.py "what does RustFS expose"
```

```text
[0.163] rag-basics.md
    Retrieval augmented generation combines a retriever and a generator.
---
```

查询命中的 chunk 以桶为事实来源——在 RustFS 里编辑文件后重跑 `cocoindex update main`，只会增量重建变化的部分。

![RustFS 控制台中的 CocoIndex 源文档](./images/rustfs-cocoindex-source.png)

## 4. 停止或重置

删除已索引的文档：

```bash
aws s3 rm s3://my-bucket/cocoindex-docs --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

## 故障排查

### `Environment settings must provide Settings.db_path`

CocoIndex 自己的状态也存 Postgres。把 `COCOINDEX_DB`（目标表用 `POSTGRES_URL`）指向启用了 `pgvector` 扩展的数据库。

### 流报 `InvalidAccessKeyId` 或连接超时

运行流之前没有导出环境变量（`set -a && . ./.env && set +a`）。`AWS_ENDPOINT_URL` 必须带协议；凭证走标准 `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`。

### 流看不到文件

检查前缀与匹配器——`list_objects` 遍历 `S3_PREFIX` 并按 `included_patterns` 过滤。先用 `aws s3 ls s3://my-bucket/cocoindex-docs/` 确认对象存在。

## 下一步

- 在接入更多源之前，先阅读 [S3 兼容性说明](/administration/protocols/s3)。
- 使用[访问密钥管理](/security-compliance/iam/access-token)创建专用的生产凭证。
- 按照 [CocoIndex Amazon S3 连接器文档](https://cocoindex.io/docs/connectors/amazon_s3)使用路径匹配器、大小限制与实时更新。
