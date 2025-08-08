---
title: "RustFS MCP"
description: "RustFS MCP kullanım kılavuzu"
---

# RustFS MCP

**RustFS MCP sunucusu**, AI/LLM araçlarına S3 uyumlu nesne depolama işlemlerine kesintisiz erişim sağlayan, yüksek performanslı bir [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.org) sunucusudur. Sunucu, en yüksek performans ve güvenlik için Rust ile geliştirilmiştir ve Claude Desktop gibi yapay zeka asistanlarının standartlaştırılmış bir protokol üzerinden bulut depolama ile etkileşim kurmasını mümkün kılar.

### MCP nedir?

Model Context Protocol, AI uygulamalarının harici sistemlerle güvenli ve kontrollü bağlantılar kurmasını sağlayan açık bir standarttır. Bu sunucu, AI araçları ile S3 uyumlu depolama servisleri arasında bir köprü görevi görür; dosya işlemlerine yapılandırılmış erişim sunarken güvenlik ve gözlemlenebilirliği korur.

## ✨ Özellikler

### Desteklenen S3 işlemleri

- **Kovaları listeleme**: Erişilebilir tüm S3 kovalarını listeler
- **Nesneleri listeleme**: İsteğe bağlı önek (prefix) filtresiyle kova içeriğini gezme
- **Dosya yükleme**: Yerel dosyayı yükler, MIME türünü ve cache-control’ü otomatik algılar
- **Nesne alma**: S3’ten nesne getirir; okuma veya indirme kiplerini destekler

## 🔧 Kurulum

### Önkoşullar

- Rust 1.88+ (kaynak koddan derleme için)
- Yapılandırılmış AWS kimlik bilgileri (ortam değişkenleri, AWS CLI veya IAM rolü)
- S3 uyumlu depolama hizmetine erişim

### Kaynaktan derleme

```bash
# Depoyu klonlayın
git clone https://github.com/rustfs/rustfs.git
cd rustfs

# MCP sunucusunu derleyin
cargo build --release -p rustfs-mcp

# İkili dosya şu konumda hazır olur
./target/release/rustfs-mcp
```

## ⚙️ Yapılandırma

### Ortam değişkenleri

```bash
# AWS kimlik bilgileri (zorunlu)
export AWS_ACCESS_KEY_ID=erişim_anahtarınız
export AWS_SECRET_ACCESS_KEY=gizli_anahtarınız
export AWS_REGION=us-east-1  # İsteğe bağlı, varsayılan us-east-1

# İsteğe bağlı: Özel S3 uç noktası (MinIO vb. için)
export AWS_ENDPOINT_URL=http://localhost:9000

# Günlük seviyesi (isteğe bağlı)
export RUST_LOG=info
```

### Komut satırı seçenekleri

```bash
rustfs-mcp --help
```

Sunucu davranışını özelleştirmek için çeşitli seçenekler destekler:

- `--access-key-id`: S3 kimlik doğrulaması için AWS erişim anahtarı ID’si
- `--secret-access-key`: S3 kimlik doğrulaması için AWS gizli anahtarı
- `--region`: S3 işlemleri için AWS bölgesi (varsayılan: us-east-1)
- `--endpoint-url`: Özel S3 uç noktası URL’si (MinIO, LocalStack vb.)
- `--log-level`: Günlük seviyesi (varsayılan: rustfs_mcp_server=info)

-----

## 🚀 Kullanım

### Sunucuyu başlatma

```bash
# MCP sunucusunu başlatın
rustfs-mcp

# veya özel seçeneklerle
rustfs-mcp --log-level debug --region us-west-2
```

### Sohbet istemcisi ile entegrasyon

#### Seçenek 1: Komut satırı argümanlarıyla

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "args": [
        "--access-key-id", "erişim_anahtarınız",
        "--secret-access-key", "gizli_anahtarınız",
        "--region", "us-west-2",
        "--log-level", "info"
      ]
    }
  }
}
```

#### Seçenek 2: Ortam değişkenleriyle

```json
{
  "mcpServers": {
    "rustfs-mcp": {
      "command": "/path/to/rustfs-mcp",
      "env": {
        "AWS_ACCESS_KEY_ID": "erişim_anahtarınız",
        "AWS_SECRET_ACCESS_KEY": "gizli_anahtarınız",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

## 🛠️ Kullanılabilir araçlar

MCP sunucusu, AI asistanlarının kullanabileceği aşağıdaki araçları sunar:

### `list_buckets`

Yapılandırılmış kimlik bilgileriyle erişilebilen tüm S3 kovalarını listeler.

**Parametreler**: Yok

### `list_objects`

S3 kovasındaki nesneleri listeler; isteğe bağlı önek filtresi desteklenir.

**Parametreler**:

- `bucket_name` (string): S3 kova adı
- `prefix` (string, isteğe bağlı): Nesneleri filtrelemek için önek

### `upload_file`

Yerel dosyayı S3’e yükler ve MIME türünü otomatik algılar.

**Parametreler**:

- `local_file_path` (string): Yerel dosya yolu
- `bucket_name` (string): Hedef S3 kovası
- `object_key` (string): S3 nesne anahtarı (hedef yol)
- `content_type` (string, isteğe bağlı): İçerik türü (sağlanmazsa otomatik)
- `storage_class` (string, isteğe bağlı): S3 depolama sınıfı
- `cache_control` (string, isteğe bağlı): Önbellek kontrol başlığı

### `get_object`

S3’ten nesne getirir; iki kip vardır: içeriği doğrudan okumak veya dosyaya indirmek.

**Parametreler**:

- `bucket_name` (string): Kaynak S3 kovası
- `object_key` (string): S3 nesne anahtarı
- `version_id` (string, isteğe bağlı): Sürümlemeli nesnenin sürüm ID’si
- `mode` (string, isteğe bağlı): İşlem kipi — "read" (varsayılan) doğrudan içerik; "download" yerel dosyaya kaydetme
- `local_path` (string, isteğe bağlı): Yerel dosya yolu (kip "download" iken zorunlu)
- `max_content_size` (number, isteğe bağlı): Okuma kipinde maksimum içerik boyutu (bayt) (varsayılan: 1MB)

## Mimari

MCP sunucusu modüler bir mimari ile inşa edilmiştir:

```
rustfs-mcp/
├── src/
│   ├── main.rs          # Giriş noktası, CLI ayrıştırma, sunucu başlatma
│   ├── server.rs        # MCP sunucu uygulaması ve araç işleyicileri
│   ├── s3_client.rs     # Asenkron işlemlerle S3 istemci sarmalayıcı
│   ├── config.rs        # Yapılandırma yönetimi ve CLI seçenekleri
│   └── lib.rs           # Kütüphane dışa aktarımları ve genel API
└── Cargo.toml           # Bağımlılıklar, meta veriler ve ikili yapılandırma
```