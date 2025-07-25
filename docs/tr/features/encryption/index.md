# Büyük Ölçekli Veri Altyapısı

RustFS, teknik ölçek, operasyonel ölçek ve ekonomik ölçek için tasarlanmıştır. Temel ölçek.

Nesne depolama alanında, müzakere masasında yer almak için sağlam şifreleme gereklidir. RustFS, en yüksek düzeyde şifreleme ve kapsamlı optimizasyonlar aracılığıyla daha fazla işlevsellik sunar ve depolama şifreleme işlemleriyle genellikle ilişkilendirilen ek yükü neredeyse ortadan kaldırır.

![Veri Şifreleme Mimarisi](images/s5-1.png)

RustFS, verileri hem diske kaydedildiğinde hem de ağ üzerinden iletildiğinde şifreler. RustFS'nin en son şifreleme şeması, AES-256-GCM, ChaCha20-Poly1305 ve AES-CBC gibi modern endüstri standardı şifreleme algoritmalarını kullanarak ince taneli nesne düzeyinde şifrelemeyi destekler. RustFS, S3 şifreleme semantikleriyle tamamen uyumludur ve ayrıca Hashicorp Vault, Gemalto KeySecure ve Google Secrets Manager gibi AWS dışı anahtar yönetim hizmetlerini destekleyerek S3'ü genişletir.

## Ağ Şifreleme

Nesne depolama ve uygulamalar arasında veri iletildiğinde, veri bilinmeyen ve/veya güvenilmeyen ağlar arasında zıplayabilir. Verileri ağ üzerinden iletilirken (aynı zamanda "aktarım halinde" olarak da bilinir) şifrelemek, adamın-ortasında saldırılarını başarıyla azaltır ve verilerin aldığı yönlendirme yolundan bağımsız olarak güvenli kalmasını sağlar.

RustFS, kümedeki tüm bileşenler arasında Transport Layer Security (TLS) v1.2+'yı destekler. Bu yaklaşım, küme içi ve kümeler arası şifreli trafikte zayıf bağlantılar olmadığını garanti eder. TLS, her yerde bulunan bir şifreleme çerçevesidir: bankalar, e-ticaret web siteleri ve veri depolama şifrelemesine güvenen diğer kurumsal düzey sistemler tarafından kullanılan aynı şifreleme protokolüdür.

RustFS'nin TLS uygulamasının performans ek yükü ihmal edilebilir düzeydedir ve CPU talimat düzeyinde optimize edilmiştir. Sadece kümedeki her RustFS sunucusu için TLS özel anahtarlarını ve genel sertifikaları belirtmeyi gerektirir. Kubernetes ortamları için, RustFS Kubernetes Operatörü, kiracı dağıtımı sırasında TLS sertifikalarını entegre eder/otomatik olarak oluşturur ve atar. RustFS, her sertifikanın belirli bir etki alanı adıyla eşleştiği çoklu TLS sertifikalarını destekler. RustFS, Sunucu Adı Belirleme (SNI) kullanarak herhangi bir istek için hangi sertifikayı sunacağını belirler.

## Nesne Şifreleme

Diske kaydedilen veriler, veri güvenliğini sağlamak için tamamen disk güvenliğine ve ana bilgisayar sistemine dayanır. RustFS sunucu tarafı nesne şifrelemesi, verileri diske kaydedilmeden önce otomatik olarak şifreler (dinlenme halinde şifreleme). Bu yaklaşım, hiçbir verinin şifrelenmemiş diskler üzerine yazılmadığını garanti eder. Bu temel güvenlik katmanı, dinlenme halindeki verilerin gizliliğini, bütünlüğünü ve doğruluğunu sağlar. RustFS, veri şifrelemede maksimum esneklik için hem müşteri tarafından yönlendirilen hem de otomatik kova varsayılan nesne şifrelemesini destekler.

RustFS sunucu tarafı şifrelemesi, Amazon AWS-S3 semantikleriyle (SSE-S3) uyumludur. RustFS, Hashicorp Vault ve Thales Ciphertrust (eski adıyla Gemalto KeySecure) gibi yaygın kurumsal KMS sistemlerini içerecek şekilde AWS KMS desteğini genişleterek temel desteği genişletir. RustFS ayrıca, uygulamaların nesneleri şifrelemek için kullanılan veri anahtarını belirleyebildiği müşteri tarafından yönlendirilen şifrelemeyi (SSE-C) de destekler. Hem SSE-S3 hem de SSE-C için, RustFS sunucusu, anahtar döndürme ve nesne yeniden şifreleme dahil olmak üzere tüm şifreleme işlemlerini gerçekleştirir.

Otomatik sunucu tarafı şifreleme aracılığıyla, RustFS her nesneyi benzersiz bir anahtarla şifreler ve dinamik şifreleme anahtarları ve harici KMS veya müşteri tarafından sağlanan anahtarlardan türetilen anahtarlar kullanarak ek şifreleme katmanları uygular. Bu güvenli ve sofistike yaklaşım, RustFS içinde, çoklu bağımsız çekirdek ve kullanıcı alanı şifreleme yardımcı programlarını işleme ihtiyacı olmadan gerçekleştirilir.

RustFS, nesneler nesne depolamasına yazılırken veya okunurken nesneleri şifrelemek/şifresini çözmek için İlişkili Verilerle Kimlik Doğrulanmış Şifreleme (AEAD) şemalarını kullanır. RustFS AEAD şifrelemesi, AES-256-GCM ve ChaCha20-Poly1305 gibi endüstri standardı şifreleme protokollerini destekleyerek nesne verilerini korur. RustFS'nin CPU düzeyi optimizasyonları (SIMD hızlandırma gibi), şifreleme/şifre çözme işlemleri için ihmal edilebilir performans ek yükü sağlar. Kuruluşlar, alt optimal güvenlik seçimleri yapmaya zorlanmak yerine herhangi bir zamanda otomatik kova düzeyi şifreleme çalıştırabilirler.

## RustFS Anahtar Şifreleme Servisi

RustFS, anahtar şifreleme için yerleşik seçenekler sunar. RustFS'in Anahtar Şifreleme Servisi (KES), yüksek performanslı uygulamalar için durum bilgisiz dağıtılmış bir anahtar yönetim sistemidir. Kubernetes içinde çalışacak şekilde tasarlanmıştır ve uygulamalara şifreleme anahtarları dağıtır. KES, RustFS sunucu tarafı nesne şifrelemesi (SSE-S3) için gerekli bir bileşendir.

KES, RustFS kümeleri üzerinde şifreleme işlemlerini destekler ve ölçeklenebilir ve yüksek performanslı şifreleme işlemlerini sağlamak için anahtar bir mekanizmadır. KES, RustFS kümeleri ve harici KMS arasında bir aracı olarak hareket eder, gerektiğinde şifreleme anahtarları oluşturur ve KMS kısıtlamaları olmadan şifreleme işlemleri gerçekleştirir. Bu nedenle, hala ana anahtarları koruyan ve altyapıdaki güven kökü olarak hizmet veren merkezi bir KMS vardır. KES, her uygulama seti için KMS'yi başlatma ihtiyacını ortadan kaldırarak dağıtımı ve yönetimi basitleştirir. Bunun yerine, uygulamalar KES sunucularından veri şifreleme anahtarları (DEK'ler) talep edebilir veya KES sunucularından şifrelenmiş DEK'lerin şifresini çözmesini isteyebilir.

KES sunucuları tamamen durum bilgisiz olduğu için, Kubernetes Yatay Pod Otomatik Ölçekleyici aracılığıyla otomatik olarak ölçeklenebilir. Aynı zamanda, KES uygulama taleplerinin büyük çoğunluğunu bağımsız olarak ele aldığından, merkezi KMS üzerindeki yük önemli ölçüde artmaz.

Kubernetes ortamları için, RustFS Kubernetes Operatörü, her kiracı için KES'in dağıtılmasını ve yapılandırılmasını destekler ve her kiracı dağıtımının bir parçası olarak SSE-S3'ü etkinleştirir.

![KES Anahtar Şifreleme Servisi Mimarisi](images/s5-2.png)

## Desteklenen Harici Anahtar Yönetim Sistemleri

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |