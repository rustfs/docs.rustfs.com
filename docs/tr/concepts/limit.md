---
title: "Kullanım Limitleri"
description: "RustFS, basit, verimli, dağıtık bir nesne depolama sistemidir. Tamamen S3 uyumludur ve Apache2 lisansı altında açık kaynaklı bir yazılımdır."
---
# Kullanım Limitleri

## 1. S3 API Limitleri

> Aşağıdaki standartlar, spesifikasyon için S3 protokol standartlarını sıkı bir şekilde takip eder.

| Öğe | Spesifikasyon |
| --------------------- | ---------------------------------- |
| Maksimum nesne boyutu | 5 TiB |
| Minimum nesne boyutu | 0 B |
| Tekil PUT işlemi için maksimum nesne boyutu | Çok parçalı olmayan yükleme: 500 GiB; Çok parçalı yükleme: 5 TiB |
| Yükleme başına maksimum parça sayısı | 10,000 |
| Parça boyutu aralığı | 5 MiB ile 5 GiB; son parça 0 B ile 5 GiB olabilir |
| Liste parçaları isteği başına döndürülen maksimum parça sayısı | 10,000 |
| Liste nesneleri isteği başına döndürülen maksimum nesne sayısı | 1,000 |
| Liste çok parçalı yüklemeler isteği başına döndürülen maksimum çok parçalı yükleme sayısı | 1,000 |
| Kovası adı maksimum uzunluğu | 63 karakter |
| Nesne adı maksimum uzunluğu | 1024 karakter |
| Her `/` ile ayrılmış nesne adı segmentinin maksimum uzunluğu | 255 karakter |
| Tekil nesne başına maksimum sürüm sayısı | 10,000 (yapılandırılabilir) |

## 2. Silme Kodlama Limitleri

> EC parametreleri, Reed-Solomon matris EC algoritmasına göre yapılandırılır. Gerçek EC parametre yapılandırmasına tabidir.

| Öğe | Spesifikasyon |
| ---------------------------- | ------------------------------ |
| Küme başına maksimum sunucu sayısı | Sınırsız |
| Minimum sunucu sayısı | 1 |
| Sunucu sayısı 1 olduğunda, sunucu başına minimum sürücü sayısı | 1 (tek düğüm tek sürücü dağıtımı, ek güvenilirlik veya kullanılabilirlik sağlayamaz) |
| Sunucu sayısı 2 veya daha fazla olduğunda, sunucu başına minimum sürücü sayısı | 1 |
| Sunucu başına maksimum sürücü sayısı | Sınırsız |
| Okuma quorum sayısı | N/2 |
| Yazma quorum sayısı | (N/2) + 1 |

## 3. Nesne Adlandırma Limitleri

### Dosya Sistemi ve İşletim Sistemi Limitleri

RustFS'deki nesne adları, temel işletim sistemi ve dosya sistemi tarafından sınırlandırılır. Örneğin, Windows ve bazı diğer işletim sistemleri `^`, `*`, `|`, `\`, `/`, `&`, `"`, veya `;` gibi belirli özel karakterlerin kullanımını kısıtlar.

Kullandığınız özel işletim sistemi ve dosya sistemine göre kısıtlamaların tam listesini ilgili belgelerden kontrol edin.

RustFS, üretim ortamlarında daha iyi performans ve uyumluluk için XFS dosya sistemine dayalı Linux işletim sistemlerini kullanmanızı önerir.

### Ad Çakışması Yönetimi

RustFS'de, uygulamalar tüm nesnelere benzersiz ve çakışmayan anahtarlar atamalıdır. Bu, ebeveyn nesne veya kardeş nesne adlarıyla çakışabilecek nesnelerin oluşturulmasından kaçınmayı içerir. RustFS, çakışmaların meydana geldiği konumlarda LIST işlemleri gerçekleştirirken boş bir küme döndürecektir.

Örneğin, aşağıdaki işlemler ad alanı çakışmalarına neden olur:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Mevcut nesne önekiyle çakışır
PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Mevcut nesneyle çakışır
```

Bu nesneler üzerinde GET veya HEAD işlemleri gerçekleştirebilirsiniz, ancak ad çakışmaları `hello/2025/first/` yolunda yürütülen LIST işlemlerinin boş sonuç setleri döndürmesine neden olacaktır.