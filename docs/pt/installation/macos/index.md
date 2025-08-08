---
title: "Instalar RustFS no macOS"
description: "Guia de arranque rápido do RustFS no macOS"
---

# Instalar RustFS no macOS

No macOS, há três formas de iniciar:
1. Docker
2. Pacote gráfico de arranque com um clique
3. Binário

> Este guia foca o arranque rápido usando o pacote gráfico de um clique do RustFS.

## 1. Preparação

Atenção:

> O modo gráfico suporta apenas SNSD (single node, single disk) e é indicado para desenvolvimento, debug e testes.

1. Para detalhes de modos de arranque, veja [Modos](../mode/)
2. Descarregue o instalador, ajuste permissões e inicie

## 2. Download

Vá ao site oficial e descarregue a versão mais recente do instalador do RustFS.

## 3. Permissões

No macOS, confirme que a aplicação tem permissões de execução.

## Iniciar com duplo clique

1. Faça duplo clique no ícone da aplicação
2. Clique para configurar o disco
3. Clique em "Start Service" para iniciar o RustFS

<img src="./images/macos-setup.jpg" alt="macOS start" />

## 4. Alterar configurações

Clique no botão de configuração (ícone de engrenagem) no canto superior direito para ajustar:

1. Porta padrão do servidor
2. Nome de utilizador e palavra‑passe do admin
3. Diretório do disco

<img src="./images/setting.jpg" alt="Configuração RustFS no macOS" />

## 5. Aceder ao Console

Depois de iniciar, aceda a `http://127.0.0.1:7001` para abrir o console.
