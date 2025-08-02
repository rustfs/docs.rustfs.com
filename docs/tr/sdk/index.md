---
title: "SDK Genel Bakış"
description: "RustFS ile hangi S3 SDK'ları kullanılabilir? Bu makale detaylı bilgi sağlar."
---

# SDK Genel Bakış

RustFS, S3 protokolüyle %100 uyumlu dağıtık bir nesne depolama yazılımıdır. Kullanıcılar şu yöntemlerle RustFS'i yönetebilir:

1. Konsol yönetim arayüzü üzerinden
2. S3 istemcileri aracılığıyla
3. İş mantığı tarafında SDK'lar kullanarak nesne depolama işlemleri ve yönetimi gerçekleştirme

## Okumadan Önce Terimler

S3, Amazon'un ilk kez hizmete sunduğu nesne depolama ürününün adıdır. Tüm protokol ve spesifikasyonlarını açık kaynak olarak yayınlamışlardır. Sonrasında neredeyse tüm nesle depolama sistemleri S3 protokol ve spesifikasyonlarını takip etmiştir.
Bazı durumlarda S3 nesne depolama olarak adlandırılırken, bazen de doğrudan nesle depolama protokolü olarak anılır.

## 1. SDK Önerileri

Piyasada uzun yıllardır bakımı yapılan çok sayıda SDK bulunmaktadır. Örneğin AWS S3 SDK yıllardır debug edilmiş ve optimize edilmiştir. Performansı ve hata oranı neredeyse sıfırdır. Bu nedenle, doğrudan standart AWS S3 SDK kullanarak RustFS'i yönetmenizi ve RustFS ile iletişim kurmanızı öneririz.

Eğer aşina olduğunuz ve güvendiğiniz SDK sağlayıcı ürünleri varsa, bunları da kullanabilirsiniz.

Çinli bulut sağlayıcıların birçok noktada yaptığı "değişiklikler" nedeniyle, en yeni S3 teknolojilerinin birçoğu desteklenmemektedir. Bu nedenle dünya genelindeki birçok nesne depolama ürünü, Çinli bulut sağlayıcıların SDK'larını önermemektedir.

## 2. MinIO SDK'ları doğrudan RustFS ile iletişim kurabilir mi?

Evet.

MinIO SDK'ları için kapsamlı uyumluluk ve adaptasyon çalışmaları yapılmıştır.

Eğer MinIO SDK kullanıyorsanız, sadece Endpoint, AK ve SK bilgilerini değiştirerek RustFS ile uyumlu hale getirebilirsiniz.

## 3. Uyumsuz SDK'lar için ne yapılmalı?

Eğer belirli bir bulut sağlayıcının SDK'sını kullanıyorsanız ve bu SDK en yeni S3, MinIO ve RustFS'i desteklemiyorsa ne yapmalısınız?
En kısa sürede SDK'nızı değiştirmeli ve iş mantığı tarafında yeniden eşleştirme ve yükseltme yapmalısınız.