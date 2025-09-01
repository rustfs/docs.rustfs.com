---
title: "RustFS MCP"
description: "RustFS MCP kullanım rehberi"
---

# RustFS MCP


**RustFS MCP Sunucusu**, AI/LLM araçlarına S3 uyumlu nesne depolama işlemlerine sorunsuz erişim sağlayan yüksek performanslı bir [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) sunucusudur. Bu sunucu maksimum performans ve güvenlik için Rust ile oluşturulmuştur ve Claude Desktop gibi AI asistanlarının standardize protokol aracılığıyla bulut depolama ile etkileşim kurmasını sağlar.

### MCP Nedir?

Model Context Protocol, AI uygulamalarının dış sistemlerle güvenli, kontrollü bağlantılar kurmasını sağlayan açık bir standarttır. Bu sunucu, AI araçları ile S3 uyumlu depolama hizmetleri arasında köprü görevi görür, güvenlik ve gözlenebilirliği korurken dosya işlemlerine yapılandırılmış erişim sağlar.


## ✨ Özellikler

### Desteklenen S3 İşlemleri

  - **Bucket Listeleme**: Tüm erişilebilir S3 bucket'larını listeler
  - **Nesne Listeleme**: İsteğe bağlı önek filtreleme ile bucket içeriğini tarar
  - **Dosya Yükleme**: Yerel dosyaları yükler, MIME tipi ve önbellek kontrolünü otomatik algılar
  - **Nesne Getirme**: S3 depolamadan nesneleri alır, okuma veya indirme modunu destekler


## 🔧 Kurulum

### Ön Koşullar

  - Rust 1.88+ (kaynak koddan derleme için)
  - Yapılandırılmış AWS kimlik bilgileri (çevre değişkenleri, AWS CLI veya IAM rolleri aracılığıyla)
  - S3 uyumlu depolama hizmetine erişim

### Kaynak Koddan Derleme

```bash
# Repository'yi klonla
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP sunucusunu derle
cargo build --release -p rustfs-mcp

# Binary dosya şu yolda mevcut olacak
./target/release/rustfs-mcp
```


## ⚙️ Yapılandırma

### Çevre Değişkenleri

```bash
# AWS kimlik bilgileri (zorunlu)
export AWS_ACCESS_KEY_ID=sizin_erişim_anahtarınız
export AWS_SECRET_ACCESS_KEY=sizin_gizli_anahtarınız
export AWS_REGION=us-east-1  # İsteğe bağlı, varsayılan us-east-1

# İsteğe bağlı: Özel S3 endpoint (MinIO vb. için)
export AWS_ENDPOINT_URL=http://localhost:9000

# Log seviyesi (isteğe bağlı)
export RUST_LOG=info
```

### Komut Satırı Seçenekleri

```bash
rustfs-mcp --help
```

Sunucu davranışını özelleştirmek için çeşitli komut satırı seçeneklerini destekler:

  - `--access-key-id`: S3 kimlik doğrulaması için AWS erişim anahtarı ID'si
  - `--secret-access-key`: S3 kimlik doğrulaması için AWS gizli anahtarı
  - `--region`: S3 işlemleri için AWS bölgesi (varsayılan: us-east-1)
  - `--endpoint-url`: Özel S3 endpoint URL'si (MinIO, LocalStack vb. için)
  - `--log-level`: Log seviyesi yapılandırması (varsayılan: rustfs\_mcp\_server=info)

-----

## 🚀 Kullanım

### Sunucuyu Başlatma

```bash
# MCP sunucusunu başlat
rustfs-mcp

# Veya özel seçeneklerle
rustfs-mcp --log-level debug --region us-west-2
```

### Chat İstemcileri ile Entegrasyon

#### Seçenek 1: Komut Satırı Argümanları Kullanma

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "sizin_erişim_anahtarınız",
        "--secret-access-key", "sizin_gizli_anahtarınız",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Seçenek 2: Çevre Değişkenleri Kullanma

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "sizin_erişim_anahtarınız",
        "AWS_SECRET_ACCESS_KEY": "sizin_gizli_anahtarınız",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Docker'da Kullanım

[RustFS MCP resmi olarak Dockerfile sağlar](https://github.com/rustfs/rustfs/tree/main/crates/mcp), RustFS MCP kullanmak için Dockerfile kullanarak container imajı oluşturabilirsiniz.

```
# RustFS repository kodunu klonla
git clone git@github.com:rustfs/rustfs.git

# Docker imajını oluştur
docker build -f crates/mcp/Dockerfile -t rustfs/rustfs-mcp .
```

Derleme başarılı olduktan sonra AI IDE'nin MCP yapılandırmasında kullanılmak üzere yapılandırılabilir.

#### AI IDE'de MCP Yapılandırması

Şu anda ana akım AI IDE'ler, Cursor, Windsurf, Trae vb. MCP'yi destekler. Örneğin Trae'de, aşağıdaki içeriği MCP yapılandırmasına ekleyin (**MCP --> Ekle**):

```
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "AWS_ACCESS_KEY_ID",
        "-e",
        "AWS_SECRET_ACCESS_KEY",
        "-e",
        "AWS_REGION",
        "-e",
        "AWS_ENDPOINT_URL",
        "rustfs/rustfs-mcp"
      ],
      "env": {
        "AWS_ACCESS_KEY_ID": "rustfs_access_key",
        "AWS_SECRET_ACCESS_KEY": "rustfs_secret_key",
        "AWS_REGION": "cn-east-1",
        "AWS_ENDPOINT_URL": "rustfs_instance_url"
      }
    }
  }
}
```

> `AWS_ACCESS_KEY_ID` ve `AWS_SECRET_ACCESS_KEY` RustFS'nin erişim anahtarlarıdır, oluşturmak için [erişim anahtarı yönetimi bölümüne](../administration/iam/access-token.md) başvurabilirsiniz.

Başarıyla eklenirse, MCP yapılandırma sayfasında [mevcut araçlar](#️-mevcut-araçlar) listelenebilir.

![add rustfs mcp in trae mcp configuration successfully](images/add-rustfs-mcp-succ.png)

Trae'de, ilgili araçları (Tool) kullanmak için ilgili komut istemi girmeniz yeterlidir. Örneğin Trae'nin sohbet diyalog kutusunda:

```
Lütfen mevcut rustfs örneğindeki bucket'ları listeler misiniz, teşekkürler!
```

Aşağıdaki yanıtı döndürür:

![list rustfs bucket with rustfs mcp](images/list-rustfs-bucket-with-mcp.png)


Trae **Builder with MCP** modunu kullanarak `list_buckets` aracını çağırdı ve yapılandırılmış RustFS örneğindeki tüm bucket'ları listeledi. Diğer araçların çağrılması da aynıdır.

## 🛠️ Mevcut Araçlar

MCP sunucusu, AI asistanlarının kullanabileceği aşağıdaki araçları sunar:

### `list_buckets`

Yapılandırılmış kimlik bilgileriyle erişilebilen tüm S3 bucket'larını listeler.

**Parametreler**: Yok

### `list_objects`

S3 bucket'taki nesneleri listeler, isteğe bağlı önek filtrelemesini destekler.

**Parametreler**:

  - `bucket_name` (string): S3 bucket'ının adı
  - `prefix` (string, isteğe bağlı): Nesneleri filtrelemek için önek

### `upload_file`

Yerel dosyayı S3'e yükler ve MIME tipini otomatik algılar.

**Parametreler**:

  - `local_file_path` (string): Yerel dosya yolu
  - `bucket_name` (string): Hedef S3 bucket'ı
  - `object_key` (string): S3 nesne anahtarı (hedef yol)
  - `content_type` (string, isteğe bağlı): İçerik tipi (sağlanmazsa otomatik algılanır)
  - `storage_class` (string, isteğe bağlı): S3 depolama sınıfı
  - `cache_control` (string, isteğe bağlı): Önbellek kontrol başlığı

### `get_object`

S3'ten nesneyi alır, iki işlem modu vardır: içeriği doğrudan okuma veya dosyaya indirme.

**Parametreler**:

  - `bucket_name` (string): Kaynak S3 bucket'ı
  - `object_key` (string): S3 nesne anahtarı
  - `version_id` (string, isteğe bağlı): Sürümlü nesne için sürüm ID'si
  - `mode` (string, isteğe bağlı): İşlem modu - "read" (varsayılan) içeriği doğrudan döndürür, "download" yerel dosyaya kaydeder
  - `local_path` (string, isteğe bağlı): Yerel dosya yolu (mod "download" olduğunda zorunlu)
  - `max_content_size` (number, isteğe bağlı): Okuma modu için maksimum içerik boyutu (byte) (varsayılan: 1MB)

### `create_bucket`

Yeni bir RustFS bucket'ı oluşturur.

**Parametreler**:

  - `bucket_name` (string): Oluşturulacak bucket adı.

### `delete_bucket`

Belirtilen RustFS bucket'ını siler.

**Parametreler**:

  - `bucket_name` (string): Silinecek bucket adı.

## Mimari

MCP sunucusu modüler mimari ile oluşturulmuştur:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # Giriş noktası, CLI ayrıştırma ve sunucu başlatma
│   ├── server.rs        # MCP sunucu implementasyonu ve araç işleyicileri
│   ├── s3_client.rs     # Asenkron işlemlerle S3 istemci sarmalayıcısı
│   ├── config.rs        # Yapılandırma yönetimi ve CLI seçenekleri
│   └── lib.rs           # Kütüphane dışa aktarımları ve ortak API
└── Cargo.toml           # Bağımlılıklar, meta veriler ve binary yapılandırması
```

