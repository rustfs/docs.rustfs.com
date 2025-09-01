---
title: "Güvenlik Kontrol Listesi"
description: "RustFS güvenlik kontrol listesi (kurumsal dağıtımcılar için), RustFS Rust dili ile geliştirilmiş yüksek performanslı dağıtık nesne depolama yazılımıdır, Apache 2.0 açık kaynak protokolü ile yayınlanır."
---

# Güvenlik Kontrol Listesi

> Kuruluşların RustFS'i güvenli bir şekilde dağıtmasına yardımcı olmak için, RustFS resmi güvenlik uygulama önerilerini referans alarak aşağıdaki güvenlik en iyi uygulamalarını düzenledik. Dağıtım sırasında kontrol listesine göre madde madde kontrol yapmanızı, sistemin güvenli ve güvenilir olmasını sağlamanızı öneririz.

## 1. Kimlik Doğrulama ve Erişim Kontrolü

- **S3 Uyumlu Anahtar Kimlik Doğrulaması Kullanın** 
 RustFS AWS Signature V4 benzeri imzalama mekanizması kullanarak kimlik doğrulama yapar. Her kullanıcı veya hizmet geçerli Access Key ve Secret Key kullanarak erişim sağlamalı, kimlik doğrulama adımlarını atlamayın.

- **Politika Tabanlı Erişim Kontrolü** 
 En az ayrıcalık ilkesine göre farklı roller ve kullanıcılar için erişim politikaları tanımlayın. Grup politikaları ve kullanıcı politikaları ayarlayabilir, izin verilen S3 işlemlerini açıkça belirtebilirsiniz. Varsayılan olarak, politikada açıkça yetkilendirilmeyen işlemler reddedilmelidir.

## 2. Ağ İletim Şifrelemesi (TLS/SSL)

- **TLS/SSL Şifrelemesini Etkinleştirin** 
 Dağıtım sırasında RustFS için mutlaka geçerli SSL sertifikası ve özel anahtar yapılandırın. Harici ağ erişimi ve dahili ağ erişimi için ayrı domain adları sertifikaları kullanmanızı, TLS1.2 veya daha yüksek güvenlik protokolleri benimsemenizi öneririz.

- **Sertifika Yönetimi** 
 Sertifikaların güvenilir CA tarafından imzalandığından (veya şirket içi kök CA kullanarak) emin olun, süresi dolmuş veya kendi kendine imzalanmış sertifika kullanmaktan kaçının. Özel anahtar dosyaları için sıkı dosya izinleri ayarlayın, sadece RustFS hizmet süreci veya özel kullanıcının okuyabilmesine izin verin.

- **Çoklu Domain Adı ve Şifreleme Süiti** 
 Birden fazla erişim domain adı için ayrı ayrı bağımsız sertifikalar yapılandırın; anahtar oluştururken önerilen şifreleme algoritmaları kullanın (2048 bit RSA veya 256 bit ECC gibi).

## 3. Ortam Değişkenleri ve Kimlik Bilgisi Koruması

- **Varsayılan Kimlik Bilgilerini Değiştirin** 
 RustFS başlatılırken varsayılan hesap kullanılıyorsa (`rustfsadmin` / `rustfsadmin` gibi), dağıtım sonrasında rastgele karmaşık parola ile değiştirilmelidir.

- **Kimlik Bilgilerini Güvenli Şekilde Saklayın** 
 Düz metin parolaları betikler, imajlar veya loglarda sabit kodlamayın. Parolaları yönetmek için ortam değişkenleri veya Kubernetes Secret kullanın.

## 4. Log ve Denetim İzleme

- **Denetim Loglarını Etkinleştirin** 
 RustFS denetim loglarını HTTP Webhook, Kafka, ELK, Splunk gibi harici sistemlere aktarmayı destekler.

- **Çalışma Logu Toplama** 
 Farklı platformlarda (systemd, Docker, K8s gibi) standart yöntemler kullanarak logları toplayın ve analiz edin. ELK, Grafana Loki ile birlikte kullanmanızı öneririz.

- **İzleme ve Alarm** 
 Giriş başarısızlıkları, anormal zamanlarda erişim, büyük ölçekli silme gibi anormal davranışlar için alarm bildirimleri ayarlayın.

- **Gözlemlenebilirlik**
 RustFS gözlemlenebilir ortam dağıtımını destekler, her fonksiyonun çalışma süresi optimizasyonuna kadar hassas ayar yapabilir. Farklı ortamlar için yapılandırmanızı daha da optimize edebilirsiniz.

## 5. API Erişim Kısıtlaması

- **Ağ Erişimini Sınırlayın** 
 Varsayılan olarak RustFS'in S3 API'si 9000 portunu, yönetim konsolu 9090 portunu dinler. Firewall veya bulut güvenlik grupları ile erişim kaynak IP'lerini sınırlayın.

- **Ağ İzolasyonu ve Proxy** 
 Ters proxy (Nginx gibi) üzerinden hizmeti açığa çıkarmanızı, depolama düğüm IP'lerini doğrudan açığa çıkarmamayı öneririz.

- **Gereksiz Portları Kapatın** 
 Kullanılmayan portları veya arayüzleri devre dışı bırakın, örneğin yönetim arayüzünü genel internete açmayın.

## 6. Veri Salt Okunur (WORM)

- **Sürüm Kontrolü ve Nesne Kilitleme** 
 Nesne sürüm özelliği ve nesne kilitleme politikasını açın, yasal gereksinimleri (finans, kamu yönetimi gibi) karşılayın.

## 7. Güncelleme ve Sürüm Yönetimi

- **Zamanında Yama ve Yükseltme Uygulayın** 
 RustFS resmi güncelleme bildirimlerini takip edin, düzenli yükseltme yapın ve değişiklik açıklamalarını inceleyin, güvenlik açıklarından kaçının.

- **Bozucu Olmayan Yükseltme Süreci** 
 RustFS sıcak güncelleme sürecini destekler, düğüm bazında yeniden başlatma ile kesintisiz hizmet sağlanabilir.

- **İşletim Sistemi ve Bağımlılık Yönetimi** 
 İşletim sistemi ve temel bileşenlerin (OpenSSL gibi) güvenlik açığı güncellemeleri ve düzeltme durumlarını takip edin.

---

Yukarıdakiler **RustFS kurumsal düzey dağıtımının güvenlik kontrol listesi**dir. Dağıtım öncesi madde madde karşılaştırın, dağıtım sonrası düzenli olarak gözden geçirin, riski önemli ölçüde azaltabilir, kararlılığı artırabilirsiniz.