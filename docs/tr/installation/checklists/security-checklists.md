---
title: "Güvenlik Kontrol Listesi"
description: "RustFS Güvenlik Kontrol Listesi (kurumsal dağıtımcılar için), RustFS, Rust dili ile geliştirilmiş yüksek performanslı dağıtık nesne depolama yazılımıdır ve Apache 2.0 açık kaynak protokolü altında yayınlanır."
---

# Güvenlik Kontrol Listesi

> Kurumların RustFS'i güvenli bir şekilde dağıtmasına yardımcı olmak için, RustFS resmi güvenlik uygulama önerilerini referans alarak aşağıdaki güvenlik en iyi uygulamalarını derledik. Dağıtım sırasında listeye göre madde madde kontrol etmeniz ve sistem güvenliğini ve güvenilirliğini sağlamanız önerilir.

## 1. Kimlik Doğrulama ve Erişim Kontrolü

- **S3 uyumlu anahtar kimlik doğrulaması kullanın**
 RustFS, kimlik doğrulama için AWS Signature V4 benzeri imza mekanizması kullanır. Her kullanıcı veya servis, erişim için geçerli Access Key ve Secret Key kullanmalıdır, kimlik doğrulama adımlarını atlamayın.

- **Politika tabanlı erişim kontrolü**
 Minimum ayrıcalık prensibine göre farklı roller ve kullanıcılar için erişim politikaları tanımlayın. Grup politikaları ve kullanıcı politikaları ayarlayabilir, açıkça izin verilen S3 operasyonlarını belirleyebilirsiniz. Varsayılan olarak, politikada açıkça yetkilendirilmeyen operasyonlar reddedilmelidir.

## 2. Ağ Aktarım Şifrelemesi (TLS/SSL)

- **TLS/SSL şifrelemeyi etkinleştirin**
 Dağıtım sırasında RustFS için mutlaka geçerli SSL sertifikası ve özel anahtar yapılandırın. Dış ağ erişimi ve iç ağ erişimi için farklı domain adlarına sahip sertifikalar kullanmanız ve TLS1.2 veya daha yüksek sürüm güvenlik protokolünü benimsemeniz önerilir.

- **Sertifika yönetimi**
 Sertifikaların güvenilir CA tarafından verildiğinden emin olun (veya şirket içi kök CA kullanın), süresi dolmuş veya kendi imzalı sertifikalar kullanmaktan kaçının. Özel anahtar dosyası için katı dosya izinleri ayarlayın, sadece RustFS servis sürecinin veya özel kullanıcının okumasına izin verin.

- **Çoklu domain ve şifreleme paketleri**
 Birden fazla erişim domain'i için ayrı sertifikalar yapılandırın; anahtar oluştururken önerilen şifreleme algoritmalarını kullanın (2048 bit RSA veya 256 bit ECC gibi).

## 3. Ortam Değişkenleri ve Kimlik Bilgileri Koruması

- **Varsayılan kimlik bilgilerini değiştirin**
 RustFS başlatılırken varsayılan hesap kullanılıyorsa (örneğin `rustfsadmin` / `rustfsadmin`), dağıtımdan sonra mutlaka rastgele karmaşık şifre ile değiştirilmelidir.

- **Kimlik bilgilerini güvenli depolayın**
 Düz metin şifreleri script, imaj veya günlüklerde hardcode etmeyin. Şifreleri yönetmek için ortam değişkenleri veya Kubernetes Secret kullanın.

## 4. Günlük ve Denetim İzleme

- **Denetim günlüklerini etkinleştirin**
 RustFS, denetim günlüklerini HTTP Webhook, Kafka, ELK, Splunk gibi harici sistemlere dışa aktarmayı destekler.

- **Çalışma günlüğü toplama**
 Farklı platformlarda (systemd, Docker, K8s gibi) standart yöntemler kullanarak günlükleri toplayın ve analiz edin. ELK, Grafana Loki ile birlikte kullanmanız önerilir.

- **İzleme ve uyarı**
 Giriş başarısızlığı, normal olmayan zamanlarda erişim, büyük ölçekli silme gibi anormal davranışlar için uyarı bildirimleri ayarlayın.

- **Gözlemlenebilirlik**
 RustFS, gözlemlenebilir ortam dağıtımını destekler, her fonksiyonun yürütme süresine kadar hassas ayar yapabilirsiniz. Farklı ortamlar için yapılandırmanızı daha da optimize edebilirsiniz.

## 5. API Erişim Kısıtlamaları

- **Ağ erişimini kısıtlayın**
 Varsayılan olarak RustFS'in S3 API'si 9000 portunu dinler, yönetim konsolu 9090 portunu dinler. Güvenlik duvarı veya bulut güvenlik grubu aracılığıyla erişim kaynak IP'lerini kısıtlayın.

- **Ağ izolasyonu ve proxy**
 Servisi ters proxy (Nginx gibi) aracılığıyla açığa çıkarmanız önerilir, depolama düğüm IP'lerini doğrudan açığa çıkarmaktan kaçının.

- **Gereksiz portları kapatın**
 Kullanılmayan portları veya arayüzleri devre dışı bırakın, örneğin yönetim arayüzünü genel ağa açmayın.

## 6. Veri Salt Okunur (WORM)

- **Sürüm kontrolü ve nesne kilitleme**
 Nesne sürüm işlevini ve nesne kilitleme stratejisini etkinleştirin, düzenleyici gereksinimleri karşılayın (finans, hükümet gibi).

## 7. Güncelleme ve Sürüm Yönetimi

- **Yamaları ve yükseltmeleri zamanında uygulayın**
 RustFS resmi güncelleme bildirimlerini takip edin, düzenli olarak yükseltin ve değişiklik açıklamalarını inceleyin, güvenlik açıklarını önleyin.

- **Yıkıcı olmayan yükseltme süreci**
 RustFS sıcak güncelleme sürecini destekler, düğüm düğüm yeniden başlatma ile kesintisiz servis gerçekleştirilebilir.

- **İşletim sistemi ve bağımlılık yönetimi**
 İşletim sistemi ve temel bileşenlerin (OpenSSL gibi) güvenlik açığı güncellemelerini ve düzeltmelerini takip edin.

---

Yukarıdaki **RustFS kurumsal dağıtım güvenlik kontrol listesi**dir. Dağıtımdan önce madde madde karşılaştırın, dağıtımdan sonra düzenli olarak gözden geçirin, bu riski önemli ölçüde azaltabilir ve kararlılığı artırabilir.
