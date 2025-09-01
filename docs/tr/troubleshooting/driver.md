---
title: "Sabit Disk Hasarı"
description: "RustFS erasure code benzeri mekanizma ile bazı disk arızaları sırasında hala okuma-yazma erişimi sağlar ve disk değişimi sonrasında otomatik veri iyileştirme yapar."
---

# RustFS Disk Arızası Giderme Kılavuzu

RustFS erasure code benzeri mekanizma ile bazı disk arızaları sırasında hala okuma-yazma erişimi sağlar ve disk değişimi sonrasında otomatik veri iyileştirme yapar.

## İçindekiler

1. [Arızalı Diski Çıkarma](#arızalı-diski-çıkarma)
2. [Arızalı Diski Değiştirme](#arızalı-diski-değiştirme)
3. [`/etc/fstab` veya RustFS Yapılandırmasını Güncelleme](#etcfstab-veya-rustfs-yapılandırmasını-güncelleme)
4. [Yeni Diski Yeniden Mount Etme](#yeni-diski-yeniden-mount-etme)
5. [Veri İyileştirmesini Tetikleme ve İzleme](#veri-iyileştirmesini-tetikleme-ve-izleme)
6. [Sonraki Kontrol ve Dikkat Edilecek Hususlar](#sonraki-kontrol-ve-dikkat-edilecek-hususlar)

<a id="arızalı-diski-çıkarma"></a>

### Arızalı Diski Çıkarma

Fiziksel sabit diski değiştirmeden önce, dosya sistemi veya RustFS'in değişim sürecinde I/O hatası yaşamasını önlemek için önce işletim sistemi seviyesinde arızalı diski güvenli bir şekilde çıkarmanız gerekir.

```bash
# Arızalı diskin /dev/sdb olduğunu varsayın
umount /dev/sdb
```

> **Açıklama**
>
> * Mount noktası birden fazla ise, ayrı ayrı `umount` çalıştırın.
> * "Cihaz meşgul" hatası alırsanız, önce RustFS hizmetini durdurun:
>
> ```bash
> systemctl stop rustfs
> ```

<a id="arızalı-diski-değiştirme"></a>

### Arızalı Diski Değiştirme

Arızalı diski fiziksel olarak değiştirdikten sonra, yeni diske bölümleme ve formatlama yapmanız ve orijinal diskle aynı etiketi eklemeniz gerekir.

```bash
# ext4 olarak formatla ve DISK1 etiketi ekle (orijinal etiketle eşleşmesi gerekir)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Gereksinimler**
>
> * Yeni disk kapasitesi ≥ orijinal disk kapasitesi;
> * Dosya sistemi türü diğer disklerle tutarlı olmalı;
> * Disk sırasının sistem yeniden başlatmasından etkilenmemesi için etiket (LABEL) veya UUID ile mount etmeyi öneririz.

<a id="etcfstab-veya-rustfs-yapılandırmasını-güncelleme"></a>

### `/etc/fstab` veya RustFS Yapılandırmasını Güncelleme

`/etc/fstab` içindeki mount öğesi etiketinin veya UUID'nin yeni diski gösterdiğini onaylayın. RustFS'e özel yapılandırma dosyası (`config.yaml` gibi) kullanıyorsanız, ilgili girişleri de eş zamanlı olarak güncellemelisiniz.

```bash
# Mevcut fstab'ı görüntüle
cat /etc/fstab

# Örnek fstab girişi (aynı etiket durumunda değiştirmeye gerek yok)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **İpucu**
>
> * UUID kullanıyorsanız:
>
> ```bash
> blkid /dev/sdb
> # Yeni bölümün UUID'sini alın, ardından fstab'daki ilgili alanı değiştirin
> ```
> * fstab değişikliği sonrası mutlaka syntax kontrolü yapın:
>
> ```bash
> mount -a # Hata yoksa, yapılandırma doğrudur
> ```

<a id="yeni-diski-yeniden-mount-etme"></a>

### Yeni Diski Yeniden Mount Etme

Tüm diskleri toplu mount etmek ve RustFS hizmetini başlatmak için aşağıdaki komutları çalıştırın:

```bash
mount -a
systemctl start rustfs
```

Tüm disklerin normal mount edildiğini onaylayın:

```bash
df -h | grep /mnt/disk
```

> **Not**
>
> * Bazı mount işlemleri başarısız olursa, fstab girişlerinin disk etiket/UUID'leri ile tutarlı olup olmadığını kontrol edin.

<a id="veri-iyileştirmesini-tetikleme-ve-izleme"></a>

### Veri İyileştirmesini Tetikleme ve İzleme

RustFS yeni diski tespit ettikten sonra, otomatik veya manuel olarak veri iyileştirme (heal) sürecini tetikleyecektir. Aşağıdaki örnekte varsayımsal `rustfs-admin` aracı kullanılmıştır:

```bash
# Mevcut disk durumunu görüntüle
rustfs-admin disk status

# Yeni disk için manual iyileştirmeyi tetikle
rustfs-admin heal --disk /mnt/disk1

# İyileştirme ilerlemesini gerçek zamanlı görüntüle
rustfs-admin heal status --follow
```

Aynı zamanda, sistemin diski tanıdığını ve veri kurtarmaya başladığını onaylamak için hizmet loglarını kontrol edebilirsiniz:

```bash
# systemd yönetimli kurulum için
journalctl -u rustfs -f

# Veya özel log dosyasını görüntüle
tail -f /var/log/rustfs/heal.log
```

> **Açıklama**
>
> * İyileştirme süreci arka planda tamamlanacak, genellikle çevrimiçi erişimi minimum düzeyde etkiler;
> * İyileştirme tamamlandıktan sonra, araç başarı rapor eder veya başarısız nesneleri listeler.

<a id="sonraki-kontrol-ve-dikkat-edilecek-hususlar"></a>

### Sonraki Kontrol ve Dikkat Edilecek Hususlar

1. **Performans İzleme**

 * İyileştirme sürecinde I/O hafif dalgalanma gösterebilir, disk ve ağ yükünü izlemeyi öneririz.
2. **Toplu Arızalar**

 * Aynı parti disklerinde birden fazla arıza görülürse, daha sık donanım denetimi düşünülmelidir.
3. **Düzenli Tatbikat**

 * Ekibin kurtarma sürecine aşinalığını sağlamak için düzenli disk arızası simülasyonu yapın.
4. **Bakım Penceresi**

 * Arıza oranı yüksek olduğunda, değiştirme ve iyileştirme hızını artırmak için özel bakım penceresi planlayın.