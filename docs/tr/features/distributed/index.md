---
title: "Büyük Ölçekli Veri Altyapısı"
description: "RustFS dağıtık mimarisi ve ölçeklenebilirlik özellikleri"
---

# Büyük Ölçekli Veri Altyapısı

RustFS ölçeklendirme için tasarlanmıştır. Teknik ölçek, operasyonel ölçek ve ekonomik ölçek. Temel ölçek.

RustFS bulut native olarak tasarlanmıştır ve Kubernetes gibi harici orkestrasyon hizmetleri tarafından yönetilen hafif container'lar olarak çalışabilir. Tüm sunucu ~100 MB'lık statik bir binary dosyadır ve yüksek yük altında bile CPU ve bellek kaynaklarını verimli bir şekilde kullanır. Sonuç olarak, paylaşılan donanımda çok sayıda kiracıyı birlikte barındırabilirsiniz.

![RustFS Mimari Diyagramı](./images/s2-1.png)

RustFS her yerde ve herhangi bir bulutta çalışabilir, ancak genellikle yerel bağlı sürücüleri (JBOD/JBOF) olan ticari sunucularda çalışır. Kümedeki tüm sunucular işlevsel olarak eşittir (tamamen simetrik mimari). Ad düğümü veya metadata sunucusu yoktur.

RustFS veri ve metadata'yı metadata veritabanı olmadan nesneler olarak birlikte yazar. Ayrıca, RustFS tüm işlevleri (silme kodları, bitrot kontrolü, şifreleme) satır içi, katı tutarlı işlemler olarak gerçekleştirir. Sonuç olarak, RustFS olağanüstü esnekliğe sahiptir.

Her RustFS kümesi, her düğümde bir işlem olan dağıtık RustFS sunucularının bir koleksiyonudur. RustFS kullanıcı alanında tek bir işlem olarak çalışır ve yüksek eşzamanlılık için hafif coroutine'ler kullanır. Sürücüler silme kodları setlerine gruplandırılır (buradaki silme kodları hesaplayıcısına bakın) ve nesneleri bu setlere yerleştirmek için deterministik hash algoritması kullanılır.

RustFS, büyük ölçekli, çoklu veri merkezi bulut depolama hizmetleri için tasarlanmıştır. Her kiracı kendi RustFS kümesini çalıştırır ve diğer kiracılardan tamamen izole edilir, bu da onları yükseltmeler, güncellemeler ve güvenlik olaylarından kaynaklanan herhangi bir kesintiden korumalarını sağlar. Her kiracı, coğrafi konumlar genelinde federasyon kümeleri aracılığıyla bağımsız olarak ölçeklenir.
