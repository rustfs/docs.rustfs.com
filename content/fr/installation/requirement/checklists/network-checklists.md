---
title: "Liste de contrôle réseau"
description: "Cette page fournit la liste de contrôle réseau pour les déploiements d’entreprise."
---

## Architecture réseau

### Planification

- **Topologie**
 Vérifiez que l’architecture en étoile, en anneau ou en maillage satisfait les exigences de haute disponibilité.
- **Redondance**
 Prévoyez au moins deux liaisons physiques indépendantes entre les nœuds.
- **Bande passante**
 Estimez le trafic ainsi : bande passante de lecture et d’écriture × nombre de nœuds × nombre de répliques, plus 20 % de marge.

### Allocation des adresses IP

- [ ] Séparez le réseau d’administration du réseau de données.
- [ ] Attribuez une plage d’adresses IP contiguë aux nœuds de stockage. Nous recommandons un sous-réseau /24.
- [ ] Réservez au moins 15 % des adresses IP pour l’extension.

---

## Exigences matérielles

### Commutateurs

| Élément | Exigence |
|--------|---------|
| Bande passante du fond de panier | ≥ 1.2 × le débit ligne agrégé de tous les ports |
| Type de port | Ports fibre 10G/25G/100G SFP+/QSFP+ |
| Capacité de la table de flux | ≥ nombre de nœuds × 5 |
| Spanning Tree | Activez RSTP ou MSTP pour une convergence rapide |

### Câblage

- [ ] Test d’atténuation de la fibre (monomode ≤0.35dB/km).
- [ ] Vérifiez la correspondance des ports (nœud A eth0 ↔ nœud B eth0).
- [ ] Étiquetage des câbles (adresses IP source et destination, plus le numéro de port).

---

## Configuration du système d’exploitation

### Réglage du noyau

```bash
# Check the following parameter settings
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_slow_start_after_idle = 0
```

### Configuration des cartes réseau

- [ ] Activez les trames jumbo (MTU=9000, prise en charge requise sur l’ensemble du chemin).
- [ ] Vérifiez le mode de bonding (LACP mode4 recommandé).
- [ ] Désactivez IPv6 (s’il n’est pas nécessaire).

---

## Sécurité

### Pare-feu

```text
# Necessary open ports
- TCP 9000 (S3 API; also used for internal node-to-node communication)
- TCP 9001 (RustFS Console)
- TCP 443 (only if you terminate HTTPS on a reverse proxy / load balancer)
```

### Contrôle d’accès

- Activez la sécurité de port (limitation des adresses MAC) sur les commutateurs.
- Chiffrez le trafic entre les nœuds de stockage avec IPsec.
- Activez TLS 1.3 sur les interfaces d’administration.

---

## Tests de performance

### Mesures

1. Latence entre nœuds : `ping -c 20 <target IP>` (exécutez d’abord `iperf3 -s` sur la cible pour les tests de débit)
2. Bande passante entre racks : `iperf3 -c <target IP> -P 8 -t 30`
3. Basculement : déconnectez de façon aléatoire des liaisons principales pour observer le temps de reprise.

### Critères

| Indicateur | Exigences |
|------|------|
| Latence des nœuds | ≤ 1 ms (même centre de données) / ≤ 5 ms (entre zones de disponibilité) |
| Utilisation de la bande passante | Pic ≤ 70 % de la capacité prévue |
| Basculement | Convergence BPDU < 500ms |

---

## Exigences documentaires

1. Schéma de topologie réseau (connexions physiques et adresses IP logiques)
2. Fichiers de sauvegarde de configuration des commutateurs (avec horodatage)
3. Rapports des tests de référence (données brutes incluses)
4. Journal des modifications (fenêtres de maintenance incluses)

:::tip

Nous recommandons d’exécuter un test de charge de 72 heures à 110 % du trafic de pointe attendu avant le déploiement en production.

:::

Cette liste de contrôle couvre les principales exigences réseau pour déployer un stockage objet distribué en environnement d’entreprise. Pour une assistance technique, contactez RustFS.
