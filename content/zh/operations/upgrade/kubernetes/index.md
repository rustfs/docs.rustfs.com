---
title: "Kubernetes 升级"
description: "升级由 Helm chart 或 RustFS Operator 管理的 RustFS 部署，并验证每次发布。"
---

通过拥有相应资源的工具升级 Kubernetes 部署。对于直接安装的 RustFS Helm chart，请使用 Helm。对于 Operator 安装，请通过各自的声明式配置升级 Operator 发行版和每个 Tenant。

## 升级前准备

阅读适用于部署的 RustFS、chart 和 Operator 发行说明。确认集群有足够容量替换 Pod，并且当前所有工作负载均已就绪：

```bash
kubectl get nodes
kubectl -n <namespace> get pods,pvc
```

升级或回滚期间，请勿删除 PersistentVolumeClaim（PVC）。请将现有部署值和清单纳入版本控制，包括所有镜像标签、存储拓扑、调度规则和 Secret 引用。

## 升级 Helm chart 部署

此工作流程适用于直接通过 [RustFS Helm chart](/installation/cloud-native/helm-chart/installation) 安装的 RustFS，不适用于由 RustFS Operator 创建的 Tenant。

记录当前发行版修订版本、chart 版本、应用版本和实际用户提供的值：

```bash
helm status rustfs --namespace rustfs
helm history rustfs --namespace rustfs
helm get values rustfs --namespace rustfs -o yaml > rustfs-values.previous.yaml
```

按照安装时使用的方式准备目标 chart。如果使用 chart 仓库，请更新其索引并设置 chart 引用：

```bash
helm repo update rustfs
export RUSTFS_CHART=rustfs/rustfs
```

如果使用源代码签出，请签出目标 RustFS 发行版，并让 `RUSTFS_CHART` 指向其 chart 目录：

```bash
export RUSTFS_CHART=./helm/rustfs
```

根据发行版的特定变更更新维护的 values 文件。将 `image.rustfs.tag` 设置为要运行的明确 RustFS 版本，然后应用升级：

```bash
helm upgrade rustfs "$RUSTFS_CHART" \
	--namespace rustfs \
	-f <values-file> \
	--set-string image.rustfs.tag=<target-version> \
	--wait \
	--timeout 10m
```

Helm 会执行滚动更新。监控发行版和 Pod，直到发布完成：

```bash
helm status rustfs --namespace rustfs
kubectl -n rustfs get pods,pvc,services
```

分布式模式会创建 StatefulSet：

```bash
kubectl -n rustfs rollout status statefulset/rustfs --timeout=10m
```

单机模式会创建 Deployment：

```bash
kubectl -n rustfs rollout status deployment/rustfs --timeout=10m
```

发布后验证 S3 API。如果该 API 未暴露到集群外部，请先启动安装指南中记录的端口转发：

```bash
curl -fsS http://localhost:9000/health/ready
```

### 回滚 Helm 发行版

列出发行版历史记录，确定上一个正常工作的修订版本，并让 Helm 恢复其 chart、值和镜像配置：

```bash
helm history rustfs --namespace rustfs
helm rollback rustfs <previous-revision> \
	--namespace rustfs \
	--wait \
	--timeout 10m
```

回滚后再次检查工作负载和就绪端点。请勿卸载发行版或删除其 PVC。

## 升级 Operator 部署

Operator 部署有两个独立的升级面：

- RustFS Operator 和 Operator Console 从 `rustfs-operator` Helm 发行版运行。
- 每个 Tenant 运行该 Tenant 的 `spec.image` 字段中声明的 RustFS 镜像。

更改 Tenant 镜像前，请升级并验证 Operator 控制平面。请勿在一个维护步骤中同时执行 Operator 升级和多个 Tenant 升级。

### 升级 Operator 发行版

记录当前发行版并保存其值：

```bash
helm status rustfs-operator --namespace rustfs-system
helm history rustfs-operator --namespace rustfs-system
helm get values rustfs-operator --namespace rustfs-system -o yaml \
	> rustfs-operator-values.previous.yaml
```

将 Operator 源代码签出更新到目标发行版，并查看其 chart 值和 CustomResourceDefinition（CRD）的变更。Helm 不会升级 chart 的 `crds/` 目录中存储的 CRD，因此请在升级控制器前应用两个目标 CRD：

```bash
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/tenant.yaml
kubectl apply --server-side --force-conflicts \
	--field-manager=rustfs-operator-crd-upgrade \
	-f deploy/rustfs-operator/crds/policybinding-crd.yaml
```

CRD 采用集群作用域，并由每个 Tenant 命名空间共享。首先应用 CRD 后，Kubernetes API 服务器便可接受新控制器引入的字段。两个命令均成功后，使用维护的 values 文件升级 Operator：

```bash
helm upgrade rustfs-operator deploy/rustfs-operator/ \
	--namespace rustfs-system \
	-f <operator-values-file> \
	--set-string operator.image.tag=<target-operator-version> \
	--set-string console.image.tag=<target-operator-version> \
	--wait \
	--timeout 10m
```

升级 Tenant 前，请验证 CRD 和所有控制平面组件：

```bash
kubectl get crd tenants.rustfs.com
kubectl -n rustfs-system rollout status deployment/rustfs-operator --timeout=10m
kubectl -n rustfs-system rollout status deployment/rustfs-operator-console --timeout=10m
kubectl get tenants --all-namespaces
```

CRD 变更不属于 Helm 发行版历史记录，`helm rollback` 不会恢复它们。在考虑回滚控制器之前，请查看目标发行版的兼容性和迁移说明。如果该发行版明确支持降级，请恢复到之前的 Helm 修订版本，而不要应用旧的 CRD 文件：

```bash
helm history rustfs-operator --namespace rustfs-system
helm rollback rustfs-operator <previous-revision> \
	--namespace rustfs-system \
	--wait \
	--timeout 10m
```

请勿跨越有文档说明的单向工作负载或安全迁移进行降级。应向前升级到修复后的 Operator 发行版。

### 升级 Tenant

Operator 拥有每个 Tenant 的 StatefulSet。请勿直接更改其容器镜像，因为协调过程会恢复 Tenant 声明的镜像。

记录当前 Tenant 镜像并确认其 `Ready` 条件：

```bash
kubectl -n storage-a get tenant tenant-a \
	-o jsonpath='{.spec.image}{"\n"}'
kubectl -n storage-a get tenant tenant-a
kubectl -n storage-a get pods,pvc -l rustfs.tenant=tenant-a
```

在用于安装 Tenant 的完整 `tenant.yaml` 中，仅将 `spec.image` 更改为 `rustfs/rustfs:<target-version>`。保持其存储池、PVC 模板、凭证和其他设置不变。应用完整清单，并等待 Operator 协调新一代资源：

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
kubectl -n storage-a get pods -l rustfs.tenant=tenant-a
```

一次升级一个 Tenant。更新其他 Tenant 前，请确认其 S3 API 和[集群状态](/operations/status-check)。

### 回滚 Tenant

在 `spec.image` 中恢复之前记录的镜像，应用完整 Tenant 清单，然后再次等待 `Ready`：

```bash
kubectl apply -f tenant.yaml
kubectl -n storage-a wait tenant/tenant-a \
	--for=condition=Ready \
	--timeout=10m
```

Operator 会重复使用 Tenant 的现有 PVC。回滚期间，请勿删除 Tenant、其 StatefulSet 或 PVC。

## 后续步骤

查看[状态检查](/operations/status-check)和[可观测性](/operations/observability)，在发布后验证部署。