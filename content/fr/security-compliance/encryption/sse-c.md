---
title: "SSE-C"
description: "Utilisez des clés AES-256 fournies par le client pour le chiffrement et le déchiffrement des objets RustFS."
---

SSE-C chiffre un objet avec une clé de 256 bits fournie par le client à chaque requête d’écriture et de lecture. RustFS valide et utilise la clé pour la requête, mais ne persiste pas la clé client en clair. SSE-C n’utilise pas le backend KMS de RustFS.

## Prérequis

- Installez et configurez [`rc`](/fr/operations/rc).
- Installez OpenSSL pour l’exemple de génération de clé.
- Utilisez HTTPS afin que les clés client soient chiffrées en transit.
- Stockez la clé client dans un gestionnaire de secrets et conservez une correspondance entre chaque objet et sa clé.

:::warning[La même clé est exigée pour chaque lecture]

Si vous perdez une clé SSE-C, RustFS ne peut pas la retrouver et l’objet devient illisible. Ne journalisez jamais la clé, ne l’ajoutez jamais au dépôt et ne l’envoyez jamais sur une connexion non chiffrée.

:::

## Préparer une clé client

Générez 32 octets aléatoires via un intermédiaire hexadécimal, puis dérivez la clé Base64 et sa somme MD5 encodée en Base64 :

```bash
SSE_C_KEY_HEX=$(openssl rand -hex 32)
SSE_C_KEY_B64=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p | openssl base64 -A)
SSE_C_KEY_MD5=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p \
	| openssl dgst -md5 -binary | openssl base64 -A)
```

Placez ces valeurs dans votre processus approuvé de gestion des secrets. Ne les affichez pas dans le terminal ni dans l’historique du shell.

## Charger un objet chiffré

`rc 0.1.29` ne dispose pas d’option SSE-C dédiée. Son option d’en-tête personnalisé signé peut envoyer les trois en-têtes SSE-C de S3 :

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

Les en-têtes de requête exigés sont les suivants :

| En-tête | Valeur |
| --- | --- |
| `x-amz-server-side-encryption-customer-algorithm` | `AES256` |
| `x-amz-server-side-encryption-customer-key` | Clé de 32 octets encodée en Base64 |
| `x-amz-server-side-encryption-customer-key-md5` | Empreinte MD5 de la clé brute, encodée en Base64 |

## Lire l’objet chiffré

Fournissez les trois mêmes en-têtes pour les lectures et les requêtes de métadonnées :

```bash
rc object show rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

Le même flux a été validé avec `rc 0.1.29` sur RustFS en chargeant (upload) un objet, en le lisant avec la clé d’origine et en comparant les octets renvoyés à la source.

:::warning[Protégez les arguments de commande]

La méthode générique `-H` place les valeurs d’en-tête développées dans les arguments du processus `rc`, qui peuvent être visibles par d’autres processus de l’hôte. Pour l’automatisation en production, préférez un SDK S3 qui accepte le matériel de clé SSE-C via une mémoire protégée ou un fournisseur d’identifiants, plutôt que des arguments de ligne de commande.

:::

## Effacer les variables du shell

Après l’opération, retirez le matériel de clé de l’environnement du shell :

```bash
unset SSE_C_KEY_HEX SSE_C_KEY_B64 SSE_C_KEY_MD5
```

Modifier la valeur par défaut SSE-S3 ou SSE-KMS d’un compartiment (bucket) ne modifie pas les objets SSE-C. SSE-C est sélectionné par les en-têtes de clé client de chaque requête individuelle et a priorité pour cette requête.

## Étapes suivantes

Comparez [SSE-S3](./sse-s.md) pour le chiffrement géré par le serveur et [KMS](./kms.md) pour une gestion des clés explicite reposant sur le KMS.
