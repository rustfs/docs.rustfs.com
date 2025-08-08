---
title: "Gestão de objetos do RustFS"
description: "Carregar e eliminar objetos"
---

# Objetos do RustFS

Um objeto é a unidade básica de armazenamento no RustFS, contendo dados, metadados e um identificador único (Object Key). Esta secção demonstra a gestão de objetos através do exemplo de carregamento e eliminação de ficheiros.

> Para conceitos relacionados com objetos, consulte [Conceitos](../../concepts/glossary.md).

## Criar um objeto

Pré‑requisitos:

- Uma instância RustFS disponível (../../installation/index.md)

Crie primeiro um [bucket](bucket-create-and-delete.md) e, em seguida, carregue um ficheiro para esse bucket para criar um objeto. Pode fazê‑lo pela UI, `mc` ou API.

### Carregar pela UI do RustFS

1. Inicie sessão na consola UI do RustFS.
1. Selecione o bucket de destino.
1. No canto superior direito da página do bucket, escolha "Nova pasta", "Novo ficheiro" ou "Carregar ficheiro/pasta".
1. Para carregamento local, clique em "Carregar ficheiro/pasta", selecione os itens e clique em "Iniciar carregamento".

![object creation from ui](images/upload_file_from_ui.png)

Após o carregamento, clique no objeto para ver os detalhes.

![object details info](images/object_details_info.png)

### Carregar com `mc`

> Consulte o guia do [`mc`](../mc.md).

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### Carregar via API

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Exemplo de pedido:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## Eliminar um objeto

A eliminação pode ser feita pela UI, `mc` ou API. Por exemplo, elimine o ficheiro criado acima.

## Eliminar pela UI do RustFS

1. Inicie sessão na consola UI do RustFS.
1. Selecione o bucket que contém o ficheiro.
1. Selecione o ficheiro a eliminar.
1. Clique em "Eliminar selecionados" e confirme.

![object deletion from ui](images/delete_file_from_ui.png)

### Eliminar com `mc`

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### Eliminar via API

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Exemplo de pedido:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```