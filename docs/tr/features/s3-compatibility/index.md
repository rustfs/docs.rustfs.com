# Amazon S3 Uyumluluğu

S3 uyumluluğu, bulut yerel uygulamalar için zorunlu bir gereksinimdir. RustFS, API kullanımına sıkı sıkıya bağlı kalır ve on binlerce kullanıcıya sahiptir, bunlar arasında ticari kullanıcılar ve topluluk üyeleri de bulunmaktadır. RustFS'in S3 uygulamasının, AWS S3'e en yaygın test edilmiş ve dağıtılmış alternatif olduğu kabul edilir.

## RustFS ve S3 API - Çoklu Bulut Depolama İçin Tasarlanmıştır

RustFS, başından beri AWS S3 uyumluluğu için standart olarak kabul edilmiştir. S3 API'sinin (V2 ve V4) en erken benimseyenlerinden biri ve yalnızca S3'e odaklanan birkaç depolama şirketinden biri olarak, RustFS'in büyük topluluğu sayesinde hiçbir AWS alternatifinin daha uyumlu olmadığını garanti eder. S3 API, bulutta bir de facto standart haline gelmiştir, bu nedenle AWS alternatifleri, farklı ortamlarda (genel bulut, özel bulut, veri merkezi, çoklu bulut, hibrit bulut ve kenar) çalışmak ve birlikte çalışmak için bu API'yi akıcı bir şekilde kullanabilmelidir.

## S3, Hibrit ve Çoklu Bulut Bilgi İşlemi Sağlar

Çoklu bulut ve hibrit bulut uyumluluğunu elde etmenin tek yolu S3'tür. RESTful API standardı olarak, S3, uygulamalar, veri ve altyapı arasındaki etkileşimleri devrimleştirmiştir. Ayrıca, konteynerleştirme ve Kubernetes orkestrasyonunun da RESTful API'ler etrafında inşa edilmesi, POSIX API'lerini eski statüye indirmiştir.

Sonuç olarak, Kubernetes yerel, S3 uyumlu nesne depolama ve uygulamalar her yerde çalışabilir - çeşitli genel bulut örneklerinde (RustFS, Google, Azure ve AWS üzerinde neredeyse 1 milyon dağıtım), özel bulutlarda (Red Hat OpenShift, VMware Tanzu) ve çıplak metal üzerinde. Gelişmiş S3 API odaklı ILM teknolojisini kullanarak, işletmeler bulut ve yerel örnekler arasında operasyonel olarak optimize edilmiş örnekler gerçekleştirebilir.

Microsoft Azure için S3 dönüştürme katmanlarına ilgi duyan müşteriler, Azure Marketplace'den RustFS Blob Depolama Ağ Geçidini (S3 API) satın alabilirler.

## Çıplak Metal İş Yükleri İçin S3 Uyumluluğu

Özel bulut, herhangi bir hibrit bulut mimarisinin temel yapı taşlarından biridir. Bu, genel bulutlarda olduğu gibi, uygulama türünden bağımsız olarak (analitikten eserlere ve arşivlemeye kadar) S3 uyumluluğunun kritik olduğunu gösterir.

RustFS ile S3 uyumluluğu tamamen konumdan bağımsızdır. Bu, RustFS'in çıplak metal yerel örneklerinin, genel bulut örnekleri veya hatta kenar örnekleri ile tamamen aynı S3 uyumluluğuna ve performansına sahip olduğu anlamına gelir.

## RustFS Ölçeklenebilir Nesne Depolamanın Avantajları

Bulut yerel uygulamalar, nesne depolama ile iletişim kurmak için S3 API'sini kullanır. Ancak tüm S3 uyumluluğu aynı değildir - birçok nesne depolama satıcısı yalnızca genel işlevselliğin küçük bir alt kümesini destekler - bu da uygulama hatalarına neden olabilir. Diğerleri kapsamlı kapsama iddiasında bulunur, ancak bu iddialar, yalnızca küçük bir bölümün test edildiği özel yazılım veya cihaz modelleri tarafından sınırlandırılır.

RustFS'in benzersizliği, S3 uyumluluk iddialarını destekleme yeteneğinde yatar. On binlerce müşteriye ve açık kaynak kullanıcısına sahibiz ve S3 API uyumluluğumuz, milyonlarca donanım, yazılım ve uygulama kombinasyonunu kapsayan dünyada en yaygın test edilmiş ve uygulanmıştır. RustFS, haftalık olarak yazılım yayınlar ve S3 API'sindeki herhangi bir kusur hemen topluluk tarafından bildirilir ve RustFS tarafından düzeltilir.

Hatta Amazon'un üçüncü taraf S3 uyumluluğunu test etmek için RustFS kullandığına dair söylentiler vardır.

S3 API'si için en kapsamlı destek, uygulamaların verileri RustFS üzerinde herhangi bir donanımda, herhangi bir konumda ve herhangi bir bulutta depolayabilmesini sağlar. Geliştiriciler, RustFS'in sürümleri hiçbir zaman bozmayacağına güvenerek yenilik yapabilir ve yineleyebilirler.

## Temel Özellikler

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select, karmaşık sorgular için büyük ölçekli performansa dayanır ve RustFS performans özellikleri API'yi tam olarak kullanabilir. RustFS, performansı çip düzeyinde optimize etmek için SIMD talimat setlerini kullanır ve CSV, Parquet, JSON ve daha fazlası üzerinde büyük, karmaşık S3 Select sorgularını çalıştırabilir.

### Amazon İmza V4

![Amazon İmza V4](images/s1-5.png)

Uygulamalar ve istemciler, herhangi bir RustFS yönetim API'sine erişmek için kimlik doğrulaması yapmalıdır. RustFS, AWS İmza Sürüm 4'ü destekleyen ilk şirketti (eski İmza Sürüm 2'yi de destekler). Kimlik doğrulamasından sonra, RustFS, işlemleri yetkilendirmek için AWS IAM politika sözdizimi, yapısı ve davranışıyla uyumlu politika tabanlı erişim kontrolü kullanır.

## AWS S3 API ve RustFS

RustFS, dünyanın en hızlı nesne depolama sistemidir. S3 uyumluluğu ile birleştirildiğinde, endüstrinin en geniş kullanım durumları setini çalıştırabilmesini sağlar. Bu, kod havuzları için GitHub ve GitLab gibi modern uygulama iş yüklerini, MongoDB, ClickHouse, MariaDB, CockroachDB ve Teradata gibi modern analiz iş yüklerini ve geleneksel arşivleme, yedekleme ve felaket kurtarma kullanım durumlarını içerir.

RustFS'in performans özellikleri, S3 uyumluluğu ile birleştirildiğinde, onu AI/ML ve veri bilimi iş yükleri için standart haline getirir. KubeFlow ve TensorFlow, yüksek performanslı S3 uyumlu nesne depolamaya ihtiyaç duyar ve giderek daha fazla RustFS için, ardından AWS veya diğer bulutlar için tasarlanır. RustFS, gerçekten çoklu bulut nesne depolama ve uygulamalar için verimli çoğaltma sağlar. S3 API'si için yazılmış uygulamalar her yerde çalışabilir, böylece geliştiriciler en iyi bulut araçları mevcut olduğunda hızlı bir şekilde yenilik yapabilirler.