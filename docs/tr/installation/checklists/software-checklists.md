---
title: "Yazılım Kontrol Listesi"
description: "Bu makale, RustFS kurulumu sırasında çevre yazılımlarına dikkat edilmesi gereken noktaları açıklar, işletim sistemi, ikili paketler vb. dahil."
---



# RustFS Yazılım Dağıtım Kontrol Listesi

RustFS, yüksek performanslı dağıtık nesne depolama çözümüdür, %100 S3 protokolü uyumludur ve Apache 2.0 açık kaynak lisansı altında yayınlanır ([RustFS nedir?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82))。Rust dilinde geliştirilmiştir, bellek güvenliği özelliklerine sahiptir ve çeşitli platformlarda çalışabilir (Linux, Windows, MacOS dahil, x86/ARM gibi mimarileri destekler, dağıtım esnek ve özelleştirilebilir (özel eklenti genişletmelerini destekler))。Üretim ortamında kararlı ve güvenilir dağıtım sağlamak için aşağıda gerekli kontrol maddeleri listelenmiştir. Operasyon ekibi lütfen aşağıdaki ayarların **önceden doğrulandığını** kontrol etsin:

## Sistem Gereksinimleri

- **İşletim Sistemi**: Uzun süreli destek sürümlerini kullanmanız önerilir (Ubuntu 20.04+/22.04, RHEL 8/9 gibi), çekirdek sürümü tercihen 5.x veya daha yüksek olmalıdır. RustFS Linux 5.x+ çekirdeği altında `io_uring` asenkron I/O optimizasyonundan yararlanabilir, bu da daha iyi verim performansı sağlar。
- **CPU & Bellek**: x86_64, ARM gibi ana akım CPU mimarilerini destekler. Test ortamı için en az 2 GB bellek, üretim ortamı için en az 64 GB bellek önerilir ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2))。**Unutmayın** veri ölçeği ve eşzamanlılık tahminine göre gerekli belleği hesaplayın, bellek yetersizliğinin performans darboğazına neden olmasını önleyin。
- **Girişim Servislerini Devre Dışı Bırakma**: Performans için, dosya sistemini tarayan/denetleyen servisleri (mlocate, plocate, updatedb, auditd, antivirüs yazılımı gibi) kapatmanız veya görmezden gelmeniz önerilir, bu servisler RustFS'in disk I/O'su ile çakışabilir。Eğer kapatılamıyorsa, RustFS veri yolunu da hariç tutmalısınız, taramanın performansı etkilemesini önleyin。

RustFS, Linux 5.x veya daha yüksek çekirdek sürümlerinde, özellikle 5.10+ sürümlerinde çalıştırılmasını şiddetle önerir。
Neden?

Çünkü RustFS, alt seviye I/O modelinde Linux'un **io_uring** teknolojisini öncelikli olarak kullanır ve io_uring Linux 5.1'den itibaren tanıtılmış, 5.10+ sürümlerinde daha olgun ve kararlı hale gelmiştir。Geleneksel epoll veya thread pool'a kıyasla, io_uring daha verimli, düşük gecikmeli asenkron I/O yeteneği sağlar ve yüksek eşzamanlı nesne depolama senaryoları için çok uygundur。

### Öneriler

- Ana akım kurumsal dağıtımlarda 5.x çekirdeğe sahip sürümleri kullanın, örneğin:
- Ubuntu 20.04 LTS (HWE çekirdeği kurarak 5.15+ elde edebilirsiniz)
- Ubuntu 22.04 LTS (varsayılan 5.15+)
- CentOS Stream 9 / RHEL 9
- Debian 12 (varsayılan 6.x, daha güçlü)

- Eğer hala eski çekirdek kullanıyorsanız (4.x gibi), RustFS'in performans avantajlarından tam olarak yararlanmak için yükseltme yapmanız veya özel çekirdek desteği olan dağıtımları kullanmanız önerilir。

## İkili Paket Doğrulama ve Dağıtım

- **Resmi İndirme**: RustFS ikili paketlerini mutlaka resmi kanallardan (resmi web sitesi veya resmi aynalar gibi) indirin, bilinmeyen kaynaklardan gelen yazılım paketlerini kullanmayın, değiştirilmiş olma riskine karşı korunun。
- **Bütünlük Doğrulama**: İndirdikten sonra **unutmayın** ikili paket bütünlüğünü doğrulayın。Genellikle resmi olarak sağlanan SHA256 sağlama toplamı veya imza dosyaları olur, `sha256sum` veya imza doğrulama araçları kullanarak dosyanın bozulmadığını veya değiştirilmediğini sağlayabilirsiniz。
- **Tutarlılık**: Eğer dağıtık dağıtım yapıyorsanız, tüm düğümlerin aynı RustFS ikili sürümünü kullandığından emin olun, aksi takdirde sürüm farklılıkları nedeniyle uyumluluk sorunları yaşanabilir。
- **Kurulum Konumu**: Yönetim kolaylığı için ikiliyi global yürütme yoluna (örneğin `/usr/local/bin`) taşıyabilir ve yürütme izni verebilirsiniz (`chmod +x`)。Eğer systemd kullanarak servis yönetimi yapıyorsanız, service dosyasındaki yolların doğru olduğundan emin olun。

## Dosya Sistemi ve Disk Düzeni

- **Veri Diski Özel**: RustFS, depolama disklerine özel erişim gerektirir, sistem diski veya diğer uygulama verilerini RustFS verileri ile karıştırmayın。İşletim sistemi ve RustFS verileri için farklı diskler veya bölümler kullanmanız önerilir; **önceden doğrulayın** veri diski bağlama noktasının doğru olup olmadığını。
- **Dosya Sistemi Türü**: Olgun ve iyi performans gösteren dosya sistemlerini kullanmanız önerilir, XFS veya Ext4 gibi, ve bağlarken performans seçenekleri ekleyin (örneğin `noatime,nodiratime,nobarrier` gibi, gerçek duruma göre ayarlayın)。Bu, gereksiz I/O maliyetlerini azaltabilir ve verimi artırabilir。
- **Disk Yapılandırması**: Eğer birden fazla disk kullanıyorsanız, genellikle bunları bağımsız birimler (JBOD) olarak yapılandırmanız önerilir, RustFS'in kendisinin erasure coding gibi mekanizmalarla veri güvenilirliğini sağlamasına izin verin, donanım RAID'e güvenmeyin, böylece depolama kapasitesini daha esnek bir şekilde genişletebilirsiniz。
- **Bağlama Seçenekleri ve İzinler**: Bağlama parametrelerini kontrol edin, RustFS servisinin çalıştığı kullanıcının veri dizininde okuma yazma izinlerine sahip olduğundan emin olun。`/etc/fstab`'a `noexec`, `nodev` gibi güvenlik seçenekleri ekleyebilirsiniz, aynı zamanda RustFS sürecinin erişim iznine sahip olduğundan emin olun。

## Sistem Bağımlılık Kontrolü

- **Zaman Senkronizasyonu**: Çok düğümlü dağıtımda, **kesinlikle unutmayın** zaman senkronizasyonunu。Tüm düğümlerin sistem zamanı tutarlı olmalıdır (`ntp`, `chrony`, `timedatectl` gibi araçları kullanarak zamanı senkronize edin), aksi takdirde küme başlatma veya veri tutarlılığı anormalliklerine neden olabilir ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2))。`timedatectl status` çıktısının "`synchronized`" olup olmadığını kontrol edin ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2))。
- **Ana Bilgisayar Adı ve DNS**: Her düğüm için **sürekli ana bilgisayar adları** yapılandırın ve bu ana bilgisayar adlarının doğru IP'ye çözümlendiğinden emin olun。DNS veya `/etc/hosts` kullanarak yapılandırabilirsiniz ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2))。Örneğin `/etc/hosts`'ta her düğüm için sabit IP ve karşılık gelen ana bilgisayar adını yapılandırın, DNS sorunları nedeniyle düğümler arası bağlantı başarısızlığını önlemek için。
- **Ağ Bağlantısı**: Kümedeki düğümler arasındaki ağ karşılıklı bağlantısını doğrulayın。**Önceden doğrulayın** ağın engellenmediğini, normal şekilde birbirine ping atabildiğini ve RustFS'in varsayılan olarak dinlediği portun (genellikle 9000) tüm düğümler arasında açık olduğunu ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A))。Eğer güvenlik duvarı etkinse, RustFS portunu açın; `firewall-cmd` kullanarak `--add-port=9000/tcp` kalıcı kuralı ekleyebilirsiniz ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A))。Dağıtımda tüm düğümler aynı port numarasını kullanmalıdır。
- **TLS/Sertifikalar**: Eğer HTTPS erişimi etkinleştirmeyi planlıyorsanız, sistemde kök sertifikaların kurulu olup olmadığını kontrol edin (örneğin `/etc/ssl/certs/ca-bundle.crt` gibi) ve sunucu tarafı TLS sertifikası ve özel anahtar dosyalarını hazırlayın。RustFS yapılandırma dosyasında sertifika yollarını doğru şekilde belirtin, düğümler arası ve istemci bağlantılarının şifreli iletişiminin normal olmasını sağlamak için。
- **Bağımlı Yazılım Paketleri**: Kullanılan Linux dağıtımında gerekli bağımlılıkların kurulu olduğundan emin olun, örneğin yaygın GNU araç zinciri (`bash`, `glibc` gibi) ve şifreleme kütüphaneleri (`openssl`/`gnutls` gibi)。Farklı dağıtımlar bazı paketlerde eksik olabilir, lütfen gerçek dokümantasyona veya hata mesajlarına göre gerekli kütüphaneleri kurun。

## Çalışma Kullanıcısı ve Güvenlik Bağlamı

- **Özel Çalışma Kullanıcısı**: RustFS için servisi çalıştırmak üzere **özel bir kullanıcı** oluşturmanız önerilir (örneğin `rustfs-user`) ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D))。Bu kullanıcının Shell giriş izni gerekmez, ancak RustFS veri dizininde sahip olma izinlerine sahip olmalıdır。Lütfen `groupadd`/`useradd` kullanarak kullanıcı grubu ve kullanıcı oluşturun ve `chown` kullanarak veri dizininin sahipliğini bu kullanıcıya verin ([Linux'ta RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D))。
- **Dosya İzinleri**: RustFS ikili dosyasının ve tüm yapılandırma dosyalarının çalışma kullanıcısı tarafından okunabilir yazılabilir olduğundan emin olun, diğer kullanıcılarla ilgili olmayan dizinlere erişim izinlerini kısıtlayın。Örneğin ikiliyi `/usr/local/bin`'e koyun ve `755` izni ayarlayın, sadece çalışma kullanıcısının değiştirebilmesine izin verin。Veri dizini için `700` veya `750` izni önerilir, sadece RustFS kullanıcısına veya yöneticilere erişim izni verin。
- **SELinux/AppArmor**: Eğer sistemde SELinux veya AppArmor etkinse, RustFS'in ikili dosyası ve veri yolu için uygun güvenlik politikalarını ayarlayın。Test için SELinux'u geçici olarak `Permissive` moduna ayarlayabilir veya `semanage fcontext` kullanarak kural ekleyebilirsiniz; Ubuntu'da AppArmor yapılandırma dosyasını değiştirerek erişime izin verebilirsiniz。Bu mekanizmaları anlamıyorsanız, geçici olarak kapatmayı düşünebilirsiniz, ancak güvenlik etkisini değerlendirin。
- **Systemd Servisi**: Eğer systemd kullanarak RustFS servisini yönetiyorsanız, servis birim dosyasında (`rustfs.service`) belirtilen `User=`, `ExecStart=` gibi öğelerin doğru olup olmadığını kontrol edin。Ortam değişkenlerinin (günlük yolu gibi) doğru ayarlandığından emin olun ve kararlılığı artırmak için otomatik yeniden başlatma stratejisini etkinleştirin。

## Diğer Dikkat Edilecek Noktalar

- **İzleme ve Günlük**: Katı dağıtım öncesi kontrol olmasa da, RustFS metriklerini toplamak için izleme sistemi (Prometheus + Grafana gibi) kurmanız ve yapılandırmanız önerilir。Aynı zamanda günlük dizininin yazılabilir olup olmadığını kontrol edin ve uygun günlük rotasyon stratejisi ayarlayın, günlük dosyalarının sınırsız büyümesini önlemek için。
- **Operasyon Araçları**: RustFS açık kaynak sürümü kendi CLI istemcisiyle gelebilir veya üçüncü taraf araçlarla uyumlu olabilir (AWS CLI, s3cmd gibi)。
- **Esnek Genişletme**: RustFS eklenti genişletmelerini ve çeşitli dağıtım modlarını destekler, iş ihtiyaçlarına göre esnek şekilde ayarlanabilir。Örneğin, daha sonra düğüm ekleyebilir veya disk kapasitesini artırabilirsiniz。Dağıtımda önce en basit temel yapılandırmayı kullanabilir, doğrulandıktan sonra gelişmiş özellikleri etkinleştirebilirsiniz。
- **Geri Alma Planı**: Gerçek dağıtımdan önce, **önceden doğrulayın** tam yapılandırma yedeği ve geri alma planı olup olmadığını。Ortamın gerçeklikle uyuşmadığı veya ciddi sorunlar yaşandığında, sistem durumunu hızlıca geri yükleyebilirsiniz。

Yukarıdaki kontrol listesi, RustFS'in yazılım seviyesinde dağıtımında dikkat edilmesi gereken ana yönleri kapsar。Operasyon personeli lütfen proje gereksinimleri ve ortam özelliklerine göre, gerçek durumla birleştirerek madde madde kontrol etsin, sunucuların koşulları karşıladığından ve gerektiği gibi yapılandırıldığından emin olun。Başarılı dağıtımdan sonra, RustFS **esnek ve özelleştirilebilir** özellikleriyle ve modern Linux sistemlerinde io_uring optimizasyonuyla, verimli ve güvenilir nesne depolama servisi sağlayacaktır。
