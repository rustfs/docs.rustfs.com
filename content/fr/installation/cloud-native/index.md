---
title: "Installation Kubernetes (Helm)"
description: "Déployez RustFS sur Kubernetes avec le chart Helm officiel : mode autonome ou distribué, dimensionnement du stockage, sondes, durcissement pour la production et extension des pools de serveurs."
---

RustFS est livré avec un chart Helm officiel qui déploie soit une instance à un seul nœud (un `Deployment` avec un PVC), soit un cluster distribué (un `StatefulSet` avec plusieurs pods et plusieurs PVC). Ce guide décrit l’installation du chart, le choix du mode de déploiement, le dimensionnement correct du stockage et les options de production fournies par le chart.

**Prérequis**

- Un cluster Kubernetes et un accès à `kubectl`
- Helm 3
- Une image RustFS en version `>= 1.0.0-alpha.69` (exigence du chart)
- Une StorageClass dotée d’un provisionneur opérationnel — le chart utilise par défaut [`local-path`](https://github.com/rancher/local-path-provisioner) ; définissez `storageclass.name` pour utiliser la vôtre
- [`rc`](/fr/operations/rc), installé sur l’hôte d’administration, avant d’utiliser les commandes de pools de serveurs de ce guide

Le chart se trouve dans le dépôt source de RustFS, sous `helm/rustfs` :

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs/helm/rustfs
```

## 1. Installation rapide

Installez le chart dans un espace de noms dédié, en définissant vos propres identifiants et une taille de données réaliste :

```bash
helm install rustfs . \
  --namespace rustfs --create-namespace \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key> \
  --set storageclass.dataStorageSize=100Gi \
  --set storageclass.logStorageSize=1Gi
```

:::note[Le chart refuse les identifiants par défaut]

Le rendu échoue par défaut, sauf si l’une des conditions suivantes est vraie :

1. `secret.existingSecret` désigne un Secret Kubernetes que vous contrôlez, ou
2. `secret.rustfs.access_key` et `secret.rustfs.secret_key` sont **tous les deux** définis avec des valeurs non vides et différentes des valeurs par défaut, ou
3. `secret.allowInsecureDefaults: true` est défini (uniquement pour le développement local).

Cela empêche un déploiement accidentel avec les identifiants par défaut bien connus `rustfsadmin`/`rustfsadmin`. La définition d’une seule des deux clés est également rejetée : le chart ne retombe donc jamais silencieusement sur une valeur par défaut pour la clé manquante.

:::

Observez le démarrage des pods :

```bash
kubectl -n rustfs get pods -w
```

```text
NAME       READY   STATUS    RESTARTS   AGE
rustfs-0   1/1     Running   0          2m27s
rustfs-1   1/1     Running   0          2m27s
rustfs-2   1/1     Running   0          2m27s
rustfs-3   1/1     Running   0          2m27s
```

## 2. Choisir un mode de déploiement

Le chart prend en charge deux modes, sélectionnés par les valeurs `mode` :

| Mode | Valeurs | Charge de travail | Disposition |
| --- | --- | --- | --- |
| Distribué (**par défaut**) | `mode.distributed.enabled=true` | StatefulSet | `replicaCount` pods (`>= 2`, `4` par défaut) × `drivesPerNode` PVC de données par pod (`>= 1`, interprété comme `4` lorsque `replicaCount: 4`, ou comme `1` sinon ; 16 disques par défaut) |
| Autonome | `mode.standalone.enabled=true`, `mode.distributed.enabled=false` | Deployment | 1 pod, 1 PVC de données (un nœud, un seul disque) |

- **Autonome** correspond au mode un nœud, un seul disque : aucune redondance par codage d’effacement entre les nœuds. Utilisez-le pour le développement, les tests ou les petits déploiements dans lesquels le stockage sous-jacent assure sa propre durabilité. Il peut réutiliser des PVC existants via `mode.standalone.existingClaim.dataClaim` / `mode.standalone.existingClaim.logsClaim`.
- **Distribué** se comporte comme [plusieurs nœuds, plusieurs disques](../linux/multiple-node-multiple-disk.md) : les objets sont répartis par codage d’effacement entre les pods et les PVC. `replicaCount` définit le nombre de pods (`>= 2`) et `drivesPerNode` définit le nombre de PVC de données par pod (`>= 1`), soit `replicaCount * drivesPerNode` disques au total. Lorsque `drivesPerNode` n’est pas défini (`null`), le chart déduit `4` PVC de données par pod lorsque `replicaCount` vaut `4` (16 disques au total) et `1` PVC de données par pod pour toute autre valeur de `replicaCount` (par exemple, `replicaCount: 16` pour 16 pods avec 1 PVC chacun). Définissez explicitement à la fois `replicaCount` et `drivesPerNode` (par exemple, `replicaCount: 4` et `drivesPerNode: 2` pour 8 disques) afin de choisir une autre disposition.

```bash
# Standalone mode
helm install rustfs . -n rustfs --create-namespace \
  --set mode.standalone.enabled=true \
  --set mode.distributed.enabled=false \
  --set secret.rustfs.access_key=<your-access-key> \
  --set secret.rustfs.secret_key=<your-secret-key>
```

## 3. Dimensionnement du stockage

Les tailles de PVC proviennent du bloc `storageclass` :

```yaml title="values-prod.yaml"
storageclass:
  name: local-path        # your StorageClass
  dataStorageSize: 256Mi  # per data PVC
  logStorageSize: 256Mi   # per logs PVC
```

:::warning[La taille de PVC par défaut est 256Mi — modifiez-la]

La taille par défaut du chart pour les volumes de données et de journaux est de **256Mi**, ce qui suffit uniquement à vérifier que le chart fonctionne. Pour toute charge de travail réelle, définissez `storageclass.dataStorageSize` (par exemple `1Ti`) et `storageclass.logStorageSize` (par exemple `1Gi`) au moment de l’installation. En mode distribué, la taille des données s’applique à **chaque** PVC de données (`replicaCount * drivesPerNode`, 16 PVC par défaut).

:::

Définir `config.rustfs.obs_log_directory` sur `""` désactive entièrement les PVC de journaux et leurs montages. Les annotations de PVC personnalisées se placent sous `storageclass.pvcAnnotations.data` / `storageclass.pvcAnnotations.logs`.

## 4. Sondes d’intégrité

Le chart génère par défaut des sondes HTTP sur le port S3 (9000), alignées sur les points de terminaison d’intégrité du serveur :

- **Vivacité** : `GET /health` (`livenessProbe.httpGet.path`), délai initial de 30 s, période de 5 s
- **État de préparation** : `GET /health/ready` (`readinessProbe.httpGet.path`), délai initial de 10 s, période de 5 s

Un pod n’est ajouté aux points de terminaison du Service qu’une fois que `/health/ready` renvoie `200`, ce qui, en mode distribué, exige que le quorum de stockage soit atteint. Les seuils et les temporisations se règlent au moyen des valeurs `livenessProbe.*` et `readinessProbe.*`.

## 5. Durcissement pour la production

### Budget de perturbation des pods

Désactivé par défaut. Activez-le afin que les évictions volontaires (drainage de nœuds, mises à niveau du cluster) ne mettent jamais hors service plus d’un pod à la fois :

```bash
--set pdb.create=true    # pdb.maxUnavailable defaults to 1
```

### Anti-affinité et répartition topologique

`affinity.podAntiAffinity.enabled` vaut `true` par défaut, avec `topologyKey: kubernetes.io/hostname`, ce qui répartit les pods sur des nœuds distincts. Pour une répartition au niveau des zones, activez `topologySpreadConstraints.enabled` et fournissez des entrées de contrainte brutes sous `topologySpreadConstraints.constraints` (appliquées au StatefulSet distribué).

### mTLS entre pods (cert-manager)

Définissez `mtls.enabled=true` pour chiffrer le trafic entre les pods ; le chart génère des ressources cert-manager `Issuer`/`Certificate` pour une autorité de certification, ainsi que des certificats serveur et client. Pour utiliser un émetteur que vous exploitez déjà, définissez `mtls.existingIssuerRef.enabled=true` avec son `name`, son `kind` (`Issuer` ou `ClusterIssuer`) et son `group`.

### Ingress et Gateway API

L’Ingress est activé par défaut (`ingress.enabled=true`) avec `ingress.className: nginx` ; définissez cette valeur sur `traefik` si c’est votre contrôleur — le chart applique, pour chacun, les annotations d’affinité de session correspondantes. Définissez votre domaine via `ingress.hosts[0].host` (par défaut `example.rustfs.com`). Pour HTTPS, activez `ingress.tls.enabled`, puis transmettez le certificat avec `--set-file ingress.tls.crt=./tls.crt --set-file ingress.tls.key=./tls.key`, pointez vers un secret existant (`ingress.tls.existingSecret`), ou laissez cert-manager en émettre un (`ingress.tls.certManager.enabled=true`).

Le chart prend également en charge, en version alpha, la [Gateway API](https://gateway-api.sigs.k8s.io/) (`gatewayApi.enabled=true` conjointement avec `ingress.enabled=false`, classe de passerelle Traefik) et génère des ressources `Gateway` et `HTTPRoute`.

## 6. Accéder à RustFS

Sans Ingress, redirigez les ports du Service :

```bash
kubectl -n rustfs port-forward svc/rustfs 9000:9000 9001:9001
```

- API S3 : `http://localhost:9000`
- Console : `http://localhost:9001`

Connectez-vous à la Console avec la clé d’accès et la clé secrète définies lors de l’installation. Lorsque l’Ingress est activé, utilisez plutôt l’hôte que vous avez configuré (vérifiez avec `kubectl -n rustfs get ing`). Le Service utilise `ClusterIP` par défaut ; `service.type` peut être basculé vers `NodePort` (S3 sur `service.endpoint.nodePort: 32000`, Console sur `service.console.nodePort: 32001`) ou `LoadBalancer`.

## 7. Monter en charge avec des pools de serveurs

En mode distribué, le chart peut exécuter plusieurs **pools de serveurs** — des StatefulSets indépendants dont les disques forment ensemble un seul cluster. Cela correspond, au niveau du chart, à l’ajout d’un pool de serveurs décrit dans [Extension de pool](../../operations/scaling/storage-pool-expansion.md).

Pour étendre un déploiement existant, activez les pools et décrivez la disposition actuelle comme le pool 0, plus la nouvelle capacité :

```yaml title="values-prod.yaml (pools)"
pools:
  enabled: true
  list:
    - {}                  # pool 0: inherits top-level values and keeps the
                          # existing StatefulSet/pod/PVC names and data
    - replicaCount: 4     # pool 1: new capacity (replicaCount >= 2)
      storageclass:
        dataStorageSize: 10Gi
```

Appliquez ensuite la configuration avec `helm upgrade`. Chaque entrée peut définir `replicaCount` (`>= 2`) et/ou un bloc `storageclass` ; les champs omis héritent des valeurs de premier niveau. Lorsque le `drivesPerNode` de premier niveau est défini explicitement, ce nombre de disques s’applique à chaque pool ; lorsque `drivesPerNode` n’est pas défini (`null`), le chart déduit le nombre de disques de chaque pool à partir du `replicaCount` de ce pool (`4` disques par pod lorsque `replicaCount` vaut `4`, ou `1` disque par pod sinon). Les pools supplémentaires sont générés comme des StatefulSets `<fullname>-pool<N>` ; tous les pools partagent le service headless, le service principal, la configuration et les identifiants.

:::warning[Les pools ne s’ajoutent qu’en fin de liste]

L’index de la liste détermine le nom du StatefulSet — ne supprimez ni ne réordonnez jamais les entrées. Mettez un pool hors service avec `rc admin decommission` avant de le retirer de la liste.

:::

À quoi vous attendre pendant le déploiement, d’après la documentation du chart :

- **Prévoyez des redémarrages.** Les pods redémarrent jusqu’à ce que chaque pod de chaque pool soit résolvable — le serveur refuse de démarrer tant que des pairs ne sont pas résolvables. Attendez-vous donc à quelques boucles de plantage avant la convergence du cluster. Ce comportement est sans gravité.
- **Rééquilibrez ensuite.** Une fois le cluster convergé, exécutez `rc admin rebalance start <alias>` pour répartir les objets existants sur le nouveau pool.
- Le PodDisruptionBudget couvre tous les pools : avec la valeur par défaut `pdb.maxUnavailable: 1`, au plus un pod de l’ensemble du cluster peut être évincé à la fois.

:::note

`rc` est le client en ligne de commande de RustFS. Utilisez `rc admin pool list`, `expand`, `rebalance` et `decommission` pour les procédures de pools de serveurs décrites par le chart.

:::

## 8. Désinstaller

```bash
helm uninstall rustfs -n rustfs
```

:::note

Helm ne supprime pas les PVC créés par les modèles de revendication de volume d’un StatefulSet. Si vous souhaitez supprimer les données, retirez explicitement les PVC (`kubectl -n rustfs delete pvc -l app.kubernetes.io/name=rustfs`) — sinon, une réinstallation ultérieure avec le même nom de release les rattache de nouveau.

:::

## Étapes suivantes

- [Extension de pool](../../operations/scaling/storage-pool-expansion.md) — fonctionnement de l’extension d’un pool de serveurs au niveau du cluster
- [Mise à niveau Kubernetes](../../operations/upgrade/kubernetes/index.md) — mettre à niveau les déploiements gérés par Helm et par l’Operator
- [Configuration TLS](../../integration/tls-configured.md) — options TLS de bout en bout
