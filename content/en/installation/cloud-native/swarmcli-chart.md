---
title: "SwarmCLI Chart"
description: "Deploy a single-node RustFS service on Docker Swarm with the SwarmCLI rustfs chart: credentials in Docker secrets, versioned upgrades and rollbacks, and optional HTTPS through Traefik."
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) is a Helm-inspired package manager and terminal UI for Docker Swarm. Its open-source [`rustfs` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) deploys RustFS as a Swarm service. Both are maintained by Eldara Tech, not by the RustFS project.

Compared with a hand-written stack file, the chart adds:

- **Credentials in Docker secrets.** RustFS reads its root keys from files through `RUSTFS_ACCESS_KEY_FILE` and `RUSTFS_SECRET_KEY_FILE`, so neither value appears in the service definition or in `docker inspect`. The default `rustfsadmin` key is refused.
- **Versioned releases.** Preview an upgrade, apply it, and roll back to an earlier revision. SwarmCLI stores the revision history in the swarm itself, so no extra database is needed.
- **HTTPS through Traefik.** With the companion [`traefik` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik), the S3 API and the Console get their own host names and Let's Encrypt certificates, and the Console can use single sign-on through OpenID Connect.
- **Health-checked rollouts.** Buckets listed in the values are created at start, and every rollout is watched through RustFS's `/health/ready` endpoint, so `--wait` reports a broken upgrade instead of success.

The chart runs one RustFS service with one drive on one node (single-node single-disk, SNSD). A single drive has no erasure-coding redundancy, so it suits build caches, backup targets, and application blob stores on a small swarm; it does not run a multi-node RustFS deployment.

## 1. Prerequisites

* A Docker Swarm (`docker swarm init`) and a shell on a manager node
* SwarmCLI 1.13.0 or later — see the [SwarmCLI installation guide](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Port 9000 (S3 API) free on the swarm nodes, because step 5 publishes it on the Swarm routing mesh

## 2. Create the credentials as Docker secrets

Replace the credential placeholders, then create one secret for each key:

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Keep each value on one line with no whitespace inside it. Generate a strong secret key with, for example, `openssl rand -base64 30`.

:::warning[The service refuses weak credentials]

SwarmCLI refuses to install the chart while either secret is missing, and the container exits at start if a key is empty, contains whitespace, or is the well-known `rustfsadmin` value. Docker secrets cannot be edited: to rotate the credentials, create secrets under new names, then upgrade the release with `s3.accessKeySecret` and `s3.secretKeySecret` pointing at them.

:::

## 3. Label the data node

A named volume exists on one node only, so the service is pinned to the node labelled `rustfs-data=true`. Label exactly one node:

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

On a single-node swarm you can skip the label and add `--set persistence.nodeLabel=""` to the install command in step 5 instead.

## 4. Add the chart repository

Skip this step if `swarmcli charts repo list` already shows `swarmcli-charts`:

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 5. Install RustFS

Install the chart as a release named `rustfs`, publish the S3 API on port 9000, and create a bucket at start:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

The service stores its data under `/data` on the `rustfs-data` named volume, which Docker names `rustfs_rustfs-data` after the release. Each bucket in `buckets` is created once the server answers; a bucket that already exists is left alone, so restarts and upgrades are safe.

## 6. Verify the deployment

Check the release, the service task, and the S3 API readiness endpoint:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

The S3 API is available at `http://localhost:9000` on every swarm node. Clients use path-style addressing and region `us-east-1`. If the task stays pending with `no suitable node`, no node carries the `rustfs-data=true` label from step 3.

## Upgrade and roll back

Every install, upgrade, and rollback creates a numbered revision of the release. Preview a change, apply it, and list the revisions:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

An upgrade starts from the chart's defaults, so pass every value again, or keep the values in a file and pass it with `-f`. To return to an earlier revision:

```bash
swarmcli charts rollback rustfs 1
```

A rollback redeploys that revision's service definition; it does not restore data.

## Exposure modes

The chart exposes the S3 API and the Console independently. The Console is off by default; enable it with `console.enabled=true`. The S3 API mode is `exposure.mode`, and the Console mode is `console.exposure.mode`:

| Mode | Reachable from |
| - | - |
| `none` (default) | Only services attached to the `rustfs-net` overlay network, at `http://<release>-rustfs:9000` (the Console, when enabled, at port 9001) |
| `published` | A port published on the Swarm routing mesh: `publish.port` for the S3 API, `console.publish.port` (9001) for the Console |
| `traefik` | A host name routed by Traefik over HTTPS: `ingress.host` for the S3 API, `console.ingress.host` for the Console |

The `traefik` mode needs the [`traefik` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) installed first: it creates the `traefik-public` network that RustFS joins and obtains the Let's Encrypt certificates. Then serve the S3 API under its host name:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Without Traefik, publish the Console on port 9001 next to the S3 API:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[The Console port serves the S3 API too]

The Console listener also serves the full signed S3 and admin API, so exposing only the Console still puts that API on a public address. Leave the Console disabled where you do not use it.

:::

## Key values

| Value | Purpose | Chart default |
| - | - | - |
| `image.tag` | RustFS image tag | `""` (the RustFS version the chart pins) |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Docker secrets holding the root credentials | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Buckets created at start if missing | `[]` |
| `exposure.mode` | S3 API exposure: `none`, `published`, or `traefik` | `none` |
| `publish.port` | Published S3 API port | `9000` |
| `ingress.host` | Host name Traefik routes to the S3 API | `s3.example.com` |
| `console.enabled` | Run the Console listener | `false` |
| `console.exposure.mode` | Console exposure: `none`, `published`, or `traefik` | `none` |
| `persistence.nodeLabel` | Node label the service is pinned to; `""` for no pin | `rustfs-data` |
| `persistence.volumePath` | Host directory bind-mounted at `/data` instead of the named volume; must be owned by `10001` | `""` |
| `extraEnv` | Additional `RUSTFS_*` environment variables, such as `RUSTFS_SERVER_DOMAINS` | `{}` |

The [chart README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) documents every value, including Traefik routing, single sign-on for the Console through OpenID Connect, and the host-directory bind mount.

## Uninstall

```bash
swarmcli charts uninstall rustfs
```

Uninstalling removes the service and the release history. It keeps the data volume, the two Docker secrets, and the `rustfs-net` network, which SwarmCLI lists with the command to remove it.

:::note[The data volume survives an uninstall]

A later install with the same release name reattaches the volume and its data. To discard the data, remove the volume on the labelled node once the task has stopped (up to 30 seconds), and remove the secrets if you no longer need them:

```bash
docker volume rm rustfs_rustfs-data
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Next steps

- [RustFS Console](/administration/console)
- [Configure an S3 client](../../developer/examples/aws-cli.md)
- [Pre-Installation Checklists](../requirement/checklists/index.md)
