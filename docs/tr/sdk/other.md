---
title: "Diğer SDK'lar"
description: "Bu belge, öncelikle RustFS'ta çeşitli dil SDK'larının kullanımını açıklar."
---

# Diğer SDK'lar

Eğer AWS S3, kullandığınız dili resmi olarak desteklemiyorsa, RustFS ile entegrasyon için aşağıdaki stratejileri benimseyebilirsiniz:

## 1. Doğrudan HTTP Arayüzü İstekleri (S3 API Protokolüne Dayalı)

S3 protokolü standart bir RESTful API'dir. HTTP isteklerini destekleyen herhangi bir dil (C, Rust, Lua, Erlang gibi) kullanarak erişim mantığını kendiniz oluşturabilirsiniz.

### Önemli noktalar şunlardır:

* **İmza Algoritması**: AWS Signature Version 4 imzalama uygulaması (karmaşık)
* **Doğru Başlıkları ve Kanonik İstekleri Oluşturma**
* **İstek göndermek için HTTPS/HTTP istemcilerini kullanma**

👉 Açık kaynak projelerindeki imza uygulamalarına bakmanızı öneririz, örneğin:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Mevcut SDK'lardan CLI Araçlarını veya Ara Hizmetleri Çağırma

Eğer imzalamayı kendiniz uygulamak istemiyorsanız, şunları yapabilirsiniz:

### 2.1. Mevcut diller tarafından desteklenen AWS CLI araçlarını kullanma

Örneğin, Shell üzerinden çağırma:

```bash
aws s3 cp yerel.txt s3://benim-bucket/benim-dosyam.txt --endpoint-url http://rustfs.local:9000
```

Veya Node.js/Python SDK kullanarak basit bir röle servisi yazabilirsiniz ve diliniz bu servisi yükleme/indirme için çağırabilir.

### 2.2. Bir Proxy Kurma (Örneğin, Flask, FastAPI, Express)

S3'ü desteklemeyen istemcilerin, sarmalanmış HTTP API'nizi çağırmasına izin verin:

```http
POST /upload -> Servis dahili olarak SDK'yı çağırarak nesneleri RustFS'a yükler
GET /presigned-url -> Ön uç/istemci kullanımı için önceden imzalanmış URL'ler oluşturur
```

---

## 3. Üçüncü Taraf Topluluk SDK'larını Arama

AWS'nin resmi SDK'ları olmasa da, bazı dil toplulukları resmi olmayan S3 istemcileri geliştirmiştir. Örneğin:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (kullanım dışı) veya `aws-sdk-rust`
* OCaml: `cohttp` aracılığıyla muhtemelen uygulama
* Delphi: S3 protokolünü destekleyen ticari kütüphaneler

Topluluk SDK'larının kararlılığı büyük ölçüde değişir; kullanmadan önce aktivite, dokümantasyon ve uyumluluğu değerlendirin.

---

## 4. Çekirdek Yükleme Mantığını Platform Barındırmasına Devretme

Örneğin:

* Ön uç (Web/Mobil) yükleme görevlerini tarayıcıya veya uygulama yürütmesine devredin (önceden imzalanmış URL'ler kullanarak)
* Arka uç, yükleme mantığını uygulamak için Node.js/Python/Go proxy kullanır

---

## Özet Öneriler

| Senaryo | Önerilen Çözüm |
| ------------- | ---------------------------------- |
| Tam kontrol/gömülü ortam gereksinimi | Signature V4 kendiniz uygulayın |
| Dil desteği zayıf ama Shell var | AWS CLI üzerinden yüklemeleri çağırın |
| Röle servisi dağıtılabilir | Python/Node kullanarak S3 API ağ geçidi oluşturun |
| Ön uç yüklemeleri | Önceden imzalanmış URL'leri kullanın |