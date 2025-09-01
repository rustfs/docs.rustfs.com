---
title: "Yazılım Kontrol Listesi"
description: "Bu makale temelde RustFS kurulumu sırasında çevre yazılımlarının dikkat edilmesi gereken hususları, işletim sistemi, binary paketleri vb. konuları anlatır."
---

# RustFS Yazılım Dağıtımı Kontrol Listesi

RustFS yüksek performanslı dağıtık nesne depolamadır, %100 S3 protokolü uyumludur, Apache 2.0 açık kaynak lisansı kullanır ([RustFS nedir?](https://rustfs.com/docs/#:~:text=RustFS%E6%98%AF%E4%B8%80%E7%A7%8D%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%EF%BC%8C%E4%BD%BF%E7%94%A8Apache2%20%E8%AE%B8%E5%8F%AF%E8%AF%81%E5%8F%91%E8%A1%8C%E7%9A%84%E5%BC%80%E6%BA%90%E5%88%86%E5%B8%83%E5%BC%8F%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8%E3%80%82)). Rust dili ile geliştirilmiş, bellek güvenliği özelliklerine sahiptir, çeşitli platformlarda çalışabilir (Linux, Windows, MacOS dahil, x86/ARM gibi mimarileri destekler, esnek dağıtım ve özelleştirilebilir (özel plugin genişletme desteği)). Üretim ortamı dağıtımının kararlı ve güvenilir olmasını sağlamak için, aşağıda bazı gerekli kontrol maddeleri listelenmiştir. Lütfen operasyon ekibinin arkadaşları **önce onaylasın** aşağıdaki ayarların yerinde olup olmadığını:

## Sistem Gereksinimleri

- **İşletim Sistemi**: Uzun vadeli destek sürümü Linux kullanmanızı öneririz (Ubuntu 20.04+/22.04, RHEL 8/9 gibi), çekirdek sürümü tercihen 5.x veya daha yüksek olmalı. RustFS Linux 5.x+ çekirdeğinde `io_uring` asenkron I/O optimizasyonunu kullanabilir, daha iyi throughput performansı getirir.
- **CPU & Bellek**: x86_64, ARM gibi ana akım CPU mimarilerini destekler. Test ortamı en az 2 GB bellek, üretim ortamı en az 64 GB bellek önerilir ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). **Unutmayın** veri ölçeği ve eş zamanlı tahminlere göre gerekli belleği öngörün, bellek yetersizliğinin performans darboğazına neden olmasını önleyin.
- **Müdahale Eden Hizmetleri Devre Dışı Bırak**: Performansı garantilemek için, dosya sistemini tarayan/denetleyen hizmetleri kapatmayı veya yok saymayı öneririz (`mlocate`, `plocate`, `updatedb`, `auditd`, antivirüs yazılımları vb.), bu hizmetler RustFS'in disk I/O'su ile çakışabilir. Kapatılamıyorsa, RustFS veri yollarını hariç tutmalı, taramanın performansı etkilemesini önlemelisiniz.

RustFS'i Linux 5.x veya daha yüksek sürüm çekirdek üzerinde, özellikle 5.10+ sürümde çalıştırmanızı şiddetle öneririz.
Neden?

Çünkü RustFS alt seviye I/O modelinde öncelikle Linux'un **io_uring** teknolojisini kullanır, io_uring Linux 5.1'den başlayarak tanıtıldı ve 5.10+ sürümlerinde daha olgun ve kararlı hale geldi. Geleneksel epoll veya thread pool'a kıyasla, io_uring daha verimli, düşük gecikme süreli asenkron I/O kabiliyeti sağlar, yüksek eş zamanlı nesne depolama senaryolarına çok uygundur.

### Öneriler:

- Ana akım kurumsal dağıtımlarda 5.x çekirdeği olan sürümleri kullanın, örneğin:
 - Ubuntu 20.04 LTS (5.15+ almak için HWE çekirdeği kurabilir)
 - Ubuntu 22.04 LTS (varsayılan 5.15+)
 - CentOS Stream 9 / RHEL 9
 - Debian 12 (varsayılan 6.x, daha güçlü)

- Hala eski çekirdek (4.x gibi) kullanıyorsanız, RustFS'in performans avantajlarından tam faydalanmak için yükseltme yapmayı veya özel çekirdek destekleyen dağıtımları kullanmayı öneririz.

## Binary Paket Doğrulama ve Dağıtım

- **Resmi İndirme**: RustFS resmi kanallarından (resmi web sitesi veya resmi mirror gibi) sunucu binary paketini indirmeyi kesinlikle unutmayın, değiştirilmemesi için bilinmeyen kaynaklardan yazılım paketleri kullanmayın.
- **Bütünlük Kontrolü**: İndirdikten sonra **unutmayın** binary paket bütünlüğünü kontrol edin. Genellikle resmi olarak sağlanan SHA256 checksum veya imza dosyaları olacaktır, dosyanın bozuk veya değiştirilmemiş olduğunu garanti etmek için `sha256sum` veya imza doğrulama araçları kullanabilirsiniz.
- **Tutarlılık**: Dağıtık dağıtım ise, tüm düğümlerin aynı RustFS binary sürümünü kullandığından emin olun, aksi takdirde sürüm farklılıkları nedeniyle uyumluluk sorunlarına neden olabilir.
- **Kurulum Konumu**: Yönetimi kolaylaştırmak için, binary'yi global çalıştırma yoluna (örneğin `/usr/local/bin`) taşıyabilir ve çalıştırılabilir izin verebilirsiniz (`chmod +x`). systemd ile hizmeti yönetiyorsanız, service dosyasındaki yolun doğru olduğunu onaylamanız gerekir.

## Dosya Sistemi ve Disk Düzeni

- **Veri Diski Özel**: RustFS depolama diskine özel erişim gerektirir, sistem diski veya diğer uygulama verileri ile RustFS verisini karıştırmayın. İşletim sistemi ve RustFS verisi için ayrı diskler veya bölümler kullanmanızı öneririz; **önce onaylayın** veri diski mount noktasının doğru olup olmadığını.
- **Dosya Sistemi Türü**: Olgun ve performansı iyi dosya sistemleri kullanmanızı öneririz, XFS veya Ext4 gibi, mount ederken performans seçenekleri ekleyin (örneğin `noatime,nodiratime,nobarrier` gibi, gerçek duruma göre ayarlayın). Bu gereksiz I/O yükünü azaltabilir, throughput'u artırabilir.
- **Disk Yapılandırması**: Birden fazla disk kullanıyorsanız, genellikle bağımsız hacimler (JBOD) olarak yapılandırmanızı öneririz, RustFS'in kendisinin erasure code gibi mekanizmalar yoluyla veri güvenilirliğini garanti etmesini sağlayın, donanım RAID'e bağımlı kalmayın, depolama kapasitesini daha esnek şekilde genişletin.
- **Mount Seçenekleri ve İzinleri**: Mount parametrelerini kontrol edin, RustFS hizmet çalıştırma kullanıcısının veri dizini üzerinde okuma-yazma iznine sahip olduğundan emin olun. `/etc/fstab`'a `noexec`, `nodev` gibi güvenlik seçenekleri ekleyebilir, aynı zamanda RustFS sürecinin erişim iznine sahip olduğunu garanti edebilirsiniz.

## Sistem Bağımlılık Kontrolü

- **Zaman Senkronizasyonu**: Çok düğümlü dağıtımda, **kesinlikle unutmayın** zaman senkronizasyonu. Tüm düğümlerin sistem zamanı tutarlı olmalı (`ntp`, `chrony`, `timedatectl` gibi araçlar kullanarak zaman senkronizasyonu), aksi takdirde küme başlatma veya veri tutarlılığı anormalliklerine neden olabilir ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). `timedatectl status` çıktısının "`synchronized`" olup olmadığını kontrol edin ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)).
- **Host Adı ve DNS**: Her düğüm için **sürekli host adları** yapılandırın ve bu host adlarının doğru IP'ye çözümlenebildiğinden emin olun. DNS veya `/etc/hosts` kullanarak yapılandırabilirsiniz ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=2)). Örneğin `/etc/hosts`'ta her düğüm için sabit IP ve karşılık gelen host adı yapılandırın, DNS sorunları nedeniyle düğüm bağlantısının başarısız olmasını önleyin.
- **Ağ Bağlantısı**: Kümedeki düğümler arasındaki ağ bağlantısını doğrulayın. **Önce onaylayın** ağ bloke edilmemiş, normal şekilde birbirini ping'leyebiliyor ve RustFS'in varsayılan dinlediği port (genellikle 9000) tüm düğümler arasında açık ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Firewall etkinleştirdiyseniz, lütfen RustFS portunu açın; `firewall-cmd` kullanarak `--add-port=9000/tcp` kalıcı kuralı ekleyebilirsiniz ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E6%88%96%E8%80%85%E6%94%BE%E8%A1%8CRustFS%E7%9A%849000%E7%AB%AF%E5%8F%A3%EF%BC%9A)). Dağıtım sırasında tüm düğümler aynı port numarasını kullanmalı.
- **TLS/Sertifika**: HTTPS erişimi etkinleştirmeyi planlıyorsanız, sistemde kök sertifikaların kurulu olup olmadığını kontrol edin (`/etc/ssl/certs/ca-bundle.crt` gibi) ve sunucu TLS sertifikası ile özel anahtar dosyalarını hazırlayın. RustFS yapılandırma dosyasında sertifika yolunu doğru şekilde belirtin, düğümler arası ve istemci bağlantısının şifrelenmiş iletişiminin normal olmasını sağlayın.
- **Bağımlılık Yazılım Paketleri**: Kullanılan Linux dağıtımına gerekli bağımlılıkların kurulu olduğunu onaylayın, örneğin yaygın GNU araç zinciri (`bash`, `glibc` vb.) ve şifreleme kütüphaneleri (`openssl`/`gnutls` vb.). Farklı dağıtımlarda bazı paketler eksik olabilir, gerçek dokümantasyon veya hata ipuçlarına göre gerekli kütüphaneleri kurun.

## Çalıştırma Kullanıcısı ve Güvenlik Bağlamı

- **Özel Çalıştırma Kullanıcısı**: RustFS için bir **özel kullanıcı** oluşturmanızı öneririz (`rustfs-user` gibi) hizmeti çalıştırmak için ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)). Bu kullanıcının Shell giriş iznine ihtiyacı yoktur, ancak RustFS veri dizini üzerinde sahip izinlerine sahip olmalıdır. `groupadd`/`useradd` kullanarak kullanıcı grubu ve kullanıcı oluşturun, `chown` kullanarak veri dizininin sahiplik hakkını bu kullanıcıya verin ([Linux RustFS Kurulumu](https://rustfs.com/docs/install/linux/#:~:text=%E4%B8%89%E3%80%81%E9%85%8D%E7%BD%AE%E7%94%A8%E6%88%B7%E5%90%8D)).
- **Dosya İzinleri**: RustFS binary ve tüm yapılandırma dosyalarının çalıştırma kullanıcısı için okunabilir-yazılabilir olduğundan emin olun, diğer kullanıcılarla ilgisiz dizinlerin erişim izinlerini sınırlayın. Örneğin binary'yi `/usr/local/bin`'e koyup `755` izni ayarlayın, sadece çalıştırma kullanıcısının değiştirebilmesini sağlayın. Veri dizini izinlerini `700` veya `750` öneririz, sadece RustFS kullanıcısı veya yöneticinin erişmesine izin verin.
- **SELinux/AppArmor**: Sistem SELinux veya AppArmor etkinleştirdiyse, RustFS binary ve veri yolları için ilgili güvenlik politikalarını ayarlayın. Test için SELinux'u geçici olarak `Permissive` moduna ayarlayabilir veya `semanage fcontext` kullanarak kurallar ekleyebilirsiniz; Ubuntu'da AppArmor yapılandırma dosyasını değiştirerek erişime izin verebilirsiniz. Bu mekanizmaları bilmiyorsanız, geçici olarak kapatmayı düşünebilirsiniz, ancak güvenlik etkilerini değerlendirin.
- **Systemd Hizmeti**: RustFS hizmetini systemd ile yönetiyorsanız, hizmet birim dosyasında (`rustfs.service`) belirtilen `User=`, `ExecStart=` gibi öğelerin doğru olup olmadığını kontrol edin. Ortam değişkenlerinin (log yolu gibi) doğru ayarlandığından emin olun ve kararlılığı artırmak için otomatik yeniden başlatma politikası etkinleştirin.

## Diğer Dikkat Edilecek Hususlar

- **İzleme ve Log**: Dağıtım öncesi sıkı kontrolü olmasa da, RustFS metriklerini toplamak için izleme sistemi (Prometheus + Grafana gibi) kurma ve yapılandırmayı öneririz. Aynı zamanda log dizininin yazılabilir olup olmadığını kontrol edin ve log dosyalarının sınırsız büyümesini önlemek için uygun log rotasyon politikası ayarlayın.
- **Operasyon Araçları**: RustFS açık kaynak sürümü CLI istemcisi içerebilir veya üçüncü taraf araçlarla (AWS CLI, s3cmd gibi) uyumlu olabilir.
- **Esnek Genişletme**: RustFS plugin genişletme ve çoklu dağıtım modlarını destekler, iş gereksinimlerine göre esnek ayarlama yapabilirsiniz. Örneğin, sonradan düğüm ekleme veya disk genişletme yapılabilir. Dağıtım sırasında önce en basit temel yapılandırmayı kullanabilir, hatasız doğruladıktan sonra gelişmiş özellikleri etkinleştirebilirsiniz.
- **Geri Alma Planı**: Gerçek dağıtımdan önce, **önce onaylayın** tam yapılandırma yedekleme ve geri alma planının olup olmadığını. Ortamın gerçek durumla uyumsuz olduğu tespit edildiğinde veya ciddi sorunlar çıktığında, sistem durumunu hızlı şekilde kurtarabilirsiniz.

Yukarıdaki kontrol listesi RustFS yazılım seviyesinde dağıtım sırasında dikkat edilmesi gereken temel yönleri kapsar. Lütfen operasyon personeli proje gereksinimleri ve ortam özelliklerine göre, gerçek durumla birleştirerek madde madde kontrol yapın, sunucunun koşulları karşıladığından ve gereksinimlere göre yapılandırıldığından emin olun. Başarılı dağıtımdan sonra, RustFS **esnek özelleştirilebilir** özellikleri ve modern Linux sistemlerinde io_uring optimizasyonu ile verimli güvenilir nesne depolama hizmeti sağlayacaktır.