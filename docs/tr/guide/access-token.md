---
title: "RustFS Erişim Anahtarı Yönetimi"
description: "RustFS erişim anahtarlarının oluşturulması, kullanımı ve silinmesi"
---

# Erişim Anahtarı

RustFS erişim anahtarları, kimlik doğrulama ve işlemlere yetkilendirme için temel kimlik bilgileridir. API ve SDK senaryolarında özellikle faydalıdır. Bu bölümde erişim anahtarlarının oluşturulması ve silinmesi açıklanır.

Önkoşullar:

- Kullanılabilir bir RustFS örneği. Kurulum için [yükleme kılavuzuna](../../tr/installation/index.md) bakın.

## Erişim anahtarı oluşturma

1. RustFS UI konsoluna giriş yapın.
1. Sol gezinme menüsünden "Erişim Anahtarları"nı seçin.
1. Erişim anahtarları sayfasında sağ üstte "Erişim Anahtarı Ekle"ye tıklayın.
1. "Son kullanma süresi, ad ve açıklama"yı girip "Gönder"e tıklayın.
1. (İsteğe bağlı ancak önerilir) Açılan anahtar sayfasında "Kopyala" veya "Dışa aktar" ile anahtarı güvenle saklayın.

![access key list page](images/access_token_creation.png)

## Erişim anahtarı silme

1. RustFS UI konsoluna giriş yapın.
1. Sol gezinme menüsünden "Erişim Anahtarları"nı seçin.
1. Silmek istediğiniz anahtarı seçin.
1. Sağ taraftaki "Sil" düğmesine veya sağ üstteki "Seçili olanları sil"e tıklayın.

![access key deletion](images/access_token_deletion.png)