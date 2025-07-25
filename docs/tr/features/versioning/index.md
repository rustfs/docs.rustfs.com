# Kova ve Nesne Sürümleme

## RustFS Nesne Depolama, AWS S3 Sürümleme Uyumluluğu Sağlar

Nesne düzeyinde sürümleme, SAN ve NAS sürümleme yöntemlerine kıyasla önemli bir iyileştirmedir. Sürümleme sadece veri koruması sağlamakla kalmaz, aynı zamanda nesne kilitleme, değiştirilemezlik, katmanlandırma ve yaşam döngüsü yönetimi gibi güçlü özelliklerin temelini oluşturur.

RustFS ile nesneler, Amazon'un S3 yapısı/uygulamasına göre bağımsız olarak sürümlenir. RustFS, belirli bir nesnenin her sürümü için benzersiz bir kimlik atar - uygulamalar, nesnenin belirli bir zaman dilimindeki anlık görüntüsüne erişmek için herhangi bir zamanda bir sürüm kimliği belirtebilir.

Sürümleme, kullanıcıların aynı kovada bir nesnenin birden fazla varyantını korumasına olanak tanır ve kovada depolanan her nesnenin her sürümünü kaydetmek, almak ve geri yüklemek için bir mekanizma sağlar, böylece anlık görüntülere olan ihtiyacı ortadan kaldırır. Sürümleme, nesnelerin uygulama ve insan hataları da dahil olmak üzere bir dizi arıza sonrasında bile kullanılabilir olmasını sağlar.

Sürümleme kova düzeyinde etkinleştirilir. Etkinleştirildikten sonra, RustFS nesneler için otomatik olarak benzersiz bir sürüm kimliği oluşturur. Aynı nesnenin birden fazla sürümü olabilir.

Sürümlemenin temel faydalarından biri, kazara üzerine yazma veya silme işlemlerini önlemektir. Bu, silme işaretleyicileri kavramı kullanılarak uygulanır. Bir sürümlü nesne silindiğinde, kalıcı olarak kaldırılmaz. Bunun yerine, bir silme işaretleyicisi oluşturulur ve nesnenin geçerli sürümü haline gelir. O nesne talep edildiğinde, RustFS bir 404 Bulunamadı mesajı döndürür. Nesne, silme işaretleyicisini silerek geri yüklenebilir.

Benzer şekilde, bir sürümlü nesne üzerine yazılırsa, RustFS yeni bir sürüm oluşturur ve bu sürüm geçerli sürüm haline gelir. Eski sürümler gerektiği gibi geri yüklenebilir.

## RustFS, Üç Farklı Kova Durumu ile Nesne Sürümlemeyi Destekler

![Kova Durumları](./images/bucket-states.png)

Bir kova için sürümleme etkinleştirildikten sonra, işlemin geri alınamayacağını unutmayın - sadece askıya alınabilir. Sürümleme, kovadaki bir küresel ayardır - yani artık tüm nesneler sürümlenir.

Uygun izinlere sahip kullanıcılar, nesne sürümlerini biriktirmeyi durdurmak için sürümlemeyi askıya alabilir. Sürümlemeyi etkinleştirmeye benzer şekilde, bu işlem kova düzeyinde gerçekleştirilir.

Tüm RustFS özelliklerinde olduğu gibi, sürümleme RustFS konsolu, istemci (mc), SDK veya komut satırı uygulamaları aracılığıyla uygulanabilir.

Sürümleme, verileri kazara işlemlerden korumanın en basit yoludur. Ancak, nesneler sürümlendikçe, daha büyük kova boyutlarına ve nesneler arasında daha fazla bağımlılıklara ve gizli nesne bağımlılıkları risklerine yol açabilir. Bu faktörler, yaşam döngüsü yönetimi ile hafifletilebilir.

## Temel Özellik Avantajları

> Veri koruma faydalarının yanı sıra, RustFS'nin nesne depolama sürümleme özelliği diğer önemli özelliklerin temelini oluşturur.

### Ana Özellik Karakteristikleri

- ✅ **Kova Çoğaltma** (Aktif-Aktif, Aktif-Pasif)
- ✅ **Mc undo** - Tek bir komutla PUT/SİL nesneleri geri al
- ✅ **Nesne Kilidi**
- ✅ **Anlık görüntülerin veya tam sistem çoğaltmasının yükü olmadan Sürekli Veri Koruması benzeri koruma**
- ✅ **Mc rewind** - Sürümleme etkinleştirildikten sonra kovaları veya nesneleri herhangi bir zamanda görüntüle

## Mimari

![Mimari Diyagram](./images/architecture.png)

### Sistem Gereksinimleri

> Sürümleme gerektirir: Silme kodlama ve en az dört disk.

### Sürümleme Durumları

RustFS, üç farklı kova sürümleme durumunu destekler:

1. **🔴 Sürümsüz** - Varsayılan durum, sürümleme yapılmaz
2. **🟢 Etkin** - Tam sürümleme işlevselliği, her nesne sürümü için benzersiz bir kimlik atar
3. **🟡 Askıya Alınmış** - Yeni sürümleri biriktirmeyi durdurur ancak mevcut sürümleri saklar

### Ana Özellikler

- 🆔 **Benzersiz Sürüm Kimliği** - Her nesne sürümünün benzersiz bir tanımlayıcısı vardır
- 🔄 **Zamana Göre Kurtarma** - Bir nesnenin herhangi bir tarihsel sürümüne erişilebilir
- 🛡️ **Silme Koruması** - Kazara silmeyi önlemek için silme işaretleyicileri kullanır
- 📊 **Yaşam Döngüsü Yönetimi** - Sürüm sayısını ve depolama maliyetlerini otomatik olarak yönetir
- 🔐 **İzin Kontrolü** - İnce ayarlı erişim izin yönetimi