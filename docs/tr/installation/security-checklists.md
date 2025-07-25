---
title: "Güvenlik Kontrol Listesi"
description: "RustFS Güvenlik Kontrol Listesi (kurumsal dağıtıcılar için). RustFS, Apache 2.0 açık kaynak lisansı altında yayınlanan, Rust ile geliştirilmiş yüksek performanslı dağıtık nesne depolama yazılımıdır."
---
# Güvenlik Kontrol Listesi

> Kurumların RustFS'yi güvenli bir şekilde dağıtmasına yardımcı olmak için, resmi RustFS güvenlik uygulaması önerilerine başvurduk ve aşağıdaki en iyi güvenlik uygulamalarını derledik. Dağıtım sırasında her bir maddeyi kontrol etmenizi ve sistem güvenliğini ve güvenilirliğini sağlamanızı öneririz.

## 1. Kimlik Doğrulama ve Erişim Kontrolü

- **S3 Uyumlu Anahtar Doğrulaması Kullanın**

 RustFS, kimlik doğrulaması için AWS İmza V4'e benzer bir imza mekanizması kullanır. Her kullanıcı veya hizmet, erişim için geçerli Erişim Anahtarı ve Gizli Anahtar kullanmalıdır; asla doğrulama adımlarını atlamayın.

- **Politika Tabanlı Erişim Kontrolü**

 Farklı roller ve kullanıcılar için en az ayrıcalık prensibine göre erişim politikaları tanımlayın. Grup politikaları ve kullanıcı politikaları ayarlayabilir, izin verilen S3 işlemlerini açıkça belirtebilirsiniz. Varsayılan olarak, politikada açıkça yetkilendirilmemiş işlemler reddedilmelidir.

## 2. Ağ Taşımacılığı Şifreleme (TLS/SSL)

- **TLS/SSL Şifrelemeyi Etkinleştirin**

 RustFS dağıtımı sırasında geçerli SSL sertifikaları ve özel anahtarlar yapılandırın. Dış ve iç ağ erişimi için farklı alan adları için sertifikalar kullanmanız ve TLS 1.2 veya daha yüksek güvenlik protokollerini benimsemeniz önerilir.

- **Sertifika Yönetimi**

 Sertifikaların güvenilir Sertifika Otoriteleri (veya dahili kurumsal kök Sertifika Otoriteleri) tarafından verildiğinden emin olun, süresi dolmuş veya kendi kendine imzalanmış sertifikalar kullanmaktan kaçının. Özel anahtar dosyaları, yalnızca RustFS hizmet süreçleri veya özel kullanıcıların okumasına izin veren sıkı dosya izinlerine sahip olmalıdır.

- **Çoklu Alan Adları ve Şifre Setleri**

 Çoklu erişim alanları için bağımsız sertifikalar yapılandırın; anahtar oluştururken önerilen şifreleme algoritmalarını kullanın (örneğin, 2048-bit RSA veya 256-bit ECC).

## 3. Ortam Değişkenleri ve Kimlik Bilgisi Koruma

- **Varsayılan Kimlik Bilgilerini Değiştirin**

 RustFS, başlatma sırasında varsayılan hesaplar kullanıyorsa (örneğin, `rustfsadmin` / `rustfsadmin`), dağıtımdan sonra rastgele karmaşık parolalarla değiştirmeniz gerekir.

- **Kimlik Bilgilerini Güvenli Bir Şekilde Saklayın**

 Düz metin parolaları betiklerde, görüntülerde veya günlüklerde sabit kodlamayın. Ortam değişkenlerini veya Kubernetes Sırlarını kullanarak parolaları yönetin.

## 4. Günlük Kaydı ve Denetim İzleri

- **Denetim Günlüklerini Etkinleştirin**

 RustFS, denetim günlüklerini HTTP Webhook, Kafka, ELK, Splunk vb. gibi harici sistemlere dışa aktarmayı destekler.

- **Çalışma Zamanı Günlük Toplama**

 Farklı platformlarda (örneğin, systemd, Docker, K8s) günlükleri toplamak ve analiz etmek için standart yöntemler kullanın. ELK, Grafana Loki ile kullanmanız önerilir.

- **İzleme ve Uyarılar**

 Oturum açma başarısızlıkları, alışılmadık saatlerde erişim, büyük ölçekli silme işlemleri gibi anormal davranışlar için uyarı bildirimleri ayarlayın.

- **Gözlemlenebilirlik**

 RustFS, gözlemlenebilir ortam dağıtımını destekler, bireysel işlev yürütme sürelerine kadar optimizasyon sağlar. Farklı ortamlar için yapılandırmanızı daha da optimize edebilirsiniz.

## 5. API Erişim Kısıtlamaları

- **Ağ Erişimini Sınırlayın**

 Varsayılan olarak, RustFS S3 API 9000 numaralı portu dinler ve yönetim konsolu 9090 numaralı portu dinler. Güvenlik duvarları veya bulut güvenlik grupları aracılığıyla erişim kaynak IP'lerini kısıtlayın.

- **Ağ İzolasyonu ve Proxy**

 Hizmetleri ters proxy (örneğin, Nginx) aracılığıyla sunmanız önerilir, depolama düğümü IP'lerini doğrudan maruz bırakmaktan kaçının.

- **Gereksiz Portları Kapatın**

 Kullanılmayan portları veya arayüzleri devre dışı bırakın, örneğin, yönetim arayüzlerini genel internete maruz bırakmayın.

## 6. Bir Kere Yaz Çok Kez Oku (WORM)

- **Sürümleme ve Nesne Kilitleme**

 Düzenleyici gereksinimleri karşılamak için (örneğin, finansal, hükümet) nesne sürümleme ve nesne kilitleme politikalarını etkinleştirin.

## 7. Güncellemeler ve Sürüm Yönetimi

- **Yamaları ve Yükseltmeleri Zamanında Uygulayın**

 Resmi RustFS güncelleme bildirimlerini takip edin, düzenli olarak yükseltme yapın ve değişiklik notlarını gözden geçirerek güvenlik açıklarından kaçının.

- **Yıkıcı Olmayan Yükseltme Süreci**

 RustFS, sıcak güncelleme süreçlerini destekler, düğüm düğüm yeniden başlatma yoluyla sıfır kesinti süresi hizmeti sağlar.

- **İşletim Sistemi ve Bağımlılık Yönetimi**

 İşletim sistemleri ve temel bileşenler (örneğin, OpenSSL) için güvenlik açıkları güncellemelerini ve düzeltmelerini izleyin.

---

Yukarıda belirtilenler **RustFS Kurumsal Dağıtım Güvenlik Kontrol Listesi**dir. Dağıtımdan önce her bir maddeyi kontrol edin ve dağıtımdan sonra düzenli olarak gözden geçirin, böylece riskleri önemli ölçüde azaltabilir ve stabiliteyi artırabilirsiniz.