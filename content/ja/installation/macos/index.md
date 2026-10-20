---
title: "macOS に RustFS をインストールする"
description: "RustFS Launcher またはスタンドアロンのサーバーバイナリを使い、macOS にローカルの RustFS インスタンスをインストールします。"
---

このガイドでは、macOS で **RustFS** を実行する 2 つの方法を説明します。グラフィカルな **RustFS Launcher** を使う方法と、Terminal からスタンドアロンのサーバーバイナリを実行する方法です。どちらも、評価、開発、テストに適したローカルのシングルノードインスタンスを作成します。

:::note[デプロイの範囲]

これらの手順では、RustFS を macOS のバックグラウンドサービスとしてではなく、デスクトッププロセスとして実行します。本番または分散デプロイには、[Linux のインストールガイド](/ja/installation/linux) を使います。

:::

## 1. Mac のアーキテクチャを確認する

RustFS は、Apple シリコン（`arm64`）と Intel（`x86_64`）の Mac 向けに異なるビルドを提供しています。Terminal を開いて次を実行します。

```bash
uname -m
```

結果を見て、正しいパッケージを選びます。

| 結果 | Mac の種類 | 現在のスタンドアロンバイナリの提供状況 |
| --- | --- | --- |
| `arm64` | Apple シリコン | 現行の RustFS リリースから macOS AArch64 パッケージをダウンロードします。 |
| `x86_64` | Intel | `v1.0.0-beta.9` より後の RustFS リリースは、ビルド済みの Intel macOS パッケージを提供していません。現行バージョンはソースからビルドします。 |

:::warning[Intel Mac のリリース境界]

Intel Mac で Apple シリコンのバイナリを実行しないでください。Intel macOS で `v1.0.0-beta.9` より新しい RustFS が必要な場合は、このガイドのソースビルド手順に従います。古い beta.9 のバイナリには、それ以降のリリースの修正と機能は含まれていません。

:::

続ける前に、次も確認します。

- アプリケーションのインストールまたは実行と、選択したデータディレクトリへの書き込みの権限があります。
- TCP ポート `9000` と `9001` が空いているか、ほかの未使用ポートを 2 つ選んでいます。
- `$HOME/rustfs/data` のような専用のデータディレクトリを作成しています。

```bash
mkdir -p "$HOME/rustfs/data"
```

:::warning[データディレクトリを保護する]

空き容量が十分なディスク上の空のディレクトリを使います。このディレクトリに無関係なファイルを置かず、サーバーの実行中に RustFS のデータファイルを編集しないでください。

:::

## 2. インストール方法を選ぶ

| 方法 | 使う場面 | アーキテクチャに関する注意 |
| --- | --- | --- |
| RustFS Launcher | グラフィカルなセットアップと組み込みのログビューアーが必要な場合。 | Apple シリコンまたは Intel に一致する Launcher パッケージをダウンロードします。 |
| スタンドアロンバイナリ | 明示的な Terminal コマンドやスクリプトが必要な場合。 | 現行リリースは Apple シリコン向けバイナリを提供します。Intel では、beta.9 より後のリリースをソースからビルドします。 |

## RustFS Launcher でインストールする

### 3. Launcher をダウンロードしてインストールする

1. [RustFS Launcher の Releases ページ](https://github.com/rustfs/launcher/releases) を開きます。
2. 最新のリリースを選び、**Assets**（アセット）を展開します。
3. アーキテクチャに一致する macOS インストーラーをダウンロードします。Apple シリコンは AArch64、Intel は x86-64 です。自分で Launcher をビルドする場合を除き、**Source code**（ソースコード）はダウンロードしないでください。
4. ダウンロードしたディスクイメージを開き、**RustFS Launcher** を **Applications**（アプリケーション）に移動します。
5. **Applications** から **RustFS Launcher** を開きます。

macOS が初回起動をブロックした場合は、パッケージが公式の `rustfs/launcher` Releases ページから入手したものであることを確認します。その後、**System Settings > Privacy & Security**（システム設定 > プライバシーとセキュリティ）を開き、そのアプリケーションだけを許可します。Gatekeeper をシステム全体で無効にしないでください。

### 4. Launcher を設定する

Launcher ウィンドウの各フィールドを設定します。

| セクション | フィールド | 推奨値 | 説明 |
| --- | --- | --- | --- |
| Dataset Mount（データセットのマウント） | Data Path（データパス） | `$HOME/rustfs/data` | RustFS がオブジェクトデータを保存する、既存のディレクトリ。 |
| Ports & Access（ポートとアクセス） | API Port（API ポート） | `9000` | S3 互換 API のポート。 |
| Ports & Access | Host（ホスト） | `127.0.0.1` | アクセスをこの Mac に制限します。 |
| Ports & Access | Console Endpoint（Console エンドポイント） | Enabled（有効） | Web Console を有効にします。Launcher は既定で無効にしています。 |
| Ports & Access | Console Port（Console ポート） | `9001` | Console のポート。API ポートとは異なる必要があります。 |
| Credentials（認証情報） | Access Key（アクセスキー） | `<your-access-key>` | このインスタンスの管理者アクセスキー。 |
| Credentials | Secret Key（シークレットキー） | `<your-secret-key>` | このインスタンスの管理者シークレットキー。 |

**Browse**（参照）でデータディレクトリを選ぶか、Launcher にドラッグします。Launcher は、起動前にディレクトリが存在していることを要求します。macOS のファイル選択ダイアログは、リテラルの `$HOME` 変数ではなく、展開されたパスを表示します。

認証情報のプレースホルダーを独自の値に置き換えます。Launcher は最初、ローカルテスト用の既定の認証情報を表示します。ほかのユーザーがアクセスできる Mac では、その値を残さないでください。

:::warning[ネットワークへの公開]

別のコンピューターが RustFS に接続する必要がある場合を除き、**Host** は `127.0.0.1` のままにします。ループバック以外のアドレスは、対応するネットワークインターフェース上で API と Console を公開します。リモートアクセスを許可する前に、macOS のファイアウォールと強力な認証情報を設定します。

:::

### 5. RustFS を起動して確認する

1. **Launch RustFS**（RustFS を起動）を選びます。
2. 設定したエンドポイントがオンラインになったと Launcher が報告するまで待ちます。
3. `http://localhost:9001` を開き、設定したアクセスキーとシークレットキーでサインインします。
4. S3 互換クライアントのエンドポイントとして `http://localhost:9000` を使います。

![API ポート 9000、Console ポート 9001、起動成功のログとともに、サービスがオンラインであることを示す RustFS Launcher](../windows/images/windows-rustfs-launcher.jpg)

ホストまたはポートを変更した場合は、その値を使います。Console の URL は、**Console Endpoint** が有効な場合にのみ使えます。

Launcher は、実行中のプロセスを管理している間、設定をロックします。また、データディレクトリの隣に `logs` ディレクトリを作成します。たとえば、`$HOME/rustfs/data` を選んだ場合、サーバーのログファイルは `$HOME/rustfs/logs` に置かれます。

### 6. Launcher を停止または終了する

設定を変更する前、外付けのデータディスクを取り外す前、または macOS をシャットダウンする前に、**Stop RustFS**（RustFS を停止）を選びます。

Launcher ウィンドウを閉じると、メニューバーに隠れるだけで、RustFS は停止しません。管理対象のプロセスを停止して Launcher を終了するには、Launcher のメニューバーアイコンを開き、**Quit**（終了）を選びます。ウィンドウを戻すには、**Show**（表示）を選ぶか、アイコンを選択します。

## スタンドアロンバイナリをインストールする

### 7. Apple シリコンのバイナリをダウンロードする

`uname -m` が `arm64` を返す場合は、この手順を使います。

1. [RustFS の Releases ページ](https://github.com/rustfs/rustfs/releases) を開きます。
2. 必要なリリースを選び、**Assets** から macOS AArch64 の ZIP アーカイブをダウンロードします。アセット名は `rustfs-macos-aarch64` で始まります。
3. プログラム用のディレクトリを作成し、アーカイブを展開します。`<version>` は、ダウンロードしたファイル名のバージョンに置き換えます。

```bash
mkdir -p "$HOME/rustfs/bin"
unzip "$HOME/Downloads/rustfs-macos-aarch64-<version>.zip" -d "$HOME/rustfs/bin"
chmod +x "$HOME/rustfs/bin/rustfs"
"$HOME/rustfs/bin/rustfs" --help
```

アーカイブに `rustfs` ではなくプラットフォーム固有のバイナリ名が含まれている場合は、残りのコマンドでそのファイル名を使うか、`$HOME/rustfs/bin/rustfs` に名前を変更します。

### 8. Intel のバイナリをソースからビルドする

`uname -m` が `x86_64` を返し、`v1.0.0-beta.9` より新しいリリースが必要な場合は、この手順を使います。

1. Xcode コマンドラインツールをインストールします。

```bash
xcode-select --install
```

2. [rustup.rs](https://rustup.rs/) から現行の安定版 Rust ツールチェーンをインストールし、新しい Terminal セッションを開きます。
3. RustFS をクローンし、必要なリリースをチェックアウトします。

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs
git checkout <release-tag>
```

4. リポジトリのビルドスクリプトで、Intel macOS 向けターゲットをビルドします。

```bash
./build-rustfs.sh --platform x86_64-apple-darwin
```

ビルドスクリプトは既定で Console のアセットを含め、生成されたバイナリを検証します。次の手順では、ビルド出力の末尾に表示されたバイナリを使います。

:::note[ソースビルドの依存関係]

ソースからビルドするには、Rust と Xcode コマンドラインツールに加えて、選択した RustFS リリースが使うツールが必要です。ビルドが不足している依存関係を報告した場合は、Apple シリコン向けにビルドしたバイナリで代用せず、そのリリースのリポジトリ README の要件に従います。

:::

### 9. スタンドアロンサーバーを起動する

現在の Terminal セッションに認証情報を設定し、ダウンロードまたはコンパイルしたバイナリのパスを割り当てます。

```bash
export RUSTFS_ACCESS_KEY="<your-access-key>"
export RUSTFS_SECRET_KEY="<your-secret-key>"
export RUSTFS_BIN="$HOME/rustfs/bin/rustfs"

"$RUSTFS_BIN" server \
	--address "127.0.0.1:9000" \
	--console-enable true \
	--console-address "127.0.0.1:9001" \
	"$HOME/rustfs/data"
```

Intel のソースビルドでは、`RUSTFS_BIN` を `build-rustfs.sh` が表示したバイナリパスに置き換えます。RustFS の実行中は Terminal ウィンドウを開いたままにします。`Control+C` でサーバーを停止します。

:::tip[認証情報の扱い]

セッションの環境変数を使うと、認証情報をコマンドラインに直接置かずに済みます。繰り返し使う場合や自動化する場合は、`RUSTFS_ACCESS_KEY_FILE` と `RUSTFS_SECRET_KEY_FILE` の環境変数を使い、それらのファイルを macOS の権限で保護することを推奨します。

:::

### 10. スタンドアロンサーバーを確認する

`http://localhost:9001` を開き、設定した認証情報でサインインします。S3 互換クライアントのエンドポイントとして `http://localhost:9000` を使います。RustFS は既定でパススタイルアクセスになるため、クライアントもそれに合わせて設定します。

エンドツーエンドで確認するには、`my-bucket` という名前のバケットを作成し、`hello.txt` をアップロードして、オブジェクトがバケットに表示されることを確認します。

## インストールの成功を確認する

Launcher、Apple シリコンのバイナリ、Intel のソースビルドのいずれを使った場合でも、Console へのサインインが成功すると **Buckets**（バケット）ページが開きます。

![サインイン成功後の RustFS Console の Buckets ページ](../windows/images/rustfs-console-login.png)

## トラブルシューティング

### macOS がアプリケーションまたはバイナリをブロックする

ファイルが公式の RustFS GitHub 組織から入手したものであることを確認します。Launcher の場合は、**System Settings > Privacy & Security** でそのアプリケーションを許可します。macOS が隔離したスタンドアロンバイナリの場合は、セキュリティ属性を変更する前に警告を確認し、ダウンロード元を確かめます。

### バイナリのアーキテクチャが一致しない

`uname -m` を実行し、バイナリを確認します。

```bash
uname -m
file "$RUSTFS_BIN"
```

Apple シリコンでは AArch64 のバイナリを使います。Intel Mac では、`v1.0.0-beta.9` より後のリリースを `x86_64-apple-darwin` 向けにソースからビルドします。

### データパスが拒否される

ディレクトリが存在し、macOS アカウントに読み取りと書き込みの権限があることを確認します。Launcher は、選択したデータディレクトリを自動では作成しません。

### API または Console のポートが使えない

ポートは、`1` から `65535` の数値であり、互いに異なり、かつ未使用である必要があります。既定のポートを確認します。

```bash
lsof -nP -iTCP:9000 -iTCP:9001 -sTCP:LISTEN
```

競合しているアプリケーションを停止するか、未使用のポートを選んでから、RustFS を再度起動します。

### Console が開かない

Launcher の場合は、**Console Endpoint** が有効であることを確認します。スタンドアロンバイナリの場合は、プロセスがまだ実行中であり、`--console-enable true` があることを確認します。

### Launcher が外部の RustFS プロセスを報告する

別のプロセスが、設定した API アドレスで待ち受けていますが、Launcher はそのプロセスを起動していません。そのプロセスを停止するか、別の API ポートを選びます。Launcher は、自身が管理していないプロセスを停止できません。

### 起動後に RustFS が終了する

Launcher では、組み込みログビューアーのアプリケーションタブと RustFS タブの両方を確認します。スタンドアロンインストールでは、Terminal の出力を確認します。よくある原因は、データディレクトリがないこと、権限が不足していること、アーキテクチャの不一致、ポートの競合です。

## 次のステップ

- クライアントを接続する前に、[S3 API ガイド](/ja/administration/protocols/s3) を確認します。
- [バケットを作成する](/ja/administration/data/bucket/creation) 方法を確認します。
- 追加の確認方法は、[ステータスチェック](/ja/operations/status-check) を参照します。
- 本番向けのデプロイには、[Linux のインストールガイド](/ja/installation/linux) を使います。
