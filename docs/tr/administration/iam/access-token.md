---
title: "RustFS Erişim Anahtarı Yönetimi"
description: "RustFS erişim anahtarlarının oluşturulması, kullanılması ve silinmesi."
---

# Erişim Anahtarı

RustFS erişim anahtarı, RustFS sisteminin temel kimlik bilgisidir ve kimlik doğrulama ve işlem yetkilendirmesi için kullanılır; API ve SDK senaryolarında çok kullanışlıdır. Bu bölüm RustFS erişim anahtarlarının oluşturulması ve silinmesini tanıtır.

Ön koşullar:

- Kullanılabilir bir RustFS örneği. Kurulum için [Kurulum Kılavuzu](../../installation/index.md)'na başvurabilirsiniz.

## Erişim Anahtarı Oluşturma

1. RustFS UI konsoluna giriş yapın.
1. Sol navigasyon çubuğunda **Erişim Anahtarları**'nı seçin.
1. Erişim anahtarları sayfasında, sağ üst köşede **Erişim Anahtarı Ekle**'ye tıklayın.
1. Anahtarın **son kullanma tarihi, adı ve açıklaması**'nı girin, ardından **Gönder**'e tıklayın.
1. (İsteğe bağlı ama önerilir). Görünen erişim anahtarı sayfasında, erişim anahtarını kaydetmek için **Kopyala** veya **Dışa Aktar**'ı seçin ve sonraki kullanımlar için saklayın.

![access key list page](images/access_token_creation.png)

## Erişim Anahtarı Silme

1. RustFS UI konsoluna giriş yapın.
1. Sol navigasyon çubuğunda **Erişim Anahtarları**'nı seçin.
1. Erişim anahtarları sayfasında, silmek istediğiniz erişim anahtarını seçin.
1. Erişim anahtarının sağındaki **Sil** düğmesini veya sağ üst köşedeki **Seçilenleri Sil**'i seçerek erişim anahtarını silin.

![access key deletion](images/access_token_deletion.png)