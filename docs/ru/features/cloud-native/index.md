# Облачное развертывание

RustFS разработан для облачных сред, обеспечивая бесшовную интеграцию с Kubernetes, оркестрацией контейнеров и современными рабочими процессами DevOps.

## Мультиоблачная архитектура

![Мультиоблачная архитектура](./images/multi-cloud-architecture.png)

RustFS поддерживает развертывание в нескольких облачных провайдерах, обеспечивая:

- **Независимость от поставщика**: Избегайте привязки к облачному провайдеру
- **Оптимизация затрат**: Используйте лучшие цены у различных провайдеров
- **Географическое распределение**: Развертывание ближе к пользователям по всему миру
- **Снижение рисков**: Снижение зависимости от одного провайдера

## Интеграция с Kubernetes

### Развертывание с Helm Chart

```bash
# Добавить репозиторий Helm RustFS
helm repo add rustfs https://charts.rustfs.com
helm repo update

# Установить кластер RustFS
helm install rustfs rustfs/rustfs \
  --set replicas=4 \
  --set storage.size=100Gi \
  --set storage.storageClass=fast-ssd
```

### Развертывание с оператором

```yaml
apiVersion: rustfs.io/v1
kind: RustFSCluster
metadata:
  name: rustfs-cluster
spec:
  replicas: 4
  storage:
    size: 100Gi
    storageClass: fast-ssd
  resources:
    requests:
      memory: "2Gi"
      cpu: "1"
    limits:
      memory: "4Gi"
      cpu: "2"
```

## Оркестрация контейнеров

### Docker Compose

```yaml
version: '3.8'
services:
  rustfs:
    image: rustfs/rustfs:latest
    ports:
      - "9000:9000"
    volumes:
      - data1:/data1
      - data2:/data2
      - data3:/data3
      - data4:/data4
    command: server /data{1...4} 
    environment:
      - RUSTFS_ROOT_USER=admin
      - RUSTFS_ROOT_PASSWORD=password123
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/rustfs/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  data1:
  data2:
  data3:
  data4:
```

### Docker Swarm

```yaml
version: '3.8'
services:
  rustfs:
    image: rustfs/rustfs:latest
    ports:
      - "9000:9000"
    volumes:
      - rustfs_data:/data
    deploy:
      replicas: 4
      placement:
        constraints:
          - node.role == worker
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
    command: server http://rustfs_rustfs:9000/data 
    networks:
      - rustfs_network

networks:
  rustfs_network:
    driver: overlay
    attachable: true

volumes:
  rustfs_data:
    driver: local
```

## Интеграция с Service Mesh

### Интеграция Istio

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: rustfs-vs
spec:
  hosts:
  - rustfs.example.com
  gateways:
  - rustfs-gateway
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: rustfs-service
        port:
          number: 9000
      weight: 100
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
```

### Интеграция Linkerd

```yaml
apiVersion: v1
kind: Service
metadata:
  name: rustfs-service
  annotations:
    linkerd.io/inject: enabled
spec:
  selector:
    app: rustfs
  ports:
  - name: api
    port: 9000
    targetPort: 9000

```

## Наблюдаемость

### Мониторинг Prometheus

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: rustfs-monitor
spec:
  selector:
    matchLabels:
      app: rustfs
  endpoints:
  - port: metrics
    interval: 30s
    path: /rustfs/v2/metrics/cluster
```

### Панели мониторинга Grafana

Ключевые метрики для мониторинга:

- **Здоровье кластера**: Статус узлов, здоровье кворума
- **Производительность**: Задержка запросов, пропускная способность
- **Хранилище**: Использование емкости, метрики I/O
- **Сеть**: Пропускная способность, количество соединений

### Распределенная трассировка

```yaml
# Интеграция Jaeger
apiVersion: v1
kind: ConfigMap
metadata:
  name: rustfs-tracing
data:
  tracing.yaml: |
    jaeger:
      endpoint: http://jaeger-collector:14268/api/traces
      service_name: rustfs
      sample_rate: 0.1
```

## Интеграция CI/CD

### GitOps с ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: rustfs-app
spec:
  project: default
  source:
    repoURL: https://github.com/company/rustfs-config
    targetRevision: HEAD
    path: kubernetes
  destination:
    server: https://kubernetes.default.svc
    namespace: rustfs
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Пайплайн Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t rustfs:${BUILD_NUMBER} .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker run --rm rustfs:${BUILD_NUMBER} test'
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    helm upgrade --install rustfs ./helm-chart \
                        --set image.tag=${BUILD_NUMBER} \
                        --namespace rustfs
                '''
            }
        }
    }
}
```

## Безопасность

### Стандарты безопасности Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: rustfs-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
  containers:
  - name: rustfs
    image: rustfs/rustfs:latest
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
      readOnlyRootFilesystem: true
```

### Сетевые политики

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: rustfs-network-policy
spec:
  podSelector:
    matchLabels:
      app: rustfs
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: client
    ports:
    - protocol: TCP
      port: 9000
```

## Лучшие практики

### Управление ресурсами

1. **Лимиты ресурсов**
   - Установите соответствующие лимиты CPU и памяти
   - Используйте квоты ресурсов на уровне пространства имен
   - Мониторинг трендов использования ресурсов

2. **Классы хранилища**
   - Используйте быстрые SSD для высокопроизводительных рабочих нагрузок
   - Рассмотрите региональные постоянные диски для надежности
   - Реализуйте стратегии автоматического резервного копирования

### Высокая доступность

1. **Развертывание в нескольких зонах**

   ```yaml
   spec:
     affinity:
       podAntiAffinity:
         requiredDuringSchedulingIgnoredDuringExecution:
         - labelSelector:
             matchExpressions:
             - key: app
               operator: In
               values:
               - rustfs
           topologyKey: topology.kubernetes.io/zone
   ```

2. **Проверки здоровья**

   ```yaml
   livenessProbe:
     httpGet:
       path: /rustfs/health/live
       port: 9000
     initialDelaySeconds: 30
     periodSeconds: 10

   readinessProbe:
     httpGet:
       path: /rustfs/health/ready
       port: 9000
     initialDelaySeconds: 10
     periodSeconds: 5
   ```

## Устранение неполадок

### Распространенные проблемы

1. **Проблемы запуска Pod**
   - Проверьте ограничения ресурсов
   - Проверьте доступность класса хранилища
   - Просмотрите контексты безопасности

2. **Сетевое подключение**
   - Проверьте обнаружение сервисов
   - Проверьте сетевые политики
   - Мониторинг разрешения DNS

3. **Проблемы производительности**
   - Анализ использования ресурсов
   - Проверка шаблонов I/O хранилища
   - Просмотр пропускной способности сети

