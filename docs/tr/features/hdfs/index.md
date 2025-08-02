# HDFS Entegrasyonu

RustFS, Hadoop Dağıtık Dosya Sistemi (HDFS) ile sorunsuz entegrasyon sağlayarak, nesne depolama avantajlarıyla yüksek performanslı büyük veri analitiği ve işleme imkanı sunar.

## Genel Bakış

RustFS HDFS entegrasyonu şunları sunar:

- **HDFS Uyumluluğu**: Mevcut uygulamalar için tam HDFS API uyumluluğu
- **Nesne Depolama Avantajları**: HDFS arayüzünü nesne depolama avantajlarıyla birleştirme
- **Esnek Ölçeklendirme**: Depolama ve hesaplama kaynaklarını bağımsız olarak ölçeklendirme
- **Maliyet Optimizasyonu**: Performansı korurken depolama maliyetlerini azaltma

## Ana Avantajlar

### HDFS API Uyumluluğu

#### Yerel Entegrasyon

- **HDFS Protokolü**: Tam HDFS protokol desteği
- **Mevcut Uygulamalar**: Mevcut Hadoop uygulamalarını değiştirmeden çalıştırma
- **Ekosistem Desteği**: Tüm Hadoop ekosistemiyle uyumluluk
- **Sorunsuz Geçiş**: Geleneksel HDFS'den kolay geçiş

### Nesne Depolama Avantajları

#### Modern Mimari

- **Bağımsız Depolama**: Depolamayı hesaplamadan ayırma
- **Esnek Ölçeklendirme**: Depolama ve hesaplamayı bağımsız olarak ölçeklendirme
- **Çoklu Protokol Erişimi**: HDFS, S3 ve NFS üzerinden veri erişimi
- **Bulut Entegrasyonu**: Sorunsuz bulut ve hibrit dağıtım

### Performans Optimizasyonu

#### Yüksek Verimli İşlemler

- **Paralel İşleme**: Kütle paralel veri işleme
- **Optimize Edilmiş G/Ç**: Büyük veri iş yükleri için optimize edilmiştir
- **Akıllı Önbellekleme**: Sık erişilen veriler için akıllı önbellekleme
- **Ağ Optimizasyonu**: Optimize edilmiş ağ protokolleri

### Maliyet Verimliliği

#### Depolama Maliyetinin Azaltılması

- **Standart Donanım**: Özelleştirilmiş depolama yerine standart donanım kullanma
- **Depolama Katmanlandırma**: Maliyet optimizasyonu için otomatik veri katmanlandırma
- **Sıkıştırma**: Depolama ayak izini azaltmak için yerleşik sıkıştırma
- **Yinelenen Veri Ortadan Kaldırma**: Veri kümeleri arasında yinelenen verileri ortadan kaldırma

## Mimari

### Geleneksel HDFS vs RustFS

#### Geleneksel HDFS Mimarisi

```
┌─────────────────┐    ┌─────────────────┐
│   NameNode      │    │   DataNode      │
│   (Metadata)    │◄──►│   (Data)        │
│                 │    │                 │
│ • Namespace     │    │ • Block Storage │
│ • Block Map     │    │ • Replication   │
│ • Coordination  │    │ • Local Disks   │
└─────────────────┘    └─────────────────┘
```

#### RustFS HDFS Mimarisi

```
┌─────────────────┐    ┌─────────────────┐
│   HDFS Gateway  │    │   RustFS        │
│   (Protocol)    │◄──►│   (Storage)     │
│                 │    │                 │
│ • HDFS API      │    │ • Object Store  │
│ • Metadata      │    │ • Erasure Code  │
│ • Compatibility │    │ • Multi-Protocol│
└─────────────────┘    └─────────────────┘
```

### Dağıtım Modelleri

#### Hibrit Dağıtım

```
┌─────────────────┐    ┌─────────────────┐
│   Compute       │    │   Storage       │
│   Cluster       │◄──►│   (RustFS)      │
│                 │    │                 │
│ • Spark         │    │ • HDFS Gateway  │
│ • MapReduce     │    │ • Object Store  │
│ • Hive          │    │ • Multi-Protocol│
│ • HBase         │    │ • Elastic Scale │
└─────────────────┘    └─────────────────┘
```

#### Bulut Yerel Dağıtım

```
┌─────────────────┐    ┌─────────────────┐
│   Kubernetes    │    │   Cloud Storage │
│   Workloads     │◄──►│   (RustFS)      │
│                 │    │                 │
│ • Spark on K8s  │    │ • S3 API        │
│ • Flink         │    │ • HDFS API      │
│ • Jupyter       │    │ • Auto-scaling  │
│ • MLflow        │    │ • Cost Optimized│
└─────────────────┘    └─────────────────┘
```

## Entegrasyon Özellikleri

### HDFS Protokol Desteği

#### Çekirdek HDFS İşlemleri

- **Dosya İşlemleri**: Dosya oluşturma, okuma, yazma, silme
- **Dizin İşlemleri**: Dizin oluşturma, listeleme, silme
- **Meta Veri İşlemleri**: Dosya durumu, izinler, zaman damgaları alma
- **Blok İşlemleri**: Blok düzeyinde okuma ve yazma işlemleri

#### Gelişmiş Özellikler

- **Ekleme İşlemleri**: Mevcut dosyalara veri ekleme
- **Kesme İşlemleri**: Dosyaları belirtilen uzunluğa kesme
- **Anlık Görüntü Desteği**: Dosya sistemi anlık görüntülerini oluşturma ve yönetme
- **Genişletilmiş Özellikler**: Genişletilmiş dosya özellikleri desteği

### Hadoop Ekosistemi Entegrasyonu

#### Apache Spark

- **DataFrames**: RustFS'den DataFrames okuma ve yazma
- **RDD'ler**: Dayanıklı Dağıtık Veri Kümeleri desteği
- **Akış**: Spark Akış entegrasyonu
- **SQL**: RustFS verileri üzerinde Spark SQL sorguları

#### Apache Hive

- **Harici Tablolar**: RustFS üzerinde harici tablolar oluşturma
- **Bölümleme**: Bölümlendirilmiş tablolar desteği
- **Veri Formatları**: Parquet, ORC, Avro formatları desteği
- **Meta Depo**: Hive Meta Depo entegrasyonu

#### Apache HBase

- **HFiles**: HBase HFiles'larını RustFS'de depolama
- **WAL**: Write-Ahead Log depolama
- **Anlık Görüntüler**: HBase anlık görüntü depolama
- **Yedekleme**: HBase yedekleme ve kurtarma

#### Apache Kafka

- **Log Segmentleri**: Kafka log segmentlerini depolama
- **Katmanlı Depolama**: Kafka katmanlı depolama desteği
- **Yedekleme**: Kafka konu yedekleme ve kurtarma
- **Analitik**: Akış işleme analitiği

## Yapılandırma ve Kurulum

### HDFS Gateway Yapılandırması

#### Gateway Dağıtımı

```yaml
# RustFS HDFS Gateway yapılandırması
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rustfs-hdfs-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rustfs-hdfs-gateway
  template:
    metadata:
      labels:
        app: rustfs-hdfs-gateway
    spec:
      containers:
      - name: hdfs-gateway
        image: rustfs/hdfs-gateway:latest
        ports:
        - containerPort: 8020
        - containerPort: 9000
        env:
        - name: RUSTFS_ENDPOINT
          value: "http://rustfs-service:9000"
        - name: HDFS_NAMENODE_PORT
          value: "8020"
```

#### İstemci Yapılandırması

```xml
<!-- core-site.xml -->
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://rustfs-hdfs-gateway:8020</value>
  </property>
  <property>
    <name>fs.hdfs.impl</name>
    <value>org.apache.hadoop.hdfs.DistributedFileSystem</value>
  </property>
</configuration>
```

### Performans Ayarlama

#### Blok Boyutu Yapılandırması

```xml
<!-- hdfs-site.xml -->
<configuration>
  <property>
    <name>dfs.blocksize</name>
    <value>134217728</value> <!-- 128MB -->
  </property>
  <property>
    <name>dfs.client.read.shortcircuit</name>
    <value>false</value>
  </property>
  <property>
    <name>dfs.client.block.write.locateFollowingBlock.retries</name>
    <value>5</value>
  </property>
</configuration>
```

#### Ağ Optimizasyonu

```xml
<!-- Ağ optimizasyonu için yapılandırma -->
<configuration>
  <property>
    <name>ipc.client.connect.max.retries</name>
    <value>10</value>
  </property>
  <property>
    <name>ipc.client.connect.retry.interval</name>
    <value>1000</value>
  </property>
  <property>
    <name>dfs.socket.timeout</name>
    <value>60000</value>
  </property>
</configuration>
```

## Kullanım Örnekleri

### Büyük Veri Analitiği

#### Apache Spark Analitiği

```python
# RustFS üzerinde Spark DataFrame işlemleri
from pyspark.sql import SparkSession
spark = SparkSession.builder \
    .appName("RustFS Analytics") \
    .config("spark.hadoop.fs.defaultFS", "hdfs://rustfs-gateway:8020") \
    .getOrCreate()
# RustFS'den veri oku
df = spark.read.parquet("hdfs://rustfs-gateway:8020/data/sales")
# Analitik işlemler gerçekleştir
result = df.groupBy("region").sum("revenue")
result.write.parquet("hdfs://rustfs-gateway:8020/output/regional_sales")
```

#### Hive Veri Ambarı

```sql
-- RustFS üzerinde harici tablo oluştur
CREATE TABLE sales_data (
    transaction_id STRING,
    customer_id STRING,
    product_id STRING,
    quantity INT,
    price DECIMAL(10,2),
    transaction_date DATE
)
STORED AS PARQUET
LOCATION 'hdfs://rustfs-gateway:8020/warehouse/sales_data'
PARTITIONED BY (year INT, month INT);
-- Veri sorgula
SELECT region, SUM(price * quantity) as total_revenue
FROM sales_data
WHERE year = 2023
GROUP BY region;
```

### Makine Öğrenimi

#### MLflow Entegrasyonu

```python
# RustFS depolama ile MLflow
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
# İzleme URI'sini RustFS olarak ayarla
mlflow.set_tracking_uri("hdfs://rustfs-gateway:8020/mlflow")
with mlflow.start_run():
    # Modeli eğit
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    # Modeli RustFS'ye kaydet
    mlflow.sklearn.log_model(model, "random_forest_model")
    # Metrikleri kaydet
    mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
```

#### Jupyter Notebook'ları

```python
# Jupyter'dan RustFS verilerine eriş
import pandas as pd
import pyarrow.parquet as pq
# HDFS üzerinden RustFS'den veri oku
fs = pyarrow.hdfs.connect(host='rustfs-gateway', port=8020)
table = pq.read_table('/data/customer_data.parquet', filesystem=fs)
df = table.to_pandas()
# Analiz gerçekleştir
correlation_matrix = df.corr()
```

### Veri Gölü Mimarisi

#### Çoklu Format Desteği

```bash
# Farklı veri formatlarını depola
hdfs dfs -put data.csv hdfs://rustfs-gateway:8020/datalake/raw/csv/
hdfs dfs -put data.parquet hdfs://rustfs-gateway:8020/datalake/processed/parquet/
hdfs dfs -put data.json hdfs://rustfs-gateway:8020/datalake/raw/json/
```

#### Veri Boru Hattı

```python
# Apache Airflow kullanarak veri boru hattı
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime, timedelta
dag = DAG(
    'data_pipeline',
    default_args={
        'depends_on_past': False,
        'start_date': datetime(2023, 1, 1),
        'retries': 1,
        'retry_delay': timedelta(minutes=5),
    },
    schedule_interval=timedelta(days=1),
)
# Veri çıkart
extract_task = BashOperator(
    task_id='extract_data',
    bash_command='python extract_data.py hdfs://rustfs-gateway:8020/raw/',
    dag=dag,
)
# Veri dönüştür
transform_task = BashOperator(
    task_id='transform_data',
    bash_command='spark-submit transform_data.py',
    dag=dag,
)
# Veri yükle
load_task = BashOperator(
    task_id='load_data',
    bash_command='python load_data.py hdfs://rustfs-gateway:8020/processed/',
    dag=dag,
)
extract_task >> transform_task >> load_task
```

## Performans Optimizasyonu

### Önbellekleme Stratejileri

#### Akıllı Önbellekleme

- **Sık Kullanılan Veri Önbellekleme**: Sık erişilen verileri önbellekleme
- **Önceden Getirme**: Tahmine dayalı veri önceden getirme
- **Önbellek Temizleme**: Akıllı önbellek temizleme politikaları
- **Çok Seviyeli Önbellekleme**: Bellek ve SSD önbellekleme katmanları

#### Önbellek Yapılandırması

```xml
<configuration>
  <property>
    <name>dfs.client.cache.readahead</name>
    <value>4194304</value> <!-- 4MB -->
  </property>
  <property>
    <name>dfs.client.cache.drop.behind.reads</name>
    <value>true</value>
  </property>
</configuration>
```

### Paralel İşleme

#### Eşzamanlı İşlemler

- **Paralel Okumalar**: Çoklu eşzamanlı okuma işlemleri
- **Paralel Yazmalar**: Eşzamanlı yazma işlemleri
- **Yük Dengeleme**: Yükü düğümler arasında dağıtma
- **Bağlantı Havuzlama**: Bağlantı yönetimini optimize etme

#### Ayarlama Parametreleri

```xml
<configuration>
  <property>
    <name>dfs.client.max.block.acquire.failures</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.client.block.write.replace-datanode-on-failure.enable</name>
    <value>true</value>
  </property>
</configuration>
```

## İzleme ve Yönetim

### Metrikler ve İzleme

#### Ana Metrikler

- **Veri Aktarım Hızı**: Okuma ve yazma veri aktarım hızı
- **Gecikme Süresi**: İşlem gecikme süresi metrikleri
- **Hata Oranları**: Hata ve yeniden deneme oranları
- **Kaynak Kullanımı**: CPU, bellek ve ağ kullanımı

#### İzleme Araçları

```bash
# HDFS dosya sistemi kontrolü
hdfs fsck hdfs://rustfs-gateway:8020/ -files -blocks
# Dosya sistemi istatistikleri
hdfs dfsadmin -report
# Performans metrikleri
hdfs dfsadmin -printTopology
```

### Sağlık İzleme

#### Gateway Sağlığı

```bash
# Gateway sağlığını kontrol et
curl http://rustfs-hdfs-gateway:9870/jmx
# Gateway günlüklerini izle
kubectl logs -f deployment/rustfs-hdfs-gateway
```

#### Depolama Sağlığı

```bash
# RustFS küme sağlığını kontrol et
rustfs admin cluster status
# Depolama metriklerini izle
rustfs admin metrics
```

## Güvenlik

### Kimlik Doğrulama ve Yetkilendirme

#### Kerberos Entegrasyonu

```xml
<!-- Kerberos için core-site.xml -->
<configuration>
  <property>
    <name>hadoop.security.authentication</name>
    <value>kerberos</value>
  </property>
  <property>
    <name>hadoop.security.authorization</name>
    <value>true</value>
  </property>
</configuration>
```

#### Erişim Kontrol Listeleri

```bash
# Dosya izinlerini ayarla
hdfs dfs -chmod 755 hdfs://rustfs-gateway:8020/data/
hdfs dfs -chown user:group hdfs://rustfs-gateway:8020/data/
# ACL'leri ayarla
hdfs dfs -setfacl -m user:alice:rwx hdfs://rustfs-gateway:8020/data/
```

### Veri Şifreleme

#### Dinlenme Halinde Şifreleme

- **Şeffaf Şifreleme**: Şeffaf veri şifreleme
- **Anahtar Yönetimi**: Merkezi anahtar yönetimi
- **Bölge Bazlı Şifreleme**: Farklı veri türleri için şifreleme bölgeleri
- **Donanım Hızlandırma**: Donanım hızlandırmalı şifreleme

#### Aktarım Halinde Şifreleme

```xml
<configuration>
  <property>
    <name>dfs.encrypt.data.transfer</name>
    <value>true</value>
  </property>
  <property>
    <name>dfs.encrypt.data.transfer.algorithm</name>
    <value>3des</value>
  </property>
</configuration>
```

## Geçiş ve En İyi Uygulamalar

### Geleneksel HDFS'den Geçiş

#### Değerlendirme Aşaması

1. **Veri Envanteri**: Mevcut HDFS verilerini kataloglama
2. **Uygulama Analizi**: Uygulama bağımlılıklarını analiz etme
3. **Performans Gereksinimleri**: Performans ihtiyaçlarını anlama
4. **Geçiş Planlaması**: Geçiş stratejisi ve zaman çizelgesi planlama

#### Geçiş Süreci

```bash
# DistCp kullanarak veri geçişi
hadoop distcp hdfs://old-cluster:8020/data hdfs://rustfs-gateway:8020/data
# Veri bütünlüğünü doğrula
hdfs dfs -checksum hdfs://old-cluster:8020/data/file.txt
hdfs dfs -checksum hdfs://rustfs-gateway:8020/data/file.txt
```

### En İyi Uygulamalar

#### Performans En İyi Uygulamaları

1. **Blok Boyutu**: İş yükleri için uygun blok boyutları kullanma
2. **Paralellik**: Paralel işlemleri optimize etme
3. **Önbellekleme**: Akıllı önbellekleme uygulama
4. **Ağ**: Ağ yapılandırmasını optimize etme

#### Güvenlik En İyi Uygulamaları

1. **Kimlik Doğrulama**: Güçlü kimlik doğrulama etkinleştirme
2. **Yetkilendirme**: İnce taneli erişim kontrolü uygulama
3. **Şifreleme**: Dinlenme halinde ve aktarım halinde şifreleme etkinleştirme
4. **Denetim**: Kapsamlı denetim günlükleme etkinleştirme

#### Operasyonel En İyi Uygulamalar

1. **İzleme**: Kapsamlı izleme uygulama
2. **Yedekleme**: Düzenli yedekleme ve kurtarma testi
3. **Kapasite Planlama**: Gelecekteki büyüme için planlama
4. **Dokümantasyon**: Operasyonel dokümantasyonu sürdürme

## Sorun Giderme

### Yaygın Sorunlar

#### Bağlantı Sorunları

- **Ağ Bağlantısı**: Ağ bağlantısını doğrula
- **Port Yapılandırması**: Port yapılandırmasını kontrol et
- **Güvenlik Duvarı Kuralları**: Güvenlik duvarı kurallarını doğrula
- **DNS Çözümlemesi**: DNS çözümlemesini kontrol et

#### Performans Sorunları

- **Yavaş İşlemler**: Ağ ve depolama performansını kontrol et
- **Yüksek Gecikme Süresi**: Önbellekleme ve önceden getirmeyi optimize et
- **Kaynak Çakışması**: Kaynak kullanımını izle
- **Yapılandırma**: Yapılandırma parametrelerini gözden geçir

#### Veri Sorunları

- **Veri Bozulması**: Veri bütünlüğünü doğrula
- **Eksik Dosyalar**: Dosya sistemi tutarlılığını kontrol et
- **İzin Hataları**: Erişim izinlerini doğrula
- **Kota Sorunları**: Depolama kotalarını kontrol et

## Başlarken

### Ön Koşullar

1. **Hadoop Ortamı**: Hadoop 2.7+ veya 3.x
2. **RustFS Kümesi**: Uygun şekilde yapılandırılmış RustFS kümesi
3. **Ağ Bağlantısı**: Hadoop ve RustFS arasında ağ bağlantısı
4. **Java Çalışma Zamanı**: Java 8 veya daha yeni

### Hızlı Başlangıç Kılavuzu

1. **HDFS Gateway Dağıt**: RustFS HDFS Gateway'i dağıt
2. **Hadoop'u Yapılandır**: RustFS'i varsayılan dosya sistemi olarak kullanacak şekilde Hadoop'u yapılandır
3. **Bağlantıyı Test Et**: Temel HDFS işlemlerini test et
4. **Verileri Geçir**: Mevcut verileri RustFS'e geçir
5. **Uygulamaları Çalıştır**: RustFS üzerinde Hadoop uygulamaları çalıştır
6. **Performansı İzle**: İzleme ve uyarı sistemini kur

### Sonraki Adımlar

- **Performansı Optimize Et**: Optimal performans için yapılandırmayı ayarla
- **Güvenliği Uygula**: Kimlik doğrulama ve şifrelemeyi yapılandır
- **İzlemeyi Kur**: Kapsamlı izleme uygula
- **Ölçeklendirmeyi Planla**: Gelecekteki ölçeklendirme gereksinimlerini planla
- **Ekip Eğitimi**: Ekibi RustFS HDFS entegrasyonu konusunda eğit