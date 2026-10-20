---
title: "Envoy"
description: "Déployez RustFS derrière Envoy avec des routes qui terminent le TLS pour l’API S3 et la Console."
---

Utilisez **Envoy** pour terminer le TLS et acheminer des noms d’hôte distincts vers l’API S3 et la Console de RustFS. Ce déploiement exécute Envoy et une instance RustFS à nœud unique sur un même réseau Docker. Vous avez besoin de Docker Engine, de deux enregistrements DNS et d’un certificat TLS qui couvre les deux noms d’hôte (ce guide utilise un certificat auto-signé pour les tests).

Ce guide utilise ces noms d’hôte d’exemple :

- `s3.example.com` pour l’API S3
- `console.example.com` pour la Console

Remplacez-les par des noms d’hôte qui pointent vers l’hôte Docker.

:::warning[Servir l’API S3 depuis le chemin racine]

Ne publiez pas l’API S3 sous un chemin tel que `/s3/`. AWS Signature Version 4 inclut le chemin et l’hôte de la requête, de sorte que la réécriture de l’une ou l’autre de ces valeurs peut invalider les requêtes signées. Envoy transmet l’en-tête `Host` entrant sans le modifier, ce qui conserve la validité des signatures.

:::

## 1. Créer les répertoires de déploiement

Créez les répertoires de la configuration Envoy et du certificat TLS :

```bash
mkdir -p rustfs-envoy/certs
cd rustfs-envoy
```

Pour les tests locaux, générez un certificat auto-signé qui couvre les deux noms d’hôte :

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/privkey.pem -out certs/fullchain.pem -days 30 \
  -subj "/CN=*.example.com" \
  -addext "subjectAltName=DNS:s3.example.com,DNS:console.example.com"
chmod 644 certs/privkey.pem
```

Rendez le certificat lisible par l’utilisateur non root sous lequel s’exécute l’image Envoy — une clé privée en `600` produit une erreur trompeuse `Failed to load incomplete private key`.

## 2. Configurer Envoy

Créez la configuration avec un écouteur HTTPS et deux hôtes virtuels. Les délais d’expiration des routes sont désactivés (`timeout: 0s`) afin que les longs chargements S3 en flux ne soient pas interrompus :

```yaml title="envoy.yaml"
static_resources:
  listeners:
  - name: https
    address: {socket_address: {address: 0.0.0.0, port_value: 8443}}
    filter_chains:
    - transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
          common_tls_context:
            tls_certificates:
            - certificate_chain: {filename: /certs/fullchain.pem}
              private_key: {filename: /certs/privkey.pem}
      filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: rustfs_https
          route_config:
            virtual_hosts:
            - name: s3
              domains: ["s3.example.com", "s3.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_s3, timeout: 0s}
            - name: console
              domains: ["console.example.com", "console.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_console, timeout: 0s}
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9000}}}
  - name: rustfs_console
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_console
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9001}}}
```

Les entrées de domaine `host:*` sont importantes : sur les ports non standard, les clients envoient `Host: s3.example.com:8443`, et Envoy fait correspondre l’autorité en incluant le port.

## 3. Démarrer Envoy

Exécutez Envoy sur le même réseau Docker que RustFS, en ne publiant que le port du proxy :

```bash
docker run -d --name envoy --network oo-rustfs_default -p 8443:8443 \
  -v "$PWD/envoy.yaml":/envoy.yaml:ro \
  -v "$PWD/certs":/certs:ro \
  envoyproxy/envoy:v1.34-latest -c /envoy.yaml
```

## 4. Vérifier les deux points de terminaison

Faites pointer les noms d’hôte d’exemple vers le proxy avec `curl --resolve` (en production, le DNS s’en charge) :

```bash
curl -sk --resolve s3.example.com:8443:127.0.0.1 \
  https://s3.example.com:8443/health/ready -o /dev/null -w "s3 api: %{http_code}\n"

curl -sk --resolve console.example.com:8443:127.0.0.1 \
  https://console.example.com:8443/rustfs/console/ -o /dev/null -w "console: %{http_code}\n"
```

```text
s3 api: 200
console: 200
```

`-k` omet la validation du certificat, car le certificat est auto-signé ; avec un certificat de confiance, omettez cette option.

## 5. Envoyer des requêtes S3 signées via Envoy

Dirigez n’importe quel client S3 vers le proxy comme s’il s’agissait de RustFS. Configurez le client avec `https://s3.example.com:8443` comme point de terminaison et l’adressage de type chemin (path-style) ; lorsque le certificat du proxy est de confiance, les requêtes signées AWS Signature Version 4 passent sans modification. Pour un essai rapide en HTTP en clair, ajoutez un écouteur HTTP sur le port 8080 avec le même routage d’hôtes virtuels que l’écouteur HTTPS, puis utilisez le point de terminaison `http://s3.example.com:8080` :

```bash
rc alias set rustfs-envoy http://s3.example.com:8080 <your-access-key> <your-secret-key>
rc ls rustfs-envoy/rclone-demo/
```

```text
[                   ]         0B seed/
[2026-09-29 11:12:41]        5 B write-test.txt
```

Les signatures sont validées, car Envoy transmet l’en-tête `Host` d’origine à RustFS.

## Backends multi-nœuds

Pour un déploiement RustFS distribué, ajoutez chaque nœud au cluster S3 :

```yaml title="envoy.yaml"
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node1, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node2, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node3, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node4, port_value: 9000}}}
```

Le cluster de la Console suit le même schéma sur le port `9001`.

## Dépannage

### `Failed to load incomplete private key from path`

Le conteneur Envoy s’exécute sous un utilisateur non root et ne peut pas lire une clé en `600` qui appartient à root. Appliquez `chmod 644` aux fichiers de clé (ou attribuez-en la propriété à l’utilisateur du conteneur, UID `1001` dans l’image officielle).

### Les routes renvoient `404` avec les noms d’hôte corrects

Envoy fait correspondre l’autorité en incluant le port. Ajoutez les variantes `host:*` à la liste `domains` de chaque hôte virtuel, comme dans la configuration ci-dessus.

### `Access Denied` renvoyé par RustFS pour les requêtes transmises

Vérifiez que le proxy ne réécrit ni le chemin ni l’en-tête `Host`. Les requêtes signées doivent atteindre RustFS avec l’hôte pour lequel le client a signé.

## Étapes suivantes

- [Configurer un client S3](/fr/developer/examples/aws-cli)
- [Activer les URL de compartiment (bucket) en adressage de type hôte virtuel](/fr/integration/virtual)
- [Consulter les points de terminaison de contrôle d’intégrité et d’état de préparation](/fr/operations/status-check)
