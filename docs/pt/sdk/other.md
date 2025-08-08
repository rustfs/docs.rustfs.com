---
title: "Outros SDKs"
description: "Estratégias para integrar linguagens sem SDK oficial S3 com o RustFS."
---

# Outros SDKs

Se não houver SDK oficial da AWS S3 para a sua linguagem, use uma destas estratégias:

## 1) Chamar a API HTTP diretamente (protocolo S3)

O protocolo S3 é RESTful. Qualquer linguagem com HTTP pode implementar a integração (C, Rust, Lua, Erlang, etc.).

Pontos-chave:

- Assinatura: implemente AWS Signature Version 4
- Construa headers e Canonical Request corretamente
- Use cliente HTTPS/HTTP

Referências:

- [https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html](https://docs.aws.amazon.com/general/latest/gr/sigv4-signed-request-examples.html)

---

## 2) Usar CLIs/serviços intermediários de SDK existente

Se não quiser implementar assinatura:

### 2.1 CLI da AWS

Exemplo via shell:

```bash
aws s3 cp local.txt s3://mybucket/myfile.txt --endpoint-url http://rustfs.local:9000
```

Ou implemente um microserviço (Node.js/Python) que encapsule o SDK; sua linguagem chama esse serviço.

### 2.2 Proxy (Flask, FastAPI, Express)

Expose uma API HTTP simples:

```http
POST /upload -> o serviço usa o SDK e envia ao RustFS
GET /presigned-url -> gera URL pré‑assinada para front-end/cliente
```

---

## 3) SDKs de comunidade

Algumas linguagens têm clientes S3 não‑oficiais:

- Haskell: `amazonka-s3`
- Rust: `aws-sdk-rust` (ou `rusoto` – descontinuado)
- OCaml: possível via `cohttp`
- Delphi: há bibliotecas comerciais

Avalie estabilidade, documentação e compatibilidade antes do uso.

---

## 4) Delegar upload ao cliente/plataforma

- Navegador/App envia diretamente com URL pré‑assinada
- Backend (Node/Python/Go) atua como proxy de upload

---

## Recomendações

| Cenário | Opção recomendada |
| ------------- | ---------------------------------- |
| Controle total/embarcado | Implementar Signature V4 |
| Linguagem com shell | Usar AWS CLI |
| Pode hospedar um gateway | Construir API S3 em Python/Node |
| Upload em front‑end | Usar URL pré‑assinada |
