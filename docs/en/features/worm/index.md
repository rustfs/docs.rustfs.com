# Object Immutability from RustFS

## RustFS and S3 API - Designed for Multi-Cloud Storage

RustFS has established itself as the standard for AWS S3 compatibility from the beginning. As one of the earliest adopters of the S3 API (V2 and V4) and one of the only storage companies focused exclusively on S3, RustFS's large community ensures no other AWS alternative is more compatible. The S3 API is the de facto standard in the cloud, so AWS alternatives must be able to use the API fluently to operate and interoperate across different environments (public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge).

## Object Retention

Object storage retention rules ensure objects are protected by WORM for a period of time. Object storage retention policies specify the retention period set on object versions, either explicitly or through bucket default settings. Default lock configurations set at the bucket level apply to subsequently created objects and do not retroactively apply to versions of previously created objects.

When using bucket default settings, a duration in days or years is set to define the length of time each object version placed in the bucket should be protected. New objects placed in the bucket will inherit the protection duration set for the bucket.

Retention periods can be explicitly set for object versions. Explicit retention periods specify a "retain until date" for the object version. The "retain until date" is stored in the object version's metadata and protects the object version until the retention period expires.

After the retention period expires, the object version can be deleted unless a legal hold is also placed on the object version.

Explicit retention mode settings override default bucket settings.

Retention periods can be easily extended by submitting a new lock request.

Within the retention framework, there are two types of modes for setting retention periods for objects and buckets.

## Governance Mode

Governance mode is used to prevent objects from being deleted by standard users. However, certain users need to retain the permissions required to modify retention settings or delete objects. These users will need special permissions such as s3:BypassGovernanceRetention permission and DeleteObject permission.

## Compliance Mode

Compliance mode is more restrictive and cannot be revoked during the retention period. Therefore, compliance mode ensures that no one (including the root user) can delete objects during the object retention period.

## Legal Hold

Legal hold provides the same WORM protection as retention periods but without an expiration date. This is indefinite retention that can only be removed by authorized users.

When objects have retention or legal hold policies defined, they will continue to be versioned. Replication operations performed on an object version do not transfer retention and legal hold settings from the source bucket to the destination.

## RustFS Data Immutability Meets or Exceeds Cohasset Certification Standards

The gold standard for object locking, retention, and legal hold is verification by Cohasset Associates. RustFS's object storage retention and data immutability has earned positive evaluation from Cohasset Associates, particularly regarding SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC Regulation 1.31. Rule 17a-4 has specific requirements for electronic data storage, including many aspects of record management such as duration, format, quality, availability, and accountability of broker-dealer record retention.

A copy of the Cohasset Associates evaluation report can be downloaded in full and shared with relevant regulatory bodies when storing data on RustFS. It details how to configure RustFS to meet requirements and the logic supporting object locking functionality.
