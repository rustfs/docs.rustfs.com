---
title: "ストレージ"
description: "ストレージシステムとストレージゲートウェイの S3 バックエンドとして RustFS を使います。"
---

**RustFS** を、オブジェクトストレージの上に構築されたストレージシステムとゲートウェイのバックエンドとして使います。

## システム

- [lakeFS](./lakefs.md)
- [OpenDAL](./opendal.md)
- [ZeroFS](./zerofs.md)
- [s3fs](./s3fs.md)
- [SFTPGo](./sftpgo.md)
- [Alluxio](./alluxio.md)

システムごとに専用のバケットとプレフィックスを使い、認証情報は必要なバケット操作に限定します。
