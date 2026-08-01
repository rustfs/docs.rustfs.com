---
title: "Bucket Policy"
description: "Create, apply, inspect, and verify RustFS bucket policies with the S3 API."
---

RustFS bucket policies are S3-compatible resource policies attached directly to a bucket. Use them to grant or deny access to the bucket and its objects, including controlled anonymous access for public downloads.

## Overview

A bucket policy contains one or more statements that match a principal, action, resource, and optional conditions. RustFS evaluates the policy for requests to the bucket before allowing the storage operation.

Bucket policies and IAM policies serve different purposes:

| Policy type | Attached to | Typical use |
| --- | --- | --- |
| Bucket policy | A bucket | Grant public access, add resource-level restrictions, or authorize access to one bucket. |
| IAM policy | A user or group | Define what an authenticated identity can do across one or more resources. |

An explicit `Deny` takes precedence over an `Allow`. Bucket owners remain able to get, replace, or delete the bucket policy so that a deny statement cannot permanently lock policy administration.

RustFS implements the standard S3 operations `PutBucketPolicy`, `GetBucketPolicy`, `GetBucketPolicyStatus`, and `DeleteBucketPolicy`.

:::warning[Public policies]

A statement with `"Principal": "*"` can grant access without authentication. Keep the action and resource scope as narrow as possible, and verify the result anonymously before using the policy in production.

:::

## Configuration

### Requirements

- Create the target bucket before applying a policy.
- Configure the AWS CLI with a RustFS credential and region `us-east-1`.
- Use a credential allowed to perform the required policy-management action.

Set reusable variables:

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export BUCKET_NAME=my-bucket
```

Policy management requires these actions:

| Operation | Required action |
| --- | --- |
| Apply or replace a policy | `s3:PutBucketPolicy` |
| Read a policy | `s3:GetBucketPolicy` |
| Read public status | `s3:GetBucketPolicyStatus` |
| Remove a policy | `s3:DeleteBucketPolicy` |

### Policy document structure

A bucket policy uses version `2012-10-17` and a `Statement` array:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
```

The bucket ARN and object ARN are different:

| Resource | ARN format | Example actions |
| --- | --- | --- |
| Bucket | `arn:aws:s3:::my-bucket` | `s3:ListBucket`, `s3:GetBucketLocation` |
| Objects | `arn:aws:s3:::my-bucket/*` | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` |

Use a prefix in the object ARN, such as `arn:aws:s3:::my-bucket/public/*`, to limit access to part of the bucket. For the complete statement format and supported condition operators, see [Users, Groups, and Policies](/security-compliance/iam/policies#policy-document-format).

### Public Access Block

If the bucket's Public Access Block configuration has `BlockPublicPolicy` enabled, RustFS rejects a new policy containing an `Allow` statement with a wildcard principal. Keep this protection enabled unless anonymous access is intentional.

Public Access Block does not replace careful policy review. An existing explicit `Deny` still overrides allows, and authenticated requests continue to be evaluated against IAM and bucket policies.

## Usage

### Create a public-read policy

Create a policy that allows anonymous downloads only from the `public/` prefix:

```bash
cat > /tmp/my-bucket-policy.json <<'EOF'
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
EOF
```

This policy does not allow anonymous bucket listing, uploads, overwrites, or deletes.

### Apply the policy

```bash
aws s3api put-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--policy file:///tmp/my-bucket-policy.json \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Applying another policy replaces the complete existing policy. Retrieve and review the current document before updating it; statements are not merged automatically.

### Read the policy

```bash
aws s3api get-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT" \
	--query Policy \
	--output text
```

RustFS preserves the submitted policy JSON. If no policy exists, the API returns `NoSuchBucketPolicy`.

### Check public status

```bash
aws s3api get-bucket-policy-status \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

The response contains a high-level public-access status:

```json
{
	"PolicyStatus": {
		"IsPublic": false
	}
}
```

The current status check detects anonymous bucket listing (`s3:ListBucket`) and uploads (`s3:PutObject`). A policy that exposes only object downloads, such as the `public/` example above, can still report `false`. Always test the exact anonymous action, object prefix, and conditions instead of treating this status as a complete access analysis.

### Remove the policy

```bash
aws s3api delete-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Deleting a bucket policy removes only that resource policy. IAM policies attached to users and groups remain unchanged.

## Verification

Upload a test object with an authenticated credential:

```bash
printf 'hello from RustFS\n' > /tmp/hello.txt

aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key public/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Verify that the allowed object can be downloaded without credentials:

```bash
curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/public/hello.txt"
```

Then verify that an object outside the allowed prefix is not public:

```bash
aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key private/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"

curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/private/hello.txt"
```

The second `curl` request should fail with `AccessDenied`. Also test each authenticated user role that relies on the policy, especially when the document contains conditions or explicit deny statements.

## Next steps

- [Manage IAM policies](/security-compliance/iam/policies)
- [Manage credentials](/operations/credentials)
- [Configure audit logs](/security-compliance/audit-logs)