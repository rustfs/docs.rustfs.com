---
title: "Choix du matériel"
description: "Cette page indique le matériel minimal et le matériel recommandé pour les environnements de test et de production de RustFS."
---

> RustFS est conçu pour l’efficacité, avec une faible empreinte mémoire.

## Environnement de test

Configuration minimale pour les tests :

| Composant | Exigence |
| - | - |
| CPU | 1 cœur ou plus |
| Architecture | x86, ARM |
| Mémoire | 1 GB ou plus |
| Stockage | HDD ou SSD |
| Docker | Pris en charge |
| Réseau | Local ou hors ligne |
| Système d’exploitation | Windows, Linux, macOS |
| Équilibrage de charge | Aucun |
| Nœuds | 1 |

## Environnement de production

La version Windows de RustFS est destinée uniquement au développement et au débogage et **n’est pas recommandée pour les déploiements en production**. Pour la production, nous recommandons [Linux](/fr/installation/linux).

| Composant | Exigence |
| - | - |
| CPU | 2 × 12 cœurs ou plus |
| Architecture | x86, ARM, etc. |
| Mémoire | 64 GB ou plus |
| Stockage | SSD recommandé |
| Réseau | 10 Gbps ou plus |
| Système d’exploitation | Linux (recommandé) |
| Équilibrage de charge | Recommandé |
| Nœuds | 4 ou plus |

## Services professionnels

Pour les déploiements complexes, contactez l’assistance à hello@rustfs.com.
