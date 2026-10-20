---
title: "Contrôle d’état"
description: "Vérifiez l’accès réseau de RustFS, les points de terminaison de contrôle d’intégrité, l’état du cluster et la capacité de stockage."
---

Utilisez des sondes réseau, la page **Status** (état) de la Console RustFS, ou la ligne de commande `rc` pour examiner la disponibilité de RustFS et la consommation de stockage. Avant d’utiliser le flux en ligne de commande, [installez `rc`](/fr/operations/rc) et configurez un alias pour le cluster cible.

## Ports réseau

RustFS utilise deux écouteurs par défaut. Vous pouvez modifier les deux adresses d’écoute par des variables d’environnement ou des indicateurs de ligne de commande.

| Port | Écouteur | Configuré par | Trafic |
| --- | --- | --- | --- |
| `9000` | API S3 | `RUSTFS_ADDRESS` / `--address` | API objet S3, API d’administration et RPC interne de nœud à nœud sous `/rustfs/rpc/` et `/rustfs/peer/` |
| `9001` | Console | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | Console web intégrée sous `/rustfs/console/` ; désactivez-la avec `RUSTFS_CONSOLE_ENABLE=false` |

:::note[Connectivité entre nœuds]

Le RPC entre nœuds partage le port 9000. Dans un cluster multi-nœuds, chaque nœud doit pouvoir joindre chaque autre nœud sur le port S3 ; il n’existe pas de port de cluster distinct.

:::

Ouvrez les ports par défaut avec `firewalld` lorsque les clients doivent joindre les deux écouteurs :

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning[Limitez l’accès à la Console]

N’exposez le port 9001 qu’à des réseaux de confiance. Si vous n’avez pas besoin de la Console, définissez `RUSTFS_CONSOLE_ENABLE=false` et laissez le port fermé.

:::

## Points de terminaison de contrôle d’intégrité

L’écouteur S3 sur le port **9000** sert des points de terminaison de sonde non authentifiés. Désactivez-les avec `RUSTFS_HEALTH_ENDPOINT_ENABLE=false`. La Console sur le port **9001** a son propre chemin de contrôle d’intégrité.

| Point de terminaison | Port | Signification |
| --- | --- | --- |
| `GET /health`, `HEAD /health`, `GET /health/live`, `GET /minio/health/live` | 9000 | Vivacité — renvoie `200` tant que le processus est actif |
| `GET /health/ready` | 9000 | État de préparation — `200` seulement lorsque le stockage, l’IAM et l’intégrité des pairs sont prêts ; `503` sinon |
| `GET /minio/health/ready` | 9000 | Alias compatible avec MinIO de la sonde d’état de préparation |
| `GET /minio/health/cluster`, `GET /minio/health/cluster/read` | 9000 | Intégrité d’écriture et de lecture du cluster (exige en plus le quorum de verrouillage) |
| `GET /rustfs/console/health` | 9001 | Intégrité du processus Console |

Un nœud à l’état de préparation répond `200` avec `"ready": true`. Un nœud dégradé répond `503` avec le détail par dépendance :

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -s http://<node>:9000/health/ready | jq
curl -fsS http://localhost:9001/rustfs/console/health
```

L’objet `details` indique `storage` / `iam` / `lock` (et `kms` lorsqu’il est configuré), et `degradedReasons` liste des causes lisibles par une machine telles que `storage_quorum_unavailable`, `iam_not_ready` ou `lock_quorum_unavailable`.

## État du cluster

### Vérifier l’état du cluster dans la Console

1. Connectez-vous à la Console RustFS.
2. Ouvrez **Status**.
3. Vérifiez que le cluster est en ligne et examinez l’état des serveurs, du réseau et des disques.
4. Analysez tout serveur hors ligne, tout disque indisponible ou toute connexion réseau en échec avant une maintenance ou un changement de capacité.

### Vérifier l’état du cluster avec rc

Exécutez la commande d’information du cluster avec votre alias configuré :

```bash
rc admin info cluster rustfs
```

La vue d’ensemble indique l’état du cluster, la version de RustFS, le nombre de serveurs et de disques, le type de backend et la parité du codage d’effacement. La liste des nœuds montre la durée de fonctionnement, la connectivité réseau, la disponibilité des disques et l’appartenance aux pools. La liste des disques montre l’état de chaque disque ainsi que l’emplacement du pool, de l’ensemble et du disque.

Pour une sortie lisible par une machine, demandez le JSON :

```bash
rc admin info cluster rustfs --json
```

## Capacité de stockage

### Vérifier la capacité de stockage dans la Console

1. Connectez-vous à la Console RustFS et ouvrez **Status**.
2. Examinez la capacité de stockage utilisée et totale du cluster.
3. Examinez la capacité et l’espace disponible de chaque disque.
4. Comparez l’utilisation dans le temps et planifiez une extension avant que la capacité disponible ne devienne insuffisante pour les écritures normales et la maintenance.

### Vérifier la capacité de stockage avec rc

Utilisez la même commande d’information du cluster :

```bash
rc admin info cluster rustfs
```

Le résumé **Storage** (stockage) indique la capacité utilisée, la capacité totale et le pourcentage utilisé pour le cluster. Chaque entrée sous **Disks** (disques) indique la capacité utilisée, totale et disponible de ce disque.

Utilisez la sortie JSON lorsque vous collectez les valeurs dans un script ou une intégration de supervision :

```bash
rc admin info cluster rustfs --json
```

Les commandes d’information d’administration exigent des identifiants disposant des permissions correspondantes de l’API d’administration RustFS.

## Étapes suivantes

Pour la télémétrie continue et l’alerte, poursuivez avec l’[Observabilité](./observability.md). Pour ajouter du stockage, consultez l’[Extension de pool](./scaling/storage-pool-expansion.md).
