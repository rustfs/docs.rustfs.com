---
title: "Instalação do RustFS no macOS"
description: "Este artigo explica principalmente o método de inicialização rápida do RustFS no macOS"
---

# Instalação do RustFS no macOS


No macOS, três métodos podem ser usados:
1. Docker
2. Pacote de inicialização gráfico com um clique
3. Pacote binário

> Este artigo explica principalmente o uso do **pacote de inicialização gráfico com um clique** do RustFS para uma inicialização rápida do RustFS.



## I. Preparação

Por favor, entenda:

> O **modo de inicialização gráfico** suporta apenas o modo de nó único disco único, mais adequado para ambientes de desenvolvimento, depuração e teste.


1. Para uma introdução detalhada dos modos de inicialização, consulte [Modos de Inicialização](../linux/index.md#mode);

2. Baixe o pacote de instalação, modifique as permissões e proceda com a inicialização.


## II. Download

Visite a página de download oficial para baixar a versão mais recente do pacote de instalação do RustFS.


## III. Modificar Permissões

Por favor, confirme que este programa possui as permissões de execução relevantes no sistema operacional macOS.


## Clique Duplo no Ícone de Inicialização

1. Clique duas vezes no ícone de inicialização;

2. Clique em configurar disco;

3. Clique em "Start Service", o serviço RustFS inicia com sucesso.


<img src="./images/macos-setup.jpg" alt="inicialização do macOS" />



## IV. Modificar Configuração

Clique no botão de modificação no canto superior direito (botão em forma de engrenagem), você pode modificar:

1. Porta padrão do servidor;

2. Nome de usuário e senha do administrador padrão;

3. Diretório de disco especificado;

<img src="./images/setting.jpg" alt="configuração RustFS Windows" />



## V. Acesso ao Console


Após a inicialização bem-sucedida, visite `http://127.0.0.1:7001` para acessar o console.
