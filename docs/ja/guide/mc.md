---
title: "MinIO Client で RustFS オブジェクトを管理する"
description: "MinIO Client を用いた RustFS オブジェクト管理"
---

# MinIO Client（`mc`）

MinIO Client（`mc`）は MinIO 公式の CLI で、MinIO/S3 互換オブジェクトストレージを管理できます。S3 互換のため、`mc` は RustFS の管理にも利用できます。

前提条件：

- RustFS インスタンス（../../ja/installation/index.md）
- `mc` がインストール済み
- 利用可能な[アクセスキー](access-token.md)

## `mc` で RustFS を操作する

まず `mc alias` で RustFS のエイリアスを設定します：

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

応答：

```
Added `rustfs` successfully.
```

以降、エイリアス `rustfs` を用いて、バケット作成/削除、ファイルのアップロード/ダウンロード等を実行できます。

### バケット一覧

```
mc ls rustfs
```

応答：

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### バケット作成

```
mc mb rustfs/bucket-creation-by-mc
```

応答：

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### バケット削除

```
mc rb rustfs/bucket-creation-by-mc
```

応答：

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### ファイルをアップロード

```
mc cp file_name rustfs/bucket-creation-by-mc
```

応答：

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### ファイルを削除

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

応答：

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### ファイルをダウンロード

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

応答：

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```