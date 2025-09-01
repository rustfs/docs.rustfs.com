---
title: "RustFS SDK Genel Bakış"
description: "RustFS hangi S3 SDK'larını kullanabilir? Bu makalede detaylı açıklama yapılmıştır."
---

# SDK Genel Bakış

RustFS, S3 protokolü ile %100 uyumlu dağıtık nesne depolama yazılımıdır. Kullanıcılar şu yöntemlerle yönetebilir:

1. Console kontrol paneli ile RustFS'yi yönetme;
2. S3 istemcileri aracılığıyla RustFS'yi yönetme;
3. İş tarafında SDK aracılığıyla nesne depolama işlemleri ve yönetimi gerçekleştirme.

Şu anda RustFS'nin sağladığı SDK'lar şunları içerir:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)

## Okumadan Önce Terim Açıklamaları

S3, Amazon'un en erken açtığı ve sunduğu nesne depolama ürününün adıdır. Ve tüm protokol ve spesifikasyonlarını açmıştır. Daha sonra, neredeyse tüm nesne depolamalar S3'ün protokol ve spesifikasyonlarını takip etmiştir. Bazen insanlar S3'ü nesne depolama olarak adlandırır, bazen de S3'ü nesne depolama protokolü olarak kısaltır.

## 1. SDK Önerileri

Piyasada zaten yıllar boyunca korunan çok fazla SDK bulunduğu için. AWS S3 SDK gibi yıllar süren hata ayıklama ve optimizasyon geçirmiştir. Performansı, hataları neredeyse 0'dır. Bu nedenle, standart AWS S3 SDK'sını doğrudan kullanarak RustFS'yi kontrol etmenizi ve RustFS ile iletişim kurmanızı öneriyoruz.

Aşina olduğunuz SDK ve güvendiğiniz SDK üreticisinin ürünü varsa hepsini kullanabilirsiniz.

Çin bulut üreticileri birçok yerde "sihirli değişiklikler" yaptığı için. Birçok en yeni S3 teknolojisini desteklememektedirler. Bu nedenle, dünya çapında birçok nesne depolama ürünü Çin'deki birçok bulut üreticisinin SDK'sını pek önermemektedir.



## 2. MinIO SDK'sı RustFS ile Doğrudan İletişim Kurabilir mi?

Evet.

MinIO SDK'sı için kapsamlı uyarlama ve uyumluluğu gerçekleştirdik.

MinIO SDK'sını kullanıyorsanız, Endpoint ve AK, SK'yi değiştirdikten sonra doğrudan RustFS ile uyumlu olabilir.


## 3. Diğer Uyumlu Olmayan SDK'lar Olursa Ne Yapılır?

Bir bulut üreticisinin SDK'sını kullanıyoruz, en yeni S3, MinIO ve RustFS'yi desteklemiyor nasıl işlem yapmalıyız?
Lütfen mümkün olan en kısa sürede SDK'yı değiştirin, iş tarafında yeniden eşleştirme ve yükseltme yapın.

