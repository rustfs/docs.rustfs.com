# Günlükleme ve Denetim

Herhangi bir sistemin sağlığını ve performansını izlerken, metrikler ve günlükleme çok önemlidir. RustFS, ayrıntılı depolama performansı izleme, metrikler ve her işlemin günlüklenmesi yoluyla kümeler hakkında tam görünürlük sağlar. Sonuç, nesne depolama izleme, uyarı ve gözlemlenebilirlik için sağlam, şeffaf ve verimli bir çözümdür.

## Özellikler

### İzleme Metrikleri

Tam sistem izleme ve performans metrikleri toplama sağlar.

### Günlükleme

Her işlem için ayrıntılı günlük bilgilerini kaydeder, denetim izlerini destekler.

## Metrik İzleme

RustFS, Prometheus uyumlu metrik uç noktaları aracılığıyla geniş bir ince taneli donanım ve yazılım metriği yelpazesi dışa aktarır. Prometheus, metrik adları ve anahtar/değer çiftleriyle tanımlanan zaman serisi verilerinden oluşan çok boyutlu bir veri modeline sahip bulut yerel bir izleme platformudur. RustFS, toplanan metrikleri görselleştirmek için Grafana kullanan bir depolama izleme gösterge paneli içerir. Prometheus ekosistemi, RustFS metriklerini depolama, mesajlaşma ve uyarı hizmetlerine yönlendirmek için birçok entegrasyon içerir.

RustFS, disk veya düğüm arızaları, toplam kullanılabilir depolama kapasitesi ve disk başına depolama kapasitesi gibi sağlık bilgileri dahil olmak üzere Prometheus uç noktaları aracılığıyla çeşitli ince taneli donanım ve yazılım metriklerini görüntüler. Prometheus'u ve metrik toplama ve analiz platformu olarak giderek artan popülerliğini kullanarak, RustFS, verilen üçüncü taraf analiz/görselleştirme/uyarı hizmetleri için sayısız özel veri depolama izleme adaptörü oluşturmak yerine nesne depolama işlevselliğine odaklanabilir.

RustFS Kubernetes Operatörü, Prometheus dağıtımlarını ve her kiracı için metrik toplama işlemlerini otomatik olarak dağıtabilir, yapılandırabilir ve yönetebilir. Kuruluşlar, ayrıca kendi Prometheus veya Prometheus uyumlu sistemlerini her kiracıya işaret ederek çoklu satıcı, veri merkezleri ve görselleştirme/analiz araçları üzerinden merkezileştirilmiş izleme yapabilirler.

RustFS ayrıca düğüm ve küme canlılığını kontrol etmek için bir sağlık kontrol uç noktası sağlar. Basit bir CURL ifadesi, belirli bir düğümün sağlıklı olup olmadığını veya kümenin okuma/yazma korumuna sahip olup olmadığını gösterebilir.

## Denetim Günlükleri

RustFS denetim günlükleme özelliğini etkinleştirmek, RustFS'ye küme üzerindeki her işlem için günlükler oluşturmasını söyler. Her işlem, işlemle ilgili müşteri, nesne, kova ve diğer tüm meta veriler hakkında ayrıntılı bilgi içeren bir denetim günlüğü oluşturur. RustFS, günlük verilerini yapılandırılmış HTTP/HTTPS webhook uç noktalarına yazar. Denetim günlükleme hedeflerinin özel gereksinimlerini karşılamak için özel adaptörler kullanılabilir.

RustFS, RustFS Konsol Kullanıcı Arayüzü ve RustFS `mc` komut satırı aracı aracılığıyla denetim günlüklerinin yapılandırılmasını destekler. Kubernetes ortamları için, RustFS Operatörü, toplanan denetim günlüklerinin görsel olarak incelenmesi için LogSearch entegrasyonuyla konsolu otomatik olarak yapılandırır.

RustFS Lambda bildirimleri ek günlükleme desteği sağlar. RustFS, sunucusuz veya işlev olarak hizmet bilgi işlem çerçeveleri gibi olay odaklı işleme için üçüncü taraf uygulamalara kova ve nesne olaylarını otomatik olarak gönderebilir. RustFS Lambda bildirimleri, RabbitMQ, Kafka, Elasticsearch ve webhook'lar aracılığıyla keyfi hizmetler gibi hedefleri destekler.

RustFS ayrıca RustFS Konsolu ve RustFS mc admin izleme kabuk komutları aracılığıyla HTTP/S işlemlerinin gerçek zamanlı izlenmesini destekler.

## Mimari

**RustFS, metriklerini Prometheus uyumlu HTTP(S) uç noktaları aracılığıyla dışa aktarır, burada Prometheus hizmetleri bu metrikler için push/pull erişimi sağlar. RustFS Kubernetes Operatörü, önceden yapılandırılmış her RustFS kiracısı için bağımsız bir Prometheus hizmeti dağıtarak kiracı metriklerini kazır. Kuruluşlar ayrıca kiracı metriklerini kazımak için kendi merkezileştirilmiş Prometheus hizmetlerini dağıtabilir veya kullanabilir.**

![Mimari Diyagram 1](images/s7-1.png)

RustFS Lambda bildirimleri, olay bildirimlerini Kafka, Elasticsearch veya PostgreSQL gibi desteklenen hedef hizmetlere otomatik olarak iter. Yöneticiler, RustFS'nin olaylar oluşturduğu S3 olayları ve nesneler için ince taneli filtreler içeren kova düzeyi bildirim kuralları tanımlayabilir. RustFS Lambda bildirimleri, RustFS nesne depolama hizmetine yerleştirilmiştir ve yalnızca uzak bildirim hedeflerine erişim gerektirir.

![Mimari Diyagram 2](images/s7-2.png)

## Gereksinimler

### Metrikler İçin

Kendi Prometheus'unuzu getirin *veya* her kiracı için otomatik olarak dağıtmak ve yapılandırmak için Kubernetes Operatörünü kullanın.

### Günlük Arama İçin

Kendi PostgreSQL'inizi getirin *veya* her kiracı için otomatik olarak dağıtmak ve yapılandırmak için Kubernetes Operatörünü kullanın.

### Günlükler İçin

Üçüncü taraf bildirim hedeflerini destekleyin.