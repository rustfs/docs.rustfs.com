# Object Immutability

## Object Retention

Retention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default settings. Default lock configurations apply to subsequently created objects.

When using bucket default settings, a duration in days or years defines the protection period. New objects inherit this duration.

Retention periods can be explicitly set for object versions. Explicit retention periods specify a "retain until date".

After the retention period expires, the object version can be deleted unless a legal hold is active.

Explicit retention mode settings override default bucket settings.

Retention periods can be extended by submitting a new lock request.

## Governance Mode

Governance mode prevents objects from being deleted by standard users. Users with special permissions (e.g., `s3:BypassGovernanceRetention`) can modify retention settings or delete objects.

## Compliance Mode

Compliance mode ensures that no one (including the root user) can delete objects during the retention period.

## Legal Hold

Legal hold provides indefinite WORM protection without an expiration date. It can only be removed by authorized users.

When objects have retention or legal hold policies, they continue to be versioned. Replication operations do not transfer retention and legal hold settings.

## RustFS Data Immutability Meets Cohasset Certification Standards

RustFS meets Cohasset Associates standards for object locking, retention, and legal hold, including SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC Regulation 1.31.

Download the Cohasset Associates report for details on configuring RustFS to meet regulatory requirements.
