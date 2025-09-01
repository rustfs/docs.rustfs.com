---
title: "Limitações de Uso"
description: "RustFS é um armazenamento de objetos distribuído simples, eficiente. É 100% compatível com S3, software de código aberto lançado sob a licença Apache2."
---

# Limitações de Uso

## 1. Limitações da API S3

> Os seguintes padrões seguem rigorosamente os padrões do protocolo S3 para especificação.

| Item | Especificação |
| --------------------- | ---------------------------------- |
| Tamanho máximo de objeto | 5 TiB |
| Tamanho mínimo de objeto | 0 B |
| Tamanho máximo de objeto para operação PUT única | Upload não-multiparte: 500 GiB; Upload multiparte: 5 TiB |
| Número máximo de partes por upload | 10.000 |
| Faixa de tamanho de partes | 5 MiB a 5 GiB; última parte pode ser 0 B a 5 GiB |
| Número máximo de partes retornadas por solicitação de listagem de partes | 10.000 |
| Número máximo de objetos retornados por solicitação de listagem de objetos | 1.000 |
| Número máximo de uploads multiparte retornados por solicitação de listagem de uploads multiparte | 1.000 |
| Comprimento máximo do nome do bucket | 63 caracteres |
| Comprimento máximo do nome do objeto | 1024 caracteres |
| Comprimento máximo de cada segmento de nome de objeto separado por `/` | 255 caracteres |
| Número máximo de versões por objeto único | 10.000 (configurável) |

---

## 2. Limitações de Código de Apagamento

> Parâmetros EC são configurados baseados no algoritmo EC de matriz Reed-Solomon. Sujeito à configuração real de parâmetros EC.

| Item | Especificação |
| ---------------------------- | ------------------------------ |
| Número máximo de servidores por cluster | Ilimitado |
| Número mínimo de servidores | 1 |
| Quando a contagem de servidores é 1, número mínimo de drives por servidor | 1 (para implantação de nó único e drive único, não pode fornecer confiabilidade ou disponibilidade adicional) |
| Quando a contagem de servidores é 2 ou mais, número mínimo de drives por servidor | 1 |
| Número máximo de drives por servidor | Ilimitado |
| Contagem de quórum de leitura | N/2 |
| Contagem de quórum de escrita | (N/2) + 1 |

---

## 3. Limitações de Nomenclatura de Objetos

### Limitações do Sistema de Arquivos e Sistema Operacional

Nomes de objetos no RustFS são principalmente limitados pelo sistema operacional e sistema de arquivos subjacentes. Por exemplo, Windows e alguns outros sistemas operacionais restringem o uso de certos caracteres especiais como `^`, `*`, `|`, `\`, `/`, `&`, `"`, ou `;`.

Consulte a documentação relevante para uma lista completa de restrições baseada em seu sistema operacional e sistema de arquivos específicos.

O RustFS recomenda o uso de sistemas operacionais Linux baseados em sistemas de arquivos XFS em ambientes de produção para melhor desempenho e compatibilidade.

### Tratamento de Conflitos de Nomenclatura

No RustFS, aplicações devem atribuir chaves únicas e não conflitantes a todos os objetos. Isso inclui evitar criar objetos cujos nomes possam conflitar com nomes de objetos pai ou irmãos. O RustFS retornará um conjunto vazio ao executar operações LIST em locais onde conflitos ocorrem.

Por exemplo, as seguintes operações causariam conflitos de namespace:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Conflita com prefixo de objeto existente

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Conflita com objeto existente
```

Embora você possa executar operações GET ou HEAD nesses objetos, conflitos de nomenclatura farão com que operações LIST executadas no caminho `hello/2025/first/` retornem conjuntos de resultados vazios.
