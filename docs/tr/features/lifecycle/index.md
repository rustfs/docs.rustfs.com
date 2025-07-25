# Veri Yaşam Döngüsü Yönetimi ve Katmanlandırma

Veri büyümeye devam ettikçe, erişim, güvenlik ve ekonomi için işbirliği içinde optimize etme yeteneği, bir "güzel olma" durumundan çok zorunlu bir gereksinim haline gelir. İşte burada yaşam döngüsü veri yönetimi devreye girer. RustFS, genel ve özel bulutlar dahil olmak üzere bulutlar içinde ve arasında verileri korumak için benzersiz bir özellik seti sunar. RustFS'nin kurumsal veri yaşam döngüsü yönetimi araçları, sürüm oluşturma, nesne kilitleme ve çeşitli türev bileşenler dahil olmak üzere birçok kullanım durumunu karşılar.

## Nesne Süresi Dolması

Verilerin sonsuza kadar var olması gerekmez: RustFS yaşam döngüsü yönetimi araçları, verilerin silinmeden önce diskte ne kadar kalacağını tanımlamanıza olanak tanır. Kullanıcılar, RustFS'nin nesneleri silmeye başlamadan önce süre uzunluğunu belirli bir tarih veya gün sayısı olarak tanımlar.

Yaşam döngüsü yönetimi kuralları, kova başına oluşturulur ve nesne ve etiket filtrelerinin herhangi bir kombinasyonu kullanılarak yapılandırılabilir. Tüm kova için süre sonu kuralları ayarlamak için filtre belirtmeyin veya daha karmaşık süre sonu davranışı oluşturmak için birden fazla kural belirtin.

RustFS nesne süre sonu kuralları ayrıca sürümlü kovlara da uygulanır ve bazı sürümlemeye özgü varyasyonlarla gelir. Örneğin, nesnelerin mevcut olmayan sürümleri için süre sonu kuralları belirtip, uzun vadeli depolama maliyetlerini üstlenmeden nesne sürümlemenin avantajlarını en üst düzeye çıkarabilirsiniz. Benzer şekilde, kalan tek sürümü bir silme işareti olan nesneleri silmek için yaşam döngüsü yönetimi kuralları oluşturabilirsiniz.

Kova süre sonu kuralları, RustFS WORM kilitleme ve yasal tutma işlemleriyle tamamen uyumludur - kilitli durumdaki nesneler, kilit süresi dolana veya açıkça serbest bırakılana kadar diskte kalır. Nesneler artık kilitler tarafından kısıtlanmadığında, RustFS normal olarak süre sonu kurallarını uygulamaya başlar.

RustFS nesne süre sonu yaşam döngüsü yönetimi kuralları, işlevsel ve sentaktik olarak AWS Yaşam Döngüsü Yönetimi ile uyumludur. RustFS ayrıca JSON formatında mevcut kuralları içe aktarmayı destekler, bu da mevcut AWS süre sonu kurallarını geçirmeyi kolaylaştırır.

## Politika Tabanlı Nesne Katmanlandırma

RustFS, nesne depolama katmanlandırma için programlı olarak yapılandırılabilir, böylece nesneler, zaman ve erişim sıklığı gibi birçok değişkene dayanarak bir durumdan veya sınıftan diğerine geçiş yapar. Bu özellik, katmanlandırma bağlamında en iyi anlaşılır. Katmanlandırma, kullanıcıların değişen veri erişim kalıplarına yanıt olarak depolama maliyetlerini veya işlevselliğini optimize etmesine olanak tanır. Katmanlı veri depolama genellikle aşağıdaki senaryolarda kullanılır:

## Depolama Ortamları Arasında

Çapraz depolama ortamı katmanlandırma, en iyi bilinen ve en basit katmanlandırma kullanım durumudur. Burada RustFS, altta yatan ortamı soyutlar ve performans ve maliyet için işbirliği içinde optimize eder. Örneğin, performans veya çevrimiçi iş yükleri için veri NVMe veya SSD'de depolanabilir, ancak bir süre sonra HDD ortamına katmanlandırılabilir veya performans ölçeklendirme değerine sahip iş yükleri için. Zamanla, uygun görülürse, bu veri daha uzun süreli depolamaya daha da taşınabilir.

![Çapraz Depolama Ortamı Katmanlandırma](images/s9-2.png)

## Bulut Türleri Arasında

Hızla ortaya çıkan bir kullanım durumu, özel bulutlar için ucuz depolama ve bilgi işlem kaynakları olarak genel bulutun başka bir katman olarak kullanılmasıdır. Bu kullanım durumunda, performans odaklı çevrimiçi iş yükleri, uygun özel bulut ortamı kullanılarak yürütülür. Veri hacmi önemli değildir, ancak değer ve performans beklentileri önemlidir. Veri hacimleri arttıkça ve performans beklentileri azaldıkça, işletmeler veri saklama ile ilişkili maliyetleri ve erişim yeteneklerini optimize etmek için genel bulutun soğuk depolama seçeneklerini kullanabilir.

Bu, RustFS'nin hem özel hem de genel bulutlarda çalıştırılmasıyla sağlanır. Çoğaltma kullanarak, RustFS veri taşıyabilir ve gerekli olduğunda korumak ve erişmek için genel bulutta RustFS kullanabilir. Bu durumda, genel bulut, RustFS için aptal depolama haline gelir, tıpkı JBOD'un RustFS için aptal depolama haline gelmesi gibi. Bu yaklaşım, eski teyp altyapısını değiştirmeyi ve eklemeyi önler.

![Çapraz Bulut Türü Katmanlandırma](images/s9-3.png)

## Genel Bulutlarda

RustFS tipik olarak genel bulutlarda birincil uygulama depolama katmanı olarak hizmet verir. Bu durumda, diğer kullanım durumlarında olduğu gibi, RustFS, uygulamaların eriştiği tek depolama alanıdır. Uygulamalar (ve geliştiriciler), depolama uç noktasının ötesinde herhangi bir şey bilmek zorunda değildir. RustFS, yönetim parametrelerine dayanarak hangi verilerin nereye ait olduğunu belirler. Örneğin, RustFS, blok verilerinin nesne katmanına taşınması gerektiğini ve hangi nesne katmanının işletmenin performans ve ekonomik hedeflerini karşıladığını belirleyebilir.

RustFS, farklı depolama katmanlandırma katmanlarını birleştirir ve daha iyi ekonomi sağlamak için uygun ortamı belirler ve performanstan ödün vermez. Uygulamalar basitçe nesneleri RustFS aracılığıyla adreslerken, RustFS, nesneleri katmanlar arasında taşımak için politikaları şeffaf bir şekilde uygular ve o nesnenin meta verilerini blok katmanında tutar.

![Genel Bulut Katmanlandırma](images/s9-4.png)