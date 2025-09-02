---
title: "Hibrit/Çoklu Bulut Nesne Depolama"
description: "Hibrit ve çoklu bulut mimarisi ile tutarlı performans, güvenlik ve ekonomiklik"
---

# Hibrit/Çoklu Bulut Nesne Depolama

Hibrit/çoklu bulut mimarisi, tutarlı performans, güvenlik ve ekonomiklik sağlar. Çoklu bulut hakkındaki herhangi bir tartışma bir tanımla başlamalıdır. Bu sadece tek bir genel bulut ve şirket içi değildir.

## Başarılı çoklu bulut depolama stratejisi, çeşitli ortamlarda çalışabilen mimari ve araçları kullanır

### Genel Bulut

Bu giderek büyüyen bir alandır, ancak AWS, Azure, GCP, IBM, Alibaba, Tencent ve hükümet bulutları ile başlar. Hibrit/çoklu bulut depolama yazılımınızın, uygulama yığınının çalıştığı her yerde çalışması gerekir. Tek bir bulutta çalıştığını iddia eden şirketler bile yapmaz - her zaman başka bulutlar vardır. RustFS, her genel bulut sağlayıcısı için depolama tutarlılığı sağlar, yeni bulutlara genişlerken uygulamaları yeniden yazma ihtiyacını önler.

### Özel Bulut

Kubernetes, modern özel bulutun ana yazılım mimarisidir. Bu, VMware (Tanzu), RedHat (OpenShift), Rancher/SUSE, HP (Ezmeral) ve Rafay gibi tüm Kubernetes dağıtımlarını içerir. Çoklu bulut Kubernetes, yazılım tanımlı ve bulut native nesne depolama gerektirir. Özel bulut ayrıca daha geleneksel çıplak metal örneklerini de içerir, ancak kurumsal iş yükleri giderek containerize edilir ve orkestrasyon yapılır.

### Kenar

Kenar, hesaplamayı veri üretilen yere taşımakla ilgilidir. İşlendikten sonra, veri daha merkezi konumlara taşınır. Kenar depolama çözümleri, bu çoklu bulut mimarisinde çalışmak için hafif, güçlü, bulut native ve esnek olmalıdır. Bunu yapmak çok zordur, bu yüzden çok az tedarikçi bunu tartışır, iyi bir cevapları yoktur - Amazon bile.

## RustFS ile Çoklu Bulut Mimarisi

![Çoklu Bulut Mimarisi](images/multi-cloud-architecture.png)

## Hibrit/Çoklu Bulut Depolama Özellikleri

Çoklu bulut depolama, genel bulut sağlayıcılarının tutarlı bir şekilde benimsediği genel bulut tarafından kurulan modelleri takip eder. Genel bulutun başarısı, dosya ve blok depolamayı etkili bir şekilde eski hale getirdi. Her yeni uygulama POSIX için değil, AWS S3 API için yazılmıştır. Bulut native teknolojiler gibi ölçeklenmek ve performans göstermek için, eski uygulamalar S3 API için yeniden yazılmalı ve container uyumlu olacak şekilde mikro hizmetlere yeniden yapılandırılmalıdır.

### Kubernetes-Native

Kubernetes native tasarım, çok kiracılı nesne depolama hizmeti altyapısını yapılandırmak ve yönetmek için operatör hizmetleri gerektirir. Bu kiracıların her biri, temel donanım kaynaklarını paylaşırken kendi bağımsız ad alanlarında çalışır. Operatör modeli, kaynak orkestrasyonu, kesintisiz yükseltme, küme genişletme gibi yaygın işlemleri gerçekleştirmek ve yüksek kullanılabilirliği korumak için Kubernetes'in tanıdık deklaratif API modelini özel kaynak tanımları (CRD) ile genişletir.

RustFS, Kubernetes mimarisinden tam olarak yararlanmak için inşa edilmiştir. Sunucu binary dosyası hızlı ve hafif olduğu için, RustFS Operator birden fazla kiracıyı kaynakları tüketmeden yoğun bir şekilde birlikte yerleştirebilir. Kubernetes ve ilgili ekosistemin avantajlarından yararlanarak, taşınabilir Kubernetes native depolama ile çoklu bulut avantajları elde edin.

### Tutarlı

Hibrit/çoklu bulut depolama, API uyumluluğu, performans, güvenlik ve uyumluluk açısından tutarlı olmalıdır. Tutarlı ve temel donanımdan bağımsız olarak çalışması gerekir. Herhangi bir değişiklik, çok küçük olsa bile, uygulamaları bozabilir ve büyük operasyonel yük yaratabilir.

RustFS çok hafif olduğu için, genel, özel ve kenar ortamlarında tutarlı deneyimi koruyarak dakikalar içinde kesintisiz güncellemeler yapabiliriz. RustFS, anahtar yönetimi, kimlik yönetimi, erişim politikaları ve donanım/işletim sistemi farklılıkları dahil olmak üzere bu mimariler arasındaki temel farklılıkları soyutlar.

### Performans

Nesne depolama hem birincil hem de ikincil depolama olarak kullanıldığından, büyük ölçekte performans sağlaması gerekir. Mobil/web uygulamalarından AI/ML'ye kadar, veri yoğun iş yükleri temel nesne depolamanın mükemmel performansına ihtiyaç duyar. Hatta veri koruma iş yükleri bile yüksek performanslı yinelenen veri eliminasyonu ve anlık görüntü erişimi gerektirir. Hiçbir işletme yavaş kurtarma süreçlerini göze alamaz. Geleneksel olarak, bu iş yükleri çıplak metal performansı gerektirir. Artık, tüm bu iş yükleri containerize edilebilir - genel bulut sağlayıcılarının başarısının kanıtladığı gibi.

RustFS, dünyanın en hızlı nesne depolama sistemidir, NVMe için okuma/yazma hızları sırasıyla 325 GiB/s ve 171 GiB/s, HDD için okuma/yazma hızları sırasıyla 11 GiB/s ve 9 GiB/s'dir. Bu hızlarda, her iş yükü herhangi bir çoklu bulut mimarisinde, herhangi bir altyapıda çalışabilir.

### Ölçeklenebilir

Birçok kişi ölçeğin sadece sistemin ne kadar büyük olabileceği anlamına geldiğini düşünür. Ancak bu düşünce, ortam geliştikçe operasyonel verimliliğin önemini göz ardı eder. Temel altyapı ne olursa olsun, çoklu bulut nesne depolama çözümü verimli, şeffaf bir şekilde ölçeklenmelidir ve sadece minimal insan etkileşimi ve maksimum otomasyon ile gerçekleştirilmelidir. Bu sadece basit mimari üzerine inşa edilmiş API odaklı platform ile mümkündür.

RustFS'in basitliğe olan kararlı odaklanması, büyük ölçekli, çoklu PB veri altyapısının minimal insan kaynağı ile yönetilebileceği anlamına gelir. Bu API ve otomasyonun işlevidir ve üzerinde ölçeklenebilir çoklu bulut depolama oluşturulabilecek bir ortam yaratır.

### Yazılım Tanımlı

Çoklu bulutta başarılı olmanın tek yolu yazılım tanımlı depolama kullanmaktır. Neden basit. Donanım cihazları genel bulutta veya Kubernetes'te çalışmaz. Genel bulut depolama hizmeti ürünleri, diğer genel bulut, özel bulut veya Kubernetes platformlarında çalışmak için tasarlanmamıştır. Bunu yapsalar bile, bant genişliği maliyeti depolama maliyetinden daha yüksek olur çünkü ağ genelinde kopyalamak için geliştirilmemişlerdir. Kuşkusuz, yazılım tanımlı depolama genel bulut, özel bulut ve kenarda çalışabilir.

RustFS yazılımda doğmuştur ve çeşitli işletim sistemleri ve donanım mimarileri genelinde taşınabilir. Kanıt, AWS, GCP ve Azure genelinde çalışan 2M+ IP'mizde bulunabilir.
