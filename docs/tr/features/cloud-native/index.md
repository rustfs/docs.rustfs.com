# Bulut Yerel Dağıtım

RustFS, bulut yerel ortamlar için tasarlanmıştır ve Kubernetes, konteyner orkestrasyonu ve modern DevOps iş akışları ile sorunsuz entegrasyon sağlar.

## Çoklu Bulut Mimarisi

![Çoklu Bulut Mimarisi](./images/multi-cloud-architecture.png)

RustFS, birden fazla bulut sağlayıcıya dağıtımı destekleyerek şunları sağlar:

- **Satıcı Bağımsızlığı**: Bulut sağlayıcı kilidinden kaçının
- **Maliyet Optimizasyonu**: Sağlayıcılar arasında en iyi fiyatlandırmayı kullanın
- **Coğrafi Dağılım**: Dünya çapında kullanıcılara daha yakın dağıtım yapın
- **Risk Azaltma**: Tek sağlayıcıya olan bağımlılığı azaltın

## Kubernetes Entegrasyonu

### Helm Chart Dağıtımı

```bash
# RustFS Helm deposunu ekleyin
helm repo add rustfs https://charts.rustfs.com
helm repo update

# RustFS kümesini yükleyin
helm install rustfs rustfs/rustfs \
  --set replicas=4 \
  --set storage.size=100Gi \
  --set storage.storageClass=fast-ssd
```

### Operatör Dağıtımı

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

## Konteyner Orkestrasyonu

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

## Servis Ağı Entegrasyonu

### Istio Entegrasyonu

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

### Linkerd Entegrasyonu

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

## Gözlemleme

### Prometheus İzleme

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

### Grafana Panoları

İzlenmesi gereken temel metrikler:

- **Küme Sağlığı**: Düğüm durumu, kuorum sağlığı
- **Performans**: İstek gecikmesi, aktarım hızı
- **Depolama**: Kapasite kullanımı, G/Ç metrikleri
- **Ağ**: Bant genişliği, bağlantı sayısı

### Dağıtık İzleme

```yaml
# Jaeger entegrasyonu
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

## CI/CD Entegrasyonu

### GitOps ile ArgoCD

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

### Jenkins Boru Hattı

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

## Güvenlik

### Pod Güvenlik Standartları

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

### Ağ Politikaları

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

## En İyi Uygulamalar

### Kaynak Yönetimi

1. **Kaynak Limitleri**
   - Uygun CPU ve bellek limitleri ayarlayın
   - Ad alanları düzeyinde kaynak kotaları kullanın
   - Kaynak kullanım eğilimlerini izleyin

2. **Depolama Sınıfları**
   - Yüksek performanslı iş yükleri için hızlı SSD'ler kullanın
   - Dayanıklılık için bölgesel kalıcı diskleri düşünün
   - Otomatik yedekleme stratejileri uygulayın

### Yüksek Kullanılabilirlik

1. **Çoklu Bölge Dağıtımı**

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

2. **Sağlık Kontrolleri**

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

## Sorun Giderme

### Yaygın Sorunlar

1. **Pod Başlatma Sorunları**
   - Kaynak kısıtlamalarını kontrol edin
   - Depolama sınıfı kullanılabilirliğini doğrulayın
   - Güvenlik bağlamlarını gözden geçirin

2. **Ağ Bağlantısı**
   - Servis keşfini doğrulayın
   - Ağ politikalarını kontrol edin
   - DNS çözümlemesini izleyin

3. **Performans Sorunları**
   - Kaynak kullanımını analiz edin
   - Depolama G/Ç kalıplarını kontrol edin
   - Ağ bant genişliğini gözden geçirin