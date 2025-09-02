---
title: "Alibaba Cloud Kubernetes Service için RustFS"
description: "Alibaba Cloud ACK'de RustFS çalıştırma kılavuzu"
---

# Alibaba Cloud Kubernetes Service için RustFS

## Müşterilerin Alibaba Cloud'da RustFS çalıştırmasının üç nedeni var

- RustFS, hibrit bulut veya çoklu bulut dağıtım senaryolarında tutarlı bir depolama katmanı olarak görev yapar
- RustFS, Kubernetes native yüksek performanslı bir üründür ve genel bulut, özel bulut ve kenar bulut ortamlarında öngörülebilir performans sağlayabilir
- EKS'de RustFS çalıştırmak, yazılım yığınını kontrol etmenizi sağlar ve bulut kilidinden kaçınmak için gereken esnekliğe sahiptir

Alibaba Cloud ACK, AWS'de Kubernetes çalıştırmak için kullanılabilecek, kendi Kubernetes kontrol düzleminizi veya düğümlerinizi kurmanız, çalıştırmanız ve bakımını yapmanız gerekmeyen yönetilen bir hizmettir.

RustFS, tüm ana Kubernetes platformlarında (Alibaba Cloud ACK, Tanzu, Azure, GCP, Alibaba Cloud ACK) taşınabilir yüksek performanslı nesne depolama sistemi sağlar. Alibaba Cloud'da, RustFS, Alibaba Cloud ACK hizmeti ile native olarak entegre olur, böylece kendi büyük ölçekli çok kiracılı nesne depolama hizmetini çalıştırmak daha kolay hale gelir. RustFS, AWS S3 depolama hizmetinin tam bir alternatifidir.

![RustFS Mimari Diyagramı](images/sec1-1.png)

AWS S3'ten farklı olarak, RustFS, uygulamaların pahalı yazılım yeniden yazımı veya özel entegrasyon olmadan çoklu bulut ve hibrit bulut altyapısı genelinde ölçeklenmesini sağlar. RustFS containerized ve Kubernetes native olduğu için, büyük ölçekli depolama altyapısını çalıştırmak için özel beceriler gerektirmeden bu platformlarda devreye alınabilir.

## RustFS Operator, Alibaba Cloud ACK özellikleri ile native olarak entegre olur

### Özellik Genel Bakışı

- **Depolama sınıfları ve katmanlama**
- **Harici yük dengeleme**
- **Şifreleme anahtarı yönetimi**
- **Kimlik yönetimi**
- **Sertifika yönetimi**
- **İzleme ve uyarılar**
- **Günlük kaydı ve denetim**

## Depolama Sınıfları ve Katmanlama

Alibaba Cloud ACK'de RustFS'i büyük ölçekte dağıtmanın anahtar gereksinimi, depolama sınıfları (NVMe, HDD, genel bulut) genelinde katmanlama yeteneğidir. Bu, işletmelerin maliyet ve performansı aynı anda yönetmesini sağlar.

RustFS, eski nesnelerin hızlı NVMe katmanından daha maliyet etkin HDD katmanına ve hatta maliyet optimize edilmiş soğuk genel bulut depolama katmanına otomatik geçişini destekler.

Katmanlama sırasında, RustFS katmanlar genelinde birleşik bir ad alanı sağlar. Katmanlar arası hareket uygulamalar için şeffaftır ve müşteri tarafından belirlenen politikalar tarafından tetiklenir.

RustFS, nesneleri kaynakta şifreleyerek Alibaba Cloud ACK hibrit bulutunda güvenli depolama sağlar, müşterilerin verileri üzerinde her zaman tam kontrol sahibi olmasını garanti eder. Alibaba Cloud ACK genel bulutta dağıtıldığında, katmanlama özelliği, Alibaba Cloud ACK'nin kalıcı blok depolama ve daha ucuz nesne depolama katmanları genelinde verileri etkili bir şekilde yönetmesine yardımcı olur.

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
