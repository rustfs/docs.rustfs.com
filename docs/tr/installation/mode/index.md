---
title: Başlangıç Modları
description: RustFS'nin kaç tane başlangıç modu vardır?
---
# Başlangıç Modları

RustFS'nin üç başlangıç modu vardır:

- **Tek Düğüm Tek Disk**: Bir sunucuda bir veri diski
- **Tek Düğüm Çoklu Diskler**: Bir sunucuda çoklu veri diskleri
- **Çoklu Düğümler Çoklu Diskler**: Çoklu sunucularda çoklu veri diskleri

## Tek Düğüm Tek Disk Modu (SNSD)

> Düşük yoğunluklu kritik olmayan işler için uygundur. Üretim ortamlarında veri yedeklemesi önerilir, risklerden kaçınmak için.

Bir sunucuda yalnızca bir veri diski, tüm veriler bu tek veri diskinde depolanır.

Belirli mimari diyagram aşağıdaki gibidir:

![RustFS Tek Düğüm Tek Disk Modu](./images/1.jpg)

## Tek Düğüm Çoklu Disk Modu (SNMD)

> Orta düzeyde kritik olmayan işler için uygundur. Üretim ortamlarında, belirtilen M diskine verilen hasar genellikle veri riskine neden olmaz. Eğer tüm sunucu hasar görürse veya M'den fazla disk hasar görürse, veri kaybolur.

Bir sunucuda çoklu veri diskleri, veriler çoklu veri disklerine parçalar halinde depolanır.

Bir veri bloğu, belirtilen K veri bloğuna ve M parite bloğuna bölünecektir. En fazla K veri bloğu kaybolamaz ve en fazla M parite bloğu kaybolamaz.

Aşağıdaki diyagramda gösterildiği gibi:

![RustFS Tek Düğüm Çoklu Disk Modu](./images/2.jpg)

## Çoklu Düğümler Çoklu Diskler (MNMD)

> Üretim ortamlarındaki kritik işler için uygundur. Uzman rehberliği altında yapılandırma önerilir, eşzamanlılık, verim, iş senaryoları, basınç ve diğer metrikleri dikkate alan kapsamlı sistem optimizasyonu ile.

En az 4 sunucu gereklidir, her sunucuda en az 1 disk bulunmalıdır, böylece bir dağıtık nesne depolama kümesi güvenli bir şekilde başlatılabilir.

Aşağıdaki mimari diyagram örneğinde, veriler yük dengeleme yoluyla herhangi bir sunucuya rastgele yazılır. Varsayılan 12 + 4 modu kullanılarak, bir veri bloğu varsayılan olarak 12 veri bloğu + 4 parite bloğuna bölünür ve farklı sunucuların farklı disklerinde depolanır.

Herhangi bir 1 sunucunun hasar görmesi veya bakımı veri güvenliğini etkilemez.

Herhangi 4 disk veya daha azının hasar görmesi veri güvenliğini etkilemez.

![RustFS Çoklu Düğüm Çoklu Disk Modu](./images/lb.jpg)