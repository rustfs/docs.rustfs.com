---
title: "Diğer SDK'lar"
description: "Bu makale temelde RustFS'de çeşitli diğer dillerin SDK'larının kullanımını anlatır."
---

# Diğer SDK'lar

AWS S3 resmi olarak kullandığınız dili desteklemiyorsa, RustFS ile entegrasyon için aşağıdaki stratejileri kullanabilirsiniz:

## 1. HTTP Arayüzü ile Doğrudan İstek (S3 API Protokolü Tabanlı)

S3 protokolü standart RESTful API'dir. HTTP isteklerini destekleyen herhangi bir dil (örneğin C, Rust, Lua, Erlang) ile kendi erişim mantığınızı sarmalayabilirsiniz.

### Temel noktalar şunlardır:

* **İmzalama algoritması**: AWS Signature Version 4 imzalamasını uygulayın (karmaşık)
* **Doğru Header ve Canonical Request oluşturun**
* **HTTPS / HTTP istemcisi kullanarak istek gönderin**

👉 Açık kaynak projelerin imzalama uygulamalarına başvurmanızı öneririz, örneğin:

* [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2. Mevcut SDK'nın CLI Araçlarını veya Ara Hizmetlerini Çağırma

Kendi imzalamanızı uygulamak istemiyorsanız, şunları yapabilirsiniz:

### 2.1. Mevcut dil destekli AWS CLI araçlarını kullanın:

Örneğin Shell üzerinden çağrı yapın:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Veya Node.js/Python SDK ile basit bir aktarma hizmeti yazın, diliniz bu hizmeti çağırarak yükleme/indirme yapabilir.

### 2.2. Bir Proxy kurun (örneğin Flask, FastAPI, Express)

S3'ü desteklemeyen istemcilerin sarmaladığınız HTTP API'yi çağırmasını sağlayın:

```http
POST /upload -> Hizmet içinde SDK çağrısı yaparak nesneyi RustFS'ye yükleyin
GET /presigned-url -> Frontend/istemci için önceden imzalanmış URL oluşturun
```

---

## 3. Üçüncü Taraf Topluluk SDK'larını Bulma

AWS'nin resmi SDK'sı olmasa da, bazı dil toplulukları resmi olmayan S3 istemcileri geliştirmiştir. Örneğin:

* Haskell: `amazonka-s3`
* Rust: `rusoto` (kullanımdan kaldırıldı) veya `aws-sdk-rust`
* OCaml: `cohttp` ile kendi uygulamanızı yapabilirsiniz
* Delphi: S3 protokolünü destekleyen ticari kütüphaneler vardır

Topluluk SDK'larının kararlılığı büyük farklılık gösterir, kullanmadan önce etkinlik, dokümantasyon ve uyumluluğu değerlendirmelisiniz.

---

## 4. Temel Yükleme Mantığını Platform Barındırmasına Bırakma

Örneğin:

* Frontend (Web/Mobile) yükleme görevlerini tarayıcı veya App tarafında gerçekleştirin (önceden imzalanmış URL kullanarak)
* Backend'de Node.js/Python/Go gibi proxy kullanarak yükleme mantığını uygulayın

---

## Özet Önerileri

| Senaryo | Önerilen Çözüm |
| ------------- | ---------------------------------- |
| Tam kontrol/gömülü ortam gerekli | Signature V4 kendi imzalamanızı uygulayın |
| Dil zayıf destek ama Shell var | AWS CLI çağrısı ile yükleme yapın |
| Aktarma hizmeti dağıtılabilir | Python/Node ile S3 API ağ geçidi oluşturun |
| Frontend yükleme | Önceden imzalanmış URL kullanın |