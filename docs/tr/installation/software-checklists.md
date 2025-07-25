---
title: "Yazılım Kontrol Listesi"
description: "Bu belge, RustFS kurulumu sırasında çevresel yazılımlar için alınması gereken önlemleri, işletim sistemleri, ikili paketler vb. dahil olmak üzere açıklar."
---
# RustFS Yazılım Dağıtım Kontrol Listesi

RustFS, S3 protokolü ile %100 uyumlu, yüksek performanslı dağıtık bir nesne depolama sistemidir ve Apache 2.0 açık kaynak lisansı kullanır ([RustFS Nedir?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82)). Rust ile geliştirilmiş olup bellek güvenliği özelliklerine sahiptir ve çoklu platformlarda çalışabilir (Linux, Windows, macOS dahil, x86/ARM mimarilerini destekler), esnek ve özelleştirilebilir dağıtım seçenekleri sunar (özelleştirilebilir eklenti uzantılarını destekler). Üretim ortamında stabil ve güvenilir bir dağıtım sağlamak için aşağıdaki gerekli kontrol maddeleri listelenmiştir. Lütfen aşağıdaki ayarların yapılıp yapılmadığını **önce doğrulayın**:

## Sistem Gereksinimleri

- **İşletim Sistemi**: Uzun süreli destek sürümleri olan Linux dağıtımlarını kullanmanız önerilir (örneğin Ubuntu 20.04+/22.04, RHEL 8/9 vb.), çekirdek sürümü tercihen 5.x veya daha üstü olmalıdır. RustFS, Linux 5.x+ çekirdekleri altında `io_uring` asenkron G/Ç optimizasyonunu kullanabilir, bu da daha iyi verim performansı sağlar.
- **CPU ve Bellek**: x86_64, ARM gibi ana akım CPU mimarilerini destekler. Test ortamı için en az 2 GB bellek, üretim ortamı için en az 64 GB bellek önerilir ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). **Unutmayın**, veri ölçeği ve eşzamanlılık düzeyine göre gerekli belleği tahmin edin, yetersiz bellek nedeniyle performans darboğazlarından kaçının.
- **Müdahale Eden Servisleri Devre Dışı Bırakın**: Performansı sağlamak için, dosya sistemlerini tarayan/denetleyen servisleri devre dışı bırakmanız veya görmezden gelmeniz önerilir (örneğin `mlocate`, `plocate`, `updatedb`, `auditd`, antivirüs yazılımları vb.), çünkü bu servisler RustFS disk G/Ç'si ile çatışabilir. Devre dışı bırakılamıyorsa, RustFS veri yollarını tarama performans etkisinden kaçınmak için hariç tutun.

RustFS, Linux 5.x veya daha üstü çekirdek sürümlerinde çalıştırılmasını şiddetle önerir, özellikle 5.10+ sürümleri.

Neden?

Çünkü RustFS, alt seviye G/Ç modelinde Linux'un **io_uring** teknolojisini kullanmayı önceliklendirir ve io_uring, Linux 5.1'den itibaren tanıtıldı ve 5.10+ sürümlerinde daha olgun ve stabil hale geldi. Geleneksel epoll veya iş parçacığı havuzlarına kıyasla, io_uring daha verimli, düşük gecikmeli asenkron G/Ç yetenekleri sunar, yüksek eşzamanlılık nesne depolama senaryoları için çok uygundur.

### Öneriler

- 5.x çekirdekli ana akım kurumsal dağıtım sürümlerini kullanın, örneğin:
  - Ubuntu 20.04 LTS (HWE çekirdeği yükleyerek 5.15+ elde edilebilir)
  - Ubuntu 22.04 LTS (varsayılan 5.15+)
  - CentOS Stream 9 / RHEL 9
  - Debian 12 (varsayılan 6.x, daha da iyi)
- Eğer hala eski çekirdekleri kullanıyorsanız (örneğin 4.x), yükseltme yapmanız veya özel çekirdekleri destekleyen dağıtımlar kullanmanız önerilir, böylece RustFS performans avantajlarından tam olarak yararlanabilirsiniz.

## İkili Paket Doğrulama ve Dağıtım

- **Resmi İndirme**: Sunucu ikili paketlerini yalnızca resmi RustFS kanallarından (örneğin resmi web sitesi veya resmi aynalar) indirin, bilinmeyen kaynaklardan gelen paketler kullanmayın, değiştirilme riskine karşı.
- **Bütünlük Doğrulama**: İndirdikten sonra, **unutmayın** ikili paketin bütünlüğünü doğrulayın. Genellikle resmi SHA256 checksumları veya imza dosyaları sağlanır, bunları `sha256sum` veya imza doğrulama araçları kullanarak doğrulayın ve dosyaların bozulmadığını veya değiştirilmediğini sağlayın.
- **Tutarlılık**: Dağıtık dağıtım için, tüm düğümlerin aynı sürüm RustFS ikili dosyalarını kullandığından emin olun, aksi takdirde sürüm farklılıkları nedeniyle uyumluluk sorunları ortaya çıkabilir.
- **Kurulum Konumu**: Yönetimi kolaylaştırmak için ikili dosyaları global yürütme yoluna taşıyın (örneğin `/usr/local/bin`) ve yürütme izinleri verin (`chmod +x`). Eğer systemd kullanarak servisleri yönetiyorsanız, servis dosyalarındaki yolun doğru olduğunu doğrulayın.

## Dosya Sistemi ve Disk Düzeni

- **Özel Veri Diskleri**: RustFS, depolama disklerine özel erişim gerektirir, sistem disklerini veya diğer uygulama verilerini RustFS verileriyle karıştırmayın. İşletim sistemi ve RustFS verileri için farklı diskler veya bölümler kullanmanız önerilir; **önce doğrulayın** veri disk montaj noktalarının doğru olduğunu.
- **Dosya Sistemi Türü**: Olgun ve yüksek performanslı dosya sistemleri kullanmanız önerilir, örneğin XFS veya Ext4, ve montaj sırasında performans seçenekleri ekleyin (örneğin `noatime,nodiratime,nobarrier` vb., gerçek koşullara göre ayarlayın). Bu, gereksiz G/Ç yükünü azaltabilir ve verimi artırabilir.
- **Disk Yapılandırması**: Eğer çoklu disk kullanıyorsanız, genellikle bağımsız hacimler olarak yapılandırmanız önerilir (JBOD), RustFS'in kendisinin silme kodlama ve diğer mekanizmalar aracılığıyla veri güvenilirliğini sağlamasına izin vererek, daha esnek depolama kapasitesi genişlemesi için donanım RAID'e güvenmek yerine.
- **Montaj Seçenekleri ve İzinleri**: Montaj parametrelerini kontrol edin, RustFS servis çalıştırma kullanıcısının veri dizinlerine okuma/yazma izinleri olduğunu doğrulayın. `/etc/fstab` içinde `noexec`, `nodev` gibi güvenlik seçenekleri ekleyebilirsiniz, RustFS sürecinin erişim izinleri olduğunu sağlarken.

## Sistem Bağımlılık Kontrolleri

- **Zaman Senkronizasyonu**: Çok düğümlü dağıtım için, **asla unutmayın** zaman senkronizasyonunu. Tüm düğümlerin sistem zamanı tutarlı olmalıdır (zamanı senkronize etmek için `ntp`, `chrony`, `timedatectl` gibi araçlar kullanın), aksi takdirde küme başlatma veya veri tutarlılığı anormallikleri oluşabilir ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). `timedatectl status` çıktısının "`synchronized`" gösterip göstermediğini kontrol edin ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)).
- **Ana Bilgisayar Adı ve DNS**: Her düğüm için **tutarlı ana bilgisayar adları** yapılandırın ve bu ana bilgisayar adlarının doğru IP'lere çözülebildiğinden emin olun. DNS veya `/etc/hosts` kullanarak yapılandırabilirsiniz ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). Örneğin, her düğüm için sabit IP'ler ve karşılık gelen ana bilgisayar adlarını `/etc/hosts` içinde yapılandırarak DNS sorunları nedeniyle düğümler arası bağlantı hatalarından kaçının.
- **Ağ Bağlantısı**: Kümedeki tüm düğümler arasındaki ağ bağlantısını doğrulayın. **Önce doğrulayın** ağın engellenmediğini, birbirleriyle normal ping atabildiklerini ve RustFS varsayılan dinleme portunun (genellikle 9000) tüm düğümler arasında açık olduğunu ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Güvenlik duvarı etkinse, lütfen RustFS portlarını açın; `firewall-cmd` kullanarak kalıcı `--add-port=9000/tcp` kuralları ekleyebilirsiniz ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Dağıtım sırasında tüm düğümler aynı port numarasını kullanmalıdır.
- **TLS/Sertifikalar**: HTTPS erişimini etkinleştirmeyi planlıyorsanız, sistemde kök sertifikaların yüklü olup olmadığını kontrol edin (örneğin `/etc/ssl/certs/ca-bundle.crt` vb.), ve sunucu TLS sertifikaları ve özel anahtar dosyalarını hazırlayın. RustFS yapılandırma dosyalarında sertifika yollarını doğru bir şekilde belirtin, düğümler ve istemciler arasındaki şifreli iletişimin normal olduğunu sağlayın.
- **Bağımlılık Paketleri**: Linux dağıtımında gerekli bağımlılıkların yüklü olduğunu doğrulayın, örneğin yaygın GNU araç zinciri (`bash`, `glibc` vb.) ve şifreleme kütüphaneleri (`openssl`/`gnutls` vb.). Farklı dağıtımlar belirli paketlerden yoksun olabilir, lütfen gerçek belgeler veya hata istemlerine göre gerekli kütüphaneleri yükleyin.

## Çalışan Kullanıcı ve Güvenlik Bağlamı

- **Özel Çalışan Kullanıcı**: RustFS servisini çalıştırmak için **özel bir kullanıcı** oluşturmanız önerilir (örneğin `rustfs-user`) ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)). Bu kullanıcının oturum açma kabuk izni olmasına gerek yoktur, ancak RustFS veri dizinlerine sahip izinleri olmalıdır. `groupadd`/`useradd` kullanarak kullanıcı grupları ve kullanıcıları oluşturun ve `chown` kullanarak veri dizini sahipliğini bu kullanıcıya atayın ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)).
- **Dosya İzinleri**: RustFS ikili dosyalarının ve tüm yapılandırma dosyalarının çalışan kullanıcı tarafından okunabilir/yazılabilir olduğunu ve diğer kullanıcılarla ilgili olmayan dizinlere erişim izinlerini kısıtlayın. Örneğin, ikili dosyaları `/usr/local/bin` içinde 755 izinleriyle yerleştirin, yalnızca çalışan kullanıcının değiştirmesine izin verin. Veri dizinleri 700 veya 750 izinlerine sahip olmalı, yalnızca RustFS kullanıcısı veya yöneticilerin erişimine izin verilmelidir.
- **SELinux/AppArmor**: Sistemde SELinux veya AppArmor etkinse, lütfen RustFS ikili dosyaları ve veri yolları için ilgili güvenlik politikalarını ayarlayın. Test için SELinux'u geçici olarak `Permissive` moduna ayarlayabilir veya `semanage fcontext` kullanarak kurallar ekleyebilirsiniz; Ubuntu'da, AppArmor yapılandırma dosyalarını değiştirerek erişime izin verebilirsiniz. Bu mekanizmalarla aşina değilseniz, geçici olarak devre dışı bırakmayı düşünebilirsiniz ancak güvenlik etkilerini değerlendirin.
- **Systemd Servisi**: Eğer systemd kullanarak RustFS servisini yönetiyorsanız, servis birim dosyalarında (`rustfs.service`) `User=`, `ExecStart=` vb. maddelerin doğru olduğunu kontrol edin. Ortam değişkenlerinin (örneğin günlük yolları) doğru ayarlandığından ve otomatik yeniden başlatma politikalarını etkinleştirerek stabiliteyi artırın.

## Diğer Hususlar

- **İzleme ve Günlük Kaydı**: Katı bir ön dağıtım kontrolü olmasa da, izleme sistemleri kurmanız ve yapılandırmanız önerilir (örneğin Prometheus + Grafana) RustFS metriklerini toplamak için. Ayrıca günlük dizinlerinin yazılabilir olduğunu ve uygun günlük döndürme politikalarını ayarlayarak sınırsız günlük dosyası büyümesini önleyin.
- **İşletim Araçları**: RustFS açık kaynak sürümü CLI istemcilerini içerebilir veya üçüncü taraf araçlarla (örneğin AWS CLI, s3cmd vb.) uyumlu olabilir.
- **Esnek Genişleme**: RustFS eklenti uzantılarını ve çoklu dağıtım modlarını destekler, iş gereksinimlerine göre esnek bir şekilde ayarlanabilir. Örneğin, daha sonra düğüm ekleyebilir veya disk kapasitesini genişletebilirsiniz. Dağıtım sırasında en basit temel yapılandırma ile başlayabilir, doğruluğunu doğrulayabilir ve ardından gelişmiş özellikleri etkinleştirebilirsiniz.
- **Geri Alma Planı**: Gerçek dağıtımdan önce, **önce doğrulayın** tam yapılandırma yedeklerinizin ve geri alma planlarınızın olup olmadığını. Eğer ortam gerçek koşullarla eşleşmiyorsa veya ciddi sorunlar ortaya çıkarsa, sistem durumunu hızlıca geri yükleyebilirsiniz.

Yukarıdaki kontrol listesi, RustFS'yi yazılım seviyesinde dağıtırken dikkate alınması gereken ana yönleri kapsar. Lütfen operasyon personelinin her bir maddeyi proje gereksinimlerine ve ortam özelliklerine göre kontrol etmesini sağlayın, gerçek koşulları birleştirerek sunucuların gereksinimleri karşıladığını ve gerektiği gibi yapılandırıldığını doğrulayın. Başarılı bir dağıtımdan sonra, RustFS, **esnek ve özelleştirilebilir** özellikleri ve modern Linux sistemlerindeki io_uring için optimizasyonu ile verimli ve güvenilir nesne depolama hizmetleri sunacaktır.