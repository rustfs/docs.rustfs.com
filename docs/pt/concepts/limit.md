---
title: "Limites de utilização"
description: "RustFS é um armazenamento de objetos simples, eficiente e distribuído. 100% compatível com S3, em licença Apache 2.0."
---

# Limites de utilização

## 1) Limites da API S3

> Os seguintes valores seguem o padrão do protocolo S3.

| Item | Especificação |
| --------------------- | ---------------------------------- |
| Tamanho máximo de objeto | 5 TiB |
| Tamanho mínimo de objeto | 0 B |
| Tamanho máx. por PUT | Upload simples: 500 GiB; Multipart: 5 TiB |
| Nº máx. de partes por upload | 10,000 |
| Faixa de tamanho de parte | 5 MiB a 5 GiB; última parte 0 B a 5 GiB |
| Máx. de partes por listagem | 10,000 |
| Máx. de objetos por listagem | 1,000 |
| Máx. de uploads multipart por listagem | 1,000 |
| Máx. comprimento de nome de bucket | 63 caracteres |
| Máx. comprimento de chave de objeto | 1024 caracteres |
| Máx. comprimento de cada segmento (separado por `/`) | 255 caracteres |
| Máx. versões por objeto | 10,000 (configurável) |

---

## 2) Limites de Erasure Coding (EC)

> Parâmetros EC devem seguir a configuração baseada na matriz Reed‑Solomon. Considere a parametrização efetiva em produção.

| Item | Especificação |
| ---------------------------- | ------------------------------ |
| Nº máx. de servidores por cluster | Sem limite |
| Nº mín. de servidores | 1 |
| Quando há 1 servidor: nº mín. de drives | 1 (single‑node/drive, sem redundância) |
| Quando há ≥2 servidores: nº mín. de drives por servidor | 1 |
| Nº máx. de drives por servidor | Sem limite |
| Quórum de leitura | N/2 |
| Quórum de escrita | (N/2) + 1 |

---

## 3) Restrições de nomenclatura de objetos

### Sistema de ficheiros e SO

Os nomes de objetos no RustFS estão sujeitos às restrições do SO/sistema de ficheiros subjacente. Por exemplo, no Windows e noutros sistemas, certos caracteres especiais são proibidos: `^`, `*`, `|`, `\`, `/`, `&`, `"` ou `;`.

Consulte a documentação do seu SO e FS para a lista completa de restrições.

Para produção, recomenda‑se Linux com XFS para melhor desempenho e compatibilidade.

### Conflitos de nomes

Aplicações devem garantir chaves únicas sem conflito. Evite criar objetos cujo nome conflite com prefixos existentes. Quando ocorre conflito, uma operação LIST no caminho em conflito retornará conjunto vazio.

Exemplo de conflitos:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # conflita com prefixo existente

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # conflita com objeto existente
```

Embora GET/HEAD possam funcionar sobre objetos específicos, conflitos farão a LIST em `hello/2025/first/` retornar vazio.

