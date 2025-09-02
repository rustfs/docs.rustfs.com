---
title: "RustFS Rust SDK Kullanım Kılavuzu"
description: "Rust SDK aracılığıyla RustFS örneğini işletmek, depolama bucketları ve nesnelerin oluşturulması ve silinmesi dahil."
---

# RustFS Rust SDK

RustFS tamamen S3 uyumlu bir nesne depolama sistemi olduğundan, S3'ün Rust SDK'sında bazı sarmalayıcılar yaparak RustFS için uygun bir Rust SDK oluşturabilir, SDK aracılığıyla RustFS'i işletebilir, depolama bucketları/nesnelerin oluşturulması ve silinmesi, dosya yükleme ve indirme gibi işlemleri gerçekleştirebiliriz.

## Ön Koşullar

- Kullanılabilir bir RustFS örneği (kurulum için [Kurulum Kılavuzu](../../installation/index.md)'na başvurabilirsiniz).
- Erişim anahtarları (oluşturma için [Erişim Anahtar Yönetimi](../../administration/iam/access-token.md)'ne başvurabilirsiniz).

## RustFS Rust SDK Oluşturma

`region`, `access_key_id`, `secret_access_key` ve `endpoint_url`'i bir Config veri yapısı olarak oluşturun ve çevre değişkenlerinden ilgili bilgileri okuyun:

```
pub struct Config {
    pub region: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub endpoint_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let region = env::var("RUSTFS_REGION")?;
        let access_key_id = env::var("RUSTFS_ACCESS_KEY_ID")?;
        let secret_access_key = env::var("RUSTFS_SECRET_ACCESS_KEY")?;
        let endpoint_url = env::var("RUSTFS_ENDPOINT_URL")?;

        Ok(Config {
            region,
            access_key_id,
            secret_access_key,
            endpoint_url,
        })
    }
}
```

Yukarıda oluşturulan Config'i kullanarak, `aws_sdk_s3::Client` yardımıyla RustFS Client'i oluşturun:

```
let config = Config::from_env()?;

let credentials = Credentials::new(
    config.access_key_id,
    config.secret_access_key,
    None,
    None,
    "rustfs",
);

let region = Region::new(config.region);

let endpoint_url = config.endpoint_url;

let shard_config = aws_config::defaults(BehaviorVersion::latest())
    .region(region)
    .credentials_provider(credentials)
    .endpoint_url(endpoint_url)
    .load()
    .await;

let rustfs_client = Client::new(&shard_config);
```

Ardından oluşturulan `rustfs_client`'i kullanarak ilgili işlemleri gerçekleştirin.

## Depolama Bucket'ı Oluşturma

```
match rustfs_client
    .create_bucket()
    .bucket("your-bucket-name")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket created successfully");
    }
    Err(e) => {
        println!("Error creating bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Depolama Bucket'ını Silme

```
match rustfs_client
    .delete_bucket()
    .bucket("cn-east-1rust-sdk")
    .send()
    .await
{
    Ok(_) => {
        println!("Bucket deleted successfully");
    }
    Err(e) => {
        println!("Error deleting bucket: {:?}", e);
        return Err(e.into());
    }
}
```

## Depolama Bucket'larını Listeleme

```
match rustfs_client.list_buckets().send().await {
    Ok(res) => {
        println!("Total buckets number is {:?}", res.buckets().len());
        for bucket in res.buckets() {
            println!("Bucket: {:?}", bucket.name());
        }
    }
    Err(e) => {
        println!("Error listing buckets: {:?}", e);
        return Err(e.into());
    }
}
```

## Nesneleri Listeleme

```
match rustfs_client
    .list_objects_v2()
    .bucket("rust-sdk-demo")
    .send()
    .await
{
    Ok(res) => {
        println!("Total objects number is {:?}", res.contents().len());
        for object in res.contents() {
            println!("Object: {:?}", object.key());
        }
    }
    Err(e) => {
        println!("Error listing objects: {:?}", e);
        return Err(e.into());
    }
}
```

## Dosya Yükleme

```
let data = fs::read("/file-path/1.txt").await.expect("can not open the file");

match rustfs_client
    .put_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .body(ByteStream::from(data))
    .send()
    .await
{
    Ok(res) => {
        println!("Object uploaded successfully, res: {:?}", res);
    }
    Err(e) => {
        println!("Error uploading object: {:?}", e);
        return Err(e.into());
    }
}
```

## Nesne İndirme

```
match rustfs_client
    .get_object()
    .bucket("rust-sdk-demo")
    .key("1.txt")
    .send()
    .await
{
    Ok(res) => {
        println!("Object downloaded successfully, res: {:?}", res);
    }
    Err(e) => {
        println!("Error downloading object: {:?}", e);
        return Err(e.into());
    }
}
```

Diğer kullanımları kendi başınıza keşfedebilirsiniz, Vibe Coding yardımıyla daha da basit hale gelir!