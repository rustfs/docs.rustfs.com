---
title: "Commvault Yedekleme, Kurtarma ve Çoğaltma için Yüksek Performanslı Nesne Depolama"
description: "Commvault ile RustFS entegrasyonu ile güvenli ve hızlı yedekleme çözümleri"
---

# Commvault Yedekleme, Kurtarma ve Çoğaltma için Yüksek Performanslı Nesne Depolama

**Basit. Ölçeklenebilir. Hızlı. Ransomware korumalı. Başka bir deyişle, tam istediğiniz şey.**

## Temel Avantajlar

### 🔒 Basit = Güvenli

Bu dünya zaten yeterince karmaşık. Commvault ve RustFS, verilerinizi korumak için yedekleme ve kurtarmayı basitleştirir. VM'den Office 365'e kadar çeşitli veri kaynakları için uygundur.

### 📈 Basit Teslim Ölçeği

RustFS nesne depolama, sunucu havuzu yaklaşımı ile EB ve hatta daha yüksek seviyelere sorunsuz bir şekilde ölçeklenir. Bu, Commvault'un temel görevine odaklanabilmesini sağlar, geri kalanını (donanım heterojenliğinden silme kodları ve bit çürüme korumasına kadar) RustFS'e bırakır. Bu, işletmelerin yedeklemelerini genişletebileceği ve mümkün olduğunca çok veriyi koruyabileceği anlamına gelir.

### ⚡ Hızlı yedekleme bir şey, hızlı kurtarma başka bir şey

Boyut ne olursa olsun, yedekleme ve kurtarma hızlı bir şekilde yapılmalıdır. RustFS ve Commvault, tek bir 32 düğümlü kümede **325 GiB/s**'den fazla hızda okuma/yazma yapabilir, bu nedenle nesne depolamadan daha önce imkansız olduğu düşünülen hızlarda yedekleme ve kurtarma yapabilir. İşiniz hızlı kurtarmaya bağlı olduğunda, piyasada bundan daha iyi bir çözüm yoktur.

### ⚛️ Atomik

RustFS metadata'yı nesne verileriyle birlikte atomik olarak yazdığı için, harici metadata veritabanına (çoğu durumda Cassandra) ihtiyaç yoktur. Bu, küçük nesnelerle ilişkili performans kayıplarını ortadan kaldırır. RustFS, Commvault'un önerdiği nesne boyutu aralığında performans sağlayabilir, hızlı silme ve yinelenen veri eliminasyonuna yardımcı olur.

### 🔐 Satır İçi ve Katı Tutarlı

RustFS'deki veri her zaman okunabilir ve tutarlıdır çünkü tüm I/O, satır içi silme kodları, bitrot hash'leri ve şifreleme ile senkron olarak commit edilir. RustFS tarafından sağlanan S3 hizmeti, meşgul işlemlerdeki herhangi bir kesintiye veya yeniden başlatmaya esnek bir şekilde yanıt verebilir. Asenkron I/O için önbellek veya geçici veri yoktur. Bu, tüm yedekleme işlemlerinin başarısını garanti eder.

### 🔧 Donanımdan Bağımsız

Commvault gibi, RustFS de yazılım tanımlı ve donanımdan bağımsızdır. Bu yaklaşım, Commvault müşterilerine çeşitli farklı yedekleme kullanım durumlarına uyacak sistemleri tasarlarken büyük tasarruf ve esneklik sağlar.

## Çözüm Genel Bakışı

RustFS ve Commvault, çeşitli yazılım tanımlı optimize edilmiş yedekleme çözümleri sağlar. Birlikte çalışarak, yedekleme ortamında yüksek performanslı nesne depolamayı endpoint olarak ekler, hesaplama ve depolamayı ayırır, aynı zamanda mükemmel performans, ölçeklenebilirlik ve ekonomiklik sağlar. RustFS'in tek bir kümesi, VM, Oracle, SAP ve MS Office'teki herhangi bir şey için Commvault endpoint'i olarak kullanılabilir.

## Ana Uygulama Senaryoları

### 🖥️ VMware ESXi için Commvault Yedeklemeleri RustFS Kullanarak

Commvault kullanarak sanal altyapıyı nesne depolamaya sorunsuz bir şekilde yedekleyin, size neredeyse sınırsız nesne depolama kapasitesi esnekliği sağlar. Maliyet ve güvenliği kontrol edebilir, böylece verilere nasıl erişildiğini kontrol edebilirsiniz.

### 📧 Office 365 için Commvault Yedeklemeleri RustFS Kullanarak

Commvault kullanarak Office 365 verilerini nesne depolamaya sorunsuz bir şekilde yedekleyin, size neredeyse sınırsız nesne depolama kapasitesi esnekliği sağlar. Maliyet ve güvenliği kontrol edebilir, böylece verilere nasıl erişildiğini kontrol edebilirsiniz.

### 💼 SAP HANA için Commvault Yedeklemeleri RustFS Kullanarak

RustFS ile SAP HANA için Commvault yedekleme çözümü daha hızlı ve güvenli.

### 🗄️ Oracle için Commvault Yedeklemeleri RustFS Kullanarak

Oracle iş yüklerini yedeklemek performans, esneklik ve güvenlik gerektirir. Bu kritik yedekleme görevini optimize etmek için RustFS nesne depolama kullanın.
