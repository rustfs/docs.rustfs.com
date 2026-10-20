---
title: Intégration KMS
description: Configurez la gestion de clés locale ou HashiCorp Vault pour un Tenant RustFS via l’API de chiffrement de l’Operator.
---

Configurez l’intégration du service de gestion des clés (KMS) via `spec.encryption`. N’ajoutez pas de variables `RUSTFS_KMS_*` à `spec.env` ; l’Operator les génère à partir de la configuration structurée du Tenant et des références de Secrets.

## Choisir un backend

Utilisez `local` uniquement pour un Tenant à un seul serveur. Utilisez `vault` pour les déploiements distribués dans lesquels chaque pod du Tenant peut joindre HashiCorp Vault.

## KMS local

Créez un Secret de clé principale :

```yaml title="local-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-local-kms
  namespace: storage-a
type: Opaque
stringData:
  local-master-key: "replace-with-a-random-master-key"
```

Ajoutez le bloc de chiffrement au manifeste Tenant existant :

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: local
    local:
      keyDirectory: /data/rustfs0/.kms-keys
      masterKeySecretRef:
        name: rustfs-local-kms
        key: local-master-key
    defaultKeyId: tenant-default
```

Le répertoire de clés doit se trouver à l’intérieur d’un chemin de données monté, afin de survivre au remplacement du pod.

## KMS HashiCorp Vault

Créez un Secret contenant un jeton Vault :

```yaml title="vault-kms-secret.yaml"
apiVersion: v1
kind: Secret
metadata:
  name: rustfs-kms
  namespace: storage-a
type: Opaque
stringData:
  vault-token: "replace-with-vault-token"
```

Ajoutez la configuration Vault au manifeste Tenant existant :

```yaml title="tenant.yaml"
spec:
  encryption:
    enabled: true
    backend: vault
    vault:
      endpoint: https://vault.example.com:8200
    kmsSecret:
      name: rustfs-kms
    defaultKeyId: tenant-default
```

Chaque pod du Tenant doit pouvoir résoudre le point de terminaison Vault, s’y connecter et faire confiance à son certificat.

## Appliquer la configuration

```bash
kubectl apply -f local-kms-secret.yaml
kubectl apply -f tenant.yaml
kubectl -n storage-a describe tenant tenant-a
```

Pour Vault, appliquez `vault-kms-secret.yaml` avant `tenant.yaml`. La modification des réglages de chiffrement déclenche un redémarrage progressif des StatefulSets concernés.

:::warning[Protégez les clés de chiffrement]

Sauvegardez le matériel de clés et testez la récupération avant de stocker des données de production. La perte de la clé principale locale ou des clés Vault peut rendre les objets chiffrés irrécupérables.

:::
