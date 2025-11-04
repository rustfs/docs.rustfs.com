---
title: "RustFS 的云原生安装指南"
description: "使用 Helm Chart 或 Operator 在 Kubernetes 上安装部署 RustFS.​"
---

# RustFS 的云原生安装指南

RustFS 提供了官方和 [Helm Chart](https://github.com/rustfs/rustfs/tree/main/helm)来在 Kubernetes 集群上安装 RustFS（[多机多盘模式，即 MNMD](../../installation/index.md)）。

## 参数介绍


| 参数  |  描述 | 默认值 |
|--|--|--|
| `replicaCount`  |  集群的节点数量 | `4`（目前 16 节点正在测试中）  |
| `image.repository` | 镜像仓库 | `rustfs/rustfs` |
| `image.tag` | 镜像 tag | `latest` |
| `secret.rustfs.access_key` | RustFS access key | `rustfsadmin` |
| `secret.rustfs.secret_key` | RustFS secret key | `rustfsadmin` |
| `storageclass.name` | StorageClass 的名称 | `local-path` |
| `storageclass.size` | PVC 大小 | `256Mi`（**一定根据自身需求设置好大小**）|
| `requests.cpu` |  请求的 CPU 大小 | `100m`（**一定根据自身需求设置好大小**）|
| `requests.memory` |  请求的 Memory 大小 | `128Mi`（**一定根据自身需求设置好大小**）|
| `limits.cpu` |  限制的 CPU 大小 | `100m`（**一定根据自身需求设置好大小**）|
| `limits.cpu` |  限制的 Memory 大小 | `100m`（**一定根据自身需求设置好大小**）|
| `config.rustfs.volume` | RustFS 的 VOLUME 设置 | `/data/rustfs0,/data/rustfs1,/data/rustfs2,/data/rustfs3`（ **4 个 node 下必须这么配置**） |
| `config.rustfs.address` | RustFS 的 API 端点地址 | `0.0.0.0:9000` |
| `config.rustfs.console_address` | RustFS 的控制台地址 | `0.0.0.0:9001` |
| `ingress.className` | ingress class 的类型，`traefik` 或 `nginx` | `nginx` |

## 安装命令

如果以 `traefik` 为 ingress class，执行如下安装命令：

```
helm install rustfs -n rustfs --create-namespace ./ --set ingress.className="traefik"
```

如果以 `nginx` 为 ingress class，执行如下安装命令：


```
helm install rustfs -n rustfs --create-namespace ./ --set ingress.className="nginx"
```

查看 pod 和 ingress：

```
# 查看 Pod
kubectl -n rustfs get pods -w
NAME       READY   STATUS    RESTARTS        AGE
rustfs-0   1/1     Running   0               2m27s
rustfs-1   1/1     Running   0               2m27s
rustfs-2   1/1     Running   0               2m27s
rustfs-3   1/1     Running   0               2m27s

# 查看 ing
kubectl -n rustfs get ing
NAME     CLASS   HOSTS            ADDRESS         PORTS     AGE
rustfs   nginx   your.rustfs.com   10.43.237.152   80, 443   29m
```

使用 `https://your.rustfs.com` 并用默认用户名和密码（均为 `rustfsadmin/rustfsadmin`）登陆安装好的 RustFS 实例。


## 卸载

如果您想卸载 RustFS 实例，执行命令：

```
helm uninstall rustfs -n rustfs
```


## 反馈

目前，该 Helm Chart 还在持续改进中，您在使用过程中有任何问题，可以在 [GitHub 上提 Issue 反馈](https://github.com/rustfs/rustfs/issues)。