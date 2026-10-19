---
title: "Pannes de disque"
description: "Remplacez un disque défaillant dans un déploiement RustFS et laissez RustFS réparer les données automatiquement."
---

RustFS utilise le codage d’effacement pour que les données restent lisibles et inscriptibles lorsque certains disques tombent en panne. Après le remplacement d’un disque défaillant, RustFS y répare automatiquement les données manquantes.

<a id="unmount-failed-disk"></a>

### Démontez le disque défaillant

Avant de remplacer le disque dur physique, démontez le disque défaillant au niveau du système d’exploitation afin d’éviter des erreurs d’E/S dans le système de fichiers ou dans RustFS pendant le remplacement.

```bash
sudo umount /data/rustfs0
```

:::note[Remarques]

* Si le disque possède plusieurs points de montage, exécutez `umount` sur chacun d’eux.
* Si l’erreur « device is busy » apparaît, arrêtez d’abord le service RustFS :

```bash
sudo systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### Remplacez le disque défaillant

Après avoir physiquement remplacé le disque défaillant, vous devez partitionner et formater le nouveau disque, puis lui appliquer la même étiquette que le disque d’origine.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

:::note[Exigences]

* Le nouveau disque est au moins aussi grand que le disque d’origine.
* Utilisez le même système de fichiers que les autres disques (XFS ; voir le [guide d’installation](../installation/linux/index.md)).
* Nous recommandons de monter les systèmes de fichiers par étiquette (LABEL) ou par UUID, afin que les montages restent corrects si les noms de périphériques changent après un redémarrage.

:::

<a id="update-etcfstab-or-rustfs-configuration"></a>

### Mettez à jour `/etc/fstab` ou la configuration RustFS

Vérifiez que les étiquettes ou les UUID des entrées de `/etc/fstab` pointent vers le nouveau disque. Le point de montage doit rester identique à celui indiqué dans `RUSTFS_VOLUMES` (dans `/etc/default/rustfs`), afin que le disque réparé rejoigne le cluster au même chemin.

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

:::tip[Conseils]

* Si vous utilisez un UUID :

```bash
sudo blkid -s UUID -o value /dev/sdb
```

* Après avoir modifié `/etc/fstab`, validez la syntaxe :

```bash
sudo mount -a
findmnt /data/rustfs0
```

:::

<a id="remount-new-disk"></a>

### Remontez le nouveau disque

Exécutez les commandes suivantes pour monter tous les systèmes de fichiers configurés et démarrer RustFS :

```bash
sudo systemctl start rustfs
```

Vérifiez que tous les systèmes de fichiers attendus sont montés :

```bash
df -hT /data/rustfs0
```

:::note[Échecs de montage]

Si un montage échoue, vérifiez que les étiquettes ou les UUID de `/etc/fstab` correspondent à ceux du système de fichiers cible.

:::

<a id="trigger-and-monitor-data-healing"></a>

### Déclenchez et suivez la réparation des données

Dès que RustFS détecte un disque fraîchement formaté sur un point de montage connu, son scanner en arrière-plan y répare automatiquement les données manquantes. Aucune commande manuelle n’est requise. Confirmez que la récupération a commencé et suivez sa progression dans les journaux du service :

```bash
journalctl -u rustfs -f
tail -f /var/log/rustfs/rustfs.log
```

Vous pouvez aussi ouvrir la Console RustFS et vérifier l’état des disques du nœud concerné.

:::note[Remarques]

* La réparation s’exécute en arrière-plan et a généralement peu d’impact sur les requêtes des clients.
* Une fois la réparation terminée, les journaux signalent le succès ou listent les objets dont la réparation a échoué.

:::

<a id="follow-up-checks-and-notes"></a>

### Vérifications et remarques de suivi

1. **Surveillance des performances**

 * La charge d’E/S peut fluctuer pendant la réparation. Nous recommandons de surveiller l’utilisation des disques et du réseau.
2. **Pannes par lot**

 * Si plusieurs disques du même lot de fabrication tombent en panne, inspectez plus souvent les disques restants de ce lot.
3. **Tests de panne réguliers**

 * Organisez régulièrement des exercices de panne de disque afin que votre équipe puisse s’exercer à la procédure de reprise.
4. **Fenêtres de maintenance**

 * Lorsque le taux de panne est élevé, planifiez des fenêtres de maintenance dédiées pour accélérer le remplacement et la réparation.
