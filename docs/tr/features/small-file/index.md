---
title: "Küçük Dosya Optimizasyonu"
description: "Ultra yüksek performanslı iş yükleri için bellek nesne depolama"
---

# Küçük Dosya Optimizasyonu

> Ultra yüksek performanslı iş yükleri için bellek nesne depolama oluşturun

Sunucu DRAM'ini kullanarak, yüksek IOPS ve verim performansı gerektiren iş yükleri için dağıtık paylaşılan bellek havuzu oluşturun.

## Arka Plan

RustFS küçük dosya optimizasyonu, IOPS ve verim performansı gerektiren iş yükleri için mükemmeldir. Modern mimarilerde, bu giderek AI/ML iş yükleri anlamına gelir. Önbellek olmadan, I/O GPU için darboğaz haline gelebilir.

Kurumsal önbellek kullanarak, eğitim, doğrulama ve test veri setlerini içeren depolama kovaları, bellek tabanlı sağlama için bellekte saklanabilir.

## Özellikler

### 🗃️ Özel Nesne Önbelleği

RustFS küçük dosya optimizasyonu, dosya nesnelerini önbelleğe almak için özel olarak tasarlanmıştır.
Eğer bir nesne mevcut nesne önbelleğinde bulunamazsa, otomatik olarak o nesneyi alacak, gelecekteki istekler için önbelleğe alacak ve o nesneyi çağırana geri döndürecektir.

### 💾 Tutarlı Hash Algoritması

RustFS'in küçük dosya optimizasyonu, içeriği öncelik olarak kullanır.
Tutarlı hash algoritması kullanarak önbellek nesne verilerini önbellek düğümleri kümesine (eş düğümler olarak adlandırılır) dağıtır. Tutarlı hash, nesnelerin anahtarlarına göre kolayca bulunmasını sağlar. Bu, nesnelerin anahtar değerleri ile önbellek nesnelerini saklayan düğümler arasında bire bir ilişki oluşturur. Ayrıca düğümlerin aynı miktarda veri içermesini sağlar, böylece bir düğüm aşırı yüklenirken diğer düğümler boşta kalmaz. Ancak daha da önemlisi, nesneleri öyle bir şekilde dağıtır ki, eğer düğümler eklenir veya çıkarılırsa, sistemi hizalamak için sadece minimal yeniden düzenleme gerekir.

### 🧹 Kayan Önbellek Bellek Yönetimi

RustFS, bellek yönetimi için kayan önbellek kullanır. RustFS, önbelleğin toplam boyutunu küçük dosya optimizasyon yapılandırmasında belirtilen sınırlar içinde tutmak için kayan önbellek kullanır. Eğer yeni bir nesne eklemek önbellek boyutunun belirtilen sınırı aşmasına neden olursa, o nesnenin son kez istendiği zaman damgasına göre bir veya daha fazla nesne silinir.

### 🔄 Otomatik Sürüm Güncelleme

Yeni nesne sürümlerini otomatik olarak günceller. Eğer önbellek nesnesi güncellenmişse, RustFS nesne depolama otomatik olarak önbelleği yeni nesne sürümü ile güncelleyecektir.

### 🧩 Sorunsuz API Entegrasyonu

RustFS küçük dosya optimizasyonu, RustFS'in arka planda çalışan bir uzantısıdır. Küçük dosya optimizasyonu RustFS'in bir uzantısı olduğu için, geliştiriciler yeni API'ler öğrenmek zorunda değildir. Geliştiriciler öncekiyle aynı API'leri kullanır. Eğer istenen nesne önbellekte ise, RustFS otomatik olarak onu önbellekten alacaktır. Eğer bir nesne önbellekte olmalıysa ve ilk kez isteniyorsa, RustFS onu nesne depolamadan alacak, çağırana geri döndürecek ve sonraki istekler için önbelleğe koyacaktır.
