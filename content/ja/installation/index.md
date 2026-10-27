---
title: "RustFS のインストール方法を選ぶ"
description: "ローカルでの試用、シングルノードまたはマルチノードの本番、コンテナ、Kubernetes の中から、目的に合った RustFS のデプロイ方法を選びます。"
---

RustFS は、Rust で書かれ、Apache 2.0 ライセンスで公開されている分散オブジェクトストレージです。Linux、Windows、macOS、FreeBSD、およびコンテナ上で動作し、x86、ARM、RISC-V などの CPU アーキテクチャに対応しています。

:::warning[開発とデバッグ専用]

Windows 版の RustFS は、開発とデバッグ専用であり、**本番デプロイには推奨しません**。本番ワークロードには [Linux](/ja/installation/linux) を推奨します。

:::

:::warning[既定の認証情報は直ちに変更する]

インストール後、RustFS をネットワークに公開する前に、`RUSTFS_ACCESS_KEY` と `RUSTFS_SECRET_KEY` に一意の値を設定します。よく知られた `rustfsadmin` をいずれの認証情報にも使わないでください。

- Linux バイナリまたは systemd でインストールした場合は、`/etc/default/rustfs` に両方の値を設定し、`rustfs` サービスを再起動します。
- Docker、Podman、または Docker Compose の場合は、コンテナ作成時に両方の値をコンテナの環境変数として渡します。これらを設定せずに起動した既存のコンテナは、作り直します。

:::

## 方法を選ぶ

| 目的 | 推奨する方法 | ガイド |
| - | - | - |
| ローカルマシンで RustFS を試す | 1 コマンドのインストールスクリプト、またはコンテナ | [Linux クイックスタート](./linux/quick-start.md) · [コンテナ](./container/index.md) |
| 単一サーバーの本番 | SNSD（ディスク 1 台）または SNMD（複数ディスク） | [Linux に RustFS をインストールする](./linux/index.md) |
| 複数サーバーの本番クラスター | 本番チェックリストを完了したうえで MNMD | [マルチノード・マルチディスク（MNMD）](./linux/multiple-node-multiple-disk.md) · [チェックリスト](./requirement/checklists/index.md) |
| Kubernetes / クラウドネイティブ | Helm チャートまたは Operator でデプロイ | [クラウドネイティブ](./cloud-native/index.md) |
| Windows または macOS のホスト | ネイティブインストール | [Windows](./windows/index.md) · [macOS](./macos/index.md) |

## デプロイ方式の比較 [#deployment-mode-comparison]

| 方式 | ノード | ディスク | 耐障害性 | 主な用途 |
| - | - | - | - | - |
| [SNSD](./linux/single-node-single-disk.md) | 1 | 1 | なし（バックアップに依存） | 開発、テスト、および小規模で重要度の低いワークロード |
| [SNMD](./linux/single-node-multiple-disk.md) | 1 | 複数 | ノード内で最大 M 台のパリティディスク | 単一サーバー上の中規模で重要度の低いワークロード |
| [MNMD](./linux/multiple-node-multiple-disk.md) | 4 以上 | ノードごとに複数 | サーバー間のイレイジャーコーディングによるディスクおよびノード単位 | 本番ワークロード |

## チェックリスト

本番デプロイの前に、[インストール前チェックリスト](./requirement/checklists/index.md)（ハードウェア、ネットワーク、ソフトウェア、セキュリティ）を確認し、環境が本番要件を満たしていることを確かめます。
