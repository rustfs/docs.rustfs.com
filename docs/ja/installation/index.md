---
title: "RustFS インストールガイド"
description: "各OSおよび多様なデプロイ方式での RustFS インストール手順"
---

# RustFS インストールガイド

RustFS のインストール方法とデプロイメントオプションについて学びます。

## インストールオプション

### プラットフォーム別インストール

- **[Linux インストール](./linux.md)** - Linux システムでの RustFS インストール
- **[Docker インストール](./docker.md)** - Docker を使用した RustFS デプロイメント
- **[macOS インストール](./macos/index.md)** - macOS での RustFS セットアップ
- **[Windows インストール](./windows/index.md)** - Windows 環境での RustFS

### デプロイメントモード

- **[デプロイメントモード](./mode/index.md)** - 単一ノード vs マルチノードデプロイメント

## 事前準備とチェックリスト

### ハードウェア要件

- **[ハードウェア選択](./hardware-selection.md)** - 推奨ハードウェア仕様
- **[ハードウェアチェックリスト](./hard-checklists.md)** - ハードウェア検証チェックリスト

### システム要件

- **[ソフトウェアチェックリスト](./software-checklists.md)** - ソフトウェア要件と依存関係
- **[ネットワークチェックリスト](./network-checklists.md)** - ネットワーク設定とファイアウォール
- **[セキュリティチェックリスト](./security-checklists.md)** - セキュリティ設定とベストプラクティス
- **[一般チェックリスト](./checklists.md)** - インストール前の確認事項

## クイックスタート

最速でRustFSを開始したい場合は、以下の順序をお勧めします：

1. **[Docker インストール](./docker.md)** - 最も簡単な開始方法
2. **[Linux インストール](./linux.md)** - 本番環境での推奨方法
3. **[チェックリスト](./checklists.md)** - 本番デプロイメント前の確認

## サポートされているプラットフォーム

| プラットフォーム | 単一ノード | マルチノード | 推奨度 |
|----------------|------------|------------|--------|
| Linux | ✅ | ✅ | 高 |
| Docker | ✅ | ✅ | 高 |
| macOS | ✅ | ⚠️ | 中 |
| Windows | ✅ | ⚠️ | 中 |

## 次のステップ

インストール完了後は、以下のドキュメントを参照してください：

- **[SDK ガイド](../sdk/index.md)** - 開発者向けSDK使用方法
- **[アーキテクチャ](../architecture.md)** - RustFS アーキテクチャの理解
- **[概念](../concepts/glossary.md)** - 重要な概念と用語

サポートが必要な場合は、[コミュニティ](https://github.com/rustfs/rustfs/discussions)にお気軽にお問い合わせください。

