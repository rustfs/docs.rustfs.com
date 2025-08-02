---
title: "macOS'ta RustFS Kurulumu"
description: "Bu belge, RustFS'nin macOS'ta hızlı başlatma yöntemini açıklar."
---
# macOS'ta RustFS Kurulumu

macOS'ta, kurulum için üç yöntem kullanabilirsiniz:
1. Docker
2. Grafiksel tek tıklama başlangıç paketi
3. İkili paket

> Bu belge, RustFS **grafiksel tek tıklama başlangıç paketi** kullanarak hızlı RustFS başlatmayı açıklar.

## 1. Hazırlık

Lütfen anlayın:
> **Grafiksel başlangıç modu** yalnızca tek düğüm tek disk modunu destekler, daha çok geliştirme, hata ayıklama ve test ortamları için uygundur.

1. Başlangıç modları hakkında detaylı bilgi için lütfen [Başlangıç Modları](../mode/) bölümüne bakın;
2. Kurulum paketini indirin, izinleri değiştirin ve başlatın.

## 2. İndirme

Resmi web sitesi indirme sayfasına gidin ve en son RustFS kurulum paketini indirin.

## 3. İzinleri Değiştirme

Lütfen bu programın macOS işletim sisteminde ilgili yürütme izinlerine sahip olduğunu doğrulayın.

## Başlatma Simgesine Çift Tıklayın

1. Başlatma simgesine çift tıklayın;
2. Disk yapılandırmasını değiştirin;
3. "Servisi Başlat"a tıklayın, RustFS servisi başarıyla başlar.

<img src="./images/macos-setup.jpg" alt="macOS başlangıç" />

## 4. Yapılandırmayı Değiştirme

Sağ üst köşedeki değiştirme düğmesine (dişli şeklinde düğme) tıklayarak aşağıdakileri değiştirin:

1. Sunucu varsayılan portu;
2. Varsayılan yönetici kullanıcı adı ve şifresi;
3. Belirtilen disk dizini;

<img src="./images/setting.jpg" alt="RustFS macOS yapılandırması" />

## 5. Konsola Erişim

Başarılı bir şekilde başlatıldıktan sonra, `http://127.0.0.1:7001` adresini ziyaret ederek konsola erişin.