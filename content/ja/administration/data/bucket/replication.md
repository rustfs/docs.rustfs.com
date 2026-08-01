---
title: "Bucket Replication"
description: "Configure, validate, and monitor asynchronous replication between versioned RustFS buckets."
---

RustFS bucket replication copies selected object versions from a source bucket to a target bucket. Use it to maintain a remote copy of bucket data, distribute objects between deployments, or prepare a secondary copy for recovery workflows.

## Overview

Bucket replication has two configuration layers:

1. A **remote target** stores the target endpoint, bucket, credentials, and generated target ARN.
2. An S3 **replication configuration** attaches rules to the source bucket and references that target ARN.

Both the source and target buckets must have versioning enabled. RustFS verifies the target connection and target-bucket versioning when you register the remote target. It rejects a replication configuration whose enabled rules reference an unknown or stale target ARN.

Replication is asynchronous by default. A successful source upload means RustFS accepted the source object; it does not mean the target copy is already complete.

Rules can select objects by prefix or object tags and control these behaviors:

| Rule setting | Behavior |
| --- | --- |
| `Status` | Enables or disables the rule. |
| `Filter` | Restricts replication by key prefix, object tags, or both. |
| `ExistingObjectReplication` | Includes objects that existed before the rule when set to `Enabled`. |
| `DeleteMarkerReplication` | Replicates delete markers when set to `Enabled`. |
| `DeleteReplication` | Replicates deletion of a specific object version when set to `Enabled`. |
| `Destination` | Identifies the registered remote target by ARN. |

Bucket replication is directional. Configure a separate target and rule in the opposite direction if both buckets must accept writes and replicate them to each other. Do not confuse bucket replication with [site replication](/operations/high-availability/site-replication), which synchronizes broader site configuration and identity data.

## Configuration

### Requirements

- A source RustFS deployment and a reachable target S3-compatible deployment.
- A source bucket and target bucket with versioning enabled.
- A dedicated target credential that can inspect the target bucket's versioning and write replicated object versions and delete markers.
- A source administrator allowed to manage remote targets and replication configuration.
- Network access from every source node that can run replication work to the target endpoint.
- The RustFS [`rc`](/operations/rc) client installed on an administration host.

Configure one `rc` alias for each deployment. Use dedicated credentials and replace the example endpoints before running the commands:

```bash
rc alias set source https://source.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set target https://target.example.com:9000 \
	<target-access-key> <target-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias list
```

The source deployment uses the target alias credentials when it registers the remote target. `rc alias list` displays endpoints but does not print secret keys.

:::warning[Protect target credentials]

RustFS stores the target credential as part of the source bucket's remote-target configuration. Use a dedicated credential with access limited to the target bucket and do not reuse a root credential.

:::

### Permissions

Source-side administration uses these policy actions:

| Operation | Required action |
| --- | --- |
| Register, update, or remove a remote target | `admin:SetBucketTarget` |
| List remote targets | `admin:GetBucketTarget` |
| Read replication metrics | `admin:GetReplicationMetrics` |
| Apply or delete replication configuration | `s3:PutReplicationConfiguration` |
| Read replication configuration | `s3:GetReplicationConfiguration` |

The target credential must pass RustFS target validation, which checks bucket access, versioning, replicated-object writes, replicated delete markers, and object-version deletion. When Object Lock is enabled on the source bucket, the target must have compatible Object Lock support.

### Create and version the buckets

Create the source bucket:

```bash
rc bucket create source/my-bucket
```

Create the target bucket:

```bash
rc bucket create target/my-bucket-replica
```

Enable versioning on both buckets:

```bash
rc bucket version enable source/my-bucket
rc bucket version enable target/my-bucket-replica

rc bucket version info source/my-bucket
rc bucket version info target/my-bucket-replica
```

Do not suspend source-bucket versioning while replication is configured.

## Usage

### Configure replication in the Console

The RustFS Console combines remote-target registration and replication-rule configuration in one form.

1. Sign in to the source deployment's Console.
2. Open **Buckets**, locate the source bucket, and select **Settings**.
3. Under **Data Protection**, enable **Versioning** if it is disabled.
4. Under **Automation**, select **Open Bucket Replication**.
5. Select **Add Replication Rule**.
6. Configure the destination and rule:

| Console field | Value |
| --- | --- |
| **Priority** | Rule evaluation priority. The initial value is `1`. |
| **Mode** | Select **Asynchronous** or **Synchronous**. Asynchronous is selected by default. |
| **Endpoint** | Target S3 API address as `host:port`, without a URL scheme. |
| **Bucket** | Versioned destination bucket name. |
| **Access Key** and **Secret Key** | Dedicated credentials authorized to replicate into the destination bucket. |
| **Region** | Target region. The initial value is `us-east-1`. |
| **Storage Class** | Storage class applied at the destination. The initial value is `STANDARD`. |
| **Prefix** | Optional key prefix used to limit matching objects. |
| **Tags** | Optional object-tag name and value filters. Select **Add Tag** for additional filters. |
| **Use TLS** | Enables HTTPS for the destination connection. |
| **Replicate Existing Objects** | Includes objects created before the rule. Enabled by default. |
| **Replicate Delete Markers** | Copies delete markers to the destination. Enabled by default. |
| **Replicate Delete** | Copies deletion of a specific object version. Enabled by default. |
| **Health Check Interval** | Target health-check interval in seconds. The initial value is `60`. |
| **Bandwidth Limit** | Per-target transfer limit, selectable in KiB/s, MiB/s, or GiB/s. |

7. Select **Save**. RustFS validates the source bucket, target connection, target credentials, and target-bucket versioning before accepting the rule.
8. Return to **Bucket Replication** to review the rule or select **Refresh** to update its displayed state.

:::warning[Enable versioning on both deployments]

The source and destination buckets must both have versioning enabled before you save the rule. Sign in to the target deployment's Console and enable versioning under **Buckets** → **Settings** → **Data Protection** when needed.

:::

For repeatable automation or configuration management, use the `rc` workflow below.

### Add a replication rule with rc

Create an asynchronous rule that copies new and existing objects and propagates delete markers and explicit version deletions:

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-all \
	--priority 1 \
	--replicate delete,delete-marker,existing-objects
```

`rc` registers the target, obtains its generated ARN, and applies the replication rule in one operation. Omit `--replicate` flags for behaviors you do not want. Add `--sync` only when writes must wait for synchronous replication.

To limit replication to a prefix, add `--prefix`:

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-documents \
	--priority 2 \
	--prefix documents/ \
	--replicate delete-marker,existing-objects
```

Objects that do not match an enabled rule remain only in the source bucket. Use `--bandwidth` to set a byte-per-second limit, `--healthcheck-seconds` to change the target health-check interval, and `--storage-class` to override the destination storage class.

### List and update rules

List the active rules:

```bash
rc bucket replication list source/my-bucket
rc bucket replication list source/my-bucket --json
```

Update a rule by its ID. Only supplied settings are changed:

```bash
rc bucket replication update source/my-bucket \
	--id replicate-all \
	--priority 2 \
	--bandwidth 104857600 \
	--healthcheck-seconds 60
```

Use `--status Enabled|Disabled` to enable or disable a rule and `--sync true|false` to change its replication mode.

### Export and import configuration

Export the complete replication configuration for review or backup:

```bash
rc bucket replication export source/my-bucket --json > replication.json
```

The export includes remote-target metadata and the target Access Key, although the Secret Key is omitted. Protect the file as sensitive configuration.

Import a previously exported configuration:

```bash
rc bucket replication import source/my-bucket replication.json
```

### Delete replication configuration

```bash
rc bucket replication remove source/my-bucket --id replicate-all

# Remove every replication rule from the bucket.
rc bucket replication remove source/my-bucket --all
```

RustFS also removes replication remote targets referenced by the deleted configuration. It does not delete objects or versions already copied to the target bucket. Remove or retain those objects according to the target bucket's lifecycle and retention requirements.

:::note[rc 0.1.29 removal response]

After RustFS removes the replication configuration and its targets, `rc 0.1.29` can report `Remote target not found` while attempting a second target cleanup. Run `rc bucket replication list source/my-bucket --json`; an empty `rules` array confirms that the configuration was removed.

:::

## Verification

### Check target readiness

`rc bucket replication add` checks source access, target connectivity, target credentials, and bucket versioning before it creates the rule. Confirm the resulting destination and rule settings:

```bash
rc bucket replication list source/my-bucket --json
```

### Replicate an object

Upload a test object to the source:

```bash
printf 'hello from RustFS replication\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt source/my-bucket/hello.txt
```

Inspect the source object:

```bash
rc object stat source/my-bucket/hello.txt --json
```

Because replication is asynchronous by default, the target object might not appear immediately. Repeat this command until it succeeds:

```bash
rc object stat target/my-bucket-replica/hello.txt --json
rc object show target/my-bucket-replica/hello.txt
```

Compare the source and target `etag` and `size_bytes` values, then confirm that `object show` returns the expected content.

To verify delete-marker replication, delete the source object and list versions on both buckets:

```bash
rc object remove source/my-bucket/hello.txt --force

rc bucket version list source/my-bucket/hello.txt --json
rc bucket version list target/my-bucket-replica/hello.txt --json
```

When delete-marker replication succeeds, the latest entry on both buckets has `is_delete_marker: true`.

### Inspect replication metrics

```bash
rc bucket replication status source/my-bucket
rc bucket replication status source/my-bucket --json
```

The command returns the source node's current in-memory replication statistics. Metrics can remain zero even after an object reaches the destination, so use them together with target-object and version checks rather than as the only verification signal.

### Troubleshoot failures

| Symptom | Check |
| --- | --- |
| `bucket versioning must be enabled` | Enable versioning on the source bucket. |
| Target registration reports `not versioned` | Enable versioning on the target bucket. |
| `replication target configuration not found` | Recheck the target alias, credentials, and destination bucket, then rerun `replication add`. |
| Rule reports a stale target | Refresh the rule list and retry `replication add`; if it persists, remove the failed configuration and recreate the target. |
| Target object does not appear | Check target reachability, credentials, target quota, and `rc bucket replication status`. |
| Replication fails | Inspect source-node logs for the target ARN and object key. |
| Target removal is disallowed | Delete or replace the replication configuration before removing a referenced target. |

## Next steps

- [Manage bucket lifecycle](../lifecycle-management.md)
- [Configure bucket quotas](./quota.md)
- [Configure observability](/operations/observability)