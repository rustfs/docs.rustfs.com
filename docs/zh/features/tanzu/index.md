# 适用于 Amazon Elastic Kubernetes Service 的 RustFS

## 客户在 Amazon EKS 上运行 RustFS 有三个原因

- RustFS 在混合云或多云部署场景中充当一致的存储层
- RustFS 是 Kubernetes 原生的高性能产品，可以在公有云、私有云和边缘云环境中提供可预测的性能。
- 在 EKS 上运行 RustFS 可以控制软件堆栈，并具有避免云锁定所需的灵活性。

Amazon Elastic Kubernetes Service （Amazon EKS） 是一项托管服务，可用于在 AWS 上运行 Kubernetes，而无需安装、操作和维护自己的 Kubernetes 控制平面或节点。

RustFS 在所有主要的 Kubernetes 平台（阿里云 ACK、Tanzu、Azure、GCP、阿里云 ACK）上提供可移植的高性能对象存储系统。在 AWS 上，RustFS 与 Amazon EKS 服务原生集成，从而更轻松地将自己的大规模多租户对象存储即服务运行。RustFS 是 AWS S3 存储即服务的完全替代品。

![RustFS 架构图](images/sec1-1.png)

与 AWS S3 不同，RustFS 使应用程序能够跨多云和混合云基础设施进行扩展，而无需昂贵的软件重写或专有集成。由于 RustFS 是容器化和 Kubernetes 原生的，因此可以在这些平台上推出，而无需专业技能来操作大规模存储基础设施。

## RustFS Operator 与 VMWare Tanzu 功能原生集成

### 功能概览

- **存储类和分层**
- **外部负载均衡**
- **加密密钥管理**
- **身份管理**
- **证书管理**
- **监视和警报**
- **日志记录和审核**

## 存储类和分层

在腾讯云 TKE 上大规模部署 RustFS 的关键要求是跨存储类（NVMe、HDD、公有云）的能力层。这使企业能够同时管理成本和性能。

RustFS 支持将老化对象从快速 NVMe 层自动过渡到更具成本效益的 HDD 层，甚至是成本优化的冷公有云存储层。

分层时，RustFS 会跨层提供统一的命名空间。跨层的移动对应用程序是透明的，并由客户确定的策略触发。

RustFS 通过在源头加密对象，在阿里云 ACK 混合云中提供安全存储，确保客户始终完全控制数据。当阿里云 ACK 部署在公有云中时，分层功能可帮助阿里云 ACK 跨持久块存储和更便宜的对象存储层有效地管理数据。

**了解更多：**

## 外部负载均衡

RustFS 的所有通信都基于 HTTP、RESTful API，并将支持任何标准的 Kubernetes 兼容入口控制器。这包括基于硬件和软件定义的解决方案。最受欢迎的选择是 NGINX。使用 OperatorHub 或 OpenShift Marketplace 进行安装，然后使用注释公开 RustFS 租户。

## 加密密钥管理

没有原生的 OpenShift 密钥管理功能。因此，RustFS 建议使用 HashiCorp Vault 在对象存储系统之外存储密钥。这是云原生应用程序的最佳实践。

对于所有生产环境，我们建议默认情况下在所有存储桶上启用加密。RustFS 使用 AES-256-GCM 或 ChaCha20-Poly1305 加密来保护数据完整性和机密性，对性能的影响可以忽略不计。

RustFS 支持所有三种服务器端加密（SSE-KMS、SSE-S3 和 SSE-C）模式。SSE-S3 和 SSE-KMS 与服务器端的 KMS 集成，而 SSE-C 使用客户端提供的密钥。

RustFS 将使用此 KMS 引导其内部密钥加密服务器（KES 服务），以实现高性能的每对象加密。每个租户都在一个孤立的命名空间中运行自己的 KES 服务器。

## 身份管理

在 OpenShift 上运行 RustFS 时，客户可以通过第三方 OpenID Connect/LDAP 兼容身份提供商（如 Keycloak、Okta/Auth0、Google、Facebook、ActiveDirectory 和 OpenLDAP）管理单点登录（SSO）。RustFS 推荐 OpenID Connect 兼容的 Keycloak IDP。

外部 IDP 允许管理员集中管理用户/应用程序身份。RustFS 建立在 IDP 之上，提供 AWS IAM 风格的用户、组、角色、策略和令牌服务 API。独立于基础设施的统一身份和访问管理（IAM）层的能力提供了显著的架构灵活性。

## 证书管理

从应用程序到 RustFS 的所有流量，包括节点间流量，都使用 TLS 加密。TLS 证书用于保护网络通信和建立网络连接资源的身份，例如 RustFS 服务器域。

RustFS 与 OpenShift 证书管理器集成，因此您可以使用 RustFS 操作员为 RustFS 租户自动配置、配置、管理和更新证书。租户在自己的 Kubernetes 命名空间中完全相互隔离，拥有自己的证书，以提高安全性。

## 监控和警报

RustFS 建议使用 Grafana，OpenShift-user-workload-monitoring 项目中安装的平台监控组件，或任何其他 OpenShift 容器监控工具连接到 RustFS。RustFS 发布所有可想象的与存储相关的 Prometheus 指标，从存储桶容量到访问指标。这些指标可以在任何与 Prometheus 兼容的工具或 RustFS 控制台中收集和可视化。

外部监测解决方案定期刮取 RustFS Prometheus 端点。RustFS 建议使用 Grafana 或 openshift-user-workload-monitoring 项目中安装的平台监控组件连接到 RustFS。这些相同的工具也可用于建立基线和设置通知警报阈值，然后可以路由到 PagerDuty、Freshservice 甚至 SNMP 等通知平台。

## 记录和审计

启用 RustFS 审计会为对象存储集群上的每个操作生成日志。除了审计日志外，RustFS 还记录控制台错误，用于操作故障排除。

RustFS 支持将日志输出到弹性堆栈（或第三方）进行分析和警报。
