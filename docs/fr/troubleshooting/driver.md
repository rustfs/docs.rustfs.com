---
title: "Panne de Disque Dur"
description: "RustFS utilise un mécanisme similaire au code d'effacement pour garantir l'accès en lecture et écriture même lorsque certains disques sont en panne et guérit automatiquement les données après le remplacement des disques."
---

# Guide de Dépannage des Pannes de Disque RustFS

RustFS utilise un mécanisme similaire au code d'effacement pour garantir l'accès en lecture et écriture même lorsque certains disques sont en panne et guérit automatiquement les données après le remplacement des disques.

## Table des Matières

1. [Démonter le disque défaillant](#démonter-le-disque-défaillant)
2. [Remplacer le disque défaillant](#remplacer-le-disque-défaillant)
3. [Mettre à jour `/etc/fstab` ou la configuration RustFS](#mettre-à-jour-etcfstab-ou-la-configuration-rustfs)
4. [Remonter le nouveau disque](#remonter-le-nouveau-disque)
5. [Déclencher et surveiller la guérison des données](#déclencher-et-surveiller-la-guérison-des-données)
6. [Vérifications ultérieures et précautions](#vérifications-ultérieures-et-précautions)

<a id="démonter-le-disque-défaillant"></a>

### Démonter le Disque Défaillant

Avant de remplacer le disque dur physique, il faut d'abord démonter en sécurité le disque défaillant au niveau du système d'exploitation, pour éviter les erreurs d'I/O du système de fichiers ou de RustFS pendant le processus de remplacement.

```bash
# Supposons que le disque défaillant soit /dev/sdb
umount /dev/sdb
```

> **Remarque**
>
> * S'il y a plusieurs points de montage, exécutez `umount` séparément.
> * Si vous rencontrez "périphérique occupé", arrêtez d'abord le service RustFS :
>
> ```bash
> systemctl stop rustfs
> ```
>

<a id="remplacer-le-disque-défaillant"></a>

### Remplacer le Disque Défaillant

Après avoir physiquement remplacé le disque défaillant, il faut partitionner et formater le nouveau disque, et lui attribuer le même label que l'ancien disque.

```bash
# Formater en ext4, et étiqueter comme DISK1 (doit correspondre au label original)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Exigences**
>
> * Capacité du nouveau disque ≥ capacité de l'ancien disque ;
> * Type de système de fichiers cohérent avec les autres disques ;
> * Recommandé d'utiliser les labels (LABEL) ou UUID pour le montage, pour garantir que l'ordre des disques ne soit pas affecté par le redémarrage du système.

<a id="mettre-à-jour-etcfstab-ou-la-configuration-rustfs"></a>

### Mettre à Jour `/etc/fstab` ou la Configuration RustFS

Confirmez que l'entrée de montage label ou UUID dans `/etc/fstab` pointe vers le nouveau disque. Si vous utilisez un fichier de configuration propriétaire RustFS (comme `config.yaml`), mettez également à jour les entrées correspondantes.

```bash
# Voir le fstab actuel
cat /etc/fstab

# Exemple d'entrée fstab (pas besoin de modifier si le label est identique)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Conseil**
>
> * Si vous utilisez UUID :
>
> ```bash
> blkid /dev/sdb
> # Obtenez l'UUID de la nouvelle partition, puis remplacez le champ correspondant dans fstab
> ```
> * Après modification de fstab, vérifiez impérativement la syntaxe :
>
> ```bash
> mount -a # Si aucune erreur, alors la configuration est correcte
> ```
>

<a id="remonter-le-nouveau-disque"></a>

### Remonter le Nouveau Disque

Exécutez les commandes suivantes pour monter tous les disques en lot et démarrer le service RustFS :

```bash
mount -a
systemctl start rustfs
```

Confirmez que tous les disques sont montés normalement :

```bash
df -h | grep /mnt/disk
```

> **Attention**
>
> * Si certains montages échouent, veuillez vérifier que les entrées fstab et les labels/UUID des disques sont cohérents.

<a id="déclencher-et-surveiller-la-guérison-des-données"></a>

### Déclencher et Surveiller la Guérison des Données

RustFS déclenche automatiquement ou manuellement le processus de guérison des données (heal) après avoir détecté le nouveau disque. L'exemple suivant utilise l'outil hypothétique `rustfs-admin` :

```bash
# Voir l'état actuel des disques
rustfs-admin disk status

# Déclencher manuellement la guérison du nouveau disque
rustfs-admin heal --disk /mnt/disk1

# Voir en temps réel le progrès de guérison
rustfs-admin heal status --follow
```

En même temps, vous pouvez vérifier les journaux du service pour confirmer que le système a identifié et commencé à récupérer les données :

```bash
# Pour l'installation gérée par systemd
journalctl -u rustfs -f

# Ou voir le fichier journal dédié
tail -f /var/log/rustfs/heal.log
```

> **Remarque**
>
> * Le processus de guérison se termine en arrière-plan, généralement avec un impact minimal sur l'accès en ligne ;
> * Après la guérison, l'outil rapportera le succès ou listera les objets qui ont échoué.

<a id="vérifications-ultérieures-et-précautions"></a>

### Vérifications Ultérieures et Précautions

1. **Surveillance des Performances**

 * Les I/O peuvent fluctuer légèrement pendant la guérison, il est recommandé de surveiller la charge disque et réseau.
2. **Pannes en Lot**

 * Si plusieurs disques du même lot présentent des pannes répétées, considérez des inspections matérielles plus fréquentes.
3. **Exercices Réguliers**

 * Simulez régulièrement les pannes de disque et pratiquez pour garantir la familiarité de l'équipe avec le processus de récupération.
4. **Fenêtre de Maintenance**

 * Lorsque le taux de panne est élevé, planifiez une fenêtre de maintenance dédiée pour accélérer le remplacement et la guérison.