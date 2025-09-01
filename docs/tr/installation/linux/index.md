---
title: "RustFS Nedir ve Kurulum Açıklamaları"
description: "RustFS, Apache2 lisansı ile yayınlanan açık kaynaklı dağıtık nesne depolama olan bir nesne depolama çözümüdür."
---

# Bir, RustFS Nedir?

RustFS basit, verimli, dağıtık bir nesne depolamadır, MinIO'nun hızlı alternatifi ve AI eğitimi ve çıkarım nesne depolama senaryolarının kullanımı için uygundur.
Aynı zamanda, RustFS verimli, açık kaynaklı, özgür bir nesne depolama çözümüdür. S3 protokolü ile %100 uyumludur, Apache2 lisansı ile yayınlanan açık kaynaklı yazılımdır. RustFS şu anda dünyanın en popüler, bellek güvenli dili olan Rust dili ile yazılmıştır, özellikle yüksek performans senaryolarının kullanımı için uygundur, RustFS dünyanın dört bir yanından üstün mühendislerin katıldığı ve katkıda bulunduğu ticari dostu dağıtık nesne depolama ürünüdür, RustFS çok sayıda dostça olmayan açık kaynaklı protokol nesne depolama ürününün alternatifi olabilir.

RustFS ticari uygulamadan açık kaynağa resmi olarak geçmek üzere, küresel olarak yayınlanarak dünyanın depolama maliyetlerini düşürmesine, veri güvenliğini artırmasına yardımcı olmak üzere.



## İki, Kurulumdan Önce Okunması Gerekenler

RustFS'de üç kurulum modu bulunur, tek makine tek disk uygun, tek makine çok disk ve çok makine çok disk modu. Bunlardan, çok makine çok disk modu kurumsal düzeyde kullanılabilir performans, güvenlik ve ölçeklenebilirlik içerir. Ve üretim iş yükleri için gerekli mimari diyagramını sağlar. Lütfen kurmadan önce okuyun, başlatma modumuz ve kontrol listemiz aşağıdaki gibidir:

1. Lütfen üç kurulum başlatma modunuzu belirleyin:

    - [Tek makine tek disk modu (SNSD)](./single-node-single-disk.md)   
    - [Tek makine çok disk modu (SNMD)](./single-node-multiple-disk.md)
    - [Çok makine çok disk modu (MNMD)](./multiple-node-multiple-disk.md) 

2. [Kurulum öncesi kontrol](../checklists/index.md), tüm göstergelerin üretim rehber özelliklerine uygun olduğundan emin olun, üretim standardına ihtiyaç yoksa bu rehberi okumayabilirsiniz;



## Üç, İşletim Sistemi ve CPU Desteği

RustFS'yi neredeyse her CPU ve işletim sisteminde çalıştırabilirsiniz, Linux, Unix, Windows, MacOS, FreeBSD, Docker, hatta edge gateway'lerde bile RustFS çalıştırabilirsiniz.
CPU mimarisi desteği: X86, ARM vb. birden çok CPU mimarisi.

## Dört, RustFS'nin Özellikleri

- **S3 Uyumlu**: S3 protokolü ile %100 uyumlu, büyük veri, veri gölleri, yedekleme yazılımları, görüntü işleme yazılımları, endüstriyel üretim yazılımları ile mükemmel uyumluluk;
- **Dağıtık**: RustFS dağıtık bir nesne depolamadır, bu nedenle RustFS çeşitli ihtiyaçları karşılayabilir;
- **Ticari Dostu**: RustFS %100 açık kaynaklı yazılımdır ve Apache v2.0 lisansı ile yayınlanır, bu nedenle RustFS ticari dostudur;
- **Hızlı**: Rust geliştirme dilinin performansı C dilinin hızına sonsuza kadar yakındır. Bu nedenle RustFS'nin performansı çok güçlüdür;
- **Güvenli**: RustFS bellek güvenli Rust dili ile yazılmıştır, bu nedenle RustFS %100 güvenlidir;
- **Platform Bağımsız**: RustFS Windows, macOS ve Linux'ta çalışır;
- **Genişletilebilir**: RustFS özel eklentileri destekler, bu nedenle RustFS çeşitli ihtiyaçları karşılayabilir;
- **Özelleştirilebilir**: Açık kaynaklı özelliği nedeniyle çeşitli eklentiler özelleştirebilirsiniz, bu nedenle RustFS çeşitli ihtiyaçları karşılayabilir;
- **Bulut Dostu**: RustFS Docker vb. yöntemlerle dağıtımı destekler, bulut dostu ortamda hızlı dağıtım yapabilir.

## Beş, RustFS Değerleri

Tüm insanlığın veri güvenliğini artırmasına, depolama maliyetlerini düşürmesine yardımcı olmak.

## Altı, RustFS'nin Vizyonu

Dünyadaki her kişisel AI ajanının veri depolamak için RustFS kullanabilmesi.

