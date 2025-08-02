---
title: "Terimler Sözlüğü"
description: "Bu makale, kullanıcıların nesne depolamayı hızlıca anlamalarına yardımcı olmak için nesne depolamada yaygın olarak kullanılan kelime dağarcığını tanıtır."
---
# Nesne Depolama Çekirdek Terimleri Koleksiyonu (100 Terim)

| No. | Terim | Çince | Açıklama |
|-----|-----------------------|-----------------------------|--------------------------------------------------------------------------------------------|
| 1 | Nesne Depolama | 对象存储 | Verilerin nesneler olarak depolandığı, geleneksel dosya hiyerarşi yapılarını değiştiren bir mimari |
| 2 | Kovası | 存储桶 | Küresel olarak benzersiz ad alanıyla nesneleri depolamak için bir konteyner |
| 3 | Nesne | 对象 | Veri, meta veri ve benzersiz tanımlayıcı (Nesne Anahtarı) içeren temel depolama birimi |
| 4 | Meta Veri | 元数据 | Nesne özelliklerini tanımlayan anahtar-değer çifti bilgisi (örneğin, dosya türü, oluşturma zamanı) |
| 5 | S3 Uyumlu | S3 兼容 | Amazon S3 API standartlarıyla uyumlu depolama hizmetleri |
| 6 | Veri Kalıcılığı | 数据持久性 | Verilerin sistemde uzun süre korunma olasılığı (örneğin, %99.999999999) |
| 7 | Çoğaltma | 多副本 | Veri güvenliğini sağlamak için verilerin çoklu kopyalarını oluşturan yedeklilik teknolojisi |
| 8 | Silme Kodlaması | 纠删码 | Verileri parçalara ayırarak ve kodlayarak yüksek güvenilirlik sağlayan teknoloji |
| 9 | Soğuk Depolama | 冷存储 | Nadiren erişilen veriler için düşük maliyetli depolama türü (örneğin, arşivlenmiş veri) |
| 10 | Yaşam Döngüsü Yönetimi | 生命周期管理 | Nesneleri otomatik olarak geçiş yapmak/silmek için politikalar (örneğin, 30 gün sonra soğuk depolamaya taşımak) |
| 11 | Sürüm Kontrolü | 版本控制 | Nesnelerin tarihsel sürümlerini saklayarak üzerine yazmayı önleme |
| 12 | Depolama Türü | 存储类型 | Farklı performans/maliyet depolama katmanları (Standart, Seyrek Erişim, Arşiv) |
| 13 | Erişim Anahtarı | 访问密钥 | API istekleri için kimlik doğrulama anahtarları (Erişim Anahtarı Kimliği + Gizli Erişim Anahtarı) |
| 14 | Bölge | 区域 | Depolama altyapısının coğrafi konumu (örneğin, Doğu Çin 1, ABD Batı) |
| 15 | Kullanılabilirlik Bölgesi (AZ) | 可用区 | Aynı bölge içinde bağımsız güç/ağa sahip izole veri merkezleri |
| 16 | Uç Nokta | 端点 | Depolama hizmetine erişim için alan adı (örneğin, us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | HTTP protokolüne dayalı API tasarım spesifikasyonu |
| 18 | Çok Parçalı Yükleme | 分片上传 | Büyük dosyaları yüklemek ve birleştirmek için parçalara ayırma mekanizması |
| 19 | Ön İmzalı URL | 预签名 URL | Geçerlilik süresi olan geçici erişim bağlantılar |
| 20 | Sunucu Taraflı Şifreleme (SSE) | 服务端加密 | Sunucu tarafında otomatik veri şifreleme (SSE-S3/SSE-KMS/SSE-C) |
| 21 | İstemci Taraflı Şifreleme (CSE) | 客户端加密 | Yükleme öncesi istemci tarafında yerel şifreleme |
| 22 | Bölgeler Arası Çoğaltma | 跨区域复制 | Coğrafi bölgeler arasında nesnelerin otomatik çoğaltılması |
| 23 | Erişim Kontrol Listesi (ACL) | 访问控制列表 | Kovası/nesneler için erişim izinlerini kontrol eden kural listesi |
| 24 | Kovası Politikası | 存储桶策略 | JSON tabanlı ince ayarlı izin kontrol politikaları |
| 25 | IAM | IAM | Kullanıcı/rol izinlerini merkezileştirilmiş yönetmek için Kimlik ve Erişim Yönetimi sistemi |
| 26 | Olay Bildirimi | 事件通知 | Olaylar tetiklendiğinde mesaj kuyruklarına/işlev hesaplamasına bildirim gönderme |
| 27 | Veri Gölü | 数据湖 | Yapılandırılmış/yapılandırılmamış verilerin merkezileştirilmiş depolandığı havuz |
| 28 | Uyumluluk | 合规性 | GDPR, HIPAA gibi veri depolama düzenleyici gereksinimlerini karşılamak |
| 29 | Günlük Kaydı ve Denetim | 日志审计 | Denetim için tüm API işlem günlüklerini kaydetme |
| 30 | İzleme ve Uyarı | 监控告警 | Depolama kullanımı/isteklerini gerçek zamanlı izleme ve uyarı |
| 31 | CORS | 跨域资源共享 | Tarayıcı çapraz kaynak erişimini kontrol eden kurallar |
| 32 | Aktarım Hızlandırma | 传输加速 | Kenar düğümleri aracılığıyla yükleme/indirme hızını optimize etme |
| 33 | CDN Entegrasyonu | CDN 加速 | İçerik Dağıtım Ağı ile birleştirerek önbellek hızlandırma |
| 34 | Veri Dışa Aktarımı | 数据导出 | Verileri diğer depolama sistemlerine taşımak |
| 35 | Veri İçe Aktarımı | 数据导入 | Harici sistemlerden nesne depolamaya toplu veri taşımak |
| 36 | Statik Web Sitesi Barındırma | 静态网站托管 | HTML/CSS/JS statik dosyaları doğrudan kovalar aracılığıyla barındırma |
| 37 | Hotlink Koruma | 防盗链 | Dış web sitelerinin kaynak bağlantılarını çalmasını önleyen teknoloji |
| 38 | İstek Hız Sınırlama | 请求速率限制 | Kullanıcı/IP başına API istek sıklığını kontrol etme |
| 39 | Etiketleme | 标签 | Kovası/nesneleri yönetim için sınıflandırma etiketleri ekleme |
| 40 | Envanter Raporu | 清单报告 | Depolama nesnelerini listeleyen periyodik olarak oluşturulan CSV/ORC dosyaları |
| 41 | Veri Geri Yükleme | 数据恢复 | Arşiv depolamadan erişilebilir duruma veri geri yükleme |
| 42 | Depolama Ağ Geçidi | 存储网关 | Nesne depolamayı yerel dosya sistemi olarak eşleyen erişim katmanı |
| 43 | Veri Sıkıştırma | 数据压缩 | Depolama alanından tasarruf etmek için yükleme öncesi verileri sıkıştırma |
| 44 | Veri Tekilleştirme | 数据去重 | Depolama kullanımını azaltmak için yinelenen verileri ortadan kaldırma |
| 45 | Doğrudan Okuma Arşivi | 直读归档 | Arşivlenmiş verileri geri yükleme olmadan doğrudan okuma teknolojisi |
| 46 | Bant Genişliği Kontrolü | 流量控制 | Ağ tıkanıklığını önlemek için indirme bant genişliğini sınırlama |
| 47 | Eşzamanlı Bağlantılar | 并发连接数 | Aynı anda veri transferi yapan bağlantıların sayısı |
| 48 | Veri Taşıma Hizmeti | 数据迁移服务 | Otomatik taşıma araçları (örneğin, AWS Snowball) |
| 49 | İstemci SDK | 客户端 SDK | Depolama hizmetlerini entegre etmek için geliştirici araç setleri (örneğin, Python/Java SDK) |
| 50 | CLI | 命令行工具 | Komut satırı yönetim araçları (örneğin, aws s3 cp) |
| 51 | Web Konsolu | 图形化控制台 | Web tabanlı yönetim arayüzü |
| 52 | Veri Bütünlük Kontrolü | 数据校验 | MD5/SHA aracılığıyla iletim bütünlüğünü doğrulama |
| 53 | Kesintiden Devam Eden Yükleme/İndirme | 断点续传 | Ağ kesintisinden sonra kesinti noktasından devam eden transfer |
| 54 | Aynalama Kaynağa Geri | 镜像回源 | İstenen nesne mevcut değilse belirtilen kaynaktan çekme ve kaydetme |
| 55 | Kanarya Yayını | 灰度发布 | Yeni özellikleri bazı kullanıcılara kademeli olarak açma yayın stratejisi |
| 56 | Yumuşak Silme | 软删除 | Nesneleri silme için işaretlerken geri yükleme süresini koruma |
| 57 | Nesne Kilidi | 对象锁定 | Nesne silme veya üzerine yazmayı önleyen uyumluluk koruma mekanizması |
| 58 | Filigran Ekleme | 水印 | Görüntülere/videolara tanımlama bilgisi ekleme |
| 59 | Küçük Resim Oluşturma | 缩略图生成 | Görüntülerin küçük resim sürümlerini otomatik olarak oluşturma |
| 60 | Görüntü İşleme | 图片处理 | Çevrimiçi kırpma/ölçeklendirme/döndürme işleme işlevleri |
| 61 | Video Yeniden Kodlama | 视频转码 | Farklı cihazlar için video formatlarını/çözünürlüklerini dönüştürme |
| 62 | İçerik Denetimi | 内容审核 | Uygunsuz görüntüleri/videoları/metinleri otomatik olarak tespit etme |
| 63 | Maliyet Analizi | 成本分析 | Depolama türü/istek sayısı boyutlarına göre maliyetleri hesaplama |
| 64 | Kullanım İzleme | 用量监控 | Depolama/trafik/istek sayılarını gerçek zamanlı gösterge paneli ile görüntüleme |
| 65 | Depolama Analitiği | 存储分析 | Maliyetleri optimize etmek için depolama kalıplarını analiz eden araçlar |
| 66 | İstek Eden Öder | 请求者付费 | Veri indirenin maliyeti üstlendiği faturalandırma modeli |
| 67 | Katmanlı Depolama | 数据分层 | Verileri otomatik olarak daha düşük maliyetli depolama katmanlarına taşımak |
| 68 | Akıllı Katmanlandırma | 智能分层 | Erişim kalıplarına göre otomatik olarak optimal depolama türünü seçme |
| 69 | PrivateLink | 私有链接 | Nesne depolamaya genel olarak maruz kalmadan iç ağ üzerinden erişim |
| 70 | VPC Uç Noktası | VPC 端点 | Sanal Özel Bulut içinde depolama hizmetlerine güvenli erişim için giriş noktası |
| 71 | SSL/TLS | 传输加密 | HTTPS protokolü aracılığıyla veri iletimini şifreleme |
| 72 | İstemci Taraflı Şifreleme | 客户端加密 | Kullanıcıların verileri kendileri yüklemeden önce şifreleme |
| 73 | KMS | KMS | Şifreleme anahtarlarını merkezileştirilmiş yönetmek için Anahtar Yönetim Hizmeti |
| 74 | İzin Sınırı | 权限边界 | IAM rollerinin/kullanıcıların maksimum izin kapsamını sınırlama |
| 75 | Geçici Kimlik Bilgileri | 临时凭证 | Kısa süreli geçerlilik süresine sahip erişim tokenları (örneğin, STS Token) |
| 76 | MFA Silme | MFA 删除保护 | Veri silmek için çok faktörlü kimlik doğrulama gerektirme |
| 77 | Değiştirilemezlik | 数据不可变性 | Veri tahrifini önleyen özellik (WORM modeli ile birleştirilmiş) |
| 78 | Yasal Tutma | 法律保留 | Uyumluluk senaryolarında veri silme/düzenlemeyi yasaklayan zorunlu koruma |
| 79 | Çapraz Hesap Paylaşımı | 跨账户共享 | Diğer bulut hesaplarının belirtilen depolama kaynaklarına erişimine izin verme |
| 80 | Ön Alma Politikası | 预取策略 | Sonraki erişimi hızlandırmak için verileri önceden önbelleğe yükleme |
| 81 | Önbellek Kontrolü | 缓存控制 | HTTP başlıkları aracılığıyla tarayıcı/CDN önbellek davranışını belirtme |
| 82 | Gecikmeli Silme | 延迟删除 | Kaza ile yapılan işlemleri önlemek için silme işlemlerini geciktirme |
| 83 | Toplu İşlemler | 批量操作 | Çoklu nesneler üzerinde birleştirilmiş işlemler yapma (silme/kopyalama/geri yükleme) |
| 84 | Veri Soy Ağacı | 数据血缘 | Veri kaynaklarını ve değişiklik geçmişini izleyen meta veri kayıtları |
| 85 | Veri Kataloğu | 数据目录 | Meta veri bilgilerini depolayan alma sistemi |
| 86 | Depolama Ağ Geçidi | 存储网关 | Yerel sistemleri bulut depolama ile bağlayan hibrit bulut çözümü |
| 87 | Hibrit Bulut Depolama | 混合云存储 | Hem yerel depolama hem de bulut depolamayı kullanan mimari |
| 88 | Kenar Depolama | 边缘存储 | Veri kaynaklarına yakın kenar düğümlerinde depolama hizmetleri sunma |
| 89 | Çoklu Bulut Depolama | 多云存储 | Farklı bulut hizmet sağlayıcıları arasında depolama çözümleri |
| 90 | Depolama Federasyonu | 存储联盟 | Çoklu depolama sistemlerini birleştirilmiş yönetmek için soyutlama katmanı |
| 91 | Nesne Etiketi | 对象标签 | Nesnelere özel sınıflandırma etiketleri ekleme |
| 92 | Kovası Etiketi | 存储桶标签 | Kovasılarına yönetim/faturalandırma ile ilgili etiketler ekleme |
| 93 | Depolama Kotası | 存储配额 | Kovasıların maksimum kapasitesini sınırlama |
| 94 | İstek Kısıtlama | 请求限速 | Birim zaman başına API isteklerini sınırlama |
| 95 | Hizmet Seviyesi Anlaşması (SLA) | 服务等级协议 | Kullanılabilirlik/kalıcılık için Hizmet Seviyesi Anlaşması taahhütleri (örneğin, %99.9 kullanılabilirlik) |
| 96 | Felaket Kurtarma | 灾难恢复 | Bölgeler arası yedeklemeler aracılığıyla iş sürekliliğini sağlama |
| 97 | Depolama Topolojisi | 存储拓扑 | Verilerin fiziksel/mantıksal düzeylerde dağılım yapısı |
| 98 | Yakınlık Erişimi | 就近访问 | Kullanıcı isteklerini en yakın depolama düğümlerine yönlendirme |
| 99 | Küresel Ad Alanı | 全球统一命名空间 | Bölgeler arası kovaları birleştirilmiş görüntüleme yönetimi |
| 100 | Sıfır Kopyalı Taşıma | 零拷贝迁移 | Meta veri işlemleri aracılığıyla hızlı veri taşıma |