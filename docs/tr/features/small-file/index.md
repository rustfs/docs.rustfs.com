# Küçük Dosya Optimizasyonu
> Ultra Yüksek Performanslı İş Yükleri için Bellek Nesne Depolama Oluşturma
IOPS ve aktarım performansı gerektiren iş yükleri için sunucu DRAM'ini kullanarak dağıtılmış paylaşılan bellek havuzları oluşturun.

## Arka Plan
RustFS küçük dosya optimizasyonu, IOPS ve aktarım performansı gerektiren iş yükleri için idealdir. Modern mimarilerde, bu giderek daha fazla AI/ML iş yüklerini ifade etmektedir. Önbellekleme olmadan, G/Ç GPU'lar için bir darboğaz haline gelebilir.
Kurumsal önbellekleme kullanarak, eğitim, doğrulama ve test veri setlerini içeren kovaları bellekte tutmak için kullanılır.

## Özellikler
### 🗃️ Özel Nesne Önbelleği
RustFS küçük dosya optimizasyonu, özellikle dosya nesnelerini önbelleklemek için tasarlanmıştır.
Mevcut nesne önbelleğinde bir nesne bulunamazsa, nesneyi otomatik olarak alacak, gelecekteki istekler için önbelleğe alacak ve nesneyi çağrıyı yapan kişiye iade edecektir.

### 💾 Tutarlı Karmalaşma Algoritması
RustFS'nin küçük dosya optimizasyonu içeriğe öncelik verir.
Tutarlı karma algoritmaları kullanarak önbelleğe alınmış nesne verilerini önbellek düğümleri (akranlar olarak adlandırılır) kümesi boyunca dağıtır. Tutarlı karma, nesnelerin nesnenin anahtarı temelinde kolayca bulunmasını sağlar. Bu, nesnenin anahtar değeri ile önbelleğe alınmış nesneyi tutan düğüm arasında bire bir ilişki oluşturur. Ayrıca, düğümlerin aynı miktarda veriyi içermesini sağlayarak, bir düğümün aşırı yüklenmesini ve diğerlerinin boş kalmasını önler. Daha da önemlisi, düğümler eklenirse veya çıkarılırsa, sistemi hizalamak için yalnızca minimum düzeyde yeniden düzenleme gerektirir.

### 🧹 Yuvarlak Önbellek Bellek Yönetimi
RustFS, bellek yönetimi için yuvarlak önbellek kullanır. RustFS, toplam önbellek boyutunu küçük dosya optimizasyon yapılandırmasında belirtilen sınırlar içinde tutmak için yuvarlak önbellek kullanır. Yeni nesneler eklenmesi önbellek boyutunun belirtilen sınırı aşmasına neden olursa, bir veya daha fazla nesne, nesnenin son isteğinin zaman damgasına göre kaldırılır.

### 🔄 Otomatik Sürüm Güncellemeleri
Yeni nesne sürümlerini otomatik olarak günceller. Önbelleğe alınmış bir nesne güncellenmişse, RustFS nesne depolama alanı otomatik olarak önbelleği yeni nesne sürümüyle günceller.

### 🧩 Sorunsuz API Entegrasyonu
RustFS küçük dosya optimizasyonu, RustFS'nin arka planda çalışan bir uzantısıdır. Küçük dosya optimizasyonu RustFS'nin bir uzantısı olduğu için, geliştiricilerin yeni API'ler öğrenmesine gerek yoktur. Geliştiriciler, öncekiyle aynı API'leri kullanmaya devam eder. İstenen nesne önbellekteyse, RustFS otomatik olarak önbellekten alacaktır. Bir nesne önbelleğe alınmalı ve ilk kez isteniyorsa, RustFS nesneyi nesne depolama alanından alacak, çağrıyı yapan kişiye iade edecek ve sonraki istekler için önbelleğe alacaktır.
