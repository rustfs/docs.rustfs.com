---
title: "SwarmCLI Chart"
description: "Deploy RustFS on Docker Swarm with the SwarmCLI rustfs chart, as a single-node service or a distributed, erasure-coded cluster: credentials in Docker secrets, versioned upgrades and rollbacks, and optional HTTPS through Traefik."
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) is a Helm-inspired package manager and terminal UI for Docker Swarm. Its open-source [`rustfs` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) deploys RustFS on Docker Swarm. Both are maintained by Eldara Tech, not by the RustFS project.

Compared with a hand-written stack file, the chart adds:

- **Credentials in Docker secrets.** RustFS reads its root keys from files through `RUSTFS_ACCESS_KEY_FILE` and `RUSTFS_SECRET_KEY_FILE`, so neither value appears in the service definition or in `docker inspect`. The default `rustfsadmin` key is refused.
- **Versioned releases.** Preview an upgrade, apply it, and roll back to an earlier revision. SwarmCLI stores the revision history in the swarm itself, so no extra database is needed.
- **HTTPS through Traefik.** With the companion [`traefik` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik), the S3 API and the Console get their own host names and Let's Encrypt certificates, and the Console can use single sign-on through OpenID Connect.
- **Health-checked rollouts.** Buckets listed in the values are created at start, and every rollout of a standalone release is watched through RustFS's `/health/ready` endpoint, so `--wait` reports a broken upgrade instead of success.
- **Rolling cluster upgrades.** In distributed mode, an upgrade rolls one peer at a time; with the default four peers all running, the cluster keeps serving reads and writes throughout, one peer short.

The chart runs in one of two modes, chosen at install. Standalone mode, the default, runs one RustFS service with one drive on one node (single-node single-disk, SNSD). A single drive has no erasure-coding redundancy, so it suits build caches, backup targets, and application blob stores on a small swarm. Distributed mode erasure-codes objects across four or more peers, one per node, for data that must survive losing a node. Step 4 installs standalone mode and step 5 installs distributed mode; the other steps apply to both.

## 1. Prerequisites

* A Docker Swarm (`docker swarm init`) and a shell on a manager node
* SwarmCLI 2.2.0 or later — see the [SwarmCLI installation guide](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* For standalone mode, port 9000 (S3 API) free on the swarm nodes, because step 4 publishes it on the Swarm routing mesh
* For distributed mode, one node for each peer, at least four (a single node is enough for development; see step 5)

## 2. Create the credentials as Docker secrets

Replace the credential placeholders, then create one secret for each key:

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Keep each value on one line with no whitespace inside it. Generate a strong secret key with, for example, `openssl rand -base64 30`. In distributed mode, every peer reads the same two secrets.

:::warning[The service refuses weak credentials]

SwarmCLI refuses to install the chart while either secret is missing, and the container exits at start if a key is empty, contains whitespace, or is the well-known `rustfsadmin` value. Docker secrets cannot be edited: to rotate the credentials, create secrets under new names, then upgrade the release with `s3.accessKeySecret` and `s3.secretKeySecret` pointing at them. In distributed mode, rotation takes a full stop, as described under Upgrade and roll back.

:::

## 3. Add the chart repository

Skip this step if `swarmcli charts repo list` already shows `swarmcli-charts`:

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 4. Install standalone mode

Follow this step or step 5, not both. A named volume exists on one node only, so the service is pinned to the node labelled `rustfs-data=true`. Label exactly one node:

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

On a single-node swarm you can skip the label and add `--set persistence.nodeLabel=""` to the install command below instead.

Install the chart as a release named `rustfs`, publish the S3 API on port 9000, and create a bucket at start:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

The service stores its data under `/data` on the `rustfs-data` named volume, which Docker names `rustfs_rustfs-data` after the release. Each bucket in `buckets` is created once the server answers; a bucket that already exists is left alone, so restarts and upgrades are safe.

## 5. Install distributed mode

Follow this step instead of step 4. In distributed mode, each peer is a Swarm service of its own (`rustfs_rustfs-1` to `rustfs_rustfs-4` for a release named `rustfs`), with one replica, its own volume, and its own node label. Label one node for each peer:

```bash
docker node update --label-add rustfs-1=true <node-a>
docker node update --label-add rustfs-2=true <node-b>
docker node update --label-add rustfs-3=true <node-c>
docker node update --label-add rustfs-4=true <node-d>
```

Put each peer on a different node: peers that share a node share its fate, and with the default four peers, losing one node that holds two peers stops writes. On a single-node swarm, label that one node with all four labels; this suits development only, because it gives no availability.

Set the mode and the cluster shape explicitly. Total drives equal `cluster.peers * cluster.drivesPerPeer`.

:::warning[Choose the topology before installation]

`cluster.peers` and `cluster.drivesPerPeer` are fixed at install: RustFS records the drive count and erasure set width on every drive and refuses to start with other values. `mode` is chosen at install too. Changing it on an existing release does not convert the data: the new mode's services start on empty drives, the old mode's services keep running beside them, and clients reach both. To move a standalone store into a cluster, install the cluster as a second release and copy the buckets across through S3.

:::

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

buckets:
  - my-bucket
```

The example creates four peers with one drive each. Every object is split into two data and two parity shards, so reads survive two peers down and writes survive one, and the usable capacity is half of the drives' total. More than one drive per peer needs `persistence.volumePaths`, with one host directory per drive on a disk of its own; the chart README describes it. Install the chart with the values file:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

All peers start together. `--wait` returns once each peer's task runs and has outlived its monitor window of two minutes. Peer 1 creates the buckets once the cluster accepts writes; if it cannot within five minutes of starting, it logs the bucket it could not create (see `docker service logs rustfs_rustfs-1`) and keeps serving. A peer's health check shows only that the peer is alive, so `--wait` does not show whether the cluster serves; step 6 checks that.

## 6. Verify the deployment

In standalone mode, check the release, the service task, and the S3 API readiness endpoint:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

The S3 API is available at `http://localhost:9000` on every swarm node. Clients use path-style addressing and region `us-east-1`. If the task stays pending with `no suitable node`, no node carries the `rustfs-data=true` label from step 4.

In distributed mode, check the release and the peers' tasks, then ask the cluster whether it serves, from a container on the `rustfs-net` overlay network:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs-1 rustfs_rustfs-2 rustfs_rustfs-3 rustfs_rustfs-4
docker run --rm --network rustfs-net curlimages/curl -s -o /dev/null -w '%{http_code}\n' \
  http://rustfs-rustfs:9000/minio/health/cluster
```

`200` means that every erasure set has write quorum. If a peer's task stays pending with `no suitable node`, no node carries that peer's `rustfs-<n>=true` label from step 5. Once the label is in place, the peer starts; if peer 1's log then reports a bucket it could not create, restart peer 1 to create the buckets again: `docker service update --force rustfs_rustfs-1`.

Services that join `rustfs-net` reach the cluster at `http://rustfs-rustfs:9000`, with path-style addressing and region `us-east-1`. Any peer serves every object, and the name resolves to every peer whose health check passes. That check shows only that a peer is alive, so on a first install, or after every peer has stopped, a peer can answer 503 until the cluster serves. A request in flight to a peer that stops also fails. Clients must retry, as S3 clients do by default. To reach the cluster from outside the swarm, expose it as described under Exposure modes.

## Upgrade and roll back

Every install, upgrade, and rollback creates a numbered revision of the release. An upgrade starts from the chart's defaults, so pass every value again, including `--set persistence.nodeLabel=""` if you used it in step 4, or keep the values in a file and pass it with `-f`. For the standalone release from step 4, preview a change, apply it, and list the revisions:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

To return to an earlier revision:

```bash
swarmcli charts rollback rustfs 1
```

A rollback redeploys that revision's service definition; it does not restore data.

In distributed mode, pass the values file you installed with to every upgrade, rather than `--reuse-values`, and put later changes, such as exposure settings, into that file. An upgrade whose values lack `mode: distributed` leaves the peers as they are and starts a standalone service beside them.

SwarmCLI updates the peers one at a time: it stops a peer, starts its new task, and moves to the next peer only once that task runs and has outlived its monitor window. With the default four peers all running, the cluster keeps serving reads and writes throughout, one peer short; with one peer already down, it stops accepting writes each time the upgrade stops another. So first check with the commands from step 6 that every peer's task runs and that the cluster answers `200`; a `200` alone does not show that every peer runs. Then preview and apply the upgrade, and check the cluster again afterwards:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

A rollback rolls the peers the same way. An upgrade whose peer fails to start stops there, with the remaining peers untouched.

:::warning[Rotating the credentials of a cluster takes a full stop]

Every peer derives its internode secret from the key pair, so peers on the old pair and peers on the new one cannot reach each other, and an upgrade that rolls one peer at a time would split the cluster. Create the new secrets:

```bash
printf '%s' '<your-new-access-key>' | docker secret create rustfs-access-key-2 -
printf '%s' '<your-new-secret-key>' | docker secret create rustfs-secret-key-2 -
```

Add the two secret names to `distributed-values.yaml`, so that later upgrades keep them. With the values from step 5, the file then reads:

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

s3:
  accessKeySecret: rustfs-access-key-2
  secretKeySecret: rustfs-secret-key-2

buckets:
  - my-bucket
```

Then stop every peer and upgrade, so that all peers start together on the new pair:

```bash
for n in 1 2 3 4; do docker service scale "rustfs_rustfs-$n=0"; done
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

The data and the buckets survive; clients need the new pair. Do not roll back to a revision from before the rotation: the rollback would move the peers back to the old pair one at a time and split the cluster the same way.

:::

## Exposure modes

The chart exposes the S3 API and the Console independently. The Console is off by default; enable it with `console.enabled=true`. The S3 API mode is `exposure.mode`, and the Console mode is `console.exposure.mode`:

| Mode | Reachable from |
| - | - |
| `none` (default) | Services attached to the `rustfs-net` overlay network, at `http://<release>-rustfs:9000` (the Console, when enabled, at port 9001); while the other listener uses `traefik`, also services on `traefik-public` |
| `published` | A published port: `publish.port` for the S3 API, `console.publish.port` (9001) for the Console, on the Swarm routing mesh (in distributed mode, on each peer's own node) |
| `traefik` | A host name routed by Traefik over HTTPS: `ingress.host` for the S3 API, `console.ingress.host` for the Console |

The `traefik` mode needs the [`traefik` chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) installed first: it creates the `traefik-public` network that RustFS joins and obtains the Let's Encrypt certificates. Then serve the S3 API of a standalone release under its host name:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Without Traefik, publish a standalone release's Console on port 9001 next to the S3 API:

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

In distributed mode, every peer gets the same exposure settings; set them in `distributed-values.yaml`, then upgrade as described under Upgrade and roll back. With `traefik`, Traefik balances requests over every healthy peer. The `published` mode needs `publish.mode=host` (and `console.publish.mode=host` for the Console), which publishes the port on each peer's own node instead of the routing mesh, so a node's port reaches only the peer on that node. Put a load balancer in front of the nodes, or use Traefik. Host-mode publishing needs each peer on a node of its own, so a single-node swarm cannot use it.

## Key values

| Value | Purpose | Chart default |
| - | - | - |
| `image.tag` | RustFS image tag | `""` (the RustFS version the chart pins) |
| `mode` | `standalone` or `distributed`, chosen at install | `standalone` |
| `cluster.peers` | Distributed peers, one service and one node label each; at least 4 | `4` |
| `cluster.drivesPerPeer` | Drives per distributed peer; more than one needs `persistence.volumePaths` | `1` |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Docker secrets holding the root credentials | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Buckets created at start if missing | `[]` |
| `exposure.mode` | S3 API exposure: `none`, `published`, or `traefik` | `none` |
| `publish.port` | Published S3 API port | `9000` |
| `ingress.host` | Host name Traefik routes to the S3 API | `s3.example.com` |
| `console.enabled` | Run the Console listener | `false` |
| `console.exposure.mode` | Console exposure: `none`, `published`, or `traefik` | `none` |
| `persistence.nodeLabel` | Node label the standalone service is pinned to; `""` for no pin | `rustfs-data` |
| `persistence.nodeLabelPrefix` | Node label prefix pinning distributed peer `<n>` to `<prefix>-<n>`; `""` for no pins, on a single-node swarm only | `rustfs` |
| `persistence.volumePath` | Host directory bind-mounted at `/data` instead of the named volume, in standalone mode; must be owned by `10001` | `""` |
| `extraEnv` | Additional `RUSTFS_*` environment variables, such as `RUSTFS_SERVER_DOMAINS` | `{}` |

The [chart README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) documents every value, including Traefik routing, single sign-on for the Console through OpenID Connect, and the host-directory bind mounts of both modes.

## Uninstall

```bash
swarmcli charts uninstall rustfs
```

Uninstalling removes the service, or every peer's service in distributed mode, and the release history. It keeps the data volume (one per peer in distributed mode), the two Docker secrets, and the `rustfs-net` network, which SwarmCLI lists with the command to remove it.

:::note[The data volumes survive an uninstall]

In standalone mode, a later install with the same release name reattaches the volume and its data. To discard the data, remove the volume on the labelled node once the task has stopped (up to 30 seconds):

```bash
docker volume rm rustfs_rustfs-data
```

In distributed mode, each peer keeps its own volume, `rustfs_rustfs-data-<n>`, on the node labelled `rustfs-<n>=true`; remove it there once that peer's task has stopped. A later install with the same release name reuses these volumes, so it must keep the same `cluster.peers` and `cluster.drivesPerPeer`.

In either mode, remove the secrets if you no longer need them: the pair the release uses, and any pair that a rotation replaced. With the names from step 2:

```bash
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Next steps

- [RustFS Console](/administration/console)
- [Configure an S3 client](../../developer/examples/aws-cli.md)
- [Pre-Installation Checklists](../requirement/checklists/index.md)
