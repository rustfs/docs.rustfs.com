---
title: "Guide du SDK TypeScript"
description: "Pilotez RustFS depuis TypeScript avec le SDK AWS pour JavaScript v3, y compris la création et la suppression de compartiments et d’objets."
---

RustFS ne fournit pas de SDK TypeScript propre. Il est compatible avec S3 : vous utilisez donc le SDK AWS officiel pour JavaScript v3 (qui inclut les définitions de types TypeScript), configuré pour pointer vers votre serveur RustFS. Avec ce SDK, vous pouvez créer et supprimer des compartiments (buckets), charger (upload) et télécharger des objets, ainsi que les supprimer.

## Prérequis

- Node.js 18 ou ultérieur (les exemples utilisent les modules ES : définissez `"type": "module"` dans votre `package.json`)
- Une instance RustFS en cours d’exécution (consultez le [guide d’installation](../../installation/index.md)) : l’API S3 écoute sur le port `9000`, la Console sur le port `9001`
- Des clés d’accès, définies à l’installation par les variables d’environnement `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` (reportez-vous à la [gestion des clés d’accès](../../security-compliance/iam/access-token.md) pour les créer)

:::tip[Essai local]

Si vous n’avez pas défini d’identifiants à l’installation, le serveur utilise par défaut `rustfsadmin` / `rustfsadmin`. Cela convient à un essai local jetable, jamais à une instance accessible à d’autres personnes.

:::

Installez les dépendances :

```bash
npm install @aws-sdk/client-s3
npm install --save-dev typescript tsx @types/node
```

## Initialisation du client

L’exemple suivant est complet et exécutable. Remplacez `localhost` par l’adresse IP de votre serveur si RustFS s’exécute sur une autre machine, et renseignez vos propres clés d’accès :

```typescript title="main.ts"
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import * as fs from "fs";

const rustfs_client = new S3Client({
  region: "us-east-1", // RustFS default region
  endpoint: "http://localhost:9000", // RustFS S3 API address
  credentials: {
    accessKeyId: "<your-access-key>",
    secretAccessKey: "<your-secret-key>",
  },
  // RustFS uses path-style URLs by default; virtual-host style requires RUSTFS_SERVER_DOMAINS
  forcePathStyle: true,
});

const response = await rustfs_client.send(new ListBucketsCommand({}));
console.log(response.Buckets?.map((bucket) => bucket.Name) ?? []);
```

Exécutez-le :

```bash
npx tsx main.ts
```

```text
[ 'my-bucket' ]
```

Utilisez ensuite le `rustfs_client` construit pour les opérations ci-dessous.

## Créer un compartiment

```typescript
async function createBucket() {
  try {
    const response = await rustfs_client.send(
      new CreateBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket created:", response.Location);
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket created: /my-bucket
```

## Supprimer un compartiment

```typescript
async function deleteBucket() {
  try {
    await rustfs_client.send(
      new DeleteBucketCommand({
        Bucket: "my-bucket",
      })
    );
    console.log("Bucket deleted");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Bucket deleted
```

## Lister les compartiments

```typescript
async function listBuckets() {
  try {
    const response = await rustfs_client.send(new ListBucketsCommand({}));
    response.Buckets?.forEach((bucket) => console.log(bucket.Name));
  } catch (error) {
    console.log(error);
  }
}
```

```text
my-bucket
```

## Lister les objets

```typescript
async function listObjects() {
  try {
    const response = await rustfs_client.send(
      new ListObjectsV2Command({
        Bucket: "my-bucket",
      })
    );
    response.Contents?.forEach((obj) => console.log(`${obj.Key} (${obj.Size} bytes)`));
  } catch (error) {
    console.log(error);
  }
}
```

```text
test/hello.txt (12 bytes)
```

## Charger un fichier

```typescript
async function uploadFile() {
  try {
    await rustfs_client.send(
      new PutObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
        Body: fs.createReadStream("/path/to/hello.txt"),
      })
    );
    console.log("Object uploaded");
  } catch (error) {
    console.log(error);
  }
}
```

```text
Object uploaded
```

## Télécharger un objet

```typescript
async function getObject() {
  try {
    const response = await rustfs_client.send(
      new GetObjectCommand({
        Bucket: "my-bucket",
        Key: "test/hello.txt",
      })
    );

    // get object content
    if (response.Body) {
      const chunks: Buffer[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk as Buffer);
      }
      const data = Buffer.concat(chunks).toString("utf-8");
      console.log("Object content:", data);
    }
  } catch (error) {
    console.log(error);
  }
}
```

```text
Object content: hello rustfs
```

Pour les autres opérations (URL présignées, chargements partitionnés, etc.), consultez la [documentation de l’AWS SDK pour JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/). La plupart des opérations S3 fonctionnent de la même manière avec RustFS ; les exceptions sont décrites dans la [compatibilité S3](/fr/reference/s3-compatibility).
