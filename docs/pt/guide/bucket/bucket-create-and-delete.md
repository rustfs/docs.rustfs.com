---
title: "Gestão de buckets do RustFS"
description: "Criar e eliminar buckets no RustFS"
---

# Buckets do RustFS

Um bucket é o contentor lógico básico para organizar e gerir dados no RustFS. Cada bucket tem um nome único e pode conter vários objetos. Pode gerir buckets através da UI do RustFS, do `mc` (MinIO Client) ou via API (criar, eliminar, carregar/transferir dados, etc.).

## Criar um bucket

Pré‑requisitos:

- Uma instância RustFS disponível (../../installation/index.md)

## Criar na UI do RustFS

1. Inicie sessão na consola UI do RustFS.
1. Na página inicial, no canto superior esquerdo, clique em "Criar bucket".
1. Introduza o nome do bucket e clique em "Criar".

![bucket creation](images/bucket-creation-by-ui.png)

### Criar com `mc`

> Consulte o guia do [`mc`](../mc.md) para instalação e configuração.

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Criar via API

```
PUT /{bucketName} HTTP/1.1
```

Exemplo de pedido:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

Pode confirmar na UI que o bucket `bucket-creation-by-api` foi criado com sucesso.

## Eliminar um bucket

Atenção: eliminar um bucket pode causar erros em aplicações que o utilizem. Faça cópia de segurança dos dados e confirme que já não é necessário.

### Eliminar na UI do RustFS

1. Inicie sessão na consola UI do RustFS.
1. Na página inicial, selecione o bucket a eliminar.
1. Clique em "Eliminar" no extremo direito.
1. No diálogo apresentado, clique em "Confirmar".

![bucket deletion](images/bucket-deletion-on-ui.png)

### Eliminar com `mc`

> Consulte o guia do [`mc`](../mc.md).

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Eliminar via API

```
DELETE /{bucketName} HTTP/1.1
```

Exemplo de pedido:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

Na UI do RustFS, pode confirmar que o bucket `bucket-creation-by-api` foi eliminado.