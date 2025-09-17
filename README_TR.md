# RustFS Dokümantasyon Katkı Rehberi

RustFS topluluğuna hoş geldiniz! Dokümantasyonumuza katkıda bulunma ilginiz için gerçekten minnettarız. Bir yazım hatasını düzeltmek veya bir rehberin tamamını çevirmek olsun, katkınız bizim için önemlidir. Bu rehber, RustFS dokümantasyonunun ortak inşasına sorunsuz bir şekilde katılmanıza yardımcı olacak net talimatlar sunmayı amaçlamaktadır.

<p align="center">
<a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README.md">English</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_DA.md">Deutsch</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_FR.md">Français</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ES.md">Español</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_KO.md">한국어</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_PT.md">Português</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_RU.md">Русский</a> |
 Türkçe
</p>

------

### İçindekiler

1. [RustFS Nedir?](#1-rustfs-nedir)
2. [Misyonumuz: Herkes İçin Erişilebilir ve Güvenli Veri](#2-misyonumuz-herkes-için-erişilebilir-ve-güvenli-veri)
3. [Katkı Süreciniz](#3-katkı-süreciniz)
   - [Başlangıç: İlk Katkınız](#31-başlangıç-ilk-katkınız)
   - [Dokümantasyon Çevirisi: Yeni Bir Dil Eklemek](#32-dokümantasyon-çevirisi-yeni-bir-dil-eklemek)
4. [Teknik İş Akışı](#4-teknik-iş-akışı)
   - [Ön Koşullar](#41-ön-koşullar)
   - [Yerel Geliştirme Kurulumu](#42-yerel-geliştirme-kurulumu)
   - [Pull Request (PR) ve Commit Kuralları](#43-pull-request-pr-ve-commit-kuralları)
   - [Otomatik Kontroller ve Dağıtım](#44-otomatik-kontroller-ve-dağıtım)
5. [Topluluk ve Lisanslama](#5-topluluk-ve-lisanslama)
   - [Teşekkürler](#51-teşekkürler)
   - [İçerik Lisansı](#52-içerik-lisansı)

### 1. RustFS Nedir?

RustFS, basit, yüksek performanslı, dağıtılmış bir nesne depolama çözümüdür. %100 S3 uyumludur ve Apache 2.0 lisansı altında yayınlanmıştır, bu da onu ticari açıdan dost bir açık kaynak yazılım haline getirir.

Tamamen Rust ile yazılmış olan RustFS, bellek güvenliği ve olağanüstü performansı ile bilinen modern bir programlama dilidir. Dünya çapındaki yetenekli mühendislerden oluşan bir topluluk tarafından geliştirilmiştir. MinIO gibi ürünlerin doğrudan yerine geçebilecek güçlü ve güvenilir bir açık kaynak alternatifi olarak tasarlanmıştır.

### 2. Misyonumuz: Herkes İçin Erişilebilir ve Güvenli Veri

Veri depolamanın herkes için, her yerde uygun fiyatlı, güvenilir ve güvenli olması gerektiğine inanıyoruz.

Yüksek kaliteli, çok dilli dokümantasyon bu misyonun merkezindedir. Bu sadece bir ek değil, dünya genelindeki kullanıcılar ve geliştiriciler için giriş engelini düşürmenin anahtarıdır. Bir rehberi çevirdiğinizde veya bir hatayı düzelttiğinizde, farklı dil topluluklarındaki insanların sağlam ve uygun maliyetli veri altyapısı oluşturmasını doğrudan kolaylaştırıyorsunuz. Katkılarınız küresel bir kitleyi güçlendirir ve veri güvenliği ile egemenliğini kolektif olarak geliştirir. Bilgi paylaşımına yönelik bu topluluk odaklı yaklaşım, projenin değerini maksimize eder ve vizyonumuzu gerçekleştirmemize yardımcı olur.

### 3. Katkı Süreciniz

Farklı türdeki katkıcılar için farklı yollar tasarladık. Küçük bir sorunu hızlıca düzeltmek istiyorsanız veya dokümantasyonun tamamını sistematik olarak çevirmek istiyorsanız, burada doğru rehberi bulacaksınız.

#### 3.1 Başlangıç: İlk Katkınız

Başlamanın en kolay yolu, küçük düzenlemeleri doğrudan GitHub web arayüzü üzerinden yapmaktır. Bu yöntem, yerel bir geliştirme kurulumu gerektirmez ve küçük değişiklikler için idealdir.

Yapabileceğiniz basit katkılar:

- Yazım veya dil bilgisi hatalarını düzeltmek.
- Bozuk bağlantıları düzeltmek.
- Kafa karıştırıcı cümleleri veya paragrafları netleştirmek.
- Nasıl düzeltileceğini bilmediğiniz bir sorunu bildirmek.

**"5 Dakikalık" Pull Request Süreci:**

1. Düzenlemek istediğiniz sayfaya `https://docs.rustfs.com/` adresinden gidin.
2. Sayfanın altına kaydırın ve "Edit this page on GitHub" bağlantısına tıklayın.
3. Bu sizi GitHub'daki ilgili Markdown kaynak dosyasına götürecektir. Düzenleme moduna girmek için sağ üstteki kalem simgesine (✏️) tıklayın.
4. Metin düzenleyicide değişikliklerinizi yapın.
5. İşiniz bittiğinde, sayfanın altına kaydırın. "Propose changes" bölümünde, örneğin "Fix typo in installation guide" gibi kısa bir commit mesajı yazın.
6. "Propose changes" butonuna tıklayın. GitHub daha sonra bir pull request oluşturma sürecinde size rehberlik edecektir.

Bu süreç, karmaşık bir kurulum olmadan iş akışımıza aşina olmanızı sağlayan mükemmel bir "katkıcı rampası" görevi görür. Başarılı bir hafif katkı, genellikle daha derin bir katılımın ilk adımıdır.

#### 3.2 Dokümantasyon Çevirisi: Yeni Bir Dil Eklemek

Topluluk yardımına en çok ihtiyaç duyduğumuz temel alan burasıdır. Lütfen çeviriler eklemek veya iyileştirmek için bu adımları izleyin.

**Adım 1: GitHub Issues Üzerinden Koordinasyon**

Yinelenen çalışmalardan kaçınmak ve iş birliğini sağlamak için çeviriye başlamadan önce **[GitHub Issues sayfamızı](https://github.com/rustfs/rustfs/issues)** ziyaret edin.

- **Yeni Bir Dil Eklemek**: Çevirmek istediğiniz dil üzerinde zaten çalışan biri olup olmadığını kontrol edin. Yoksa, lütfen `[i18n] Add <Language> (<lang-code>) Translation` başlığıyla yeni bir issue oluşturun, örneğin `[i18n] Add German (de) Translation`. Bu, ilerlemeyi takip etmemize ve sahiplik atamamıza yardımcı olur.
- **Mevcut Bir Çeviriyi İyileştirmek**: Mevcut bir çeviriyi iyileştirmek istiyorsanız, ilgili issue'yu bulun veya yapmayı planladığınız iyileştirmeleri detaylandıran yeni bir issue oluşturun.

**Adım 2: Dizin Yapısını Anlama**

Dokümantasyon sitemiz VitePress ile oluşturulmuştur ve birden fazla dili yönetmek için dosya tabanlı bir dizin yapısı kullanır. Tüm kaynak dosyalar `docs/` dizininde bulunur.

```
docs/
├── en/                  # İngilizce (veya kök dizin olarak)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japonca
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # VitePress yapılandırma dosyası
```

**Adım 3: Yeni Bir Dil Paketi Eklemek**

1. Depoyu **fork edin ve klonlayın**, ardından yerel makinenizde yeni bir dal oluşturun.
2. `docs/` dizininde, hedef diliniz için ilgili **ISO 639-1 dil kodunu** kullanarak yeni bir klasör oluşturun. Lütfen aşağıdaki dil kodları tablosuna bakın.
3. `docs/en/` dizininin **tüm içeriğini** yeni dil klasörünüze kopyalayın. Bu size çeviri yapmak için eksiksiz bir dosya yapısı sağlar.
4. `docs/.vitepress/config.ts` dosyasını açın ve `locales` nesnesine diliniz için yeni bir giriş ekleyin.

   Örneğin, Almanca (`de`) eklemek için:

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'

   export default defineConfig({
     //... diğer yapılandırmalar
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Yeni yerel ayar yapılandırmasını buraya ekleyin
       de: {
         label: 'Deutsch', // Dil seçme menüsünde görünen metin
         lang: 'de',       // HTML lang özelliği
         link: '/de/',     // Yönlendirme bağlantısı
         // Bu yerel ayar için tema yapılandırmasını geçersiz kılabilirsiniz,
         // örneğin, navbar ve sidebar metinleri için.
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   Aşağıdaki tablo, `locales` nesnesindeki her özelliğin amacını açıklayarak doğru yapılandırmanıza yardımcı olur.

| Özellik      | Tür       | Gerekli  | Açıklama                                                  |
| ------------ | --------- | -------- | --------------------------------------------------------- |
| `label`      | `string`  | Evet     | Navbar'daki dil seçme menüsünde görünen metin.            |
| `lang`       | `string`  | Hayır    | `<html>` etiketi için `lang` özelliği. Belirtilmezse dizin adı kullanılır. |
| `link`       | `string`  | Hayır    | Kullanıcının bu dili seçtiğinde yönlendirileceği bağlantı. Varsayılan olarak yerel ayarın kök yoludur (örneğin, `/ja/`). |
| `title`      | `string`  | Hayır    | Sitenin ana başlığını bu yerel ayar için geçersiz kılar.  |
| `description`| `string`  | Hayır    | Sitenin ana açıklamasını bu yerel ayar için geçersiz kılar. |
| `themeConfig`| `object`  | Hayır    | Yerel ayara özgü tema yapılandırması. Navbar bağlantılarını, sidebar metinlerini çevirmek için kullanılır. |

**Adım 4: İçeriği Çevirin**

- Yeni dil dizininizdeki Markdown dosyalarını tek tek açın ve metin içeriğini çevirin.
- **Önemli**: Lütfen aşağıdakileri **çevirmeyin**:
  - Frontmatter'daki anahtarlar (örneğin, `title:`, `layout:`).
  - Kod blokları içindeki herhangi bir kod.
  - URL bağlantıları.
  - HTML etiketleri.
- Yalnızca insanların okuyabileceği metinleri çevirin.

**Adım 5: Pull Request'inizi Gönderin**

Çevirinizi tamamladıktan sonra, lütfen [Pull Request (PR) ve Commit Kuralları](#43-pull-request-pr-ve-commit-kuralları) bölümünü takip ederek katkınızı gönderin ve Adım 1'de oluşturduğunuz issue'ya bağlantı verdiğinizden emin olun.

**Dil Kodu Referansı**

Tutarlılık sağlamak için lütfen aşağıdaki tablodan standart ISO 639-1 kodlarını kullanın.

| Dil                  | ISO 639-1 Kodu  |
| -------------------- | --------------- |
| Çince (Basitleştirilmiş) | `zh` veya `zh-CN` |
| İngilizce            | `en`            |
| Japonca              | `ja`            |
| Almanca              | `de`            |
| Fransızca            | `fr`            |
| Türkçe               | `tr`            |

### 4. Teknik İş Akışı

Yerel olarak daha kapsamlı katkılar yapmak isteyen geliştiriciler (örneğin, yeni bir dil paketi eklemek veya kapsamlı değişiklikler yapmak) için lütfen bu teknik iş akışını izleyin.

#### 4.1 Ön Koşullar

Başlamadan önce, lütfen sisteminizde aşağıdaki yazılımların yüklü olduğundan emin olun:

- **Node.js**: Sürüm `18.x` veya üzeri. [Resmi Node.js web sitesinden](https://nodejs.org/) indirebilirsiniz.
- **Paket Yöneticisi**: Verimlilik için `pnpm` kullanmanızı öneririz. Global olarak `npm install -g pnpm` komutuyla yükleyebilirsiniz. Alternatif olarak `npm` veya `yarn` da kullanabilirsiniz.
- **Git**: Bir sürüm kontrol sistemi. [Resmi Git web sitesinden](https://git-scm.com/) indirebilirsiniz.

#### 4.2 Yerel Geliştirme Kurulumu

Dokümantasyon geliştirme sunucusunu yerel olarak çalıştırmak için bu komut dizisini izleyin:

1. Depoyu Fork Edin ve Klonlayın

   Önce bu depoyu GitHub'da fork edin. Ardından fork'unuzu yerel makinenize klonlayın.

   Bash

   ```
   # <KULLANICI_ADINIZ> yerine GitHub kullanıcı adınızı yazın
   git clone https://github.com/<KULLANICI_ADINIZ>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Bağımlılıkları Yükleyin

   Gerekli tüm proje bağımlılıklarını yüklemek için pnpm kullanın.

   Bash

   ```
   pnpm install
   ```

3. Geliştirme Sunucusunu Çalıştırın

   Bu komut, sıcak yeniden yükleme özelliği etkin olan yerel bir geliştirme sunucusu başlatacaktır.

   Bash

   ```
   pnpm docs:dev
   ```

4. Siteye Erişin

   Başarılı bir şekilde çalıştırıldıktan sonra terminalinizde `VitePress dev server running at: http://localhost:5173/` benzeri bir çıktı görmelisiniz. Bu URL'yi tarayıcınızda açarak dokümantasyon sitesini görüntüleyin. Markdown dosyalarında yaptığınız değişiklikler tarayıcıda anında yansıtılacaktır.

#### 4.3 Pull Request (PR) ve Commit Kuralları

Kod kalitesini ve temiz bir proje geçmişini sağlamak için standart bir iş akışı izliyoruz.

- **Dal Stratejisi**

  - Çalışmanız için her zaman yeni bir dal oluşturun. Doğrudan `main` dalına commit yapmayın.
  - `feat/add-german-translation` veya `fix/correct-s3-api-typo` gibi açıklayıcı bir dal adı kullanın.

- **Commit Mesajı Kuralı**

  Conventional Commits spesifikasyonuna uyuyoruz. Bu, changelog'ları otomatikleştirmemize ve commit geçmişini anlamayı kolaylaştırmamıza yardımcı olur.

  - **Biçim**: `<type>(<scope>): <subject>`

  - **Örnekler**:

    - `feat(i18n): add initial french translation`
    - `fix(guide): correct typo in getting-started.md`
    - `docs(contributing): update local development setup`

    Bu yapılandırılmış yaklaşım, birçok olgun açık kaynak projesinde en iyi uygulamadır.

- **Pull Request Gönderme**

  1. Dalınızı fork'unuza itin: `git push -u origin dal-adınız`.
  2. GitHub'da, fork'unuzdan `rustfs/docs.rustfs.com` deposunun `main` dalına bir pull request açın.
  3. **Issue'ya Bağlantı Verin**: PR açıklamasında, daha önce oluşturduğunuz issue'ya `Closes #123` veya `Fixes #123` gibi anahtar kelimelerle bağlantı verin. Bu, PR birleştirildiğinde issue'yu otomatik olarak kapatacaktır ve iş akışı otomasyonumuzda önemli bir adımdır.
  4. **Net Bir Açıklama Yazın**: **Ne** değiştirdiğinizi ve **neden** değiştirdiğinizi açıkça açıklayın. Değişiklikleriniz görselse, lütfen önce ve sonra ekran görüntüleri ekleyin.

- **İnceleme Süreci**

  - Bir PR gönderdiğinizde, bir proje yöneticisi onu inceleyecektir.
  - Değişiklik isteyebiliriz. Lütfen cesaretiniz kırılmasın! Bu, katkıların kalitesini artırmayı amaçlayan iş birliğine dayalı açık kaynak geliştirmenin normal bir parçasıdır.
  - PR'niz onaylandıktan ve tüm otomatik kontroller geçtikten sonra, bir yönetici onu birleştirecektir.

#### 4.4 Otomatik Kontroller ve Dağıtım

Dokümantasyonumuzun kalitesini ve kararlılığını sağlamak için tam otomatik bir CI/CD (Sürekli Entegrasyon/Sürekli Dağıtım) işlem hattımız var.

- **Otomatik Kontroller**: Bir pull request gönderdiğinizde, GitHub Actions otomatik olarak bir dizi kontrol çalıştıracaktır. Bu kontroller, dokümantasyon sitesinin başarıyla oluşturulup oluşturulmadığını ve kod biçimlendirmesinin doğru olup olmadığını (linting) doğrular.
- **Otomatik Dağıtım**: PR'niz `main` dalına birleştirildiğinde, GitHub Actions tekrar tetiklenecek ve sitenin en son sürümünü oluşturup `https://docs.rustfs.com` adresine dağıtacaktır.

Bu süreci şeffaf hale getirerek, katkıcıların iş akışımıza olan güvenini oluşturmayı amaçlıyoruz. Dağıtım detayları hakkında endişelenmenize gerek yok; başarılı bir birleştirme, başarılı bir dağıtım anlamına gelir. Bu size, katkınızın gönderilmesinden yayınlanmasına kadar olan tüm yaşam döngüsünü net bir şekilde görme imkanı sağlar.

### 5. Topluluk ve Lisanslama

#### 5.1 Teşekkürler

RustFS dokümantasyonu, topluluk tarafından, topluluk için oluşturulmuştur. Zamanlarını ve uzmanlıklarını paylaşan herkese minnettarız.

Her katkı, ne kadar küçük olursa olsun, büyük değer taşır. Tüm katkıları adil ve şeffaf bir şekilde tanımak için GitHub'ın yerleşik araçlarını kullanıyoruz.

Harika katkıcılarımızın listesini **[Contributors graph](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)** üzerinden görebilirsiniz. Bu otomatik, ölçeklenebilir yaklaşım, her katkının tanındığından ve her zaman güncel olduğundan emin olur.

#### 5.2 İçerik Lisansı

Bu projedeki tüm dokümantasyon **Creative Commons Attribution 4.0 International License** altında lisanslanmıştır.

RustFS dokümantasyon projesine katkıda bulunarak, katkılarınızın bu lisans altında yayınlanacağını kabul etmiş olursunuz.

Bu lisans altında şunları yapmakta özgürsünüz:

- **Paylaşma** — materyali herhangi bir ortamda veya formatta kopyalayabilir ve yeniden dağıtabilirsiniz.
- **Uyarlama** — materyali herhangi bir amaçla remiksleyebilir, dönüştürebilir ve üzerine inşa edebilirsiniz, hatta ticari olarak.

Aşağıdaki şartlara uymalısınız:

- **Atıf** — **Uygun şekilde kredi vermeli**, lisansın bir bağlantısını sağlamalı ve **değişiklik yapıldıysa belirtmelisiniz**. Bunu makul bir şekilde yapabilirsiniz, ancak lisans verenin sizi veya kullanımınızı onayladığını ima edecek şekilde yapmamalısınız.
