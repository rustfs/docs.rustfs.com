---
title: "Infraestrutura para dados em grande escala"
description: "RustFS desenhado para escalar: técnico, operacional e económico"
---

# Infraestrutura para dados em grande escala

O RustFS foi desenhado para escalar: a nível técnico, operacional e económico.

É cloud‑native e pode ser executado como um contentor leve orquestrado por Kubernetes. O servidor tem ~100 MB como binário estático e é eficiente em CPU e memória mesmo sob carga, permitindo consolidar muitos tenants no mesmo hardware.

![Arquitetura do RustFS](./images/s2-1.png)

O RustFS corre em qualquer lugar e em qualquer cloud, tipicamente em servidores COTS com JBOD/JBOF. Todos os servidores do cluster são funcionalmente equivalentes (arquitetura totalmente simétrica). Não há name node nem servidor de meta‑dados.

O RustFS escreve dados e meta‑dados juntos como objetos, dispensando base de meta‑dados. Funcionalidades como erasure coding, verificação de bit‑rot e encriptação são feitas inline com consistência estrita, garantindo elevada resiliência.

Cada cluster é um conjunto de servidores RustFS distribuídos, um processo por nó. Corre em espaço de utilizador como processo único com corrotinas leves para alta concorrência. Os discos são agrupados em conjuntos de erasure (ver calculadora de stripes) e os objetos são colocados nesses conjuntos por hashing determinístico.

O RustFS é desenhado para serviços de armazenamento multi‑datacenter em grande escala. Cada tenant executa o seu próprio cluster RustFS, isolado dos outros, protegendo‑o de impactos de upgrades/segurança; cada um escala de forma independente através de federação geográfica.
