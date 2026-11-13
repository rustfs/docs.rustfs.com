---
title: "Dapr"
description: "Lire et écrire des objets RustFS depuis n'importe quelle application Dapr via le binding AWS S3."
---

Ce guide connecte [Dapr](https://github.com/dapr/dapr) — le runtime portable de la CNCF pour applications distribuées — à **RustFS** via son binding AWS S3. Vous allez déclarer un composant de binding adossé à un bucket RustFS, exécuter un sidecar et utiliser l'API HTTP du binding pour créer un objet, le relire et le confirmer de façon indépendante. Le workflow a été vérifié avec `daprio/dapr:1.19.0` contre un bucket RustFS avec l'adressage path-style.

Vous avez besoin de Docker. Ce déploiement est destiné aux tests d'intégration locaux, pas à la production.

## Architecture

```mermaid
flowchart LR
	App["Your app"] -->|"POST /v1.0/bindings/rustfs-s3"| Daprd["daprd sidecar :3500"]
	Daprd -->|"bindings.aws.s3"| RustFS["RustFS :9000"]
```

Les applications ne détiennent aucun identifiant ni endpoint S3. Le sidecar expose le bucket comme un binding nommé, et chaque opération est un POST vers l'endpoint du binding avec une `operation` et des `metadata` optionnelles.

## 1. Déclarer le composant de binding

Créez le fichier du composant. L'`endpoint` inclut le schéma et `forcePathStyle` correspond à l'adressage path-style de RustFS :

```yaml title="rustfs-s3.yaml"
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: rustfs-s3
spec:
  type: bindings.aws.s3
  version: v1
  metadata:
  - name: bucket
    value: my-bucket
  - name: endpoint
    value: http://<your-rustfs-endpoint>:9000
  - name: accessKey
    value: <your-access-key>
  - name: secretKey
    value: <your-secret-key>
  - name: region
    value: us-east-1
  - name: forcePathStyle
    value: "true"
```

## 2. Démarrer le sidecar

Exécutez `daprd` avec le répertoire des composants monté. `--resources-path` remplace le `--components-path` obsolète :

```bash
docker run -d --name dapr \
  -v "$PWD:/components" \
  daprio/dapr:1.19.0 /daprd \
  --app-id s3demo \
  --dapr-http-port 3500 \
  --resources-path /components
```

Confirmez l'initialisation du binding — le journal se termine par :

```bash
docker logs dapr 2>&1 | grep "successful init"
```

```text
successful init for output binding (rustfs-s3 (bindings.aws.s3/v1))
```

## 3. Créer un objet via le binding

Appelez le binding depuis n'importe quel client HTTP atteignant le sidecar. La métadonnée `key` fixe le nom de l'objet :

```bash
curl -s -X POST http://localhost:3500/v1.0/bindings/rustfs-s3 \
  -H "Content-Type: application/json" \
  -d '{"operation":"create","data":"hello from dapr","metadata":{"key":"dapr/hello.txt"}}'
```

```json
{"location":"http://<your-rustfs-endpoint>:9000/my-bucket/dapr/hello.txt","versionID":null}
```

## 4. Relire l'objet

L'opération `get` renvoie le contenu de l'objet dans le corps de la réponse :

```bash
curl -s -X POST http://localhost:3500/v1.0/bindings/rustfs-s3 \
  -H "Content-Type: application/json" \
  -d '{"operation":"get","metadata":{"key":"dapr/hello.txt"}}'
```

```text
hello from dapr
```

Confirmez le même objet depuis un client indépendant :

```bash
aws s3 cp s3://my-bucket/dapr/hello.txt - \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

```text
hello from dapr
```

![Objets du binding Dapr dans la console RustFS](./images/rustfs-dapr-binding.png)

## 5. Arrêter ou réinitialiser

Pour démonter le sidecar tout en conservant les objets du bucket :

```bash
docker rm -f dapr
```

Pour supprimer l'objet de démonstration :

```bash
aws s3 rm s3://my-bucket/dapr/hello.txt \
  --endpoint-url http://<your-rustfs-endpoint>:9000
```

## Dépannage

### Le binding échoue à s'initialiser avec une erreur S3

Vérifiez ensemble les quatre valeurs d'adressage : `endpoint` doit inclure le schéma, `region` est requise même pour des endpoints non AWS, et `forcePathStyle` doit valoir `"true"`. Sans `forcePathStyle`, Dapr envoie des requêtes virtual-hosted que RustFS refuse.

### `no such binding` à l'appel

Le sidecar n'a pas chargé le composant — confirmez que le fichier se termine par `.yaml`, se trouve dans le répertoire passé à `--resources-path`, et que la ligne d'initialisation de l'étape 2 apparaît dans le journal.

### `get` renvoie un contenu vide

La `metadata.key` ne correspond pas à la clé utilisée lors de la création. Les clés sont sensibles à la casse et incluent le préfixe.

## Prochaines étapes

- Consultez les [notes de compatibilité S3](/administration/protocols/s3) avant d'adopter les opérations `list`, `delete` ou `presign` du binding.
- Créez des identifiants de production dédiés avec la [gestion des clés d'accès](/security-compliance/iam/access-token) et référencez-les via un store de secrets Dapr plutôt qu'en clair dans le composant.
- Suivez la [documentation du binding S3 de Dapr](https://docs.dapr.io/reference/components-reference/supported-bindings/s3/) pour l'ensemble des opérations et le comportement des tentatives.
