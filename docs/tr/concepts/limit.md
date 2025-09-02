---
title: "Kullanım Sınırlamaları"
description: "RustFS, basit, verimli ve dağıtık bir nesne depolama sistemidir. %100 S3 uyumludur ve Apache2 lisansı altında yayınlanan açık kaynak yazılımdır."
---

# Kullanım Sınırlamaları

## I. S3 API Sınırlamaları

> Aşağıdaki standartlar S3 protokol standartlarına sıkı sıkıya uygun olarak belirlenmiştir.

| Öğe | Özellik |
| --------------------- | ---------------------------------- |
| Maksimum nesne boyutu | 5 TiB |
| Minimum nesne boyutu | 0 B |
| Tek PUT işlemi için maksimum nesne boyutu | Parça yükleme olmayan: 500 GiB; Parça yükleme: 5 TiB |
| Her yükleme için maksimum parça sayısı | 10,000 |
| Parça boyutu aralığı | 5 MiB ile 5 GiB arası; son parça 0 B ile 5 GiB arası olabilir |
| Her parça listesi isteği için dönen maksimum parça sayısı | 10,000 |
| Her nesne listesi isteği için dönen maksimum nesne sayısı | 1,000 |
| Her parça yükleme listesi isteği için dönen maksimum parça yükleme sayısı | 1,000 |
| Depolama kovası adının maksimum uzunluğu | 63 karakter |
| Nesne adının maksimum uzunluğu | 1024 karakter |
| Her `/` ile ayrılan nesne adı segmentinin maksimum uzunluğu | 255 karakter |
| Tek nesne için maksimum sürüm sayısı | 10,000 (yapılandırılabilir) |

---

## II. Silme Kodlama Sınırlamaları

> EC parametreleri, Reed-Solomon matrisine dayalı EC algoritmasına göre yapılandırılır. Gerçek EC parametre yapılandırmasına göre belirlenir.

| Öğe | Özellik |
| ---------------------------- | ------------------------------ |
| Her küme için maksimum sunucu sayısı | Sınırsız |
| Minimum sunucu sayısı | 1 |
| Sunucu sayısı 1 olduğunda, her sunucu için minimum sürücü sayısı | 1 (tek düğüm tek sürücü dağıtımı için uygundur, ek güvenilirlik veya kullanılabilirlik sağlayamaz) |
| Sunucu sayısı 2 veya daha fazla olduğunda, her sunucu için minimum sürücü sayısı | 1 |
| Her sunucu için maksimum sürücü sayısı | Sınırsız |
| Okuma quorum sayısı | N/2 |
| Yazma quorum sayısı | (N/2) + 1 |

---

## III. Nesne Adlandırma Sınırlamaları

### Dosya Sistemi ve İşletim Sistemi Sınırlamaları

RustFS'deki nesne adları, temel işletim sistemi ve dosya sistemi sınırlamalarına tabidir. Örneğin, Windows ve diğer bazı işletim sistemleri `^`, `*`, `|`, `\`, `/`, `&`, `"` veya `;` gibi belirli özel karakterlerin kullanımını kısıtlar.

Lütfen işletim sisteminiz ve dosya sisteminizin özel durumuna göre, tam kısıtlama listesi için ilgili dokümantasyona başvurun.

RustFS, daha iyi performans ve uyumluluk için üretim ortamında XFS dosya sistemi tabanlı Linux işletim sistemi kullanmanızı önerir.

### Adlandırma Çakışması İşleme

RustFS'de, uygulamalar tüm nesneler için benzersiz ve çakışmayan anahtarlar atamalıdır. Bu, ebeveyn nesne veya kardeş nesne adlarıyla çakışabilecek adlara sahip nesneler oluşturmaktan kaçınmayı içerir. RustFS, çakışma meydana gelen konumda LIST işlemi gerçekleştirirken boş küme döndürür.

Örneğin, aşağıdaki işlemler ad alanı çakışmasına neden olur:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Mevcut nesne öneki ile çakışma

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Mevcut nesne ile çakışma
```

Bu nesneler üzerinde GET veya HEAD işlemleri gerçekleştirebilmenize rağmen, ad çakışması `hello/2025/first/` yolunda LIST işlemi gerçekleştirirken boş sonuç kümesi döndürülmesine neden olur.
