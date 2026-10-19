---
title: "Requêtes en adressage de type hôte virtuel"
description: "Configurez les URL S3 en adressage de type chemin (path-style) et en adressage de type hôte virtuel pour RustFS."
---

RustFS prend en charge les deux modes d’adressage des URL S3 :

1. Adressage de type hôte virtuel
2. Adressage de type chemin (path-style)

Les deux modes diffèrent selon l’emplacement du nom du compartiment (bucket) dans l’URL.

## Adressage de type chemin

L’adressage de type chemin est le mode par défaut. Dans une URL de ce type, le nom du compartiment suit le point de terminaison.

Exemple (compartiment : `test`, hôte : `rustfs.yourdomain.com`) :

```text
http://rustfs.yourdomain.com/test
```

**Remarque** : aucune configuration n’est requise pour l’adressage de type chemin.

## Adressage de type hôte virtuel

En adressage de type hôte virtuel, le nom du compartiment fait partie du domaine.

Exemple (compartiment : `test`, hôte : `rustfs.yourdomain.com`) :

```text
http://test.rustfs.yourdomain.com/
```

### Configuration

1. **DNS** : créez un enregistrement DNS générique (par exemple, `*.rustfs.yourdomain.com` → l’adresse IP de votre serveur).
2. **Configuration** : modifiez le fichier de configuration (Linux : `/etc/default/rustfs`, Docker/K8s : variables d’environnement).
3. **Définir le domaine** : définissez `RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com"`.
4. **Redémarrage** : redémarrez le service (`systemctl restart rustfs`).

### Port dans le domaine (facultatif)

Le routage en adressage de type hôte virtuel s’applique à l’écouteur de l’API S3 (port 9000 par défaut) ; RustFS fait automatiquement correspondre les en-têtes `Host` qui portent le port propre à cet écouteur. Vous ne devez inclure ce port dans `RUSTFS_SERVER_DOMAINS` que lorsque les clients joignent RustFS par un port **différent** (par exemple via un proxy).

Exemple (`rustfs.yourdomain.com:8000`) :

```ini
RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com:8000"
```

Cela garantit que des requêtes comme :

```text
http://my-bucket.rustfs.yourdomain.com:8000/
```

sont acheminées correctement en adressage de type hôte virtuel.

:::warning[Faites correspondre l’en-tête Host]

La valeur de `RUSTFS_SERVER_DOMAINS` doit correspondre exactement à l’en-tête `Host` (y compris le port, s’il est présent) envoyé par les clients.

:::
