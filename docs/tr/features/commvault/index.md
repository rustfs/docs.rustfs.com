# Commvault Entegrasyonu

RustFS, Commvault Complete Data Protection ile sorunsuz bir şekilde entegre olarak, olağanüstü performans ve güvenilirlikle kurumsal ölçekte yedekleme, kurtarma ve veri yönetimi çözümleri sunar.

## Genel Bakış

![Commvault Logosu](./images/commvault-logo.png)

RustFS ile Commvault şunları sunar:

- **Kurumsal Veri Koruma**: Tüm iş yükleri için kapsamlı yedekleme ve kurtarma
- **Bulut Ölçeğinde Depolama**: Kütle olarak ölçeklenebilir nesne depolama altyapısı
- **Gelişmiş Veri Yönetimi**: Akıllı veri yaşam döngüsü yönetimi
- **Birleşik Platform**: Yedekleme, arşivleme ve analiz için tek platform

## Ana Avantajlar

### Atomik Meta Veri İşlemleri

![Atomik Meta Veri](./images/atomic-metadata.png)

#### Tutarlı Meta Veri

- **ACID İşlemleri**: Atomik, tutarlı, izole, dayanıklı işlemler
- **Meta Veri Bütünlüğü**: Garantili meta veri tutarlılığı
- **Hızlı Kurtarma**: Tutarlı meta veri ile hızlı kurtarma
- **Eşzamanlı İşlemler**: Çatışma olmadan yüksek eşzamanlılık

### Ölçekte Hızlı Performans

![Hızlı Performans](./images/fast-performance.png)

#### Yüksek Verimli İşlemler

- **Paralel İşleme**: Kütle paralel yedekleme ve geri yükleme
- **Optimize Edilmiş G/Ç**: Veri koruma iş yükleri için optimize edilmiş
- **Akıllı Önbellekleme**: Sık erişilen veriler için akıllı önbellekleme
- **Doğrusal Ölçekleme**: Performans küme büyümesi ile ölçeklenir

### Eşsiz Ölçeklenebilirlik

![Ölçeklenebilirlik](./images/scalability.png)

#### Esnek Ölçekleme

- **Petabayt Ölçeği**: Petabaytlarca yedekleme verisine ölçeklenme
- **Yatay Ölçekleme**: Kapasite ve performans için düğüm ekleme
- **Oto-Ölçekleme**: Talebe göre otomatik ölçekleme
- **Küresel Ad Alanı**: Tüm düğümler arasında birleşik ad alanı

### Basit ve Güvenli Mimari

![Basit Güvenli](./images/simple-secure.png)

#### Kurumsal Güvenlik

- **Uçtan Uca Şifreleme**: Dinlenirken ve aktarımda şifreleme
- **Erişim Kontrolleri**: İnce taneli erişim kontrol politikaları
- **Denetim Günlükleri**: Kapsamlı denetim izleri
- **Uyumluluk**: Düzenleyici uyumluluk gereksinimlerini karşılama

## Commvault Entegrasyon Özellikleri

### Depolama Entegrasyonu

#### Disk Kütüphanesi Yapılandırması

- **Disk Kütüphanesi**: RustFS'i Commvault disk kütüphanesi olarak yapılandırın
- **Yinelenen Veri Giderme**: Tüm veriler arasında küresel yinelenen veri giderme
- **Sıkıştırma**: Gelişmiş sıkıştırma algoritmaları
- **Şifreleme**: Donanım hızlandırımlı şifreleme

#### Bulut Depolama Entegrasyonu

- **Bulut Kütüphanesi**: RustFS'i bulut depolama kütüphanesi olarak kullanın
- **S3 Uyumluluğu**: Tam Amazon S3 API uyumluluğu
- **Hibrit Dağıtım**: Sorunsuz hibrit bulut dağıtımı
- **Maliyet Optimizasyonu**: Akıllı depolama katmanlandırma

### Veri Koruma Yetkinlikleri

#### Yedekleme ve Kurtarma

- **Uygulama Bilinçli**: Uygulama tutarlı yedeklemeler
- **Detaylı Kurtarma**: Dosya, klasör ve uygulama seviyesi kurtarma
- **Anında Kurtarma**: Minimal RTO ile hızlı kurtarma
- **Çapraz Platform**: Tüm büyük platformlar için destek

#### Arşiv ve Uyumluluk

- **Akıllı Arşivleme**: Politika tabanlı veri arşivleme
- **Yasal Tutma**: Yasal tutma ve dava desteği
- **Saklama Yönetimi**: Esnek saklama politikaları
- **Uyumluluk Raporlama**: Otomatik uyumluluk raporlama

## Dağıtım Mimarileri

### Şirket İçi Veri Koruma

```
┌─────────────────┐    ┌─────────────────┐
│   Üretim Ortamı │    │   CommServe      │
│                 │───►│   + MediaAgent   │
│                 │    │                  │
│ • Sunucular     │    │ ┌─────────────┐  │
│ • Veritabanları │    │ │   RustFS     │  │
│ • Uygulamalar   │    │ │   Depolama   │  │
│ • VM'ler        │    │ │   Kütüphanesi│  │
└─────────────────┘    │ └─────────────┘  │
                       └─────────────────┘
```

### Hibrit Bulut Mimarisi

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Şirket İçi    │    │   Birincil       │    │   Bulut         │
│   Üretim       │───►│   Yedekleme      │───►│   Arşiv         │
│                 │    │   (RustFS)      │    │   (RustFS)      │
│ • Birincil Veri │    │                  │    │                  │
│ • Uygulamalar  │    │ • Hızlı Kurtarma │    │ • Uzun Vadeli    │
│ • Veritabanları │    │ • Yinelenen Veri │    │ • Uyumluluk     │
└─────────────────┘    │   Giderme       │    │                  │
                       └─────────────────┘    └─────────────────┘
```

### Çoklu Site Veri Koruma

```
┌─────────────────┐    ┌─────────────────┐
│   Birincil DC   │    │   DR Sitesi      │
│                 │◄──►│                  │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Üretim      │ │    │ │ DR Sistemleri │ │
│ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                  │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   RustFS     │ │    │ │   RustFS     │ │
│ │   Birincil   │ │    │ │   Replika    │ │
│ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘
```

## Yapılandırma ve Kurulum

### Commvault Yapılandırması

#### Disk Kütüphanesi Kurulumu

```bash
# RustFS'i disk kütüphanesi olarak yapılandırın
# Commvault Command Center üzerinden
1. Depolama → Disk → Disk Kütüphanesi Oluştur
2. Kütüphane Adı: RustFS-Kütüphanesi
3. MediaAgent: Uygun MediaAgent'i seçin
4. Bağlama Yolu: /mnt/rustfs
5. Yinelenen Veri Gidermeyi Etkinleştir: Evet
6. Şifreleme: Etkinleştir
```

#### Bulut Kütüphanesi Yapılandırması

```bash
# RustFS'i bulut kütüphanesi olarak yapılandırın
1. Depolama → Bulut → Bulut Kütüphanesi Oluştur
2. Bulut Depolama: Genel S3
3. Servis Ana Bilgisayarı: rustfs.example.com
4. Erişim Anahtarı: erişim-anahtarınız
5. Gizli Anahtar: gizli-anahtarınız
6. Konteyner: commvault-yedeklemeleri
```

### Depolama Politikası Yapılandırması

#### Yedekleme Depolama Politikaları

- **Birincil Kopya**: Yakın zamandaki yedeklemeler için yüksek performanslı depolama
- **İkincil Kopya**: Daha eski yedeklemeler için maliyet optimize edilmiş depolama
- **Arşiv Kopyası**: Uzun vadeli saklama ve uyumluluk
- **Yardımcı Kopya**: Felaket kurtarma ve çoğaltma

#### Veri Yaşlandırma Politikaları

- **Saklama Kuralları**: Farklı veri türleri için saklama süreleri tanımlayın
- **Yaşlandırma Politikaları**: Depolama katmanları arasında otomatik hareket
- **Budama**: Süresi dolmuş verilerin otomatik silinmesi
- **Uyumluluk**: Düzenleyici saklama gereksinimlerini karşılayın

## İş Yükü Koruması

### Sanal Makine Koruması

#### VMware vSphere

- **vCenter Entegrasyonu**: Yerel vCenter entegrasyonu
- **Değişen Blok İzleme**: Artımlı yedekleme optimizasyonu
- **Uygulama Tutarlılığı**: VSS bilinçli yedeklemeler
- **Anında Kurtarma**: Hızlı VM kurtarma ve devralma

#### Microsoft Hyper-V

- **SCVMM Entegrasyonu**: System Center entegrasyonu
- **Hyper-V VSS**: Volume Shadow Copy Service
- **Canlı Göç**: Canlı göç sırasında yedekleme
- **Küme Desteği**: Devralma kümesi desteği

### Veritabanı Koruması

#### Microsoft SQL Server

- **SQL VSS Writer**: Uygulama tutarlı yedeklemeler
- **Günlük Gönderimi**: İşlem günlüğü yedekleme ve gönderimi
- **Always On**: Always On Kullanılabilirlik Grupları desteği
- **Detaylı Kurtarma**: Veritabanı, tablo ve satır seviyesi kurtarma

#### Oracle Veritabanı

- **RMAN Entegrasyonu**: Oracle Recovery Manager entegrasyonu
- **Data Guard**: Oracle Data Guard desteği
- **RAC Desteği**: Gerçek Uygulama Kümeleri desteği
- **Zamana Göre Kurtarma**: Detaylı zamana göre kurtarma

#### Diğer Veritabanları

- **MySQL**: MySQL veritabanı koruması
- **PostgreSQL**: PostgreSQL yedekleme ve kurtarma
- **MongoDB**: NoSQL veritabanı koruması
- **SAP HANA**: SAP HANA veritabanı yedekleme

### Dosya Sistemi Koruması

#### Windows Dosya Sistemleri

- **NTFS**: Windows NTFS dosya sistemi
- **Paylaşım Koruması**: Ağ paylaşımı yedekleme
- **VSS Entegrasyonu**: Volume Shadow Copy Service
- **Açık Dosya Yedekleme**: Açık ve kilitli dosyaların yedeklenmesi

#### Unix/Linux Dosya Sistemleri

- **ext4/XFS**: Linux dosya sistemi desteği
- **NFS**: Ağ Dosya Sistemi yedekleme
- **Anlık Görüntü Entegrasyonu**: LVM ve dosya sistemi anlık görüntüleri
- **Sembolik Bağlantılar**: Sembolik bağlantılar ve izinlerin korunması

### Uygulama Koruması

#### Microsoft Exchange

- **Exchange VSS**: Exchange bilinçli yedeklemeler
- **Posta Kutusu Kurtarma**: Bireysel posta kutusu kurtarma
- **Veritabanı Kurtarma**: Exchange veritabanı kurtarma
- **Genel Klasör**: Genel klasör yedekleme ve kurtarma

#### Microsoft SharePoint

- **SharePoint VSS**: SharePoint bilinçli yedeklemeler
- **Site Koleksiyonu**: Site koleksiyonu yedekleme ve kurtarma
- **İçerik Veritabanı**: İçerik veritabanı koruması
- **Arama İndeksi**: Arama indeksi yedekleme ve kurtarma

#### Kurumsal Uygulamalar

- **SAP**: SAP uygulama yedekleme
- **Lotus Notes**: IBM Lotus Notes/Domino
- **Active Directory**: Active Directory yedekleme
- **Dosya Paylaşımları**: Ağ dosya paylaşımı koruması

## Veri Yönetimi ve Analitik

### İçerik İndeksleme

#### Arama ve Keşif

- **Tam Metin Arama**: Tüm yedekleme verilerinde arama
- **Meta Veri İndeksleme**: Dosya ve uygulama meta verilerini indeksleme
- **İçerik Analitiği**: Veri kalıplarını ve trendlerini analiz etme
- **eKeşif**: Yasal keşif ve uyumluluk

#### Veri Sınıflandırma

- **Otomatik Sınıflandırma**: AI destekli veri sınıflandırma
- **Politika Tabanlı**: Kural tabanlı sınıflandırma politikaları
- **Duyarlı Veri**: Duyarlı verileri tanımlama ve koruma
- **Uyumluluk**: Veri yönetişim gereksinimlerini karşılama

### Veri Yaşam Döngüsü Yönetimi

#### Akıllı Veri Hareketi

- **Politika Tabanlı Katmanlandırma**: Katmanlar arasında otomatik veri hareketi
- **Maliyet Optimizasyonu**: Depolama maliyetlerini optimize etme
- **Performans Optimizasyonu**: Performans ve maliyet dengesini sağlama
- **Uyumluluk**: Saklama ve uyumluluk gereksinimlerini karşılama

#### Arşiv ve Saklama

- **Otomatik Arşivleme**: Politika tabanlı veri arşivleme
- **Yasal Tutma**: Yasal tutma ve dava desteği
- **Saklama Politikaları**: Esnek saklama yönetimi
- **Bertaraf**: Güvenli veri imhası

## Güvenlik ve Uyumluluk

### Veri Güvenliği

#### Şifreleme

- **AES-256 Şifreleme**: Dinlenirken veriler için güçlü şifreleme
- **Aktarımda Şifreleme**: Veri transferi için TLS şifreleme
- **Anahtar Yönetimi**: Merkezi şifreleme anahtarı yönetimi
- **Donanım Güvenliği**: Donanım güvenlik modülü desteği

#### Erişim Kontrolü

- **Rol Tabanlı Erişim**: Rol tabanlı erişim kontrolü (RBAC)
- **Çok Faktörlü Kimlik Doğrulama**: Gelişmiş kimlik doğrulama
- **LDAP/AD Entegrasyonu**: Kurumsal dizin entegrasyonu
- **Denetim Günlükleri**: Kapsamlı erişim günlükleri

### Uyumluluk Özellikleri

#### Düzenleyici Uyumluluk

- **GDPR**: Genel Veri Koruma Yönetmeliği
- **HIPAA**: Sağlık Sigortası Taşınabilirlik Yasası
- **SOX**: Sarbanes-Oxley Yasası
- **SEC**: Menkul Kıymetler ve Borsa Komisyonu kuralları

#### Veri Yönetişimi

- **Veri Saklama**: Otomatik saklama politikaları
- **Yasal Tutma**: Yasal tutma ve muhafaza
- **Denetim Raporları**: Otomatik denetim raporlama
- **Zincirleme Gözetim**: Veri zincirleme gözetimini sürdürme

## İzleme ve Yönetim

### Commvault Komut Merkezi

#### Merkezi Yönetim

- **Tek Konsol**: Birleşik yönetim arayüzü
- **Çok Kiracılı**: Birden fazla organizasyon desteği
- **Gösterge Paneli**: Gerçek zamanlı durum ve analizler
- **Raporlama**: Kapsamlı raporlama ve analizler

#### İş İzleme

- **Gerçek Zamanlı Durum**: Gerçek zamanlı iş durumu izleme
- **Performans Metrikleri**: Yedekleme ve geri yükleme performansı
- **Kapasite Planlama**: Depolama kapasitesi planlama
- **Uyarılar**: Proaktif uyarılar ve bildirimler

### Entegrasyon ve Otomasyon

#### REST API

- **Programatik Erişim**: Otomasyon için RESTful API
- **Üçüncü Taraf Entegrasyonu**: Harici sistemlerle entegrasyon
- **Özel Uygulamalar**: Özel uygulamalar oluşturma
- **İş Akışı Otomasyonu**: Operasyonel iş akışlarını otomatikleştirme

#### PowerShell Entegrasyonu

- **PowerShell Cmdlet'leri**: Yerel PowerShell desteği
- **Komut Dosyası Oluşturma**: Rutin görevleri otomatikleştirme
- **Toplu İşlemler**: Toplu işlemler gerçekleştirme
- **Özel Komut Dosyaları**: Özel otomasyon komut dosyaları oluşturma

## En İyi Uygulamalar

### Dağıtım En İyi Uygulamaları

1. **Boyutlandırma**: Yedekleme iş yükleri için uygun boyutlandırma
2. **Ağ**: Ağ yapılandırmasını optimize etme
3. **Depolama**: Uygun depolama politikalarını yapılandırma
4. **Güvenlik**: Güvenlik en iyi uygulamalarını uygulama

### Performans Optimizasyonu

1. **Eşzamanlı İşlemler**: Eşzamanlı iş ayarlarını optimize etme
2. **Yinelenen Veri Giderme**: Küresel yinelenen veri gidermeyi yapılandırma
3. **Sıkıştırma**: Sıkıştırma ve performans dengesini sağlama
4. **Ağ**: Ağ bant genişliği kullanımını optimize etme

### Veri Yönetimi

1. **Depolama Politikaları**: Etkili depolama politikaları tasarlama
2. **Saklama**: Uygun saklama politikalarını uygulama
3. **Arşivleme**: Akıllı arşivleme politikaları kullanma
4. **İzleme**: Sürekli izleme ve optimizasyon

## Sorun Giderme

### Yaygın Sorunlar

#### Performans Sorunları

- **Yavaş Yedeklemeler**: Ağ ve depolama performansını kontrol edin
- **Yüksek CPU Kullanımı**: MediaAgent kaynak kullanımını izleyin
- **Bellek Sorunları**: Bellek tahsisini optimize edin
- **Disk Alanı**: Kullanılabilir disk alanını izleyin

#### Bağlantı Sorunları

- **Ağ Bağlantısı**: Ağ bağlantısını doğrulayın
- **Güvenlik Duvarı Kuralları**: Güvenlik duvarı yapılandırmasını kontrol edin
- **DNS Çözümleme**: DNS çözümlemesini doğrulayın
- **Servis Durumu**: Commvault servis durumunu kontrol edin

#### Yapılandırma Sorunları

- **Kütüphane Yapılandırması**: Kütüphane ayarlarını doğrulayın
- **Depolama Politikası**: Depolama politika yapılandırmasını kontrol edin
- **Kimlik Bilgileri**: Erişim kimlik bilgilerini doğrulayın
- **İzinler**: Dosya sistemi izinlerini kontrol edin

## Başlarken

### Önkoşullar

1. **Commvault Ortamı**: Commvault Complete Data Protection v11.20+
2. **RustFS Kümesi**: Uygun şekilde yapılandırılmış RustFS kümesi
3. **Ağ Bağlantısı**: Commvault ve RustFS arasında ağ bağlantısı
4. **MediaAgent**: Yeterli kaynaklara sahip Commvault MediaAgent

### Hızlı Başlangıç Kılavuzu

1. **MediaAgent Kurulumu**: Commvault MediaAgent'i kurun ve yapılandırın
2. **Kütüphane Yapılandırma**: RustFS'i disk veya bulut kütüphanesi olarak ekleyin
3. **Depolama Politikası Oluşturma**: RustFS kütüphanesi kullanarak depolama politikası oluşturun
4. **Alt İstemci Yapılandırma**: Veri koruması için alt istemci oluşturun
5. **Yedekleme Çalıştırma**: İlk yedekleme işini yürütün
6. **Kurtarma Testi**: Yedekleme kurtarma prosedürlerini test edin

### Sonraki Adımlar

- **Performansı Optimize Etme**: Optimal performans için yedekleme ayarlarını ayarlayın
- **Güvenliği Uygulama**: Şifreleme ve erişim kontrollerini yapılandırın
- **İzleme Kurulumu**: Kapsamlı izleme uygulayın
- **Felaket Kurtarma Planlama**: Felaket kurtarma prosedürleri geliştirin
- **Personel Eğitimi**: Personeli yedekleme ve kurtarma prosedürleri konusunda eğitin