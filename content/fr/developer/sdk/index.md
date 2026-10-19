---
title: "SDK"
description: "Cette page présente les SDK S3 pris en charge pour RustFS."
---

RustFS est un système de stockage objet distribué doté d’une API compatible avec S3. Vous pouvez :

- Gérer RustFS dans la Console.
- Gérer RustFS par l’intermédiaire de clients S3.
- Utiliser un SDK S3 pour gérer les compartiments (bucket) et les objets depuis votre application.

Les guides suivants expliquent comment utiliser les SDK S3 avec RustFS :

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Go SDK](./go.md)

## Terminologie

Amazon Simple Storage Service (Amazon S3) a été le premier service de stockage objet largement adopté. Son API est devenue la norme de fait du stockage objet. Dans cette documentation, « S3 » désigne le protocole.

## Recommandations relatives aux SDK

Nous recommandons d’utiliser les SDK S3 officiels d’AWS. Ces SDK sont matures, bien maintenus et fortement optimisés.

Vous pouvez aussi utiliser un SDK d’éditeur que vous connaissez et auquel vous faites confiance, à condition qu’il prenne en charge les opérations S3 dont vous avez besoin.

Certains SDK tiers peuvent avoir des implémentations non standard. Nous recommandons d’éviter les SDK qui ne sont pas strictement conformes à S3.

## Compatibilité avec les SDK MinIO

RustFS fonctionne avec les SDK MinIO.

Pour connecter un SDK MinIO à RustFS, définissez le point de terminaison, la clé d’accès et la clé secrète avec vos valeurs RustFS.

## Traitement des SDK incompatibles

Si un SDK ne fonctionne ni avec S3 standard, ni avec MinIO, ni avec RustFS, nous recommandons de passer à un SDK AWS officiel pour S3.
