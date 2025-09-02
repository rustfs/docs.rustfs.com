---
title: "Windows/Linux Destekli Çıplak Metal ve Sanallaştırma Dağıtımı"
description: "Açık kaynak, S3 uyumlu, kurumsal güçlendirilmiş ve çok hızlı"
---

# Windows/Linux Destekli Çıplak Metal ve Sanallaştırma Dağıtımı

Açık kaynak, S3 uyumlu, kurumsal güçlendirilmiş ve çok hızlı.

RustFS, yüksek performanslı dağıtık nesne depolama sistemidir. Yazılım tanımlıdır, endüstri standardı donanımda çalışır ve %100 açık kaynaktır, ana lisans Apache V2.0 açık kaynak lisansıdır.

RustFS'in farkı, baştan itibaren özel bulut/hibrit bulut nesne depolama standardı olarak tasarlanmış olmasıdır. RustFS sadece nesne hizmet vermek için özel olarak inşa edildiği için, tek katmanlı mimari tüm gerekli işlevleri performansı etkilemeden gerçekleştirebilir. Sonuç, aynı zamanda yüksek performans, ölçeklenebilirlik ve hafiflik özelliklerine sahip bulut native nesne sunucusudur.

RustFS, ikincil depolama, felaket kurtarma ve arşivleme gibi geleneksel nesne depolama kullanım durumlarında mükemmel performans gösterirken, makine öğrenimi, analiz ve bulut native uygulama iş yükleriyle ilgili zorlukları aşmada benzersizdir.

## Temel Özellikler

### Silme Kodları

RustFS, mümkün olan en yüksek performansı sağlamak için her nesne için satır içi silme kodlaması kullanarak verileri korur. RustFS, Reed-Solomon kodlarını kullanarak nesneleri kullanıcı tarafından yapılandırılabilir yedeklilik seviyelerine sahip veri ve parite bloklarına şeritler. RustFS'in silme kodlaması nesne seviyesinde onarım gerçekleştirir ve birden fazla nesneyi bağımsız olarak onarabilir.

N/2 maksimum parite altında, RustFS'in uygulaması, dağıtımda sadece ((N/2)+1) operasyonel sürücü kullanarak kesintisiz okuma ve yazma işlemlerini garanti edebilir. Örneğin, 12 sürücü kurulumunda, RustFS nesneleri 6 veri sürücüsü ve 6 parite sürücüsü arasında parçalar ve dağıtımda sadece 7 sürücü kaldığında yeni nesneleri güvenilir bir şekilde yazabilir veya mevcut nesneleri yeniden oluşturabilir.

![Silme Kodları](./images/sec2-1.png)

### Bitrot Koruması

Sessiz veri bozulması veya bitrot, disk sürücülerinin karşılaştığı, kullanıcının bilgisi olmadan veri bozulmasına neden olan ciddi bir sorundur. Nedenler çeşitlidir (sürücü yaşlanması, akım zirveleri, disk firmware hataları, hayalet yazma, yanlış yönlendirilmiş okuma/yazma, sürücü hataları, beklenmedik üzerine yazma) ancak sonuç aynıdır - veri sızıntısı.

RustFS'in HighwayHash algoritmasının optimize edilmiş uygulaması, asla bozuk veri okumayacağını garanti eder - bozuk nesneleri anında yakalayabilir ve onarabilir. READ üzerinde hash hesaplayarak ve WRITE üzerinde uygulamadan, ağdan belleğe/sürücüye doğrulayarak, uçtan uca bütünlüğü sağlar. Uygulama hız için tasarlanmıştır ve Intel CPU'daki tek çekirdekte saniyede 10 GB'dan fazla hash hızı elde edebilir.

![Bitrot Koruması](./images/sec2-2.png)

### Sunucu Tarafı Şifreleme

Veriyi uçuşta şifrelemek bir şeydir; durağan veriyi korumak başka bir şeydir. RustFS, veriyi korumak için çeşitli gelişmiş sunucu tarafı şifreleme şemalarını destekler - veri nerede olursa olsun. RustFS'in yaklaşımı, gizlilik, bütünlük ve gerçekliği garanti eder, performans maliyeti ihmal edilebilir düzeydedir. AES-256-GCM, ChaCha20-Poly1305 ve AES-CBC ile sunucu tarafı ve istemci tarafı şifreleme desteği.

Şifrelenmiş nesneler, değişiklik koruması için AEAD sunucu tarafı şifreleme kullanır. Ayrıca, RustFS tüm yaygın anahtar yönetimi çözümleriyle (örneğin HashiCorp Vault) uyumludur ve test edilmiştir. RustFS, SSE-S3'ü desteklemek için anahtar yönetimi sistemi (KMS) kullanır.

Eğer istemci SSE-S3 isterse veya otomatik şifreleme etkinleştirilirse, RustFS sunucusu her nesneyi KMS tarafından yönetilen ana anahtar tarafından korunan benzersiz nesne anahtarı ile şifreler. Maliyet çok düşük olduğu için, her uygulama ve örnek için otomatik şifreleme etkinleştirilebilir.

![Sunucu Tarafı Şifreleme](./images/sec2-3.png)

### WORM (Bir Kez Yaz Çok Kez Oku)

#### Kimlik Yönetimi

RustFS, kimlik yönetimindeki en gelişmiş standartları destekler ve OpenID connect uyumlu sağlayıcılar ve ana harici IDP tedarikçileri ile entegre olabilir. Bu, erişimin merkezi olduğu, şifrelerin geçici ve döndürüldüğü, yapılandırma dosyalarında ve veritabanlarında saklanmadığı anlamına gelir. Ayrıca, erişim politikaları ince taneli ve yüksek düzeyde yapılandırılabilir, bu da çok kiracılı ve çok örnekli dağıtımları desteklemenin basit hale geldiği anlamına gelir.

#### Sürekli Çoğaltma

Geleneksel çoğaltma yöntemlerinin zorluğu, birkaç yüz TiB'nin üzerine etkili bir şekilde ölçeklenememeleridir. Bununla birlikte, herkesin felaket kurtarmayı desteklemek için bir çoğaltma stratejisine ihtiyacı vardır ve bu strateji coğrafi konumlar, veri merkezleri ve bulut genelinde uzanmalıdır.

RustFS'in sürekli çoğaltması, büyük ölçekli, veri merkezleri arası dağıtımlar için tasarlanmıştır. Lambda hesaplama bildirimlerini ve nesne metadata'sını kullanarak, deltaları verimli ve hızlı bir şekilde hesaplayabilir. Lambda bildirimleri, geleneksel toplu işlem modu yerine değişikliklerin anında yayılmasını sağlar.

Sürekli çoğaltma, bir hata meydana geldiğinde veri kaybının minimum seviyede tutulacağı anlamına gelir - yüksek dinamik veri setleriyle karşı karşıya olsa bile. Son olarak, RustFS'in yaptığı her şey gibi, sürekli çoğaltma çok tedarikçilidir, bu da yedekleme konumunuzun NAS'tan genel buluta kadar herhangi bir yer olabileceği anlamına gelir.

#### Küresel Federasyon

Modern işletmelerin verileri her yerde. RustFS, bu farklı örnekleri birleşik küresel ad alanı oluşturmak için bir araya getirmenize izin verir. Özellikle, herhangi bir sayıda RustFS sunucusu dağıtık mod setlerine birleştirilebilir, birden fazla dağıtık mod seti RustFS sunucu federasyonuna birleştirilebilir. Her RustFS sunucu federasyonu birleşik yönetici ve ad alanı sağlar.

RustFS federasyon sunucuları sınırsız sayıda dağıtık mod setini destekler. Bu yaklaşımın etkisi, nesne depolamanın coğrafi olarak dağınık büyük işletmeler için büyük ölçekte ölçeklenebilmesi, aynı zamanda tek bir konsoldan çeşitli uygulamaları (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) barındırma yeteneğini korumasıdır.

#### Çoklu Bulut Ağ Geçidi

Tüm işletmeler çoklu bulut stratejisi benimsiyor. Bu aynı zamanda özel bulutu da içerir. Bu nedenle, çıplak metal sanallaştırma container'larınız ve genel bulut hizmetleriniz (Google, Microsoft ve Alibaba gibi S3 olmayan tedarikçiler dahil) aynı görünmelidir. Modern uygulamalar yüksek düzeyde taşınabilir olsa da, bu uygulamaları destekleyen veri öyle değildir.

Veri nerede olursa olsun, bu veriyi sağlamak RustFS'in çözdüğü ana zorluktur. RustFS çıplak metalde, ağa bağlı depolamada ve her genel bulutta çalışır. Daha da önemlisi, RustFS, Amazon S3 API aracılığıyla uygulama ve yönetim açısından bu verinin görünümünün tamamen aynı görünmesini sağlar.

RustFS daha da ileri gidebilir, mevcut depolama altyapınızı Amazon S3 ile uyumlu hale getirir. Etkisi derindir. Artık organizasyonlar veri altyapılarını gerçekten birleştirebilir - dosyalardan bloklara, tüm veri migrasyon olmadan Amazon S3 API aracılığıyla erişilebilir nesneler olarak görünür.

WORM etkinleştirildiğinde, RustFS nesne verilerini ve metadata'sını değiştirebilecek tüm API'leri devre dışı bırakır. Bu, verinin bir kez yazıldıktan sonra değişiklik korumalı hale geldiği anlamına gelir. Bu, birçok farklı düzenleyici gereksinimde pratik uygulamaya sahiptir.

![WORM Özelliği](./images/sec2-4.png)

## Sistem Mimarisi

RustFS bulut native olarak tasarlanmıştır ve Kubernetes gibi harici orkestrasyon hizmetleri tarafından yönetilen hafif container'lar olarak çalışabilir. Tüm sunucu yaklaşık 40 MB'lık statik bir binary dosyadır ve yüksek yük altında bile CPU ve bellek kaynaklarını verimli bir şekilde kullanır. Sonuç olarak, paylaşılan donanımda çok sayıda kiracıyı birlikte barındırabilirsiniz.

RustFS, yerel bağlı sürücüleri (JBOD/JBOF) olan ticari sunucularda çalışır. Kümedeki tüm sunucular işlevsel olarak eşittir (tamamen simetrik mimari). Ad düğümü veya metadata sunucusu yoktur.

RustFS veri ve metadata'yı metadata veritabanı olmadan nesneler olarak birlikte yazar. Ayrıca, RustFS tüm işlevleri (silme kodlama, bitrot kontrolü, şifreleme) satır içi, katı tutarlı işlemler olarak gerçekleştirir. Sonuç olarak, RustFS olağanüstü esnekliğe sahiptir.

Her RustFS kümesi, her düğümde bir işlem olan dağıtık RustFS sunucularının bir koleksiyonudur. RustFS kullanıcı alanında tek bir işlem olarak çalışır ve yüksek eşzamanlılık için hafif coroutine'ler kullanır. Sürücüler silme kodları setlerine gruplandırılır (varsayılan olarak her set 16 sürücü) ve nesneleri bu setlere yerleştirmek için deterministik hash algoritması kullanılır.

RustFS, büyük ölçekli, çoklu veri merkezi bulut depolama hizmetleri için tasarlanmıştır. Her kiracı kendi RustFS kümesini çalıştırır ve diğer kiracılardan tamamen izole edilir, bu da onları yükseltmeler, güncellemeler ve güvenlik olaylarından kaynaklanan herhangi bir kesintiden korumalarını sağlar. Her kiracı, coğrafi konumlar genelinde federasyon kümeleri aracılığıyla bağımsız olarak ölçeklenir.
