---
title: "Kubernetes 安装（Helm）"
description: "使用官方 Helm chart 在 Kubernetes 上部署 RustFS：单机或分布式模式、存储容量规划、探针、生产环境加固和服务器池扩容。"
---

RustFS 提供官方 Helm chart，可部署单节点实例（一个包含一个 PVC 的 `Deployment`）或分布式集群（一个包含多个 Pod 和 PVC 的 `StatefulSet`）。本指南介绍如何安装 chart、选择部署模式、正确规划存储容量，以及 chart 提供的生产环境选项。

**前提条件**

- Kubernetes 集群和 `kubectl` 访问权限
- Helm 3
- RustFS 镜像版本 `>= 1.0.0-alpha.69`（chart 要求）
- 具有可用预配器的 StorageClass。chart 默认为 [`local-path`](https://github.com/rancher/local-path-provisioner)；设置 `storageclass.name` 可使用自己的 StorageClass
- 使用本指南中的服务器池命令前，管理主机上已安装 [`rc`](/operations/rc)

该 chart 位于 RustFS 源代码仓库的 `helm/rustfs` 下：

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs/helm/rustfs
```

## 1. 快速安装

安装到专用命名空间，并设置自己的凭证和实际的数据容量：

```bash
helm install rustfs . \
  --namespace rustfs --create-namespace \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key> \
  --set storageclass.dataStorageSize=100Gi \
  --set storageclass.logStorageSize=1Gi
```

:::note[chart 拒绝默认凭证]

除非满足以下任一条件，否则默认情况下渲染会失败：

1. `secret.existingSecret` 指定你控制的 Kubernetes Secret，或
2. `secret.rustfs.access_key` 和 `secret.rustfs.secret_key` **都**设置为非空、非默认值，或
3. 设置 `secret.allowInsecureDefaults: true`（仅限本地开发）。

这可以避免意外使用众所周知的默认 `rustfsadmin`/`rustfsadmin` 凭证进行部署。仅设置两个密钥中的一个也会被拒绝，因此 chart 不会静默地为缺失密钥回退到默认值。

:::

观察 Pod 启动：

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

## 2. 选择部署模式

该 chart 支持通过 `mode` 值选择两种模式：

| 模式 | 值 | 工作负载 | 布局 |
| --- | --- | --- | --- |
| 分布式（**默认**） | `mode.distributed.enabled=true` | StatefulSet | `replicaCount: 4` 个 Pod，每个 Pod 4 个数据 PVC（共 16 个驱动器）；或设置 `replicaCount: 16`，使用 16 个 Pod，每个 Pod 1 个数据 PVC |
| 单机 | `mode.standalone.enabled=true`、`mode.distributed.enabled=false` | Deployment | 1 个 Pod、1 个数据 PVC（单节点单磁盘） |

- **单机模式**对应单节点单磁盘：节点之间不提供纠删码冗余。适用于开发、测试或底层存储自身提供持久性的小型部署。它可以通过 `mode.standalone.existingClaim.dataClaim` / `mode.standalone.existingClaim.logsClaim` 复用现有 PVC。
- **分布式模式**的行为类似[多节点多磁盘](../linux/multiple-node-multiple-disk.md)：对象通过纠删码分布到各 Pod 和 PVC。`replicaCount` 必须为 `4`（每个 Pod 获得 4 个 PVC）或 `16`（每个 Pod 获得 1 个 PVC）；请根据集群能够将 Pod 分布到多少个节点来选择。

```bash
# Standalone mode
helm install rustfs . -n rustfs --create-namespace \
  --set mode.standalone.enabled=true \
  --set mode.distributed.enabled=false \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key>
```

## 3. 存储容量规划

PVC 大小来自 `storageclass` 区块：

```yaml title="values-prod.yaml"
storageclass:
  name: local-path        # your StorageClass
  dataStorageSize: 256Mi  # per data PVC
  logStorageSize: 256Mi   # per logs PVC
```

:::warning[默认 PVC 大小为 256Mi，请更改]

chart 的数据卷和日志卷默认大小为 **256Mi**，仅足以验证 chart 是否可用。对于任何实际工作负载，请在安装时设置 `storageclass.dataStorageSize`（例如 `1Ti`）和 `storageclass.logStorageSize`（例如 `1Gi`）。在分布式模式下，数据大小应用于**每个**数据 PVC（默认 16 个 PVC）。

:::

将 `config.rustfs.obs_log_directory` 设置为 `""` 可完全禁用日志 PVC 和挂载。自定义 PVC 注解位于 `storageclass.pvcAnnotations.data` / `storageclass.pvcAnnotations.logs` 下。

## 4. 健康探针

chart 默认在 S3 端口（9000）上设置 HTTP 探针，与服务器的健康检查端点一致：

- **存活探针**：`GET /health`（`livenessProbe.httpGet.path`），初始延迟 30s，周期 5s
- **就绪探针**：`GET /health/ready`（`readinessProbe.httpGet.path`），初始延迟 10s，周期 5s

只有当 `/health/ready` 返回 `200` 后，Pod 才会添加到 Service 端点。在分布式模式下，这要求满足存储仲裁。可通过 `livenessProbe.*` 和 `readinessProbe.*` 值调整阈值和时间。

## 5. 生产环境加固

### Pod Disruption Budget

默认禁用。启用后，自愿中断（节点排空、集群升级）一次不会导致超过一个 Pod 停止：

```bash
--set pdb.create=true    # pdb.maxUnavailable defaults to 1
```

### 反亲和性和拓扑分布

`affinity.podAntiAffinity.enabled` 默认为 `true`，并使用 `topologyKey: kubernetes.io/hostname` 将 Pod 分布到不同节点。对于可用区级分布，请启用 `topologySpreadConstraints.enabled`，并在 `topologySpreadConstraints.constraints` 下提供原始约束条目（应用于分布式 StatefulSet）。

### Pod 间 mTLS（cert-manager）

设置 `mtls.enabled=true` 可加密 Pod 之间的流量；chart 会为 CA、服务器和客户端证书渲染 cert-manager `Issuer`/`Certificate` 资源。要使用已在运维的 issuer，请设置 `mtls.existingIssuerRef.enabled=true`，并提供其 `name`、`kind`（`Issuer` 或 `ClusterIssuer`）和 `group`。

### Ingress 和 Gateway API

Ingress 默认启用（`ingress.enabled=true`），且 `ingress.className: nginx`；如果使用 Traefik 控制器，请将其设置为 `traefik`，chart 会为各控制器应用匹配的会话粘性注解。通过 `ingress.hosts[0].host` 设置域名（默认为 `example.rustfs.com`）。要使用 HTTPS，请启用 `ingress.tls.enabled`，并通过 `--set-file ingress.tls.crt=./tls.crt --set-file ingress.tls.key=./tls.key` 传入证书、指向现有 Secret（`ingress.tls.existingSecret`），或让 cert-manager 签发证书（`ingress.tls.certManager.enabled=true`）。

该 chart 还提供 alpha 阶段的 [Gateway API](https://gateway-api.sigs.k8s.io/) 支持（同时设置 `gatewayApi.enabled=true` 和 `ingress.enabled=false`，使用 Traefik gateway class），并渲染 `Gateway` 和 `HTTPRoute` 资源。

## 6. 访问 RustFS

没有 ingress 时，对 Service 进行端口转发：

```bash
kubectl -n rustfs port-forward svc/rustfs 9000:9000 9001:9001
```

- S3 API：`http://localhost:9000`
- 控制台：`http://localhost:9001`

使用安装时设置的访问密钥和秘密密钥登录控制台。启用 ingress 后，改用配置的主机（运行 `kubectl -n rustfs get ing` 检查）。Service 默认为 `ClusterIP`；可将 `service.type` 切换为 `NodePort`（S3 使用 `service.endpoint.nodePort: 32000`，控制台使用 `service.console.nodePort: 32001`）或 `LoadBalancer`。

## 7. 使用服务器池横向扩容

在分布式模式下，chart 可以运行多个**服务器池**，每个服务器池都是独立的 StatefulSet，其驱动器共同组成一个集群。这相当于在 chart 层添加[存储池扩容](../../operations/scaling/storage-pool-expansion.md)中所述的服务器池。

要扩展现有部署，请启用存储池，并将当前布局描述为存储池 0，再添加新容量：

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

然后使用 `helm upgrade` 应用。每个条目可以设置 `replicaCount`（4 或 16）和/或 `storageclass` 区块；省略的字段继承顶层值。其他存储池渲染为 `<fullname>-pool<N>` StatefulSet；所有存储池共享无头 Service、主 Service、配置和凭证。

:::warning[存储池仅可追加]

列表索引决定 StatefulSet 名称，切勿删除条目或调整顺序。从列表中删除存储池前，请使用 `rc admin decommission` 将其停用。

:::

根据 chart 文档，滚动更新期间会出现以下情况：

- **崩溃/重启循环属于正常现象。** Pod 会不断重启，直到所有存储池的所有 Pod 都能解析。服务器拒绝在存在无法解析的对等节点时启动，因此集群收敛前可能出现几次崩溃循环。这不会造成损害。
- **之后重新平衡。** 集群收敛后，运行 `rc admin rebalance start <alias>` 将现有对象分布到新存储池。
- PodDisruptionBudget 跨所有存储池生效：使用默认 `pdb.maxUnavailable: 1` 时，整个集群一次最多驱逐一个 Pod。

:::note

`rc` 是 RustFS 命令行客户端。使用 `rc admin pool list`、`expand`、`rebalance` 和 `decommission` 完成 chart 所述的服务器池工作流。

:::

## 8. 卸载

```bash
helm uninstall rustfs -n rustfs
```

:::note

Helm 不会删除 StatefulSet volume claim template 创建的 PVC。如果确定要丢弃数据，请显式删除 PVC（`kubectl -n rustfs delete pvc -l app.kubernetes.io/name=rustfs`）；否则以后使用相同 release 名称重新安装时会重新挂载这些 PVC。

:::

## 后续步骤

- [存储池扩容](../../operations/scaling/storage-pool-expansion.md)：服务器池扩容在集群层的工作方式
- [Kubernetes 升级](../../operations/upgrade/kubernetes/index.md)：升级由 Helm 和 Operator 管理的部署
- [TLS 配置](../../integration/tls-configured.md)：端到端 TLS 选项