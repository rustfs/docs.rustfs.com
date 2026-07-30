---
title: "Versioning"
description: "Enable bucket versioning, recover earlier object versions, and manage delete markers with rc and the Console."
---

RustFS bucket versioning preserves multiple versions of the same object key. Use it to recover from accidental overwrites and deletes and to satisfy prerequisites for Object Lock and bucket replication.

## Overview

When versioning is enabled:

- Each upload or copy to an existing key creates a new version ID.
- A normal delete creates a delete marker instead of removing older versions.
- Reading the key without a version ID returns the latest visible version, or `NotFound` when the latest entry is a delete marker.
- Reading or deleting a specific version requires its version ID.

Suspending versioning stops normal creation of new version IDs but preserves existing versions and delete markers. Suspension is not the same as disabling or removing version history.

## Configure in the Console

### Enable at bucket creation

1. Open **Buckets** and select **Create Bucket**.
2. Enter the bucket name.
3. Enable **Version**.
4. Select **Create**.

### Enable or suspend an existing bucket

1. Open **Buckets**, locate the bucket, and select **Settings**.
2. Under **Data Protection**, locate **Versioning**.
3. Enable versioning or suspend it as required.

The settings page reports `Enabled`, `Suspended`, or `Disabled`. It also notes that suspension preserves existing versions.

### Browse and recover versions

1. Open the bucket and enable **Show Deleted Objects** when you need to see keys hidden by delete markers.
2. Select an object name to open **Object Details**.
3. Select **Versions** to inspect available versions and delete markers.
4. Download the required version and upload it again to make its content the latest version.

## Use rc

Create a bucket and enable versioning:

```bash
rc bucket create rustfs/my-bucket
rc bucket version enable rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

Upload two versions of the same key:

```bash
printf 'version one\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt

printf 'version two\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt rustfs/my-bucket/hello.txt --overwrite
```

List versions and record the version ID you want to recover:

```bash
rc bucket version list rustfs/my-bucket/hello.txt --json
rc object stat rustfs/my-bucket/hello.txt \
	--version-id <version-id> --json
```

Restore an earlier version by downloading its body and uploading it as a new latest version:

```bash
rc object show rustfs/my-bucket/hello.txt \
	--version-id <version-id> > /tmp/hello-restored.txt

rc object copy /tmp/hello-restored.txt \
	rustfs/my-bucket/hello.txt --overwrite
```

Delete the current key to create a delete marker, then inspect it:

```bash
rc object remove rustfs/my-bucket/hello.txt --force
rc bucket version list rustfs/my-bucket/hello.txt --json
```

The latest entry should show `is_delete_marker: true`. The earlier versions remain available by version ID.

Suspend versioning when you no longer want normal writes to create new numbered versions:

```bash
rc bucket version suspend rustfs/my-bucket
rc bucket version info rustfs/my-bucket
```

:::warning[rc 0.1.29 version deletion boundary]

`rc object remove --versions` is listed in the `rc 0.1.29` help output but returns `not implemented`. Use the Console or an S3 SDK to permanently delete selected version IDs. Do not remove an entire version history unless you have verified retention, replication, and recovery requirements.

:::

## Verification

After enabling versioning:

1. Upload the same key twice with different content.
2. Run `rc bucket version list` and confirm that both entries have distinct version IDs.
3. Retrieve each version with `rc object show --version-id` and compare its content.
4. Delete the key without a version ID and confirm that a delete marker appears.
5. Retrieve an older version by version ID to confirm it remains recoverable.

## Operational considerations

- Versioning increases storage use because overwrites and deletes retain older data.
- Configure lifecycle rules for noncurrent versions only after defining recovery and retention periods.
- Bucket replication requires versioning on both source and destination buckets.
- Object Lock depends on versioning and protects individual versions.
- Multipart completion creates one new object version in a versioned bucket.

## Next steps

- [Protect versions with Object Lock](./object-lock.md)
- [Upload large objects](./multipart-upload.md)
- [Manage bucket lifecycle](../lifecycle-management.md)