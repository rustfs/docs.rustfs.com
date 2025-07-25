# Modern Veri Gölleri için RustFS

Modern veri gölleri ve lakehouse mimarileri, modern nesne depolama üzerine inşa edilmiştir. Bu, onların RustFS üzerine inşa edildiği anlamına gelir.

**RustFS, her yerde çalışabilen modern veri gölleri/lakehouse'lar için birleşik bir depolama çözümü sunar: özel bulut, genel bulut, colos, çıplak metal - hatta kenarda. Evet, hızlı, ölçeklenebilir, bulut yerli ve kullanıma hazır - piller dahil.**

![Veri Gölü Mimarisi](images/data-lake-architecture.png)

## Açık Tablo Formatına Hazır

![Tablo Formatları](images/table-formats.png)

Modern veri gölleri çoklu motorlu olup, bu motorlar (Spark, Flink, Trino, Arrow, Dask, vb.) birbirine tutarlı bir mimari içinde bağlanmalıdır. Modern veri gölleri, merkezi tablo depolama, taşınabilir meta veriler, erişim kontrolü ve kalıcı yapı sağlamalıdır. İşte burada Iceberg, Hudi ve Delta Lake gibi formatlar devreye girer. Bunlar modern veri gölleri için tasarlanmıştır ve RustFS hepsini destekler. Hangisinin kazanacağına dair görüşlerimiz olabilir (bize her zaman sorabilirsiniz...), ancak artık mantıklı olmadığı sürece onları desteklemeye devam edeceğiz (Docker Swarm ve Mesosphere'a bakınız).

## Bulut Yerli

RustFS, bulutta doğmuş ve bulut ilkeleri üzerine çalışır - konteynerleştirme, orkestrasyon, mikroservisler, API'ler, altyapı olarak kod ve otomasyon. Bu nedenle, bulut yerli ekosistem RustFS ile "sadece çalışır" - Spark'tan Presto/Trino'ya, Snowflake'den Dremio'ya, NiFi'den Kafka'ya, Prometheus'tan OpenObserve'a, Istio'dan Linkerd'e, Hashicorp Vault'tan Keycloak'a.

Bunu bizden duymayın - favori bulut yerli teknolojinizi girin ve Google kanıtları sunsun.

## Çoklu Motor

RustFS, tüm S3 uyumlu sorgulama motorlarını destekler, yani hepsini. Kullandığınız motoru görmüyor musunuz? Bize bir satır bırakın ve biz araştıralım.

![Çoklu Motor Desteği](images/multi-engine-1.svg)

![Çoklu Motor Desteği](images/multi-engine-2.svg)

## Performans

Modern veri gölleri, bir performans seviyesi ve daha da önemlisi, eski Hadoop döneminin emtia mağazalarının sadece hayal edebileceği ölçekte performans gerektirir. RustFS, birçok benchmarkta Hadoop'u geride bıraktığını kanıtlamıştır ve göç yolları iyi belgelenmiştir. Bu, sorgulama motorlarının (Spark, Presto, Trino, Snowflake, Microsoft SQL Server, Teradata, vb.) daha iyi performans göstermesi anlamına gelir. Bu aynı zamanda AI/ML platformlarınızı - MLflow'dan Kubeflow'a kadar - içerir.

Dünyanın görmesi için benchmarklarımızı yayınlıyoruz ve bunları yeniden üretebilir hale getiriyoruz. Bu makalede, sadece 32 adet standart NVMe SSD düğümü ile GET işlemlerinde 325 GiB/s (349 GB/s) ve PUT işlemlerinde 165 GiB/s (177 GB/s) nasıl başardığımızı öğrenin.

## Hafif

RustFS'in sunucu ikili dosyası tamamıyla < 100 MB'dır. Gücüne rağmen, veri merkezlerinde çalışacak kadar sağlam ve kenarda rahatça yaşayacak kadar küçüktür. Hadoop dünyasında böyle bir alternatif yoktur. Kuruluşlar için bu, S3 uygulamalarınızın aynı API ile her yerden veriye erişebileceği anlamına gelir. RustFS kenar konumlarını ve çoğaltma yeteneklerini uygulayarak, veriyi kenarda yakalayabilir ve filtreleyebilir ve agregasyon ve daha fazla analitik uygulama için ana kümeye teslim edebiliriz.

## Ayrıştırma

Modern veri gölleri, Hadoop'u parçalayan ayrıştırma yeteneklerini genişletir. Modern veri gölleri, yüksek hızlı sorgulama işleme motorlarına ve yüksek verimli depolamaya sahiptir. Modern veri gölleri, veritabanlarına sığmayacak kadar büyüktür, bu nedenle veri nesne depolamada bulunur. Bu şekilde, veritabanları sorgulama optimizasyonu işlevselliğine odaklanabilir ve depolama işlevselliğini yüksek hızlı nesne depolamaya devredebilir. Verinin alt kümelerini bellekte tutarak ve S3 Select ve harici tablolar gibi özellikleri kullanarak, sorgulama motorları daha fazla esnekliğe sahip olur.

## Açık Kaynak

Hadoop'u benimseyen kuruluşlar, açık kaynak teknolojisini tercih ettikleri için bunu yaptı. Mantıksal halefi olarak, kuruluşlar veri göllerinin de açık kaynak olmasını istiyor. Bu nedenle Iceberg gelişiyor ve Databricks Delta Lake'i açık kaynak yaptı.

On binlerce kullanıcının getirdiği yetenekler, kilitlenmeden özgürlük ve rahatlık gerçek değere sahiptir. RustFS de %100 açık kaynak olup, kuruluşların modern veri göllerine yatırım yaparken hedeflerine sadık kalmalarını sağlar.

## Hızlı Büyüme

Veri sürekli olarak üretilmektedir, bu da sürekli olarak alınması gerektiği anlamına gelir - sindirime neden olmadan. RustFS bu dünya için inşa edilmiştir ve Kafka, Flink, RabbitMQ ve birçok diğer çözümle kutudan çıkar çıkmaz çalışır. Sonuç olarak, veri gölü/lakehouse tek bir doğru kaynağı haline gelir ve exabaytların ötesine sorunsuzca ölçeklenebilir.

RustFS'in günlük veri alımı 250PB'yi aşan birçok müşterisi vardır.

## Basitlik

Basitlik zordur. Çalışma, disiplin ve en önemlisi, taahhüt gerektirir. RustFS'in basitliği efsanevidir ve yazılımımızı dağıtmayı, kullanmayı, yükseltmeyi ve ölçeklendirmeyi kolaylaştıran bir felsefi taahhüttür. Modern veri gölleri karmaşık olmak zorunda değildir. Birkaç parçadan oluşur ve RustFS'in benimsenmesini ve dağıtımını en kolay hale getirmeye kararlıyız.

## ELT veya ETL - Sadece Çalışır

RustFS, her veri akışı protokolü ile çalışmakla kalmaz, her veri boru hattı - her veri akışı protokolü ve veri boru hattı RustFS ile çalışır. Her satıcı kapsamlı bir şekilde test edilmiştir ve tipik olarak veri boru hatları dirençlilik ve performansa sahiptir.

## Dirençlilik

RustFS, her nesne için satır içi silme kodlaması kullanarak verileri korur, bu da hiçbir zaman benimsenmeyen HDFS çoğaltma alternatiflerinden çok daha verimlidir. Ayrıca, RustFS'in bit çürümesi tespiti, asla bozuk verileri okumaz - nesneler için bozuk verileri dinamik olarak yakalar ve onarır. RustFS ayrıca çapraz bölge, aktif-aktif çoğaltmayı destekler. Son olarak, RustFS, yasal tutma ve saklama (yönetişim ve uyumluluk modlarıyla) sağlayan tam bir nesne kilitleme çerçevesini destekler.

## Yazılım Tanımlı

Hadoop HDFS'in halefi, bir donanım cihazı değil, emtia donanımı üzerinde çalışan bir yazılımdır. Bu, RustFS'in özüdür - yazılım. Hadoop HDFS gibi, RustFS de emtia sunucularından tam olarak yararlanmak için tasarlanmıştır. NVMe sürücüleri ve 100 GbE ağlarını kullanabilen RustFS, veri merkezlerini küçültebilir, böylece operasyonel verimliliği ve yönetilebilirliği artırabilir. Aslında, alternatif veri gölleri inşa eden şirketler, performansı artırırken ve yönetmek için gereken FTE'leri azaltırken donanım ayak izlerini %60 veya daha fazla azaltır.

## Güvenlik

RustFS, verileri nerede olursa olsun, uçuşta veya dinlenirken korumak için birçok sofistike sunucu tarafı şifreleme şeması destekler. RustFS'in yaklaşımı, ihmal edilebilir performans yükü ile gizlilik, bütünlük ve doğruluğu sağlar. AES-256-GCM, ChaCha20-Poly1305 ve AES-CBC kullanarak sunucu tarafı ve istemci tarafı şifreleme desteği, uygulama uyumluluğunu sağlar. Ayrıca, RustFS, sektör lideri anahtar yönetim sistemlerini (KMS) destekler.