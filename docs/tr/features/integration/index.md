# RustFS ile Entegrasyon

Modern veri yığınları, bağlı veri yığınlarıdır. Kapsamlı entegrasyon listesini inceleyin ve ilgili belgelerine bağlantılar bulmak için aşağıya göz atın.

## Entegrasyon Türleri Genel Bakış

- 👥 [Harici Kimlik Sağlayıcıları](#external-identity-providers) - Tek oturum açma kimlik yönetimi
- 🔐 [Harici Anahtar Yönetimi](#external-key-management) - Merkezi şifreleme anahtarı yönetimi
- 📊 [İzleme ve Uyarı](#monitoring-and-alerting) - Sürekli olay izleme
- 🔔 [Bildirim Hedefleri](#notification-targets) - Olay bildirim hizmetleri
- 🌐 [Federasyon](#federation) - Çoklu veri merkezi kimlik doğrulama
- ⚙️ [Orkestratörler](#orchestrators) - Bulut yerel orkestrasyon platformları
- ⚖️ [Yük Dengesleyiciler](#load-balancers) - Trafik dağıtımı ve yönetimi
- ☁️ [Hibrit Bulut](#hybrid-cloud) - Çoklu bulut ortamı desteği
- 🤖 [Makine Öğrenimi ve Büyük Veri](#machine-learning-and-big-data) - AI/ML çerçevesi entegrasyonu
- 💾 [Yedekleme](#backup) - Veri yedekleme çözümleri

---

## Harici Kimlik Sağlayıcıları

Güvenilir kimlik sağlayıcıları, tek oturum açmanın temel bileşenleridir. RustFS, aşağıdaki entegrasyonlar aracılığıyla uygulama ve kullanıcı kimliklerini destekler.

| | | |
|---|---|---|
| ![Kimlik Sağlayıcı 1](./images/identity-1.png) | ![Kimlik Sağlayıcı 2](./images/identity-2.png) | ![Kimlik Sağlayıcı 3](./images/identity-3.png) |

## Harici Anahtar Yönetimi

Anahtar Yönetim Hizmeti (KMS), şifreleme anahtarlarını kolayca oluşturmanıza ve yönetmenize olanak tanır ve bunların kullanımını organizasyonunuz genelinde merkezden kontrol etmenizi sağlar.

| | |
|---|---|
| ![Anahtar Yönetimi 1](./images/kms-1.png) | ![Anahtar Yönetimi 2](./images/kms-2.png) |

## İzleme ve Uyarı

Konteynerler ve mikroservisler sürekli olay izleme ve uyarı gerektirir. Bulut yerel uygulamaları veya altyapıları aşağıdaki entegrasyonlar aracılığıyla yakından izleyin.

| | | | |
|---|---|---|---|
| ![İzleme 1](./images/monitoring-1.png) | ![İzleme 2](./images/monitoring-2.png) | ![İzleme 3](./images/monitoring-3.png) | ![İzleme 4](./images/monitoring-4.png) |

## Bildirim Hedefleri

Olay bildirimleri, herhangi bir sistemin operasyonel keskinliği için merkezi öneme sahiptir. RustFS, lambda bilgi işlem, nesne arama, analiz ve güvenlik denetimi için tüm nesne işlemlerini günlükler.

| | | | |
|---|---|---|---|
| ![Bildirim 1](./images/notification-1.png) | ![Bildirim 2](./images/notification-2.png) | ![Bildirim 3](./images/notification-3.png) | ![Bildirim 4](./images/notification-4.png) |

## Federasyon

Dağıtık dağıtımlar veri merkezlerini ve coğrafi konumları kapsadığında, merkezi federasyon kimlik doğrulama hizmetlerine ihtiyaç duyulur. RustFS aşağıdakilerle entegre olur.

| | |
|---|---|
| ![Federasyon 1](./images/federation-1.png) | ![Federasyon 2](./images/federation-2.png) |

## Orkestratörler

RustFS, fiziksel kaynakların (CPU, ağ ve sürücüler) tamamen otomatik dağıtımını ve yönetimini destekleyen modern bulut yerel orkestrasyon platformlarını destekler.

| | | |
|---|---|---|
| ![Orkestratör 1](./images/orchestrator-1.png) | ![Orkestratör 2](./images/orchestrator-2.png) | ![Orkestratör 3](./images/orchestrator-3.png) |

## Yük Dengesleyiciler

Genel altyapılar için yük dengeleyiciler şu hizmetleri sağlar: yönlendirme, servis keşfi, SSL sonlandırma ve trafik şekillendirme. RustFS aşağıdakilerle entegre olur.

| | | | |
|---|---|---|---|
| ![Yük Dengesleyici 1](./images/loadbalancer-1.png) | ![Yük Dengesleyici 2](./images/loadbalancer-2.png) | ![Yük Dengesleyici 3](./images/loadbalancer-3.png) | ![Yük Dengesleyici 4](./images/loadbalancer-4.png) |

## Hibrit Bulut

RustFS, yerel dağıtımlardan genel bulutlara kadar mevcut altyapıyı Amazon S3 gibi gösterir. Ayrıca, genel bulutların önüne önbellekleme CDN işlevselliği ekleyerek bant genişliğinden tasarruf ederken yüksek performans sağlar.

| | | | |
|---|---|---|---|
| ![Hibrit Bulut 1](./images/hybrid-1.png) | ![Hibrit Bulut 2](./images/hybrid-2.png) | ![Hibrit Bulut 3](./images/hybrid-3.png) | ![Hibrit Bulut 4](./images/hybrid-4.png) |

## Makine Öğrenimi ve Büyük Veri

Modern işletmeler veri odaklıdır. RustFS, lider analitik ve makine öğrenimi çerçeveleriyle yerel entegrasyonlara sahiptir.

| | | |
|---|---|---|
| ![Makine Öğrenimi 1](./images/ml-1.png) | ![Makine Öğrenimi 2](./images/ml-2.png) | ![Makine Öğrenimi 3](./images/ml-3.png) |
| ![Makine Öğrenimi 4](./images/ml-4.png) | ![Makine Öğrenimi 5](./images/ml-5.png) | ![Makine Öğrenimi 6](./images/ml-6.png) |

## Yedekleme

AWS S3 API'sini kullanan nesne depolama, her modern yedekleme uygulaması için evrensel yedekleme hedefi haline gelmiştir. RustFS, S3 uyumlu sistemlerle entegre olur ve aşağıdaki önde gelen satıcıları içerir (liste uzundur).

| | | | |
|---|---|---|---|
| ![Yedekleme 1](./images/backup-1.png) | ![Yedekleme 2](./images/backup-2.png) | ![Yedekleme 3](./images/backup-3.png) | ![Yedekleme 4](./images/backup-4.png) |