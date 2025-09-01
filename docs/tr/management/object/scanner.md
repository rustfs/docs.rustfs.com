---
title: "Nesne Tarama"
description: "RustFS, basit, verimli, dağıtılmış bir nesne depolama çözümüdür. %100 S3 uyumludur ve Apache2 lisansı altında yayınlanan açık kaynak yazılımdır."
---

# Nesne Tarama

Bu makale RustFS nesne tarayıcısının tasarımı ve uygulamasını derinlemesine tanıtır; Erasure Coding, Scrub & Repair mekanizmalarıyla entegrasyonunu, zamanlama stratejilerini, izleme metriklerini ve sorun giderme yöntemlerini kapsar.

## Genel Bakış

RustFS nesne tarayıcısı depolama motoruna entegre edilmiştir ve nesne bütünlüğünü periyodik olarak kontrol eder ve önceden tanımlanmış işlemleri yürütür.
Tarama görevleri disk kullanımı istatistikleri, yaşam döngüsü yönetim kurallarının değerlendirilmesi, nesne replikasyonunun yürütülmesi ve bozuk nesne kendi kendine onarımının tetiklenmesi gibi işlevleri içerir.

## Mimari ve Tasarım İlkeleri

### Tarayıcı Mimarisi

RustFS tarayıcısı, normal isteklerin performans etkisini azaltmak için nesne adı hash'ine dayalı olarak her 1024 nesneden birini kontrol etmek üzere seçen bir hash örnekleme mekanizması kullanır.
Tarayıcı, Erasure Coding modülüyle derin entegrasyon sağlar ve kayıp veya bozuk parçalar tespit edildiğinde, yedek parçaları kullanarak çevrimiçi yeniden inşa edebilir, veri yüksek kullanılabilirliği ve tutarlılığını garanti eder.

## Veri Doğrulama ve Kurtarma

RustFS veri doğrulama mekanizması metadata tutarlılığını hızla kontrol edebilir, ikincisi bit düzeyinde okuma yaparak gizli kötü blokları bulmak için verileri doğrular. Nesne tarayıcısının yürütülmesi bit rot gibi sorunları tespit edebilir ve gerektiğinde onarım sürecini tetikleyebilir.

## Tarama Modları ve Zamanlama

RustFS üç tarama tetikleme modunu destekler: okuma sırasında çevrimiçi tarama, arka planda periyodik tarama ve manuel tam tarama; performans ve güvenilirliği dengeler.
Ceph'teki `osd_scrub_begin_hour` yapılandırmasına benzer şekilde, yöneticiler tarama başlangıç saatini ve sıklığını ayarlayabilir, örneğin hafif doğrulamayı günde bir kez varsayılan olarak ayarlayabilir.

## İzleme ve Metrikler

RustFS tarayıcısı toplam görev sayısını, başarısızlık sayısını ve süre dağılımını istatistiksel olarak hesaplar ve Prometheus veri modeli aracılığıyla `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` ve `rustfs_scanner_duration_seconds` gibi metrikleri açığa çıkarır.
İzleme sistemiyle birleştirildiğinde, tarama başarısızlık oranı ve süresine dayalı uyarılar ayarlanabilir, depolama veya ağ katmanlarındaki potansiel sorunlar zamanında tespit edilip lokalize edilebilir.
