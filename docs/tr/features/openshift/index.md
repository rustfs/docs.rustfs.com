---
title: "Red Hat OpenShift Container Platform için RustFS"
description: "OpenShift üzerinde RustFS çalıştırma kılavuzu"
---

# Red Hat OpenShift Container Platform için RustFS

## Müşterilerin Amazon EKS'de RustFS çalıştırmasının üç nedeni var

- RustFS, hibrit bulut veya çoklu bulut dağıtım senaryolarında tutarlı bir depolama katmanı olarak görev yapar
- RustFS, Kubernetes native yüksek performanslı bir üründür ve genel bulut, özel bulut ve kenar bulut ortamlarında öngörülebilir performans sağlayabilir
- OpenShift'te RustFS çalıştırmak, yazılım yığınını esnek bir şekilde kontrol etmenizi sağlar, böylece bulut kilidinden kaçınabilirsiniz.

Red Hat® OpenShift®, hibrit bulut, çoklu bulut ve kenar dağıtımlarını yönetebilen tam yığın otomatik operasyon ve bakım özelliklerine sahip kurumsal seviye Kubernetes container platformudur. OpenShift, kurumsal seviye Linux işletim sistemi, container runtime, ağ, izleme, kayıt defteri ve kimlik doğrulama ve yetkilendirme çözümlerini içerir.

RustFS, OpenShift ile native olarak entegre olur, böylece kendi büyük ölçekli çok kiracılı nesne depolama hizmetini daha kolay bir şekilde çalıştırabilirsiniz. RustFS Operator, OpenShift araç zinciri (örneğin OpenShift Cluster Manager CLI ve Quay container kayıt defteri) ile çalışabilir, OpenShift ekosistemine yapılan yatırımdan maksimum değer elde etmenizi sağlar.

![RustFS Mimari Diyagramı](images/sec1-1.png)

RustFS, tasarımında Kubernetes native olduğu ve baştan itibaren S3 uyumlu olduğu için tutarlı, yüksek performanslı ve ölçeklenebilir nesne depolama sağlar. Geliştiriciler, OpenShift'te çalışan tüm bulut native uygulamalar için Amazon S3 uyumlu kalıcı depolama hizmetini kolayca elde edebilir. AWS S3'ten farklı olarak, RustFS, uygulamaların herhangi bir çoklu bulut ve hibrit bulut altyapısı genelinde ölçeklenmesini sağlar ve hala OpenShift ekosisteminde yönetilebilir, genel bulut kilidinden etkilenmez.

## RustFS Operator, OpenShift Özellikleri ile Native Olarak Entegre Olur

### Özellik Genel Bakışı

- **Depolama sınıfları ve katmanlama**
- **Harici yük dengeleme**
- **Şifreleme anahtarı yönetimi**
- **Kimlik yönetimi**
- **Sertifika yönetimi**
- **İzleme ve uyarılar**
- **Günlük kaydı ve denetim**

## Depolama Sınıfları ve Katmanlama

Tencent Cloud TKE'de RustFS'i büyük ölçekte dağıtmanın anahtar gereksinimi, depolama sınıfları (NVMe, HDD, genel bulut) genelinde katmanlama yeteneğidir. Bu, işletmelerin maliyet ve performansı aynı anda yönetmesini sağlar.

RustFS, eski nesnelerin hızlı NVMe katmanından daha maliyet etkin HDD katmanına ve hatta maliyet optimize edilmiş soğuk genel bulut depolama katmanına otomatik geçişini destekler.

Katmanlama sırasında, RustFS katmanlar genelinde birleşik bir ad alanı sağlar. Katmanlar arası hareket uygulamalar için şeffaftır ve müşteri tarafından belirlenen politikalar tarafından tetiklenir.

RustFS, nesneleri kaynakta şifreleyerek OpenShift hibrit bulutunda güvenli depolama sağlar, müşterilerin verileri üzerinde her zaman tam kontrol sahibi olmasını garanti eder. OpenShift genel bulutta dağıtıldığında, katmanlama özelliği, OpenShift'in kalıcı blok depolama ve daha ucuz nesne depolama katmanları genelinde verileri etkili bir şekilde yönetmesine yardımcı olur.

**Daha fazla bilgi edin:**

## Harici Yük Dengeleme

RustFS'in tüm iletişimi HTTP, RESTful API tabanlıdır ve herhangi bir standart Kubernetes uyumlu giriş kontrolcüsünü destekleyecektir. Bu, donanım ve yazılım tanımlı çözümleri içerir. En popüler seçenek NGINX'tir. OperatorHub veya OpenShift Marketplace kullanarak kurulum yapın, ardından RustFS kiracısını açmak için açıklamalar kullanın.

## Şifreleme Anahtarı Yönetimi

Native OpenShift anahtar yönetimi özelliği yoktur. Bu nedenle, RustFS, anahtarları nesne depolama sistemi dışında saklamak için HashiCorp Vault kullanmayı önerir. Bu, bulut native uygulamalar için en iyi uygulamadır.

Tüm üretim ortamları için, varsayılan olarak tüm depolama kovalarında şifrelemeyi etkinleştirmenizi öneririz. RustFS, veri bütünlüğünü ve gizliliğini korumak için AES-256-GCM veya ChaCha20-Poly1305 şifreleme kullanır, performans üzerindeki etki ihmal edilebilir düzeydedir.

RustFS, üç sunucu tarafı şifreleme (SSE-KMS, SSE-S3 ve SSE-C) modunun tümünü destekler. SSE-S3 ve SSE-KMS, sunucu tarafı KMS entegrasyonu ile, SSE-C ise istemci tarafından sağlanan anahtarları kullanır.

RustFS, yüksek performanslı nesne başına şifreleme için bu KMS'i kendi dahili anahtar şifreleme sunucusunu (KES hizmeti) başlatmak için kullanacaktır. Her kiracı, kendi KES sunucusunu izole edilmiş bir ad alanında çalıştırır.

## Kimlik Yönetimi

OpenShift'te RustFS çalıştırırken, müşteriler üçüncü taraf OpenID Connect/LDAP uyumlu kimlik sağlayıcıları (Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory ve OpenLDAP gibi) kullanarak tek oturum açma (SSO) yönetebilir. RustFS, OpenID Connect uyumlu Keycloak IDP'yi önerir.

Harici IDP, yöneticilerin kullanıcı/uygulama kimliklerini merkezi olarak yönetmesine izin verir. RustFS, IDP üzerine inşa edilir ve AWS IAM tarzı kullanıcı, grup, rol, politika ve token hizmet API'leri sağlar. Altyapıdan bağımsız birleşik kimlik ve erişim yönetimi (IAM) katmanı yeteneği, önemli mimari esneklik sağlar.

## Sertifika Yönetimi

Uygulamalardan RustFS'e kadar olan tüm trafik, düğümler arası trafik dahil, TLS şifrelemesi kullanır. TLS sertifikaları, ağ iletişimini korumak ve RustFS sunucu alanı gibi ağ bağlantı kaynaklarının kimliğini kurmak için kullanılır.

RustFS, OpenShift sertifika yöneticisi ile entegre olur, böylece RustFS operatörünü kullanarak RustFS kiracıları için sertifikaları otomatik olarak yapılandırabilir, yapılandırabilir, yönetebilir ve güncelleyebilirsiniz. Kiracılar, güvenliği artırmak için kendi sertifikalarına sahip olarak kendi Kubernetes ad alanlarında tamamen birbirinden izole edilir.

## İzleme ve Uyarılar

RustFS, RustFS'e bağlanmak için Grafana, OpenShift-user-workload-monitoring projesinde kurulu platform izleme bileşenleri veya herhangi bir diğer OpenShift container izleme aracını kullanmayı önerir. RustFS, depolama kovası kapasitesinden erişim metriklerine kadar, hayal edilebilir tüm depolama ile ilgili Prometheus metriklerini yayınlar. Bu metrikler, herhangi bir Prometheus uyumlu araçta veya RustFS konsolunda toplanabilir ve görselleştirilebilir.

Harici izleme çözümleri, RustFS Prometheus endpoint'lerini düzenli olarak tarar. RustFS, RustFS'e bağlanmak için Grafana veya OpenShift-user-workload-monitoring projesinde kurulu platform izleme bileşenlerini kullanmayı önerir. Bu aynı araçlar, temel çizgiler oluşturmak ve bildirim uyarı eşikleri ayarlamak için de kullanılabilir, ardından bunlar PagerDuty, Freshservice ve hatta SNMP gibi bildirim platformlarına yönlendirilebilir.

## Günlük Kaydı ve Denetim

RustFS denetimini etkinleştirmek, nesne depolama kümesindeki her işlem için günlük oluşturur. Denetim günlüklerine ek olarak, RustFS, operasyonel sorun giderme için konsol hatalarını da kaydeder.

RustFS, günlükleri analiz ve uyarı için elastik stack'e (veya üçüncü taraf) çıktı olarak vermeyi destekler.
