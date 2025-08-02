# RustFS'den Nesne Değiştirilemezliği

## RustFS ve S3 API - Çoklu Bulut Depolama İçin Tasarlandı

RustFS, başından beri AWS S3 uyumluluğunun standardı olarak kendini kanıtlamıştır. S3 API'sinin (V2 ve V4) en erken benimseyenlerinden biri ve yalnızca S3'e odaklanan birkaç depolama şirketinden biri olarak, RustFS'in büyük topluluğu, başka bir AWS alternatifinin daha uyumlu olmadığını garanti eder. S3 API, bulutta fiili standart olduğu için, AWS alternatifleri API'yi farklı ortamlarda (genel bulut, özel bulut, veri merkezi, çoklu bulut, hibrit bulut ve kenar) çalıştırabilmek ve birlikte çalışabilmek için akıcı bir şekilde kullanabilmelidir.

## Nesne Saklama

Nesne depolama saklama kuralları, nesnelerin WORM (Write Once, Read Many) tarafından bir süre korunmasını sağlar. Nesne depolama saklama politikaları, nesne sürümlerinde belirlenen saklama süresini, ya açıkça ya da kova varsayılan ayarları aracılığıyla tanımlar. Kovada belirlenen varsayılan kilitleme yapılandırmaları, sonraki olarak oluşturulan nesnelere uygulanır ve önceki oluşturulan nesnelerin sürümlerine geri dönük olarak uygulanmaz.

Kova varsayılan ayarlarını kullanırken, gün veya yıl cinsinden bir süre belirlenerek, kovaya yerleştirilen her nesne sürümünün ne kadar süreyle korunacağı tanımlanır. Kovaya yerleştirilen yeni nesneler, kovada belirlenen koruma süresini devralır.

Saklama süreleri, nesne sürümleri için açıkça belirlenebilir. Açık saklama süreleri, nesne sürümü için bir "şu tarihe kadar sakla" tarihi belirler. "Şu tarihe kadar sakla" tarihi, nesne sürümünün meta verilerinde saklanır ve saklama süresi dolana kadar nesne sürümünü korur.

Saklama süresi dolduktan sonra, nesne sürümü silinebilir, ancak nesne sürümüne bir yasal tutma da uygulanmışsa silinemez.

Açık saklama süresi ayarları, varsayılan kova ayarlarını geçersiz kılar.

Saklama süreleri, yeni bir kilitleme talebi gönderilerek kolayca uzatılabilir.

Saklama çerçevesi içinde, nesneler ve kovalar için saklama sürelerini ayarlamak için iki tür mod vardır.

## Yönetim Modu

Yönetim modu, nesnelerin standart kullanıcılar tarafından silinmesini önlemek için kullanılır. Ancak, bazı kullanıcıların saklama ayarlarını değiştirmek veya nesneleri silmek için gerekli izinleri koruması gerekir. Bu kullanıcılar, s3:BypassGovernanceRetention izni ve DeleteObject izni gibi özel izinlere ihtiyaç duyarlar.

## Uyumluluk Modu

Uyumluluk modu daha kısıtlayıcıdır ve saklama süresi boyunca geri alınamaz. Bu nedenle, uyumluluk modu, saklama süresi boyunca hiç kimsenin (kök kullanıcı dahil) nesneleri silemeyeceğini garanti eder.

## Yasal Tutma

Yasal tutma, saklama süreleri gibi aynı WORM korumasını sağlar ancak bir son kullanma tarihi olmadan. Bu, yalnızca yetkili kullanıcılar tarafından kaldırılabilen süresiz bir saklamadır.

Nesnelerde saklama veya yasal tutma politikaları tanımlanmışsa, sürümlenmeye devam edeceklerdir. Bir nesne sürümü üzerinde gerçekleştirilen çoğaltma işlemleri, kaynak kovadan hedef kovaya saklama ve yasal tutma ayarlarını aktarmaz.

## RustFS Veri Değiştirilemezliği Cohasset Sertifikasyon Standartlarını Karşılar veya Aşar

Nesne kilitleme, saklama ve yasal tutma için altın standart, Cohasset Associates tarafından doğrulanmadır. RustFS'in nesne depolama saklama ve veri değiştirilemezliği, özellikle SEC Kuralı 17a-4(f), FINRA Kuralı 4511 ve CFTC Düzenlemesi 1.31 konusunda Cohasset Associates'tan olumlu değerlendirme almıştır. Kural 17a-4, elektronik veri depolama için belirli gereksinimlere sahiptir ve kayıt yönetiminin birçok yönünü, örneğin aracı-tüccar kayıt saklamanın süresi, formatı, kalitesi, kullanılabilirliği ve sorumluluğunu içerir.

Cohasset Associates değerlendirme raporunun bir kopyası tam olarak indirilebilir ve RustFS üzerinde veri depolarken ilgili düzenleyici kuruluşlarla paylaşılabilir. RustFS'in gereksinimleri karşılamak için nasıl yapılandırılacağı ve nesne kilitleme işlevselliğini destekleyen mantık hakkında detaylar içerir.