---
title: "Panne de disque dur"
description: "RustFS garantit l'accès en lecture et écriture même en cas de panne partielle de disques grâce à un mécanisme similaire au codage par effacement, et répare automatiquement les données après remplacement du disque."
---

# Panne de disque dur

RustFS garantit l'accès en lecture et écriture même en cas de panne partielle de disques grâce à un mécanisme similaire au codage par effacement, et répare automatiquement les données après remplacement du disque.

---

### Table des matières

1. [Démontage du disque défaillant](#1-démontage-du-disque-défaillant)
2. [Remplacement du disque défaillant](#2-remplacement-du-disque-défaillant)
3. [Mise à jour de `/etc/fstab` ou configuration RustFS](#3-mise-à-jour-de-etcfstab-ou-configuration-rustfs)
4. [Remontage du nouveau disque](#4-remontage-du-nouveau-disque)
5. [Déclenchement et surveillance de la réparation des données](#5-déclenchement-et-surveillance-de-la-réparation-des-données)
6. [Vérifications ultérieures et remarques](#6-vérifications-ultérieures-et-remarques)

---

### 1) Démontage du disque défaillant

Avant de remplacer physiquement le disque dur, il faut d'abord le démonter en toute sécurité au niveau du système d'exploitation pour éviter les erreurs I/O du système de fichiers ou de RustFS pendant le processus de remplacement.

```bash
# Supposons que le disque défaillant soit /dev/sdb
umount /dev/sdb
```

> **Explication**
>
> * S'il y a plusieurs points de montage, exécutez `umount` pour chacun.
> * En cas d'erreur "périphérique occupé", arrêtez d'abord le service RustFS :
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Remplacement du disque défaillant

Après avoir physiquement remplacé le disque défaillant, le nouveau disque doit être partitionné et formaté, avec le même label que l'ancien disque.

```bash
# Formatage en ext4 avec le label DISK1 (doit correspondre au label original)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Exigences**
>
> * Capacité du nouveau disque ≥ capacité de l'ancien disque
> * Type de système de fichiers cohérent avec les autres disques
> * Il est recommandé d'utiliser un label (LABEL) ou un UUID pour le montage, afin que l'ordre des disques ne soit pas affecté par le redémarrage du système

---

### 3) Mise à jour de `/etc/fstab` ou configuration RustFS

Confirmez que les labels ou UUID des entrées de montage dans `/etc/fstab` pointent vers le nouveau disque. Si vous utilisez un fichier de configuration spécifique à RustFS (comme `config.yaml`), vous devez également mettre à jour les entrées correspondantes.

```bash
# Vérifier le fstab actuel
cat /etc/fstab

# Exemple d'entrée fstab (aucune modification nécessaire si le label est identique)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Conseil**
>
> * Si vous utilisez un UUID :
>
> ```bash
> blkid /dev/sdb
> # Obtenez l'UUID de la nouvelle partition, puis remplacez le champ correspondant dans fstab
> ```
> * Après modification de fstab, vérifiez impérativement la syntaxe :
>
> ```bash
> mount -a # Si aucune erreur, la configuration est correcte
> ```

---

### 4) Remontage du nouveau disque

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
> * Si certains montages échouent, vérifiez que les entrées fstab correspondent aux labels/UUID des disques.

---

### 5) Déclenchement et surveillance de la réparation des données

Après détection du nouveau disque, RustFS déclenchera automatiquement ou manuellement le processus de réparation (heal) des données. Voici un exemple utilisant l'outil hypothétique `rustfs-admin` :

```bash
# Vérifier l'état actuel des disques
rustfs-admin disk status

# Déclencher manuellement la réparation du nouveau disque
rustfs-admin heal --disk /mnt/disk1

# Surveiller en temps réel la progression de la réparation
rustfs-admin heal status --follow
```

Parallèlement, vous pouvez vérifier les logs du service pour confirmer que le système a reconnu et commencé la récupération des données :

```bash
# Pour une installation gérée par systemd
journalctl -u rustfs -f

# Ou vérifier le fichier de log dédié
tail -f /var/log/rustfs/heal.log
```

> **Explication**
>
> * Le processus de réparation se termine en arrière-plan, avec généralement un impact minimal sur l'accès en ligne
> * Une fois la réparation terminée, l'outil signalera le succès ou listera les objets qui ont échoué

---

### 6) Vérifications ultérieures et remarques

1. **Surveillance des performances**

   * Pendant la réparation, les I/O peuvent légèrement fluctuer, il est recommandé de surveiller la charge des disques et du réseau.

2. **Pannes en lot**

   * Si plusieurs pannes se produisent sur des disques du même lot, envisagez des inspections matérielles plus fréquentes.

3. **Exercices réguliers**

   * Effectuez régulièrement des exercices simulant des pannes de disques pour vous assurer que l'équipe maîtrise le processus de récupération.

4. **Fenêtre de maintenance**

   * En période de taux de panne élevé, planifiez une fenêtre de maintenance dédiée pour accélérer le remplacement et la réparation.

