# RustFSとの統合

モダンデータスタックは接続されたデータスタックです。関連ドキュメントへのリンクを含む、包括的な統合リストをご覧ください。

## 統合タイプ概要

- 👥 [外部アイデンティティプロバイダー](#外部アイデンティティプロバイダー) - シングルサインオンアイデンティティ管理
- 🔐 [外部キー管理](#外部キー管理) - 集中暗号化キー管理
- 📊 [監視とアラート](#監視とアラート) - 継続的イベント監視
- 🔔 [通知ターゲット](#通知ターゲット) - イベント通知サービス
- 🌐 [フェデレーション](#フェデレーション) - データセンター間認証
- ⚙️ [オーケストレータ](#オーケストレータ) - クラウドネイティブオーケストレーションプラットフォーム
- ⚖️ [ロードバランサー](#ロードバランサー) - トラフィック分散と管理
- ☁️ [ハイブリッドクラウド](#ハイブリッドクラウド) - マルチクラウド環境サポート
- 🤖 [機械学習とビッグデータ](#機械学習とビッグデータ) - AI/MLフレームワーク統合
- 💾 [バックアップ](#バックアップ) - データバックアップソリューション

---

## 外部アイデンティティプロバイダー

信頼できるアイデンティティプロバイダーは、シングルサインオンの重要なコンポーネントです。RustFSは以下の統合を通じてアプリケーションとユーザーアイデンティティをサポートします。

| | | |
|---|---|---|
| ![Identity Provider 1](./images/identity-1.png) | ![Identity Provider 2](./images/identity-2.png) | ![Identity Provider 3](./images/identity-3.png) |

## 外部キー管理

Key Management Service（KMS）により、暗号化キーの作成と管理を簡単に行い、組織全体での使用を集中制御できます。

| | |
|---|---|
| ![Key Management 1](./images/kms-1.png) | ![Key Management 2](./images/kms-2.png) |

## 監視とアラート

コンテナとマイクロサービスには、継続的なイベント監視とアラートが必要です。これらの統合を通じて、あらゆるクラウドネイティブアプリケーションやインフラストラクチャを注意深く監視できます。

| | | | |
|---|---|---|---|
| ![Monitoring 1](./images/monitoring-1.png) | ![Monitoring 2](./images/monitoring-2.png) | ![Monitoring 3](./images/monitoring-3.png) | ![Monitoring 4](./images/monitoring-4.png) |

## 通知ターゲット

イベント通知は、システムの運用精度の中核です。RustFSは、ラムダコンピューティング、オブジェクト検索、分析、セキュリティ監査のために、すべてのオブジェクト操作をログに記録します。

| | | | |
|---|---|---|---|
| ![Notification 1](./images/notification-1.png) | ![Notification 2](./images/notification-2.png) | ![Notification 3](./images/notification-3.png) | ![Notification 4](./images/notification-4.png) |

## フェデレーション

分散デプロイメントがデータセンターや地理的位置にまたがる場合、中央集約されたフェデレーション認証サービスが必要です。RustFSは以下と統合します。

| | |
|---|---|
| ![Federation 1](./images/federation-1.png) | ![Federation 2](./images/federation-2.png) |

## オーケストレータ

RustFSは、物理リソース（CPU、ネットワーク、ドライブ）の完全自動デプロイメントと管理のために、モダンなクラウドネイティブオーケストレーションプラットフォームをサポートします。

| | | |
|---|---|---|
| ![Orchestrator 1](./images/orchestrator-1.png) | ![Orchestrator 2](./images/orchestrator-2.png) | ![Orchestrator 3](./images/orchestrator-3.png) |

## ロードバランサー

公開インフラストラクチャでは、ロードバランサーが以下のサービスを提供します：ルーティング、サービス検出、SSL終端、トラフィック整形。RustFSは以下と統合します。

| | | | |
|---|---|---|---|
| ![Load Balancer 1](./images/loadbalancer-1.png) | ![Load Balancer 2](./images/loadbalancer-2.png) | ![Load Balancer 3](./images/loadbalancer-3.png) | ![Load Balancer 4](./images/loadbalancer-4.png) |

## ハイブリッドクラウド

RustFSは、オンプレミスデプロイメントからパブリッククラウドまでの既存インフラストラクチャを、Amazon S3のように見せます。さらに、パブリッククラウドの前にキャッシュCDN機能を追加し、高性能を提供しながら帯域幅を節約します。

| | | | |
|---|---|---|---|
| ![Hybrid Cloud 1](./images/hybrid-1.png) | ![Hybrid Cloud 2](./images/hybrid-2.png) | ![Hybrid Cloud 3](./images/hybrid-3.png) | ![Hybrid Cloud 4](./images/hybrid-4.png) |

## 機械学習とビッグデータ

モダン企業はデータ駆動型です。RustFSは、主要な分析および機械学習フレームワークとのネイティブ統合を提供します。

| | | |
|---|---|---|
| ![Machine Learning 1](./images/ml-1.png) | ![Machine Learning 2](./images/ml-2.png) | ![Machine Learning 3](./images/ml-3.png) |
| ![Machine Learning 4](./images/ml-4.png) | ![Machine Learning 5](./images/ml-5.png) | ![Machine Learning 6](./images/ml-6.png) |

## バックアップ

AWS S3 APIを使用するオブジェクトストレージは、すべてのモダンバックアップアプリケーションの汎用的なバックアップターゲットとなっています。RustFSは、以下の主要ベンダーを含むS3互換システムと統合します（リストは長いです）。

| | | | |
|---|---|---|---|
| ![Backup 1](./images/backup-1.png) | ![Backup 2](./images/backup-2.png) | ![Backup 3](./images/backup-3.png) | ![Backup 4](./images/backup-4.png) |

