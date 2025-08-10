---
title: "Instalar RustFS no Windows"
description: "Arranque do RustFS no Windows com um clique"
---

# Instalar RustFS no Windows

## 1. Preparação

Atenção:

> O modo de arranque no Windows suporta apenas SNSD (single node, single disk), indicado para desenvolvimento, debug e testes.

1. Para detalhes dos modos, veja [Modos](../mode/)
2. Descarregue o instalador, ajuste permissões e inicie

## 2. Download

Vá ao site oficial e descarregue a versão mais recente do instalador do RustFS.

## 3. Permissões

No Windows, confirme que a aplicação tem permissões de execução.

## Iniciar com duplo clique

1. Faça duplo clique no ícone da aplicação
2. Clique para configurar o disco
3. Clique em "Start Service" para iniciar o RustFS

<img src="./images/windows-setup.jpg" alt="Windows start" />

## 4. Alterar configurações

Clique no botão de configuração (ícone de engrenagem) no canto superior direito para ajustar:

1. Porta padrão do servidor
2. Nome de utilizador e palavra‑passe do admin
3. Diretório do disco

<img src="./images/setting.jpg" alt="Configuração RustFS no Windows" />

## 5. Aceder ao Console

Depois de iniciar, aceda a `http://127.0.0.1:7001` para abrir o console.
