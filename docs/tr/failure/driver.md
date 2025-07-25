---
title: "Sabit Disk Arızası"
description: "RustFS, silme kodlama benzeri mekanizmalar aracılığıyla kısmi disk arızaları sırasında okuma/yazma erişimini sağlar ve disk değiştirildikten sonra verileri otomatik olarak onarır."
---
# Sabit Disk Arızası

RustFS, silme kodlama benzeri mekanizmalar aracılığıyla kısmi disk arızaları sırasında okuma/yazma erişimini sağlar ve disk değiştirildikten sonra verileri otomatik olarak onarır.

---

### İçindekiler

1. [Arızalı Diski Bağlantısını Kesme](#1-arızalı-diskin-bağlantısını-kesme)
2. [Arızalı Diski Değiştirme](#2-arızalı-diskin-değiştirilmesi)
3. [`/etc/fstab` veya RustFS Yapılandırmasını Güncelleme](#3-etcfstab-veya-rustfs-yapılandırmasını-güncelleme)
4. [Yeni Diski Yeniden Bağlama](#4-yeni-diskin-yeniden-bağlanması)
5. [Veri Onarımını Tetikleme ve İzleme](#5-veri-onarımını-tetikleme-ve-izleme)
6. [Sonraki Kontroller ve Dikkat Edilmesi Gerekenler](#6-sonraki-kontroller-ve-dikkat-edilmesi-gerekenler)

---

### 1) Arızalı Diskin Bağlantısını Kesme

Fiziksel sabit diski değiştirmeden önce, işletim sistemi seviyesinden arızalı diskin bağlantısını güvenli bir şekilde kesmelisiniz, böylece değiştirme süreci sırasında dosya sistemi veya RustFS G/Ç hataları oluşmaz.

```bash
# Arızalı diskin /dev/sdb olduğunu varsayalım
umount /dev/sdb
```

> **Not**
>
> * Birden fazla bağlama noktası varsa, her biri için ayrı ayrı `umount` komutunu çalıştırın.
> * "Aygıt meşgul" hatası alırsanız, önce RustFS servisini durdurabilirsiniz:
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Arızalı Diskin Değiştirilmesi

Arızalı diski fiziksel olarak değiştirdikten sonra, yeni diski bölümlendirmeniz, biçimlendirmeniz ve orijinal diskle aynı etiketi vermeniz gerekir.

```bash
# ext4 olarak biçimlendirin ve DISK1 olarak etiketleyin (orijinal etiketle eşleşmelidir)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Gereksinimler**
>
> * Yeni disk kapasitesi ≥ orijinal disk kapasitesi;
> * Dosya sistemi türü diğer disklerle tutarlı olmalıdır;
> * Bağlama için LABEL veya UUID kullanmanız önerilir, böylece disk sırası sistem yeniden başlatmalarından etkilenmez.

---

### 3) `/etc/fstab` veya RustFS Yapılandırmasını Güncelleme

`/etc/fstab` içindeki bağlama girişlerinin etiketlerinin veya UUID'lerinin yeni diski işaret ettiğini doğrulayın. RustFS özel yapılandırma dosyaları kullanıyorsanız (örneğin `config.yaml`), ilgili girişleri de eşzamanlı olarak güncellemeniz gerekir.

```bash
# Mevcut fstab'ı görüntüleyin
cat /etc/fstab
# fstab giriş örneği (etiketler aynıysa değişiklik gerekmez)
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
>
> * fstab'ı değiştirdikten sonra, söz dizimini mutlaka doğrulayın:
>
> ```bash
> mount -a # Hata yoksa, yapılandırma doğrudur
> ```

---

### 4) Yeni Diskin Yeniden Bağlanması

Tüm diskleri toplu olarak bağlamak ve RustFS servisini başlatmak için aşağıdaki komutları çalıştırın:

```bash
mount -a
systemctl start rustfs
```

Tüm disklerin normal şekilde bağlandığını doğrulayın:

```bash
df -h | grep /mnt/disk
```

> **Not**
>
> * Bazı bağlamalar başarısız olursa, lütfen fstab girişlerinin disk etiketleri/UUID'leri ile tutarlı olup olmadığını kontrol edin.

---

### 5) Veri Onarımını Tetikleme ve İzleme

RustFS, yeni diski algıladıktan sonra veri onarım sürecini otomatik veya manuel olarak tetikleyecektir. Aşağıdaki örnek, varsayımsal `rustfs-admin` aracını kullanır:

```bash
# Mevcut disk durumunu görüntüleyin
rustfs-admin disk status
# Yeni disk için manuel olarak onarımı tetikleyin
rustfs-admin heal --disk /mnt/disk1
# Onarım ilerlemesini gerçek zamanlı olarak görüntüleyin
rustfs-admin heal status --follow
```

Aynı zamanda, hizmet günlüklerini görüntüleyerek sistemin onarımı tanıdığını ve veri kurtarmaya başladığını doğrulayabilirsiniz:

```bash
# systemd tarafından yönetilen kurulumlar için
journalctl -u rustfs -f
# Veya özel günlük dosyalarını görüntüleyin
tail -f /var/log/rustfs/heal.log
```

> **Not**
>
> * Onarım süreci arka planda tamamlanacak ve genellikle çevrimiçi erişim üzerinde minimal etkiye sahip olacaktır;
> * Onarım tamamlandığında, araç başarılı olduğunu veya başarısız nesneleri listeleyecektir.

---

### 6) Sonraki Kontroller ve Dikkat Edilmesi Gerekenler

1. **Performans İzleme**
   * Onarım sırasında G/Ç'de hafif dalgalanmalar olabilir; disk ve ağ yükünü izlemeniz önerilir.

2. **Toplu Arızalar**
   * Aynı parti disklerde birden fazla arıza meydana gelirse, daha sık donanım kontrolleri düşünün.

3. **Düzenli Tatbikatlar**
   * Disk arıza tatbikatlarını düzenli olarak simüle edin, böylece ekip kurtarma prosedürleriyle aşina olsun.

4. **Bakım Windows**
   * Arıza oranları yüksek olduğunda, değiştirme ve onarım hızını artırmak için özel bakım windows planlayın.