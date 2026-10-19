---
title: "Conteneur"
description: "Exécutez l’image de conteneur officielle de RustFS avec Docker ou Podman."
---

RustFS est un système de stockage objet distribué, à code source ouvert et compatible avec S3. En mode nœud unique, disque unique (SNSD), RustFS n’utilise pas le codage d’effacement et ne stocke aucune donnée redondante. Ce mode ne convient donc qu’aux tests locaux et aux petites charges. L’image officielle de RustFS regroupe le binaire RustFS et son environnement d’exécution dans un conteneur : vous pouvez démarrer RustFS avec un stockage persistant en une seule commande.

Le conteneur s’exécute sous l’utilisateur non root `rustfs`, d’identifiant `10001`. Un répertoire de l’hôte monté en bind mount doit donc appartenir à `10001`, afin d’éviter les erreurs « permission denied ».

## Environnements d’exécution de conteneurs

- [Docker](./docker.md) : exécutez une instance à nœud unique avec un stockage persistant, puis étendez-la avec Docker Compose, TLS et un réseau multi-nœuds.
- [Podman](./podman.md) : exécutez la même image dans un flux de travail sans démon.

:::note[Droits des répertoires]

Si vous montez un répertoire de l’hôte dans le conteneur avec `-v`, assurez-vous que le propriétaire du répertoire de l’hôte est `10001` :

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

Pour les déploiements Kubernetes, consultez plutôt le [chart Helm](/fr/installation/cloud-native/helm-chart) ou l’[Operator](/fr/installation/cloud-native/operator).
