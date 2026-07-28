---
title: "Lifecycle Management"
description: "Configure, inspect, and maintain RustFS object lifecycle rules with the rc command-line client."
---

RustFS lifecycle management applies expiration and transition rules to objects in a bucket. This page shows how to manage those rules with `rc`, verify a transition, and restore a temporary local copy of transitioned data.

Before you begin, [install `rc`](/operations/rc), configure an alias named `local`, and create `my-bucket`. To transition objects, first register the target in [Tiered Storage](/administration/data/tiered-storage) and note its uppercase tier name.

:::note[Asynchronous evaluation]

Lifecycle rules do not process every eligible object immediately. The [Object Scanner](/administration/data/object/scanner) evaluates lifecycle work in the background.

:::

## Add an expiration rule

Expire objects under the `logs/` prefix 30 days after creation:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--prefix logs/ \
	--expiry-days 30
```

The command creates an enabled rule and returns its generated rule ID. Record that ID when you need to edit or remove this specific rule.

## Add a transition rule

Move object data to the registered `COLDTIER` tier after 90 days:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--transition-days 90 \
	--storage-class COLDTIER
```

`--storage-class` must match a registered tier name. Adding the rule does not create the tier or validate an AWS storage-class label as a RustFS tier.

You can combine expiration and transition options in one rule. Use the noncurrent-version options only for a versioned bucket:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--noncurrent-transition-days 30 \
	--noncurrent-transition-storage-class COLDTIER \
	--noncurrent-expiry-days 365
```

## Inspect and update rules

List the current rules and note the ID of the rule you want to change:

```bash
rc bucket lifecycle rule list local/my-bucket
```

Change a rule's expiration period or disable it without deleting it:

```bash
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--expiry-days 60
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--disable true
```

Remove one rule by ID. Use `--all` only when you intend to remove the bucket's complete lifecycle configuration:

```bash
rc bucket lifecycle rule remove local/my-bucket --id <rule-id>
rc bucket lifecycle rule remove local/my-bucket --all
```

## Export and import rules

Export the bucket's lifecycle configuration before a bulk change:

```bash
rc bucket lifecycle rule export local/my-bucket > lifecycle.json
```

Importing a file replaces the lifecycle configuration sent to the bucket. Review the JSON before applying it:

```bash
rc bucket lifecycle rule import local/my-bucket lifecycle.json
```

## Confirm a lifecycle transition

After an object becomes eligible under its lifecycle rule, inspect it on the source cluster:

```bash
aws s3api head-object \
	--bucket my-bucket \
	--key hello.txt \
	--endpoint-url http://localhost:9000
```

After the transition completes, the response reports the registered tier name as the storage class:

```json
{
	"StorageClass": "COLDTIER"
}
```

The response can contain additional object metadata. Before the transition completes, `StorageClass` may be absent or may not yet report `COLDTIER`.

Read the object through the source RustFS endpoint as usual:

```bash
aws s3 cp \
	s3://my-bucket/hello.txt \
	/path/to/hello.txt \
	--endpoint-url http://localhost:9000
```

RustFS reads transitioned data through the source bucket and object key. Applications do not need to address the target bucket directly.

## Restore a local copy

Request a temporary local copy of a transitioned object and retain it for seven days:

```bash
rc bucket lifecycle restore local/my-bucket/hello.txt --days 7
```

While the copy-back is running, `HEAD` reports `x-amz-restore: ongoing-request="true"`. After completion, it reports `ongoing-request="false"` with an expiry date. A second restore submitted while one is running returns `RestoreAlreadyInProgress`.

When the restore period expires, RustFS removes the local restored copy and its restore metadata. The transitioned object remains available from the remote tier.

## Command compatibility

The latest `rc` also accepts `rc ilm` as a compatibility alias. We recommend the noun-first `rc bucket lifecycle` form for new commands and scripts:

```bash
rc bucket lifecycle --help
rc bucket lifecycle rule --help
rc bucket lifecycle tier --help
```

## Next steps

Review [Tiered Storage](/administration/data/tiered-storage) to monitor or maintain remote tiers, and use [object creation](/administration/data/object/creation) to create test objects for a lifecycle rule.
