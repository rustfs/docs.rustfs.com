---
title: "Veeam Backup and Replication için Yüksek Performanslı Nesne Depolama"
description: "Veeam v12 örneklerinizi RustFS ile genişletin ve depolama kapasitesi ile performansını önemli ölçüde artırın"
---

# Veeam Backup and Replication için Yüksek Performanslı Nesne Depolama

![Veeam Logo](./images/veeam-logo.png)

Veeam v12 örneklerinizi RustFS ile genişletin ve Veeam depolama kapasitesi ile performansını önemli ölçüde artırın.

## RustFS, Veeam ile işbirliği yaparak S3 endpoint portföyüne yüksek performanslı özel bulut nesne depolama ekler

Veeam Backup and Replication, çeşitli yazılım tanımlı optimize edilmiş yedekleme çözümleri sağlar. Birlikte çalışarak, yedekleme ortamında hesaplama ve depolamayı ayırarak yüksek performanslı nesne depolamayı endpoint olarak ekler, aynı zamanda mükemmel performans, ölçeklenebilirlik ve ekonomiklik sağlar. RustFS'in tek bir örneği, sanal makineler, Oracle, SAP ve MS Office için Veeam endpoint'i olarak kullanılabilir.

## Ana Uygulama Senaryoları

### 🖥️ VMware ESXi için Veeam Yedeklemeleri RustFS Kullanarak

Veeam kullanarak sanal altyapıyı nesne depolamaya sorunsuz bir şekilde yedekleyin, size neredeyse sınırsız nesne depolama kapasitesi esnekliği sağlar. Maliyet ve güvenliği kontrol edebilir, böylece verilere nasıl erişildiğini kontrol edebilirsiniz.

### 📧 Office 365 için Veeam Yedeklemeleri RustFS Kullanarak

Veeam kullanarak sanal altyapıyı nesne depolamaya sorunsuz bir şekilde yedekleyin, size neredeyse sınırsız nesne depolama kapasitesi esnekliği sağlar. Maliyet ve güvenliği kontrol edebilir, böylece verilere nasıl erişildiğini kontrol edebilirsiniz.

### 💼 SAP HANA için Veeam Yedeklemeleri RustFS Kullanarak

RustFS ile SAP HANA için Veeam yedekleme çözümü daha hızlı ve güvenli.

### 🗄️ Oracle için Veeam Yedeklemeleri RustFS Kullanarak

Oracle iş yüklerini yedeklemek performans, esneklik ve güvenlik gerektirir. Bu kritik yedekleme görevini optimize etmek için RustFS nesne depolama kullanın.

---

## Veeam ve RustFS Doğal Ortaklardır

Veeam ve RustFS, kendi teknolojileri için birinci sınıf yazılım çözümleri sağlar. VM'den Office 365'e kadar, büyük ölçekli performans uçtan uca çözümlerin ölçüsüdür. RustFS nesne depolama, bugün piyasada mevcut olan en ölçeklenebilir ve yüksek performanslı nesne depolama çözümünü sağlar ve Veeam müşterileri için ideal seçimdir.

## Temel Avantajlar

### ⚡ Hızlı yedekleme bir şey, hızlı kurtarma başka bir şey

Boyut ne olursa olsun, yedekleme ve kurtarma hızlı bir şekilde yapılmalıdır. Veeam Backup and Replication için RustFS, tek bir 32 düğümlü kümede 160 GiB/s'den fazla hızda okuma/yazma yapabilir, nesne depolamadan daha önce imkansız olduğu düşünülen hızlarda yedekleme ve kurtarma yapabilir.

### 🗃️ Metadata Avantajı

Harici tablolar kullanarak, işletmeler veri taşıma maliyeti veya koordinasyon zorluğu olmadan SQL Server'ın tüm özelliklerinden yararlanabilir.

RustFS metadata'yı nesne verileriyle birlikte atomik olarak yazdığı için, Veeam yedeklemeleri harici metadata veritabanına (çoğu durumda Cassandra) ihtiyaç duymaz. Bu, küçük nesnelerle ilişkili performans kayıplarını ortadan kaldırır. RustFS, Veeam'in önerdiği nesne boyutu aralığında performans sağlayabilir, hızlı silme ve yinelenen veri eliminasyonuna yardımcı olur.

### 🔒 Satır İçi ve Katı Tutarlı

RustFS'deki veri her zaman okunabilir ve tutarlıdır çünkü tüm I/O, satır içi silme kodları, bitrot hash'leri ve şifreleme ile senkron olarak commit edilir. RustFS tarafından sağlanan S3 hizmeti, meşgul işlemlerdeki herhangi bir kesintiye veya yeniden başlatmaya esnek bir şekilde yanıt verebilir. Asenkron I/O için önbellek veya geçici veri yoktur. Bu, tüm yedekleme işlemlerinin başarısını garanti eder.

### 🔧 Donanımdan Bağımsız

Veeam gibi, RustFS de yazılım tanımlı ve donanımdan bağımsızdır. Bu yaklaşım, Veeam müşterilerine çeşitli farklı yedekleme kullanım durumlarına uyacak sistemleri tasarlarken büyük tasarruf ve esneklik sağlar.

### 🚀 RustFS ve Veeam: Nesne Depolamadan Yedekleme ve Kurtarma

RustFS ve Veeam güçlerini birleştirir! RustFS nesne depolamayı Veeam ile birlikte dağıtmak çeşitli avantajlar sağlar. Bunlar arasında yazılım tanımlı çözümlerle ilişkili avantajlar, hızlı yedekleme ve kurtarma performans özellikleri ve metadata'yı atomik olarak yazan nesne depolamanın esnekliği ve esnekliği bulunur.
