# Çoklu Site, Aktif-Aktif Nesne Depolama Çoğaltma

## Nesne Depolama İçin Aktif Çoğaltma

![Nesne Depolama Çoğaltma](images/s6-1.png)

Nesne depolama için aktif çoğaltma, kritik görev üretim ortamları için hayati bir gereksinimdir. RustFS, şu anda bu hizmeti sağlayan tek satıcıdır. Kova düzeyinde ince taneli olarak yürütülen bu işlem, aşağıdaki durumlarda kullanılır:

RustFS, mimari seçimlere ve veri değişiklik hızlarına bağlı olarak eşzamanlı ve neredeyse eşzamanlı çoğaltmayı destekler. Yukarıdaki durumların her birinde, çoğaltma, bant genişliği kısıtlamaları ve değişiklik hızları göz önüne alındığında mümkün olduğunca katı bir tutarlılıkla gerçekleştirilmelidir.

## Büyük Ölçekli Dayanıklılık İçin Tasarlanmış RustFS Veri Çoğaltma

Ana özellikler şunları içerir:

- ✅ Şifrelenmiş veya şifrelenmemiş nesneler ve bunlarla ilişkili meta veriler (nesnelerle birlikte atomik olarak yazılır)
- ✅ Nesne sürümleri
- ✅ Nesne etiketleri (varsa)
- ✅ S3 nesne kilidi saklama bilgileri (varsa)

## Temel Özellikler

### Kaynak ve Hedef Kovaların Aynı Ada Sahip Olabilme Yeteneği

Uygulamaların uzak sitelere herhangi bir kesinti olmadan şeffaf bir şekilde geçiş yapabilmesi için gereklidir.

### Kaynak ve Hedef Arasında Otomatik Nesne Kilidi/Saklama Çoğaltması için Yerel Destek

Çoğaltma sırasında veri bütünlüğü ve uyumluluk gereksinimlerinin korunmasını sağlar.

### Neredeyse Eşzamanlı Çoğaltma

Kovada herhangi bir değişiklik meydana geldikten hemen sonra nesneleri güncelleyebilir. RustFS, veri merkezleri içinde katı tutarlılığı ve veri merkezleri arasında nihai tutarlılığı korur.

### Bildirim İşlevselliği

Çoğaltma hata olaylarını iletmek için bildirim işlevselliği. Uygulamalar bu olaylara abone olabilir ve operasyon ekiplerini uyarabilir.

## RustFS Aktif-Aktif Çoğaltmayı Uygularken Dikkat Edilmesi Gerekenler

En temel düzeyde, herhangi bir tasarım altyapı, bant genişliği, gecikme süresi, dayanıklılık ve ölçek gibi faktörleri dikkate almalıdır. Bunları sırayla inceleyelim:

### Altyapı

RustFS, çoğaltma uç noktalarının her iki tarafında da aynı donanımın kullanılmasını önerir. Benzer donanım çalışabilir, ancak heterojen donanım profilleri getirmek karmaşıklığı artırır ve sorun tespitini yavaşlatır.

### Bant Genişliği

İki siteyi tutarlı bir şekilde senkronize tutmak için bant genişliği kritik bir faktördür. Siteler arasındaki optimal bant genişliği gereksinimi, gelen veri hızına göre belirlenir. Özellikle, bant genişliği zirve değişiklikleri işlemek için yetersizse, değişiklikler uzak siteye kuyruğa alınacak ve sonunda senkronize olacaktır.

### Gecikme Süresi

Bant genişliğinden sonra, aktif-aktif bir model tasarlarken dikkate alınması gereken en önemli faktör gecikme süresidir. Gecikme süresi, iki RustFS kümesi arasındaki gidip gelme süresini (RTT) temsil eder. Amaç, bant genişliği tarafından uygulanan bütçe kısıtlamaları içinde gecikme süresini mümkün olan en küçük sayıya indirmektir. RustFS, Ethernet bağlantılar ve ağlar için RTT eşiklerinin 20 milisaniyeyi aşmamasını ve paket kaybı oranlarının %0.01'i aşmamasını önerir.

### Mimari

Şu anda, RustFS yalnızca iki veri merkezi arasında çoğaltmayı önermektedir. Çoklu veri merkezleri arasında çoğaltma mümkün olsa da, bu işlemdeki karmaşıklık ve gerekli olan ödünleşmeler bu durumu oldukça zorlaştırmaktadır.

## Büyük Ölçekli Dağıtım Mimarisi

RustFS, yukarıda belirtilen hususlar ölçeği belirlerken, her veri merkezinde kaynak ve hedef dahil olmak üzere çok büyük dağıtımları destekler.

![Büyük Ölçekli Dağıtım Mimarisi](images/s6-2.png)

## Sıkça Sorulan Sorular

### Çoğaltma hedefi başarısız olduğunda ne olur?

Hedef devre dışı kalırsa, kaynak değişiklikleri önbelleğe alacak ve çoğaltma hedefi kurtarıldıktan sonra senkronizasyona başlayacaktır. Tam senkronizasyona ulaşmakta bazı gecikmeler olabilir; bu, süre, değişiklik sayısı, bant genişliği ve gecikme süresine bağlıdır.

### Değiştirilemezlik için parametreler nelerdir?

Değiştirilemezlik desteklenmektedir. Ana kavramlar bu makalede bulunabilir. Aktif-aktif çoğaltma modunda, değiştirilemezlik yalnızca nesneler sürümlendirildiğinde garanti edilebilir. Sürüm oluşturma kaynağında devre dışı bırakılamaz. Hedefte sürüm oluşturma askıya alınırsa, RustFS çoğaltmayı başarısızlığa uğratmaya başlayacaktır.

### Sürüm oluşturma askıya alınırsa veya bir uyumsuzluk olursa başka ne gibi etkiler olur?

Bu durumlarda, çoğaltma başarısız olabilir. Örneğin, kaynak kovada sürüm oluşturmayı devre dışı bırakmaya çalışırsanız bir hata döndürülür. Sürüm oluşturmayı devre dışı bırakmadan önce çoğaltma yapılandırmasını kaldırmanız gerekir. Ayrıca, hedef kovada sürüm oluşturma devre dışı bırakılırsa, çoğaltma başarısız olacaktır.

### Nesne kilitleme her iki uçta da etkinleştirilmezse nasıl işlem görür?

Nesne kilitleme, kaynak ve hedefte de etkinleştirilmelidir. Kovada çoğaltma kurulduktan sonra, hedef kova silinebilir ve nesne kilitleme etkinleştirilmeden yeniden oluşturulabilir ve çoğaltma başarısız olabilir. Nesne kilitleme ayarları her iki uçta da yapılandırılmazsa, tutarsız durumlar ortaya çıkabilir. Bu durumda, RustFS sessizce başarısız olacaktır.