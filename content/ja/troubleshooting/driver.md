---
title: "ドライブ障害"
description: "RustFS のデプロイで障害が発生したドライブを交換し、データを自動的に修復します。"
---

RustFS はイレイジャーコーディングにより、一部のドライブが故障してもデータの読み書きを継続します。障害が発生したドライブを交換すると、RustFS は欠落したデータをそのドライブへ自動的に修復します。

<a id="unmount-failed-disk"></a>

### 障害が発生したディスクのアンマウント

物理ハードディスクを交換する前に、OS 上で障害ディスクをアンマウントします。交換中にファイルシステムや RustFS で I/O エラーが起きるのを防ぎます。

```bash
# Assume the failed disk is /dev/sdb
umount /dev/sdb
```

:::note[注意]

* ディスクに複数のマウントポイントがある場合は、それぞれで `umount` を実行します。
* 「device is busy」エラーが表示された場合は、先に RustFS サービスを停止します。

```bash
systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### 障害が発生したディスクの交換

障害ディスクを物理的に交換したあと、新しいディスクをパーティション分割してフォーマットし、元のディスクと同じラベルを付けます。

```bash
# Format as XFS and apply the same label as the original disk (RustFS requires XFS, like the other disks in the deployment)
mkfs.xfs -L DISK1 /dev/sdb
```

:::note[要件]

* 新しいディスクの容量は、元のディスク以上である必要があります。
* ほかのディスクと同じファイルシステム（XFS）を使います。詳細は [インストールガイド](../installation/linux/index.md) を参照します。
* 再起動後にデバイス名が変わってもマウント先がずれないよう、ラベル（LABEL）または UUID でファイルシステムをマウントすることを推奨します。

:::

<a id="update-etcfstab-or-rustfs-configuration"></a>

### `/etc/fstab` または RustFS 設定の更新

`/etc/fstab` のエントリに書かれたラベルまたは UUID が、新しいディスクを指していることを確認します。マウントポイントは `/etc/default/rustfs` の `RUSTFS_VOLUMES` に記載されたパスと同一である必要があります。これにより、修復対象のディスクが同じパスでクラスターに再参加します。

```bash
# View current fstab
cat /etc/fstab

# Example fstab entry (no modification needed if labels are the same)
LABEL=DISK1 /data/rustfs0 xfs defaults,noatime 0 2
```

:::tip[ヒント]

* UUID を使う場合:

```bash
blkid /dev/sdb
# Get the new partition's UUID, then replace the corresponding field in fstab
```

* `/etc/fstab` の編集後に、構文を検証します。

```bash
mount -a # If no errors, configuration is correct
```

:::

<a id="remount-new-disk"></a>

### 新しいディスクの再マウント

次のコマンドで、設定済みのファイルシステムをすべてマウントし、RustFS を起動します。

```bash
mount -a
systemctl start rustfs
```

想定しているファイルシステムがすべてマウントされていることを確認します。

```bash
df -h | grep /data/rustfs
```

:::note[マウントの失敗]

マウントに失敗した場合は、`/etc/fstab` のラベルまたは UUID が、対象ファイルシステム上の値と一致しているか確認します。

:::

<a id="trigger-and-monitor-data-healing"></a>

### データ修復の開始と監視

RustFS が既知のマウントポイントでフォーマット直後のディスクを検出すると、バックグラウンドスキャナーが欠落データをそのディスクへ自動的に修復します。手動のコマンドは不要です。サービスログで、復旧の開始と進捗を確認します。

```bash
# For systemd-managed installations
journalctl -u rustfs -f

# Or view the log files under the directory set by RUSTFS_OBS_LOG_DIRECTORY
tail -f /var/log/rustfs/rustfs.log
```

RustFS Console を開き、対象ノードのディスク状態を確認することもできます。

:::note[注意]

* データ修復はバックグラウンドで実行され、通常、クライアント要求への影響はわずかです。
* データ修復が終わると、ログには成功が記録されるか、修復できなかったオブジェクトが一覧されます。

:::

<a id="follow-up-checks-and-notes"></a>

### 事後確認と注意点

1. **パフォーマンス監視**

 * データ修復中は I/O 負荷が変動することがあります。ディスクとネットワークの使用率を監視することを推奨します。
2. **同一製造ロットの障害**

 * 同じ製造ロットのディスクが複数故障した場合は、そのロットに残るディスクの点検頻度を上げます。
3. **定期的な障害試験**

 * 復旧手順を習熟できるよう、定期的にディスク障害の訓練を実施します。
4. **メンテナンス時間**

 * 障害率が高い場合は、交換とデータ修復を早めるため、専用のメンテナンス時間を設けます。
