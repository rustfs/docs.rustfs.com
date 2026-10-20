---
title: "Liste de contrôle de sécurité"
description: "Cette liste de contrôle couvre la sécurité des déploiements d’entreprise."
---

> Bonnes pratiques de sécurité pour RustFS. Passez cette liste en revue pendant le déploiement afin de garantir la sécurité et la fiabilité du système.

## Authentification et contrôle d’accès

- **Authentification par clés compatible avec S3**
 RustFS utilise AWS Signature V4. Assurez-vous que toutes les requêtes sont signées avec une clé d’accès et une clé secrète valides.

- **Contrôle d’accès fondé sur des politiques**
 Définissez les politiques d’accès selon le principe du moindre privilège. Définissez explicitement les opérations autorisées ; refusez toutes les autres par défaut.

## Chiffrement (TLS/SSL)

- **Activez TLS/SSL**
 Configurez des certificats TLS valides. Nous recommandons d’utiliser des certificats distincts pour l’accès externe et l’accès interne, et d’imposer TLS 1.2 ou ultérieur.

- **Gestion des certificats**
 Utilisez des certificats émis par des autorités de certification de confiance. Protégez les clés privées par des permissions de fichiers strictes.

- **Multi-domaines et suites de chiffrement**
 Utilisez un certificat distinct pour chaque domaine. Utilisez des algorithmes de clés robustes (par exemple, RSA 2048 bits ou ECDSA P-256).

## Protection des identifiants

- **Changez les identifiants par défaut**
 Ne conservez jamais les espaces réservés d’exemple (`<your-access-key>` / `<your-secret-key>`) en production. Définissez une clé d’accès unique et une clé secrète robuste et aléatoire — par exemple, générez-en une avec `openssl rand -base64 24` — immédiatement après l’initialisation.

- **Stockage sécurisé**
 Ne codez pas les identifiants en dur. Utilisez des variables d’environnement ou un système de gestion des secrets (par exemple, les Secrets Kubernetes).

## Journalisation et audit

- **Activez les journaux d’audit**
 Exportez les journaux d’audit vers des systèmes externes (webhook HTTP, Kafka, ELK, Splunk).

- **Collecte des journaux**
 Collectez les journaux avec les outils habituels (journald, Docker, Kubernetes) et analysez-les avec ELK ou Grafana Loki.

- **Supervision et alertes**
 Définissez des alertes pour les comportements anormaux (échecs de connexion, schémas d’accès inhabituels, suppressions en masse).

- **Observabilité**
 Surveillez la latence des requêtes afin d’identifier les problèmes de performance.

## Sécurité de l’API

- **Restreignez l’accès réseau**
 Restreignez l’accès à l’API S3 (port 9000) et à la Console (port 9001) à l’aide de pare-feu ou de groupes de sécurité.

- **Isolation réseau**
 Utilisez des proxys inverses (par exemple, Nginx) plutôt que d’exposer directement les nœuds de stockage.

- **Fermez les ports inutiles**
 Désactivez les ports inutilisés et n’exposez pas les interfaces d’administration à l’Internet public.

## Conformité WORM

- **Gestion des versions et verrouillage d’objet**
 Activez la gestion des versions et le verrouillage d’objet afin de répondre aux exigences réglementaires.

## Mises à jour

- **Appliquez les correctifs**
 Vérifiez régulièrement les mises à jour de RustFS et appliquez-les.

- **Mises à niveau sans interruption**
 Utilisez le processus de redémarrage progressif pour les mises à niveau sans temps d’arrêt.

- **Système d’exploitation et dépendances**
 Maintenez à jour le système d’exploitation et les dépendances (par exemple, OpenSSL).

---

Passez régulièrement cette liste en revue afin de maintenir un déploiement RustFS sécurisé.
