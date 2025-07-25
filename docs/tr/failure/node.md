---
title: "Düğüm Arızası (Node Failure)"
description: "RustFS kümelerinde düğüm arızalarını ele alma adımları. Şunları içerir: yedek düğüm donanımının hazırlanması, yapılandırma güncellemeleri, servis dağıtımı, kümeye yeniden katılma, veri iyileştirme ve sonraki kontroller ve en iyi uygulamalar."
---
# Düğüm Arızası

Dağıtılmış RustFS kümelerinde, silme kodlama mekanizmaları, kısmi düğüm arızaları sırasında okuma/yazma erişimini sağlamak ve düğümler kümeye yeniden katıldığında otomatik veri iyileştirme yapmak için kullanılır. Bu belge, aşağıdaki süreci size rehberlik edecektir:

1. Yedek düğümü başlatın ve ortamı senkronize edin
2. DNS/ana bilgisayar adını eski düğüm kimliğini yeni düğüme yönlendirmek için güncelleyin
3. Kümeyle uyumlu RustFS servisini indirin ve dağıtın
4. Yeni düğümü kümeye yeniden katın ve veri iyileştirmesini tetikleyin
5. İyileştirme ilerlemesini izleyin ve sonraki kontrolleri ve optimizasyonu gerçekleştirin

## 1) Yedek Düğümü Başlatın

* **Donanım ve Sistem Hazırlığı**
Yedek düğümün sunucu donanımının arızalı düğümle kabaca tutarlı olduğundan emin olun; CPU, bellek, ağ yapılandırması ve disk türleri dahil; hatta daha yüksek özellikler kullanmak küme performansını etkilemez.
Yazılım ortamının diğer düğümlerle sürüm uyumluluğunu koruması gerekir (işletim sistemi, çekirdek, bağımlılık kütüphaneleri vb.) ortam farklılıklarından dolayı küme anormal davranış göstermesin.

* **Özel Sürücü Erişimi**
Fiziksel sürücüler üzerindeki işlemler gibi, RustFS de depolama birimlerine özel erişim gerektirir, diğer hiçbir işlem veya betiğin depolama birimleri içindeki verileri doğrudan değiştirmesine izin vermez, aksi takdirde veri bozulması veya yedeklilik kaybına kolayca neden olabilir.

## 2) Ana Bilgisayar Adını ve Ağ Çözünürlüğünü Güncelleyin

* **DNS/Hosts Yapılandırması**
Yedek düğümün IP adresi arızalı düğümden farklıysa, eski düğümün ana bilgisayar adını (örneğin, `rustfs-node-2.example.net`) yeni düğüme yeniden çözümlemeniz gerekir, böylece küme içindeki düğümler aynı adres üzerinden birbirlerini keşfedebilir.
```bash
# Örnek: /etc/hosts dosyasına satır ekleyin veya değiştirin
192.168.1.12 rustfs-node-2.example.net
```
Doğru çözünürlükten sonra, `ping` veya `nslookup` aracılığıyla ana bilgisayar adının yeni düğüme işaret ettiğini doğrulayın.

## 3) RustFS Servisini Dağıtın ve Yapılandırın

* **İndirme ve Kurulum**
Mevcut düğümlerle uyumlu ikili dosyaları veya kurulum paketlerini indirmek için resmi RustFS dağıtım sürecini aynı sürüm için takip edin ve birleştirilmiş dizine çıkarın. Başlangıç betiklerinin, ortam değişkenlerinin ve yapılandırma dosyalarının (örneğin `/etc/default/rustfs`) kümedeki diğer düğümlerle tamamen tutarlı olduğundan emin olun.

* **Yapılandırma Doğrulama**
* `config.yaml` dosyasındaki küme düğüm listesinin (endpointler) yeni düğümün ana bilgisayar adını ve portunu içerdiğini kontrol edin.
* Tüm düğümlerin aynı erişim anahtarlarına ve izin yapılandırmalarına sahip olduğundan emin olun, böylece yeni düğüm kimlik doğrulama hataları nedeniyle kümeye katılamaz.

## 4) Kümeye Yeniden Katılın ve Veri İyileştirmesini Tetikleyin

* **Servisi Başlatın**
```bash
systemctl start rustfs-server
```
Veya RustFS servisini başlatmak için özel başlangıç betiğinizi kullanın ve `journalctl -u rustfs-server -f` aracılığıyla başlangıç günlüklerini görüntüleyerek yeni düğümün diğer çevrimiçi düğümleri tespit ettiğini ve veri iyileştirme sürecini başlattığını onaylayın.

* **İyileştirme Durumunun Manuel İzlenmesi**
Küme sağlığını ve iyileştirme ilerlemesini görüntülemek için RustFS yönetim araçlarını kullanın (komutun `rustfs-admin` olduğunu varsayalım):
```bash
# Küme düğüm durumunu görüntüleyin
rc cluster status
# Yeni düğüm için veri iyileştirmesini tetikleyin
rc heal --node rustfs-node-2.example.net
# İyileştirme ilerlemesini gerçek zamanlı olarak takip edin
rc heal status --follow
```
Burada, `heal` komutu RustFS'nin `rc admin heal` komutuna benzer, tüm eksik veya tutarsız veri parçalarının arka planda restore edilmesini sağlar.

* **Topluluk Deneyimi Referansı**
Topluluk testleri, düğümler çevrimdışı olduğunda ve sonra kümeye yeniden katıldığında, RustFS'nin yalnızca yeni düğüm üzerinde iyileştirme işlemleri gerçekleştireceğini ve tam küme yeniden dengelenmesinden kaçınarak gereksiz ağ ve G/Ç piklerinin önüne geçtiğini göstermektedir.

## 5) Sonraki Kontroller ve En İyi Uygulamalar

* **İzleme ve Uyarılar**
* İyileştirme sırasında disk ve ağ yükünü izleyin ve kümenin okuma/yazma ve ağ bant genişliği gereksinimlerini karşıladığından emin olun.
* Düğüm iyileştirmesinin başarısız olduğu veya ilerlemenin eşiklerin ötesinde durduğu durumlarda operasyon ekiplerini zamanında bilgilendirmek için uyarılar kurun.

* **Tekrarlanan Arıza Tatbikatları**
Düzenli olarak düğüm arızalarını simüle edin ve tüm kurtarma sürecini uygulayın, böylece ekip operasyon komutları ve acil durum prosedürleriyle aşina olsun.

* **Kök Neden Analizi**
Sık arıza veren düğümler veya diskler için derinlemesine donanım sağlığı teşhisleri (SMART, BIOS günlükleri vb.) gerçekleştirin ve önleyici bakım planları uygulayın.

* **Profesyonel Destek**
Daha derin arıza lokalizasyonu ve kurtarma rehberliği için RustFS geliştirme ekibi veya toplulukla iletişime geçin.

---
**Özet**: Yukarıdaki süreç aracılığıyla, RustFS tam düğüm donanımı arızası sonrasında hızlı ve güvenli bir şekilde düğümleri değiştirebilir ve veri iyileştirmesini tamamlayabilir, böylece küme kullanılabilirliği kesintisini en aza indirebilir. Kendi ortamınıza göre doğrulama yapmayı ve belirli komut satırı araçlarıyla yapılandırma tutarlılığını ve doğru işlem sırasını sağlamayı unutmayın.