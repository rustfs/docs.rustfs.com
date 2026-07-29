---
title: "Kubernetes Installation (Helm)"
description: "Deploy RustFS on Kubernetes with the official Helm chart: standalone or distributed mode, storage sizing, probes, production hardening, and server-pool expansion."
---

RustFS ships an official Helm chart that deploys either a single-node instance (a `Deployment` with one PVC) or a distributed cluster (a `StatefulSet` with multiple pods and PVCs). This guide walks through installing the chart, choosing a deployment mode, sizing storage correctly, and the production options the chart provides.

**Prerequisites**

- A Kubernetes cluster and `kubectl` access
- Helm 3
- RustFS image version `>= 1.0.0-alpha.69` (the chart requirement)
- A StorageClass with a working provisioner — the chart defaults to [`local-path`](https://github.com/rancher/local-path-provisioner); set `storageclass.name` to use your own
- [`rc`](/operations/rc) installed on the administration host before using the server-pool commands in this guide

The chart lives in the RustFS source repository under `helm/rustfs`:

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs/helm/rustfs
```

## 1. Quick install

Install into a dedicated namespace, setting your own credentials and a realistic data size:

```bash
helm install rustfs . \
  --namespace rustfs --create-namespace \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key> \
  --set storageclass.dataStorageSize=100Gi \
  --set storageclass.logStorageSize=1Gi
```

:::note[The chart refuses default credentials]

Rendering fails by default unless one of the following is true:

1. `secret.existingSecret` names a Kubernetes Secret you control, or
2. `secret.rustfs.access_key` and `secret.rustfs.secret_key` are **both** set to non-empty, non-default values, or
3. `secret.allowInsecureDefaults: true` is set (only for local development).

This prevents accidental deployment with the well-known default `rustfsadmin`/`rustfsadmin` credentials. Setting only one of the two keys is also rejected, so the chart never silently falls back to a default for the missing key.

:::

Watch the pods come up:

```bash
kubectl -n rustfs get pods -w
```

```text
NAME       READY   STATUS    RESTARTS   AGE
rustfs-0   1/1     Running   0          2m27s
rustfs-1   1/1     Running   0          2m27s
rustfs-2   1/1     Running   0          2m27s
rustfs-3   1/1     Running   0          2m27s
```

## 2. Choose a deployment mode

The chart supports two modes, selected via the `mode` values:

| Mode | Values | Workload | Layout |
| --- | --- | --- | --- |
| Distributed (**default**) | `mode.distributed.enabled=true` | StatefulSet | `replicaCount: 4` pods, 4 data PVCs each (16 drives total) — or `replicaCount: 16` for 16 pods with 1 data PVC each |
| Standalone | `mode.standalone.enabled=true`, `mode.distributed.enabled=false` | Deployment | 1 pod, 1 data PVC (single node single disk) |

- **Standalone** matches single-node single-disk: no erasure-coding redundancy across nodes. Use it for development, testing, or small setups where the underlying storage provides its own durability. It can reuse existing PVCs via `mode.standalone.existingClaim.dataClaim` / `mode.standalone.existingClaim.logsClaim`.
- **Distributed** behaves like [multiple node multiple disk](../linux/multiple-node-multiple-disk.md): objects are erasure-coded across pods and PVCs. `replicaCount` must be `4` (each pod gets 4 PVCs) or `16` (each pod gets 1 PVC); pick based on how many nodes your cluster can spread pods across.

```bash
# Standalone mode
helm install rustfs . -n rustfs --create-namespace \
  --set mode.standalone.enabled=true \
  --set mode.distributed.enabled=false \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key>
```

## 3. Storage sizing

PVC sizes come from the `storageclass` block:

```yaml title="values-prod.yaml"
storageclass:
  name: local-path        # your StorageClass
  dataStorageSize: 256Mi  # per data PVC
  logStorageSize: 256Mi   # per logs PVC
```

:::warning[The default PVC size is 256Mi — change it]

The chart's default size for the data and logs volumes is **256Mi**, which is only enough to verify the chart works. For any real workload set `storageclass.dataStorageSize` (for example `1Ti`) and `storageclass.logStorageSize` (for example `1Gi`) at install time. In distributed mode the data size applies to **each** data PVC (16 PVCs by default).

:::

Setting `config.rustfs.obs_log_directory` to `""` disables the log PVCs and mounts entirely. Custom PVC annotations go under `storageclass.pvcAnnotations.data` / `storageclass.pvcAnnotations.logs`.

## 4. Health probes

The chart templates HTTP probes on the S3 port (9000) out of the box, matching the server's health endpoints:

- **Liveness**: `GET /health` (`livenessProbe.httpGet.path`), initial delay 30s, period 5s
- **Readiness**: `GET /health/ready` (`readinessProbe.httpGet.path`), initial delay 10s, period 5s

A pod is only added to the Service endpoints once `/health/ready` returns `200`, which in distributed mode requires the storage quorum to be met. Thresholds and timings are tunable via the `livenessProbe.*` and `readinessProbe.*` values.

## 5. Production hardening

### Pod Disruption Budget

Disabled by default. Enable it so voluntary evictions (node drains, cluster upgrades) never take more than one pod down at a time:

```bash
--set pdb.create=true    # pdb.maxUnavailable defaults to 1
```

### Anti-affinity and topology spread

`affinity.podAntiAffinity.enabled` defaults to `true` with `topologyKey: kubernetes.io/hostname`, spreading pods across distinct nodes. For zone-level spreading, enable `topologySpreadConstraints.enabled` and supply raw constraint entries under `topologySpreadConstraints.constraints` (applied to the distributed StatefulSet).

### Inter-pod mTLS (cert-manager)

Set `mtls.enabled=true` to encrypt traffic between pods; the chart renders cert-manager `Issuer`/`Certificate` resources for a CA, server, and client certificates. To use an issuer you already operate, set `mtls.existingIssuerRef.enabled=true` with its `name`, `kind` (`Issuer` or `ClusterIssuer`), and `group`.

### Ingress and Gateway API

Ingress is enabled by default (`ingress.enabled=true`) with `ingress.className: nginx`; set it to `traefik` if that is your controller — the chart applies the matching session-stickiness annotations for each. Set your domain via `ingress.hosts[0].host` (default `example.rustfs.com`). For HTTPS, enable `ingress.tls.enabled` and either pass the certificate with `--set-file ingress.tls.crt=./tls.crt --set-file ingress.tls.key=./tls.key`, point at an existing secret (`ingress.tls.existingSecret`), or let cert-manager issue one (`ingress.tls.certManager.enabled=true`).

The chart also has alpha [Gateway API](https://gateway-api.sigs.k8s.io/) support (`gatewayApi.enabled=true` together with `ingress.enabled=false`, Traefik gateway class), rendering `Gateway` and `HTTPRoute` resources.

## 6. Access RustFS

Without an ingress, port-forward the Service:

```bash
kubectl -n rustfs port-forward svc/rustfs 9000:9000 9001:9001
```

- S3 API: `http://localhost:9000`
- Console: `http://localhost:9001`

Log in to the Console with the access key and secret key you set at install time. With ingress enabled, use your configured host instead (check `kubectl -n rustfs get ing`). The Service defaults to `ClusterIP`; `service.type` can be switched to `NodePort` (S3 on `service.endpoint.nodePort: 32000`, Console on `service.console.nodePort: 32001`) or `LoadBalancer`.

## 7. Scaling out with server pools

In distributed mode the chart can run multiple **server pools** — independent StatefulSets whose drives together form one cluster. This is the chart-level equivalent of adding a Server Pool as described in [Pool Expansion](../../operations/scaling/storage-pool-expansion.md).

To expand an existing deployment, enable pools and describe the current layout as pool 0 plus your new capacity:

```yaml title="values-prod.yaml (pools)"
pools:
  enabled: true
  list:
    - {}                  # pool 0: inherits top-level values and keeps the
                          # existing StatefulSet/pod/PVC names and data
    - replicaCount: 4     # pool 1: new capacity (4 or 16)
      storageclass:
        dataStorageSize: 10Gi
```

Then apply with `helm upgrade`. Each entry may set `replicaCount` (4 or 16) and/or a `storageclass` block; omitted fields inherit the top-level values. Additional pools render as `<fullname>-pool<N>` StatefulSets; all pools share the headless service, the main service, the configuration, and the credentials.

:::warning[Pools are append-only]

The list index determines the StatefulSet name — never remove or reorder entries. Retire a pool with `rc admin decommission` before removing it from the list.

:::

What to expect during the rollout, per the chart's documentation:

- **Crash/restart cycles are normal.** Pods restart until every pod of every pool is resolvable — the server refuses to start with unresolvable peers, so expect a few crash loops before the cluster converges. This is harmless.
- **Rebalance afterwards.** After the cluster converges, run `rc admin rebalance start <alias>` to spread existing objects across the new pool.
- The PodDisruptionBudget spans all pools: with the default `pdb.maxUnavailable: 1`, at most one pod of the whole cluster may be evicted at a time.

:::note

`rc` is the RustFS command-line client. Use `rc admin pool list`, `expand`, `rebalance`, and `decommission` for the server-pool workflows described by the chart.

:::

## 8. Uninstall

```bash
helm uninstall rustfs -n rustfs
```

:::note

Helm does not delete PVCs created by StatefulSet volume claim templates. If you intend to discard the data, remove the PVCs explicitly (`kubectl -n rustfs delete pvc -l app.kubernetes.io/name=rustfs`) — otherwise a later reinstall with the same release name reattaches them.

:::

## Next steps

- [Pool Expansion](../../operations/scaling/storage-pool-expansion.md) — how Server Pool expansion works at the cluster level
- [Kubernetes Upgrade](../../operations/upgrade/kubernetes/index.md) — upgrade Helm- and Operator-managed deployments
- [TLS configuration](../../integration/tls-configured.md) — end-to-end TLS options
