---
title: "ディスクの準備"
description: "Linux に RustFS をインストールする前に、専用データディスクの識別、フォーマット、マウント、確認を行います。"
---

各 RustFS データディスクを、安定したラベルとマウントポイントを持つ独立した XFS ファイルシステムとして準備します。`RUSTFS_VOLUMES` を設定する前に、すべての Linux ノードでこれらの手順を完了します。

:::warning[フォーマットはデータを消去します]

`mkfs.xfs` コマンドは、選択したデバイスの内容を消去します。続行する前に、デバイス名を確認し、必要なデータをバックアップし、そのディスクがオペレーティングシステムで使われていないことを確認します。

:::

## 1. データディスクを識別する

ブロックデバイス、ファイルシステム、ラベル、現在のマウントポイントを一覧表示します。

```bash
sudo lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS
```

専用のデータディスクだけを選びます。オペレーティングシステムのディスクや、保持が必要なデータを含むデバイスはフォーマットしないでください。

## 2. ディスクを XFS でフォーマットする

次の例では `/dev/sdb` を準備し、ラベル `RUSTFS0` を割り当てます。環境に合わせてデバイス名を置き換え、ディスクごとに一意のラベルを使います。

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

追加のディスクでは、`RUSTFS1`、`RUSTFS2`、`RUSTFS3` などのラベルを付けてコマンドを繰り返します。

## 3. 永続的なマウントを作成する

マウントポイントを作成します。

```bash
sudo mkdir -p /data/rustfs0
```

再起動後も、安定したファイルシステムラベルでディスクがマウントされるよう、`/etc/fstab` にエントリを追加します。

```ini title="/etc/fstab"
LABEL=RUSTFS0 /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

デバイスをより確実に選ぶには、ファイルシステムの UUID でマウントすることを推奨します。UUID はファイルシステムを一意に識別するため、ラベルが重複した場合や Linux のデバイス名が変わった場合でも、誤ったディスクのマウントを避けられます。フォーマット後に UUID を取得します。

```bash
sudo blkid -s UUID -o value /dev/sdb
```

`<filesystem-uuid>` を返された値に置き換え、上の `LABEL` エントリの代わりに、このエントリを使います。

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

すべてのエントリをマウントし、結果を確認します。

```bash
sudo mount -a
findmnt /data/rustfs0
```

ディスクが複数ある場合は、ファイルシステムの UUID ごとに、マウントポイントと `/etc/fstab` のエントリを 1 つずつ作成します。

## 4. 準備したディスクを確認する

想定するすべてのマウントが XFS を使い、十分な空き容量があることを確認します。

```bash
df -hT /data/rustfs0
sudo xfs_info /data/rustfs0
```

`RUSTFS_VOLUMES` を設定するときは、確認済みのマウントパスを使います。分散デプロイでは、ディスクラベルとマウントパスをノード間で揃えます。

## 次のステップ

- [デプロイトポロジーを選ぶ](/ja/installation#deployment-mode-comparison)
- [Linux の前提条件とサービスのセットアップに進む](/ja/installation/linux/prerequisites-and-service)
