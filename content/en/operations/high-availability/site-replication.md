---
title: "Site Replication"
description: "Configure and operate multi-site RustFS replication with the rc command-line client."
---

Site replication links two or more independent **RustFS** deployments. It synchronizes buckets, object versions, and supported identity and access management (IAM) data across the linked sites. Use this workflow when applications need to write to separate RustFS sites while keeping their storage and identity configuration aligned.

Site replication is different from [bucket replication](/administration/data/bucket/replication). Bucket replication is a directional rule between selected buckets; site replication establishes a broader relationship between complete RustFS deployments.

:::warning[Plan recovery separately]

Site replication is asynchronous. A successful write at one site does not confirm that another site already has the replicated version. Site replication also does not provide DNS failover, traffic routing, or application recovery orchestration.

:::

## Replicated resources

RustFS site replication synchronizes these resource families across linked sites:

- Buckets and object versions, including delete markers.
- Bucket metadata required by the site replication workflow.
- IAM users, groups, policies, policy mappings, and service accounts.

Bucket versioning support is required at every participating site. RustFS configures the site relationship and the underlying replication targets when you add the sites.

## Requirements

Before linking sites, prepare:

- Two or more independent RustFS deployments running a release that exposes the site replication Admin API.
- A unique, stable S3 API endpoint for each deployment.
- Bidirectional network connectivity between every site endpoint on the S3 API port, normally `9000`.
- Trusted TLS certificates for production endpoints.
- The RustFS [`rc`](/operations/rc) client on a secured administration host.
- Root administrative credentials for every participating site.
- Compatible bucket-versioning support on every site.

Use empty test sites when first validating the workflow. Before linking existing sites, inventory bucket names, object-lock settings, IAM identities, and policies for conflicts.

:::warning[Protect administrative credentials]

The `add` operation resolves every peer endpoint and root credential from your local `rc` alias store. Run it only from a trusted administration host, restrict access to the local `rc` configuration, and do not place credentials in shell history, logs, or screenshots.

:::

## 1. Configure site aliases

Configure one alias for each site. Replace the endpoint and credentials for both deployments:

```bash
rc alias set site1 https://site1.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set site2 https://site2.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Check that both sites are reachable and ready:

```bash
rc ready site1
rc ready site2
rc admin info cluster site1
rc admin info cluster site2
```

Use HTTPS endpoints in production. If a site uses a private certificate authority, install that authority in the administration host's trust store before continuing.

:::warning[Loopback endpoints are for tests only]

RustFS rejects loopback replication targets by default as an outbound-request security control. The server option `RUSTFS_REPLICATION_ALLOW_LOOPBACK_TARGET=true` exists only for single-host development and automated tests. Never enable it in production.

:::

## 2. Link the sites

Submit all participating aliases in one command. The first alias receives the administration request:

```bash
rc admin replicate add site1 site2
```

To create a relationship with more than two sites, include every alias in the initial command:

```bash
rc admin replicate add site1 site2 site3
```

Do not run separate pairwise `add` commands to build the same multi-site relationship.

Inspect the resulting configuration from at least two sites:

```bash
rc admin replicate info site1
rc admin replicate info site2
```

The output identifies each linked deployment by its deployment ID, site name, and endpoint. Save the deployment IDs because edit and resync operations can select a site by exact deployment ID or exact unique name.

## 3. Check replication status

Request the default bucket and IAM summaries:

```bash
rc admin replicate status site1
```

Select specific status sections when investigating an issue:

```bash
rc admin replicate status site1 --buckets
rc admin replicate status site1 --users --groups --policies
rc admin replicate status site1 --metrics
```

Check status from each site. A healthy response from `site1` confirms that site's view of the relationship; it does not replace checking the other deployments.

## 4. Validate data and IAM replication

Create a test bucket and object at the first site:

```bash
rc bucket create site1/my-bucket
printf 'hello rustfs\n' > hello.txt
rc object copy hello.txt site1/my-bucket/hello.txt
```

Poll the second site until the object appears:

```bash
rc object stat site2/my-bucket/hello.txt
rc object copy site2/my-bucket/hello.txt ./hello-from-site2.txt
```

Compare the downloaded content before treating the data path as validated:

```bash
cmp hello.txt hello-from-site2.txt
```

For IAM validation, create a temporary user and attach a test policy at one site, then inspect the user and policy mapping at another site. Remove the temporary identity after validation:

```bash
rc admin user add site1 replication-test <temporary-secret-key>
rc admin policy attach site1 readonly --user replication-test

rc admin user info site2 replication-test
rc admin policy entities site2 --user replication-test

rc admin user rm site1 replication-test
```

Use a randomly generated temporary secret and do not reuse an application or administrator credential.

## 5. Edit a site

Use `edit` when a linked site's name, endpoint, or TLS trust settings change. First inspect the current deployment IDs and names:

```bash
rc admin replicate info site1
```

Rename a site:

```bash
rc admin replicate edit site1 \
	--site <deployment-id> \
	--name site2-dr \
	--yes
```

Replace an endpoint and keep TLS verification enabled:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--endpoint https://site2-dr.example.com:9000 \
	--verify-tls \
	--yes
```

For a private certificate authority, provide a certificate-only PEM bundle:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--ca-cert ./site2-ca.pem \
	--yes
```

Clear a previously configured custom CA when the endpoint moves to a certificate trusted by the system trust store:

```bash
rc admin replicate edit site1 \
	--site site2-dr \
	--clear-ca-cert \
	--verify-tls \
	--yes
```

The endpoint must be an HTTP or HTTPS origin without a path, query, fragment, or embedded credentials. Prefer a trusted certificate over `--skip-tls-verify`.

## 6. Resynchronize a site

Use resynchronization after repairing a site that was unavailable or when status checks show missing replicated state. Start a resync for one exact peer:

```bash
rc admin replicate resync start site1 \
	--site <deployment-id> \
	--yes
```

Read the last persisted resync snapshot:

```bash
rc admin replicate resync status site1 \
	--site <deployment-id>
```

Cancel the selected resync only when you have confirmed it should stop:

```bash
rc admin replicate resync cancel site1 \
	--site <deployment-id> \
	--yes
```

:::warning[Resync status is not live progress]

The current RustFS resync status endpoint returns the persisted result of the most recent start or cancel request. It does not inspect live workers, and its lifecycle state is reported as unknown. Start operations can overlap, cancellation is not idempotent, and a network timeout can leave the mutation outcome unknown. After an ambiguous result, inspect `replicate info`, `replicate status`, and the target data before issuing another mutation.

:::

## 7. Remove site replication

Removing a site changes the replication relationship. It does not provide an application cutover or prove that every queued object has arrived. Check status and preserve any required data before proceeding.

Remove one named site:

```bash
rc admin replicate remove site1 --site site2-dr
```

Repeat `--site` to remove multiple named sites in one request:

```bash
rc admin replicate remove site1 \
	--site site2-dr \
	--site site3
```

Dissolve the complete site replication relationship:

```bash
rc admin replicate remove site1 --all
```

Verify the result from the remaining deployments:

```bash
rc admin replicate info site1
rc admin replicate status site1
```

## Troubleshooting

### A peer endpoint is rejected

Confirm that the endpoint is a reachable HTTP or HTTPS origin and does not resolve to loopback. For production, make every site reachable through its stable network address and keep the loopback override disabled.

### TLS validation fails

Confirm that the endpoint certificate contains the peer hostname and that the issuing certificate authority is trusted. Use `replicate edit --ca-cert` for a private CA bundle. Do not make `--skip-tls-verify` the permanent fix.

### A mutation times out

Do not immediately repeat `add`, `edit`, `resync start`, `resync cancel`, or `remove`. The server may have applied the change before the client lost the response. Inspect the relationship and data first:

```bash
rc admin replicate info site1
rc admin replicate status site1
```

### Replication falls behind

Check the site status and metrics from every deployment, then verify endpoint reachability and storage readiness:

```bash
rc admin replicate status site1 --metrics
rc ready site1
rc ready site2
```

Application writes can outpace asynchronous replication. Do not infer a recovery point objective from a single status sample; measure lag under your workload and alert on sustained backlog.

## Next steps

- Review [Bucket Replication](/administration/data/bucket/replication) when you need directional replication for selected buckets instead of a complete site relationship.
- Monitor [cluster status and readiness](/operations/status-check) at every site.
- Review the [`rc` command guide](/operations/rc) and keep the client aligned with the RustFS server release.