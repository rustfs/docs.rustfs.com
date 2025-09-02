# 클라우드 네이티브 배포

RustFS는 클라우드 네이티브 환경을 위해 설계되어 Kubernetes, 컨테이너 오케스트레이션 및 최신 DevOps 워크플로와 원활한 통합을 제공합니다.

## 멀티클라우드 아키텍처

![멀티클라우드 아키텍처](./images/multi-cloud-architecture.png)

RustFS는 여러 클라우드 제공업체 간 배포를 지원하여 다음과 같은 기능을 제공합니다:

- **벤더 독립성**: 클라우드 제공업체 종속성 방지
- **비용 최적화**: 제공업체 간 최적 가격 활용
- **지리적 분산**: 전 세계 사용자에게 더 가까운 배포
- **리스크 완화**: 단일 제공업체 의존성 감소

## Kubernetes 통합

### Helm 차트 배포

```bash
# RustFS Helm 저장소 추가
helm repo add rustfs https://charts.rustfs.com
helm repo update

# RustFS 클러스터 설치
helm install rustfs rustfs/rustfs \
  --set replicas=4 \
  --set storage.size=100Gi \
  --set storage.storageClass=fast-ssd
```

### Operator 배포

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

## 컨테이너 오케스트레이션

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

## 서비스 메시 통합

### Istio 통합

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

### Linkerd 통합

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

## 가시성

### Prometheus 모니터링

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

### Grafana 대시보드

모니터링해야 할 주요 메트릭:

- **클러스터 상태**: 노드 상태, 쿼럼 상태
- **성능**: 요청 지연 시간, 처리량
- **스토리지**: 용량 활용도, I/O 메트릭
- **네트워크**: 대역폭, 연결 수

### 분산 추적

```yaml
# Jaeger 통합
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

## CI/CD 통합

### ArgoCD를 이용한 GitOps

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

### Jenkins 파이프라인

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

## 보안

### Pod 보안 표준

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

### 네트워크 정책

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

## 모범 사례

### 리소스 관리

1. **리소스 제한**
   - 적절한 CPU 및 메모리 제한 설정
   - 네임스페이스 수준에서 리소스 쿼터 사용
   - 리소스 사용률 추세 모니터링

2. **스토리지 클래스**
   - 고성능 워크로드에는 빠른 SSD 사용
   - 내구성을 위해 지역별 영구 디스크 고려
   - 자동화된 백업 전략 구현

### 고가용성

1. **멀티존 배포**

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

2. **상태 확인**

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

## 문제 해결

### 일반적인 문제

1. **Pod 시작 문제**
   - 리소스 제약 확인
   - 스토리지 클래스 가용성 확인
   - 보안 컨텍스트 검토

2. **네트워크 연결성**
   - 서비스 검색 검증
   - 네트워크 정책 확인
   - DNS 해결 모니터링

3. **성능 문제**
   - 리소스 사용률 분석
   - 스토리지 I/O 패턴 확인
   - 네트워크 대역폭 검토