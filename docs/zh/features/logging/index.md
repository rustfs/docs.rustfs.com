# 日志和审计

在跟踪任何系统的运行状况和性能时，指标和日志记录至关重要。RustFS 通过详细的存储性能监控、指标和每个操作的日志记录提供对集群的完整可见性。结果是对象存储监控、警报和可观察性的稳健、透明和高效的回答。

## 功能特性

### 监控指标

提供完整的系统监控和性能指标收集。

### 日志记录

记录每个操作的详细日志信息，支持审计追踪。

## 指标监控

RustFS 通过与 Prometheus 兼容的指标端点导出范围广泛的细粒度硬件和软件指标。Prometheus 是一个由多维数据模型组成的云原生监控平台，具有由指标名称和键/值对标识的时间序列数据。RustFS 包括一个存储监控仪表板，使用 Grafana 来可视化收集的指标。Prometheus 生态系统包括多个用于路由 RustFS 指标到存储、消息传递和警报服务的集成。

RustFS 通过 Prometheus 端点显示各种精细的硬件和软件指标，包括健康信息，例如磁盘或节点故障、总可用存储容量和每个磁盘的存储容量。利用 Prometheus 及其作为领先指标收集和分析平台的日益普及，RustFS 可以专注于其对象存储功能，而不是为给定的第三方分析/可视化/警报服务构建无数自定义数据存储监控适配器。

RustFS Kubernetes Operator 可以自动部署、配置和管理每个租户的 Prometheus 部署和指标收集。组织还可以将自己的 Prometheus 或 Prometheus 兼容系统指向每个租户，以跨多个供应商、数据中心和可视化/分析工具进行集中监控。

RustFS 还提供了一个用于探测节点和集群活性的健康检查端点。一个简单的 CURL 语句可以指示给定节点是否健康或集群是否具有读/写仲裁。

## 审计日志

启用 RustFS 审计日志记录指示 RustFS 为集群上的每个操作生成日志。每个操作都会生成一个审计日志，其中包含唯一 ID 以及有关客户端、对象、存储桶和所有其他与操作相关的元数据的详细信息。RustFS 将日志数据写入配置的 HTTP/HTTPS webhook 端点。自定义适配器可用于满足审计日志记录目标的特定要求。

RustFS 支持通过 RustFS 控制台 UI 和 RustFS `mc` 命令行工具配置审计日志。对于 Kubernetes 环境，RustFS Operator 会自动配置带有 LogSearch 集成的控制台，以便对收集的审计日志进行可视化检查。

RustFS Lambda 通知提供额外的日志记录支持。RustFS 可以自动将存储桶和对象事件发送给第三方应用程序以进行事件驱动处理，例如无服务器或功能即服务计算框架。RustFS Lambda 通知通过 webhook 支持 RabbitMQ、Kafka、Elasticsearch 和任意服务等目标。

RustFS 还支持通过 RustFS 控制台和 RustFS mc admin trace shell 命令实时跟踪 HTTP/S 操作。

## 架构

**RustFS 通过与 Prometheus 兼容的 HTTP(S) 端点公开其指标，其中 Prometheus 服务提供对这些指标的推/拉访问。RustFS Kubernetes Operator 为每个预配置的 RustFS 租户部署一个独立的 Prometheus 服务，以抓取租户指标。组织还可以部署或利用他们自己的集中式 Prometheus 服务来抓取租户指标。**

![架构图 1](images/s7-1.png)

RustFS Lambda 通知自动将事件通知推送到支持的目标服务，例如 Kafka、Elasticsearch 或 PostgreSQL。管理员可以定义桶级通知规则，其中包含 S3 事件和 RustFS 为其生成事件的对象的细粒度过滤器。RustFS Lambda 通知内置于 RustFS 对象存储服务中，只需要访问远程通知目标。

![架构图 2](images/s7-2.png)

## 要求

### 对于指标

BYO Prometheus *或*使用 Kubernetes Operator 为每个租户自动部署/配置。

### 对于日志搜索

BYO PostgreSQL *或*使用 Kubernetes Operator 为每个租户自动部署/配置。

### 对于日志

支持第三方通知目标。
