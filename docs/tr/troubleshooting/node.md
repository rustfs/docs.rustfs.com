---
title: "Düğüm Hasarı"
description: "RustFS kümesinde düğüm arızalarını işlemenin tam adımları. Temel olarak: düğüm donanımı değiştirme hazırlığı, yapılandırma güncellemesi, hizmet dağıtımı, kümeye yeniden katılma, veri iyileşmesi ve sonraki kontrol ve en iyi uygulamalar gibi kritik bağlantıları içerir."
---

# RustFS Düğüm Hasarı Arıza Giderme Kılavuzu

Dağıtılmış RustFS kümesinde Erasure Coding mekanizması benimsenmiştir, bazı düğümler arızalandığında hala okuma-yazma erişimi sağlayabilmek ve düğümler yeniden katıldıktan sonra otomatik olarak veri iyileştirme yapabilmek için. Bu belge aşağıdaki süreci tamamlamanız için size rehberlik edecektir:

1. Değiştirme düğümünü başlatma ve ortamı senkronize etme
2. DNS/host adını güncelleme, eski düğüm tanımlayıcısının yeni düğümü göstermesi
3. Küme ile tutarlı RustFS hizmetini indirme ve dağıtma
4. Yeni düğümü kümeye yeniden katma ve veri iyileştirmesini tetikleme
5. İyileştirme ilerlemesini izleme ve sonraki kontrol ile optimizasyon yapma

## 1) Değiştirme Düğümünü Başlatma

* **Donanım ve Sistem Hazırlığı**
 Değiştirme düğümünün sunucu donanımının arızalı düğümle yaklaşık aynı olduğundan emin olun, CPU, bellek, ağ yapılandırması ve disk türü dahil; daha yüksek yapılandırma kullanılsa bile küme performansını etkilemez.
 Yazılım ortamının diğer düğümlerle sürüm tutarlılığını koruması gerekir (işletim sistemi, çekirdek, bağımlılık kütüphaneleri vb.), ortam farklılıklarının neden olduğu küme anormal davranışlarından kaçınmak için.

* **Sürücü Özel Erişimi**
 Fiziksel sürücüler üzerindeki işlemlerde olduğu gibi, RustFS depolama hacimlerine özel erişim hakkı gerektirir, herhangi bir başka süreç veya betiğin depolama hacmi içindeki verileri doğrudan değiştirmesini yasaklar, aksi takdirde veri bozulması veya yedeklilik kaybına kolayca neden olur.

## 2) Host Adı ve Ağ Çözümlemesini Güncelleme

* **DNS/Hosts Yapılandırması**
 Değiştirme düğümünün IP adresi arızalı düğümden farklıysa, eski düğümün host adını (örneğin `rustfs-node-2.example.net`) yeni düğüme yeniden çözümleme yapması gerekir, küme içindeki düğümlerin aynı adres üzerinden birbirini keşfetmesini sağlamak için.

 ```bash
 # Örnek: /etc/hosts'ta satır ekle veya değiştir
 192.168.1.12 rustfs-node-2.example.net
 ```

 Doğru çözümleme sonrasında, `ping` veya `nslookup` ile host adının yeni düğümü gösterdiğini doğrulayabilirsiniz.

## 3) RustFS Hizmetini Dağıtma ve Yapılandırma

* **İndirme ve Kurulum**
 RustFS resmi aynı sürüm dağıtım sürecine göre, mevcut düğümlerle tutarlı binary veya kurulum paketini indirin ve birleşik dizine çıkarın. Başlatma betiklerinin, ortam değişkenlerinin ve yapılandırma dosyalarının (örneğin `/etc/default/rustfs`) kümedeki diğer düğümlerle tamamen tutarlı olduğundan emin olun.

* **Yapılandırma Doğrulaması**

 * `config.yaml` içindeki küme düğüm listesinin (endpoints) yeni düğümün host adı ve portunu içerip içermediğini kontrol edin.
 * Tüm düğümlerin erişim anahtarı ve izin yapılandırmalarının aynı olduğundan emin olun, kimlik doğrulama başarısızlığının yeni düğümün katılamama durumuna neden olmasını önlemek için.

## 4) Kümeye Yeniden Katılma ve Veri İyileştirmesini Tetikleme

* **Hizmeti Başlatma**

 ```bash
 systemctl start rustfs-server
 ```

 Veya özel başlatma betiğinizi kullanarak RustFS hizmetini başlatın ve `journalctl -u rustfs-server -f` ile başlatma loglarını görüntüleyin, yeni düğümün diğer çevrimiçi düğümleri tespit ettiğini ve veri iyileştirme sürecini başlattığını onaylayın.

* **Manuel İyileştirme Durumu İzleme**
 RustFS yönetim aracını (komutun `rustfs-admin` olduğunu varsayın) kullanarak küme sağlığı ve iyileştirme ilerlemesini görüntüleyin:

 ```bash
 # Küme düğüm durumunu görüntüle
 rc cluster status

 # Yeni düğümün veri iyileştirmesini tetikle
 rc heal --node rustfs-node-2.example.net

 # İyileştirme ilerlemesini gerçek zamanlı takip et
 rc heal status --follow
 ```

 Burada `heal` komutu RustFS'in `rc admin heal` komutuna benzer, kayıp veya tutarsız tüm veri parçalarının arka planda yerinde kurtarılmasını sağlayabilir.

* **Topluluk Deneyim Referansı**
 Topluluk testleri gösteriyor ki, düğüm çevrimdışı olduktan sonra tekrar katıldığında, RustFS sadece yeni düğüme iyileştirme işlemi uygulayacak, kümeyi tam yeniden dengeleme yapmayacak, böylece gereksiz ağ ve I/O zirvelerinden kaçınılır.

## 5) Sonraki Kontrol ve En İyi Uygulamalar

* **İzleme ve Alarm**

 * İyileştirme döneminde disk ve ağ yükünü izleyin, kümenin okuma-yazma ve ağ bant genişliği gereksinimlerini karşıladığından emin olun.
 * Düğüm iyileştirme başarısız olduğunda veya ilerleme eşiği aştığında durduğunda operasyon ekibini zamanında bilgilendirmek için alarm kurun.

* **Tekrarlayan Arıza Tatbikatı**
 Düğüm arızasını düzenli olarak simüle edin ve tüm kurtarma sürecini pratik yapın, ekibin işlem komutları ve acil adımlardaki aşinalığını sağlamak için.

* **Kök Neden Analizi**
 Sık arızalanan düğüm veya diskler için derinlemesine donanım sağlık teşhisi yapın (SMART, BIOS logları vb.) ve önleyici bakım planı benimseyin.

* **Profesyonel Destek**
 Daha derin arıza lokasyonu ve kurtarma rehberliği gerekiyorsa, RustFS geliştirme ekibi veya topluluğundan yardım alabilirsiniz.

---

**Özet**: Yukarıdaki süreç sayesinde, RustFS düğüm donanımında tam arıza oluştuktan sonra hızla güvenli bir şekilde düğüm değiştirebilir ve veri iyileştirmesini tamamlayabilir, kümenin kullanılabilirlik kesintisini maksimum düzeyde azaltır. Kendi ortamınız ve spesifik komut satırı araçlarınızla birlikte kontrol etmeyi unutmayın, yapılandırma tutarlılığı ve işlem sırası doğruluğunu sağlamak için.