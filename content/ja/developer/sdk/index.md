---
title: "SDK"
description: "RustFS で使える S3 SDK の概要です。"
---

RustFS は、S3 互換 API を備えた分散オブジェクトストレージです。次の方法で操作できます。

- Console で RustFS を管理します。
- S3 クライアントで RustFS を管理します。
- S3 SDK を使い、アプリケーションからバケットとオブジェクトを管理します。

次のガイドでは、RustFS で S3 SDK を使う方法を説明します。

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Go SDK](./go.md)

## 用語

Amazon Simple Storage Service（Amazon S3）は、広く採用された最初のオブジェクトストレージサービスです。その API は、オブジェクトストレージにおける事実上の標準になっています。このドキュメントで「S3」は、プロトコルを指します。

## SDK の推奨

公式の AWS S3 SDK の使用を推奨します。これらの SDK は成熟しており、保守が行き届き、高度に最適化されています。

必要な S3 操作に対応していれば、知っていて信頼できるベンダー SDK も使えます。

一部のサードパーティ SDK は、標準から外れた実装になっていることがあります。厳密に S3 に準拠していない SDK は、避けることを推奨します。

## MinIO SDK との互換性

RustFS は MinIO SDK で動作します。

MinIO SDK を RustFS に接続するには、エンドポイント、アクセスキー、シークレットキーを、RustFS の値に設定します。

## 非互換な SDK への対処

SDK が標準の S3、MinIO、RustFS のいずれとも動作しない場合は、公式の AWS SDK for S3 へ切り替えることを推奨します。
