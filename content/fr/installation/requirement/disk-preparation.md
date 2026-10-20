---
title: "Préparation des disques"
description: "Identifiez, formatez, montez et vérifiez les disques de données dédiés avant d’installer RustFS sur Linux."
---

Préparez chaque disque de données RustFS comme un système de fichiers XFS indépendant, avec un libellé et un point de montage stables. Effectuez ces étapes sur chaque nœud Linux avant de configurer `RUSTFS_VOLUMES`.

:::warning[Le formatage détruit les données]

La commande `mkfs.xfs` efface le périphérique sélectionné. Confirmez le nom du périphérique, sauvegardez les données nécessaires et assurez-vous que le disque n’est pas utilisé par le système d’exploitation avant de continuer.

:::

## 1. Identifier les disques de données

Répertoriez les périphériques bloc, les systèmes de fichiers, les libellés et les points de montage actuels :

```bash
sudo lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS
```

Ne choisissez que des disques de données dédiés. Ne formatez pas le disque du système d’exploitation, ni un périphérique qui contient des données à conserver.

## 2. Formater un disque en XFS

L’exemple suivant prépare `/dev/sdb` et lui attribue le libellé `RUSTFS0`. Remplacez le nom de périphérique selon votre environnement et utilisez un libellé unique pour chaque disque.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Répétez la commande pour les disques supplémentaires, avec des libellés tels que `RUSTFS1`, `RUSTFS2` et `RUSTFS3`.

## 3. Créer un montage persistant

Créez le point de montage :

```bash
sudo mkdir -p /data/rustfs0
```

Ajoutez une entrée à `/etc/fstab` afin que le disque soit monté, après un redémarrage, par son libellé de système de fichiers stable :

```ini title="/etc/fstab"
LABEL=RUSTFS0 /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Pour sélectionner le périphérique de façon plus fiable, nous recommandons le montage par UUID de système de fichiers. Un UUID identifie le système de fichiers de manière unique et évite de monter le mauvais disque si des libellés sont dupliqués ou si les noms de périphériques Linux changent. Récupérez l’UUID après le formatage :

```bash
sudo blkid -s UUID -o value /dev/sdb
```

Remplacez `<filesystem-uuid>` par la valeur renvoyée, et utilisez cette entrée à la place de l’entrée `LABEL` ci-dessus :

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Montez toutes les entrées et confirmez le résultat :

```bash
sudo mount -a
findmnt /data/rustfs0
```

Pour plusieurs disques, créez un point de montage et une entrée `/etc/fstab` par UUID de système de fichiers.

## 4. Vérifier les disques préparés

Confirmez que chaque montage attendu utilise XFS et dispose d’un espace libre suffisant :

```bash
df -hT /data/rustfs0
sudo xfs_info /data/rustfs0
```

Utilisez les chemins de montage vérifiés lorsque vous configurez `RUSTFS_VOLUMES`. Dans un déploiement distribué, conservez des libellés de disque et des chemins de montage identiques sur tous les nœuds.

## Étapes suivantes

- [Choisir une topologie de déploiement](/fr/installation#comparaison-des-modes-de-déploiement)
- [Poursuivre avec les prérequis Linux et la configuration du service](/fr/installation/linux/prerequisites-and-service)
