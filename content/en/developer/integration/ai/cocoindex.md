---
title: "CocoIndex"
description: "Index documents stored in a RustFS bucket into embeddings with CocoIndex."
---

This guide connects [CocoIndex](https://github.com/cocoindex-io/cocoindex) — the incremental indexing engine for AI pipelines — to **RustFS** as the document source. You will build a flow that lists markdown files from a bucket prefix, splits and embeds them, stores the embeddings in Postgres, and queries the index. The workflow was verified with CocoIndex `1.0.26` reading from a RustFS bucket through a custom S3 endpoint.

You need Python 3.11+ and a Postgres with the `pgvector` extension for the flow's target and state.

## Architecture

```mermaid
flowchart LR
	RustFS["RustFS :9000"] -->|"S3 source: *.md"| Flow["CocoIndex flow"]
	Flow -->|"chunks + embeddings"| PG["Postgres + pgvector"]
	Query["semantic query"] --> PG
```

CocoIndex reads source objects through an aiobotocore client you create yourself, so any S3-compatible endpoint works — including RustFS with path-style addressing. Incremental updates only reprocess files whose content changed, keyed by stable S3 paths.

## 1. Prepare the environment

Install CocoIndex with the S3 connector plus the embedding stack:

```bash
python3 -m venv .venv
./.venv/bin/pip install torch --index-url https://download.pytorch.org/whl/cpu
./.venv/bin/pip install "cocoindex[amazon_s3]" asyncpg pgvector numpy python-dotenv sentence-transformers
```

Upload source documents into a bucket prefix, replacing all connection placeholders:

```bash
aws s3 cp ./docs s3://my-bucket/cocoindex-docs/ --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

```text
upload: docs/rag-basics.md to s3://my-bucket/cocoindex-docs/rag-basics.md
upload: docs/rustfs-overview.md to s3://my-bucket/cocoindex-docs/rustfs-overview.md
```

## 2. Write the flow

Create the environment file and the flow. The S3 client is created with `AWS_ENDPOINT_URL` set, which aiobotocore honors for S3-compatible endpoints:

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

## 3. Build the index from RustFS

```bash
set -a && . ./.env && set +a
./.venv/bin/cocoindex update main
```

```text
✅ app_main: 1 total | 1 added
✅ process_file: 2 total | 2 added
```

Both markdown files were read from the RustFS bucket, split, and embedded into Postgres. Query the index with the entrypoint in `main.py`. It loads `.env`, embeds the question with the same model, and prints the nearest chunks:

```bash
./.venv/bin/python main.py "what does RustFS expose"
```

```text
[0.163] rag-basics.md
    Retrieval augmented generation combines a retriever and a generator.
---
```

The query hits chunks whose source of truth is the bucket — edit a file in RustFS and re-run `cocoindex update main` to incrementally re-index only the change.

![CocoIndex source documents in the RustFS Console](./images/rustfs-cocoindex-source.png)

## 4. Stop or reset

To delete the indexed documents:

```bash
aws s3 rm s3://my-bucket/cocoindex-docs --recursive \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

## Troubleshooting

### `Environment settings must provide Settings.db_path`

CocoIndex keeps its own state in Postgres. Set `COCOINDEX_DB` (and `POSTGRES_URL` for the target) to a database with the `pgvector` extension enabled.

### `InvalidAccessKeyId` or connection timeouts from the flow

The environment variables were not exported before running the flow (`set -a && . ./.env && set +a`). The `AWS_ENDPOINT_URL` must include the scheme; credentials go through the standard `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` pair.

### The flow sees no files

Check the prefix and matcher — `list_objects` walks `S3_PREFIX` and filters by `included_patterns`. Confirm the objects exist with `aws s3 ls s3://my-bucket/cocoindex-docs/`.

## Next steps

- Review [S3 compatibility notes](/administration/protocols/s3) before wiring additional sources on the same bucket.
- Create dedicated production credentials with [Access Key Management](/security-compliance/iam/access-token).
- Follow the [CocoIndex Amazon S3 connector documentation](https://cocoindex.io/docs/connectors/amazon_s3) for path matchers, size limits, and live updates.
