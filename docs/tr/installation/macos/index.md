---
title: "MacOS'ta RustFS Kurulumu"
description: "Bu makale, RustFS'in MacOS altındaki hızlı başlatma yöntemlerini açıklar"
---

# MacOS'ta RustFS Kurulumu

MacOS altında üç yöntem kullanılabilir:

1. Docker
2. Grafiksel tek tıkla başlatma paketi
3. İkili paket

> Bu makale, RustFS'i hızlı bir şekilde başlatmak için **grafiksel tek tıkla başlatma paketi** kullanma modunu açıklar。

## Bir、Hazırlık Çalışması

Lütfen bilgi edinin:

> **Grafiksel başlatma modu** sadece tek makine tek disk modunu destekler, geliştirme, hata ayıklama ve test ortamları için daha uygundur。

1. Başlatma modları hakkında detaylı bilgi için lütfen [Başlatma Modları](../linux/index.md#mode)'na bakın;

2. Kurulum paketini indirin, izinleri değiştirin ve başlatın。

## İki、İndirme

Resmi web sitesinin indirme sayfasına gidin ve en son RustFS kurulum paketini indirin。

## Üç、İzin Değiştirme

Lütfen MacOS işletim sisteminde bu programın ilgili yürütme izinlerine sahip olduğundan emin olun。

## Başlatma Simgesine Çift Tıklama

1. Başlatma simgesine çift tıklayın;

2. Disk yapılandırmasına tıklayın;

3. "Start Service"e tıklayın, RustFS servisi başarıyla başlatılır。

<img src="./images/macos-setup.jpg" alt="macos başlatma" />

## Dört、Yapılandırma Değiştirme

Sağ üst köşedeki değiştirme düğmesine (dişli şeklindeki düğme) tıklayarak şunları değiştirebilirsiniz:

1. Sunucu varsayılan portu;

2. Varsayılan yönetici kullanıcı adı ve şifresi;

3. Belirtilen disk dizini;

<img src="./images/setting.jpg" alt="RustFS windows yapılandırması" />

## Beş、Konsola Erişim

Başarıyla başlatıldıktan sonra, `http://127.0.0.1:7001` adresine giderek konsola erişebilirsiniz。
