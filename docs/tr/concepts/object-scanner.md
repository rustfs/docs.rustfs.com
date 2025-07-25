---
title: "Nesne Tarama"
description: "RustFS, basit, verimli, dağıtık bir nesne depolama sistemidir. Tamamen S3 uyumludur ve Apache2 lisansı altında açık kaynaklı bir yazılımdır."
---
# Nesne Tarama

Bu makale, RustFS nesne tarayıcısının tasarımını ve uygulamasını derinlemesine tanıtarak, Silme Kodlaması, Scrub & Repair mekanizmalarıyla entegrasyonunu, zamanlama stratejilerini, izleme metriklerini ve sorun giderme yöntemlerini kapsar.

## Genel Bakış

RustFS nesne tarayıcısı, depolama motoruna entegre edilmiştir ve nesne bütünlüğünü periyodik olarak kontrol etmek ve zamanlanmış işlemleri gerçekleştirmekten sorumludur. Tarama görevleri, disk kullanımı istatistiklerini, yaşam döngüsü yönetim kurallarını değerlendirmeyi, nesne çoğaltmasını gerçekleştirmeyi ve bozulmuş nesnelerin kendi kendini iyileştirmesini tetiklemeyi içerir.

## Mimari ve Tasarım İlkeleri

### Tarayıcı Mimarisi

RustFS tarayıcısı, normal istekler üzerindeki performans etkisini azaltmak için bir hash örnekleme mekanizması kullanır ve nesne adı hashine göre her 1024 nesneden birini denetim için seçer. Tarayıcı, Silme Kodlama modülüyle derinlemesine entegre edilmiştir ve eksik veya bozulmuş parçalar tespit edildiğinde yedek parçalar kullanarak çevrimiçi yeniden yapılandırma gerçekleştirebilir, böylece yüksek veri kullanılabilirliği ve tutarlılığı sağlar.

## Veri Doğrulama ve Kurtarma

RustFS veri doğrulama mekanizmaları, meta veri tutarlılığını hızlıca kontrol edebilirken, sonrakiler bit bit okur ve verileri doğrularak gizli kötü blokları keşfedebilir. Nesne tarayıcısının yürütülmesi, bit çürümesi gibi sorunları tespit edebilir ve gerekli olduğunda onarım süreçlerini tetikleyebilir.

## Tarama Modları ve Zamanlama

RustFS, üç tarama tetikleme modunu destekler: okuma sırasında çevrimiçi tarama, arka plan periyodik tarama ve elle tam tarama, böylece performans ve güvenilirlik dengelenir. Ceph'teki `osd_scrub_begin_hour` yapılandırmasına benzer şekilde, yöneticiler tarama başlangıç zamanlarını ve sıklıklarını ayarlayabilir, örneğin hafif doğrulamayı varsayılan olarak günlük bir kez ayarlayabilir.

## İzleme ve Metrikler

RustFS tarayıcısı, toplam görevleri, hata sayılarını ve zaman dağılımını sayar ve `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` ve `rustfs_scanner_duration_seconds` gibi metrikleri Prometheus veri modeli aracılığıyla ortaya çıkarır. İzleme sistemleriyle birleştirildiğinde, tarama hata oranlarına ve süresine dayalı olarak uyarılar ayarlanabilir, böylece depolama veya ağ düzeyindeki potansiyel sorunlar hızlıca tespit edilebilir ve konumlandırılabilir.