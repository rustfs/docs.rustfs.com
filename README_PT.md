# Guia de Contribuição para a Documentação RustFS

Bem-vindo à comunidade RustFS! Apreciamos muito seu interesse em contribuir com nossa documentação. Sua contribuição, seja corrigindo um erro de digitação ou traduzindo um guia completo, é importante para nós. Este guia tem como objetivo fornecer instruções claras para ajudá-lo a participar suavemente da construção conjunta da documentação RustFS.

<p align="center">
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README.md">English</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_DA.md">Deutsch</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_FR.md">Français</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_TR.md">Türkçe</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ES.md">Español</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_KO.md">한국어</a> |
  <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_RU.md">Русский</a> |
  Português
</p>

------

### Índice

1. [O que é RustFS?](#1-o-que-é-rustfs)
2. [Nossa Missão: Dados Acessíveis e Seguros para Todos](#2-nossa-missão-dados-acessíveis-e-seguros-para-todos)
3. [Sua Jornada de Contribuição](#3-sua-jornada-de-contribuição)
   - [Começando: Sua Primeira Contribuição](#31-começando-sua-primeira-contribuição)
   - [Traduzindo a Documentação: Adicionando um Novo Idioma](#32-traduzindo-a-documentação-adicionando-um-novo-idioma)
4. [O Fluxo de Trabalho Técnico](#4-o-fluxo-de-trabalho-técnico)
   - [Pré-requisitos](#41-pré-requisitos)
   - [Configuração de Desenvolvimento Local](#42-configuração-de-desenvolvimento-local)
   - [Diretrizes de Pull Request (PR) e Commits](#43-diretrizes-de-pull-request-pr-e-commits)
   - [Verificações Automatizadas e Implantação](#44-verificações-automatizadas-e-implantação)
5. [Comunidade e Licenciamento](#5-comunidade-e-licenciamento)
   - [Agradecimentos](#51-agradecimentos)
   - [Licença de Conteúdo](#52-licença-de-conteúdo)

### 1. O que é RustFS?

RustFS é uma solução de armazenamento de objetos distribuída, simples e de alta performance. É 100% compatível com S3 e é lançada sob a licença Apache 2.0, tornando-a um software de código aberto amigável para uso comercial.

Escrito inteiramente em Rust—a linguagem de programação moderna conhecida por sua segurança de memória e performance excepcional¹—RustFS é desenvolvido por uma comunidade global de engenheiros talentosos. É projetado para ser uma alternativa de código aberto poderosa e confiável, e pode servir como substituto direto para produtos como MinIO.²

### 2. Nossa Missão: Dados Acessíveis e Seguros para Todos

Acreditamos que o armazenamento de dados deve ser acessível, confiável e seguro para todos, em todos os lugares.

Documentação de alta qualidade e multilíngue é central para esta missão. Não é apenas um complemento; é a chave para reduzir a barreira de entrada para usuários e desenvolvedores em todo o mundo. Quando você traduz um guia ou corrige um erro, está ajudando diretamente pessoas de diferentes comunidades linguísticas a construir mais facilmente infraestruturas de dados robustas e econômicas. Suas contribuições capacitam uma audiência global, melhorando coletivamente a segurança e soberania dos dados. Esta abordagem comunitária para compartilhamento de conhecimento maximiza o valor do projeto e nos ajuda a realizar verdadeiramente nossa visão.⁴

### 3. Sua Jornada de Contribuição

Projetamos diferentes caminhos para vários tipos de contribuidores. Seja você queira corrigir rapidamente um pequeno problema ou traduzir sistematicamente toda a documentação, encontrará o guia certo aqui.

#### 3.1 Começando: Sua Primeira Contribuição

A maneira mais fácil de começar é fazendo pequenas edições diretamente através da interface web do GitHub. Este método não requer configuração de desenvolvimento local e é perfeito para mudanças menores.⁶

Contribuições simples que você pode fazer incluem:

- Corrigir erros de digitação ou gramaticais.
- Corrigir links quebrados.
- Esclarecer frases ou parágrafos confusos.
- Reportar um problema para algo que você não sabe como corrigir.

**O Processo de Pull Request de "5 Minutos":**

1. Navegue até a página que você quer editar no site de documentação `https://docs.rustfs.com/`.
2. Role até o final e clique no link "Edit this page on GitHub".
3. Isso o levará ao arquivo fonte Markdown correspondente no GitHub. Clique no ícone do lápis (✏️) no canto superior direito para entrar no modo de edição.
4. Faça suas alterações no editor de texto.
5. Quando terminar, role até o final. Na seção "Propose changes", escreva uma mensagem de commit concisa, por exemplo, "Fix typo in installation guide."
6. Clique no botão "Propose changes". O GitHub então o guiará através do processo de criar um pull request.

Este processo serve como uma excelente "rampa de entrada para contribuidores", permitindo que você se familiarize com nosso fluxo de trabalho sem qualquer configuração complexa. Uma contribuição leve bem-sucedida é frequentemente o primeiro passo para um envolvimento mais profundo.⁵

#### 3.2 Traduzindo a Documentação: Adicionando um Novo Idioma

Esta é a área central onde mais precisamos da ajuda da comunidade. Por favor, siga estes passos para adicionar ou melhorar traduções.

**Passo 1: Coordenação através de GitHub Issues**

Para evitar trabalho duplicado e garantir colaboração, por favor visite nossa **[página de GitHub Issues](https://github.com/rustfs/rustfs/issues)** antes de começar a traduzir.

- **Adicionando um Novo Idioma**: Verifique se alguém já está trabalhando no idioma que você quer traduzir. Se não, por favor crie um novo issue com o título `[i18n] Add <Language> (<lang-code>) Translation`, por exemplo, `[i18n] Add German (de) Translation`. Isso nos ajuda a rastrear o progresso e atribuir propriedade.⁷
- **Melhorando uma Tradução Existente**: Se você quer melhorar uma tradução existente, encontre o issue relevante ou crie um novo detalhando as melhorias que planeja fazer.

**Passo 2: Entendendo a Estrutura de Diretórios**

Nosso site de documentação é construído com VitePress, que usa uma estrutura de diretórios baseada em arquivos para gerenciar múltiplos idiomas.⁹ Todos os arquivos fonte estão localizados no diretório `docs/`.

```
docs/
├── en/                  # Inglês (ou como diretório raiz)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japonês
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # Arquivo de configuração do VitePress
```

**Passo 3: Adicionando um Novo Pacote de Idioma**

1. **Fork e clone** o repositório para sua máquina local, então crie uma nova branch.

2. No diretório `docs/`, crie uma nova pasta usando o **código de idioma ISO 639-1** correspondente ao seu idioma alvo. Por favor, consulte a tabela de códigos de idioma abaixo.

3. Copie **todo o conteúdo** de `docs/en/` (ou os arquivos fonte em inglês na raiz) para sua nova pasta de idioma. Isso fornece uma estrutura de arquivos completa para traduzir.

4. Abra o arquivo `docs/.vitepress/config.ts` e adicione uma nova entrada para seu idioma no objeto `locales`.

   Por exemplo, para adicionar alemão (`de`):

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'

   export default defineConfig({
     //... outras configurações
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Adicione a nova configuração de locale aqui
       de: {
         label: 'Deutsch', // Texto no menu dropdown de idiomas
         lang: 'de',       // Atributo lang do HTML
         link: '/de/',     // Link de redirecionamento
         // Você pode sobrescrever configurações de tema para esta locale,
         // por exemplo, para textos de navbar e sidebar.
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   Para ajudá-lo a configurar isso corretamente, a tabela a seguir explica o propósito de cada propriedade no objeto `locales`.⁹

| Propriedade   | Tipo     | Obrigatório | Descrição                                                  |
| ------------- | -------- | ----------- | ---------------------------------------------------------- |
| `label`       | `string` | Sim         | O texto que aparece no menu dropdown de seleção de idioma na barra de navegação. |
| `lang`        | `string` | Não         | O atributo `lang` para a tag `<html>`. Usa o nome do diretório se não especificado. |
| `link`        | `string` | Não         | O link para o qual o usuário é redirecionado ao selecionar este idioma. Por padrão, o caminho raiz da locale (por exemplo, `/ja/`). |
| `title`       | `string` | Não         | Substitui o título principal do site para esta locale específica. |
| `description` | `string` | Não         | Substitui a descrição principal do site para esta locale específica. |
| `themeConfig` | `object` | Não         | Configuração de tema específica da locale. Usado para traduzir links de navbar, texto de sidebar, etc. |

```
Esta tabela é projetada para eliminar ambiguidade na configuração, garantindo que contribuidores possam fazer isso corretamente na primeira vez e reduzindo a necessidade de revisões de ida e volta.
```

**Passo 4: Traduzindo o Conteúdo**

- Em seu novo diretório de idioma, abra os arquivos Markdown um por um e traduza o conteúdo de texto.
- **Importante**: Por favor **não** traduza o seguinte:
  - Chaves no frontmatter (por exemplo, `title:`, `layout:`).
  - Qualquer código dentro de blocos de código.
  - Links URL.
  - Tags HTML.
- Traduza apenas o texto legível por humanos.

**Passo 5: Enviando seu Pull Request**

Uma vez que você terminou de traduzir, por favor siga as [Diretrizes de Pull Request (PR) e Commits](#43-diretrizes-de-pull-request-pr-e-commits) para enviar sua contribuição, e certifique-se de vinculá-la ao issue que você criou no Passo 1.

**Referência de Códigos de Idioma**

Para garantir consistência, por favor use os códigos ISO 639-1 padrão da tabela abaixo.¹³

| Idioma              | Código ISO 639-1  |
| ------------------- | ----------------- |
| Chinês (Simplificado) | `zh` ou `zh-CN`   |
| Inglês              | `en`              |
| Japonês             | `ja`              |
| Alemão              | `de`              |
| Francês             | `fr`              |
| Espanhol            | `es`              |
| Coreano             | `ko`              |
| Português           | `pt`              |
| Russo               | `ru`              |
| Turco               | `tr`              |

### 4. O Fluxo de Trabalho Técnico

Para desenvolvedores que desejam fazer contribuições mais substanciais localmente (como adicionar um novo pacote de idioma ou fazer mudanças extensas), por favor siga este fluxo de trabalho técnico.

#### 4.1 Pré-requisitos

Antes de começar, por favor certifique-se de ter o seguinte software instalado em seu sistema:

- **Node.js**: Versão `18.x` ou superior.¹⁴ Você pode baixá-lo do [site oficial do Node.js](https://nodejs.org/).

- **Gerenciador de Pacotes**: Recomendamos usar `pnpm` para eficiência. Você pode instalá-lo globalmente com `npm install -g pnpm`. Alternativamente, você pode usar `npm` ou `yarn`.¹⁵

- **Git**: Um sistema de controle de versão. Você pode baixá-lo do [site oficial do Git](https://git-scm.com/).

#### 4.2 Configuração de Desenvolvimento Local

Siga esta sequência de comandos para executar o servidor de desenvolvimento de documentação localmente:

1. Fork e Clonar o Repositório

   Primeiro, fork este repositório no GitHub. Então, clone seu fork para sua máquina local.

   Bash

   ```
   # Substitua <YOUR_USERNAME> pelo seu nome de usuário do GitHub
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Instalar Dependências

   Use pnpm para instalar todas as dependências necessárias do projeto.

   Bash

   ```
   pnpm install
   ```

3. Executar o Servidor de Desenvolvimento

   Este comando iniciará um servidor de desenvolvimento local com hot-reloading habilitado.

   Bash

   ```
   pnpm docs:dev
   ```

4. Acessar o Site

   Após execução bem-sucedida, você deve ver uma saída em seu terminal similar a VitePress dev server running at: <http://localhost:5173/>. Abra esta URL em seu navegador para ver o site de documentação. Qualquer mudança que você fizer nos arquivos Markdown será refletida instantaneamente no navegador.¹⁵

#### 4.3 Diretrizes de Pull Request (PR) e Commits

Seguimos um fluxo de trabalho padronizado para garantir qualidade de código e um histórico de projeto limpo.

- **Estratégia de Branch**

  - Sempre crie uma nova branch para seu trabalho. Não faça commit diretamente na branch `main`.
  - Use um nome de branch descritivo, como `feat/add-german-translation` ou `fix/correct-s3-api-typo`.¹⁷

- Convenção de Mensagens de Commit

  Aderimos à especificação Conventional Commits. Isso nos ajuda a automatizar changelogs e torna o histórico de commits mais fácil de entender.

  - **Formato**: `<type>(<scope>): <subject>`

  - **Exemplos**:

    - `feat(i18n): add initial french translation`

    - `fix(guide): correct typo in getting-started.md`

    - docs(contributing): update local development setup

      Esta abordagem estruturada é uma melhor prática em muitos projetos de código aberto maduros.⁸

- **Enviando um Pull Request**

  1. Empurre sua branch para seu fork: `git push -u origin your-branch-name`.
  2. No GitHub, abra um pull request do seu fork para a branch `main` do repositório `rustfs/docs.rustfs.com`.
  3. **Vincular o Issue**: Na descrição do PR, use palavras-chave como `Closes #123` ou `Fixes #123` para vincular o issue que você criou anteriormente. Isso fechará automaticamente o issue quando o PR for merged, um passo chave na automação do nosso fluxo de trabalho.⁷
  4. **Escrever uma Descrição Clara**: Explique claramente **o que** você mudou e **por quê**. Se suas mudanças são visuais, por favor inclua screenshots antes e depois.⁵

- **O Processo de Revisão**

  - Uma vez que você envie um PR, um mantenedor do projeto o revisará.
  - Podemos solicitar mudanças. Por favor não se desencoraje! Isso é uma parte normal do desenvolvimento de código aberto colaborativo visando melhorar a qualidade das contribuições.
  - Uma vez que seu PR seja aprovado e todas as verificações automatizadas tenham passado, um mantenedor o fará merge.

#### 4.4 Verificações Automatizadas e Implantação

Para garantir a qualidade e estabilidade de nossa documentação, temos um pipeline CI/CD (Integração Contínua/Implantação Contínua) completamente automatizado.

- **Verificações Automatizadas**: Quando você envia um pull request, GitHub Actions executará automaticamente uma série de verificações. Essas verificações verificam que o site de documentação seja construído com sucesso e que a formatação do código esteja correta (linting).¹⁹
- **Implantação Automatizada**: Uma vez que seu PR seja merged na branch `main`, GitHub Actions será disparado novamente, construindo automaticamente a versão mais recente do site e implantando-a em `https://docs.rustfs.com`.

Ao tornar este processo transparente, visamos construir a confiança dos contribuidores em nosso fluxo de trabalho. Você não precisa se preocupar com os detalhes da implantação; um merge bem-sucedido significa uma implantação bem-sucedida. Isso lhe dá uma visão clara de todo o ciclo de vida de sua contribuição, do envio à publicação.¹⁹

### 5. Comunidade e Licenciamento

#### 5.1 Agradecimentos

A documentação RustFS é construída pela comunidade, para a comunidade. Somos incrivelmente gratos a todos que contribuem com seu tempo e expertise.

Cada contribuição, não importa quão pequena, é altamente valorizada. Para reconhecer todas as contribuições de forma justa e transparente, usamos as ferramentas integradas do GitHub.

Você pode ver uma lista de todos os nossos incríveis contribuidores no **[gráfico de contribuidores](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)**. Esta abordagem automatizada e escalável garante que cada contribuição seja reconhecida e sempre atualizada.²²

#### 5.2 Licença de Conteúdo

Toda a documentação neste projeto está licenciada sob a **Licença Internacional Creative Commons Attribution 4.0**.²³

Ao contribuir com o projeto de documentação RustFS, você concorda que suas contribuições serão lançadas sob esta licença.

Sob esta licença, você é livre para:

- **Compartilhar** — copiar e redistribuir o material em qualquer meio ou formato.
- **Adaptar** — remixar, transformar e construir sobre o material para qualquer propósito, mesmo comercialmente.

Você deve seguir estes termos:

- **Atribuição** — Você deve dar **crédito apropriado**, fornecer um link para a licença, e **indicar se mudanças foram feitas**. Você pode fazer isso de qualquer maneira razoável, mas não de qualquer maneira que sugira que o licenciante endossa você ou seu uso.²³
