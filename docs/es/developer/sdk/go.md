---
title: "Guía de uso del SDK de Golang de RustFS"
description: "Usa el SDK de Golang para operar en instancias de RustFS, incluyendo la creación y eliminación de buckets y objetos."
---

# SDK de Golang

Dado que RustFS es un sistema de almacenamiento de objetos completamente compatible con S3, puedes construir un SDK de Golang adecuado para RustFS envolviendo el SDK de Golang de S3. A través del SDK, puedes operar en RustFS, incluyendo la creación y eliminación de buckets/objetos, subida y descarga de archivos, etc.

## Prerrequisitos

- Una instancia de RustFS funcional (consulta la [Guía de instalación](../../installation/index.md) para la instalación).
- Claves de acceso (consulta la [Gestión de claves de acceso](../../administration/iam/access-token.md) para la creación).

## Construcción del SDK de Golang de RustFS

Usa `RUSTFS_ACCESS_KEY_ID`, `RUSTFS_SECRET_ACCESS_KEY`, `RUSTFS_ENDPOINT_URL`, `RUSTFS_REGION` para construir un `aws.Config`, luego usa `s3.NewFromConfig` del SDK de S3 de Golang para construir un Cliente de RustFS:

```
region := os.Getenv("RUSTFS_REGION")
access_key_id := os.Getenv("RUSTFS_ACCESS_KEY_ID")
secret_access_key := os.Getenv("RUSTFS_SECRET_ACCESS_KEY")
endpoint := os.Getenv("RUSTFS_ENDPOINT_URL")
// usePathStyle := strings.ToLower(os.Getenv("AWS_S3_USE_PATH_STYLE")) == "true"

if access_key_id == "" || secret_access_key == "" || region == "" || endpoint == "" {
    log.Fatal("missing the env: RUSTFS_ACCESS_KEY_ID / RUSTFS_SECRET_ACCESS_KEY / RUSTFS_REGION / RUSTFS_ENDPOINT_URL")
}

// build aws.Config
cfg := aws.Config{
    Region: region,
    EndpointResolver: aws.EndpointResolverFunc(func(service, region string) (aws.Endpoint, error) {
        return aws.Endpoint{
            URL: endpoint,
        }, nil
    }),
    Credentials: aws.NewCredentialsCache(credentials.NewStaticCredentialsProvider(access_key_id, secret_access_key, "")),
}

// build S3 client
client := s3.NewFromConfig(cfg, func(o *s3.Options) {
    o.UsePathStyle = true
})
```

Luego puedes usar el Cliente de RustFS construido para realizar operaciones de buckets y objetos.

## Crear Bucket

```
_, err = client.CreateBucket(ctx, &s3.CreateBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("create bucket failed: %v", err)
}
```

## Listar Buckets

```
resp, err := client.ListBuckets(ctx, &s3.ListBucketsInput{})
if err != nil {
    log.Fatalf("list buckets failed: %v", err)
}

fmt.Println("Buckets:")
for _, b := range resp.Buckets {
    fmt.Println(" -", *b.Name)
}
```

## Eliminar Bucket

```
_, err = client.DeleteBucket(ctx, &s3.DeleteBucketInput{
    Bucket: aws.String("go-sdk-rustfs"),
})
if err != nil {
    log.Fatalf("delete bucket failed: %v", err)
}
```

## Listar Objetos

```
resp, err := client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
    Bucket: aws.String("bucket-target"),
})
if err != nil {
    log.Fatalf("list object failed: %v", err)
}
for _, obj := range resp.Contents {
    fmt.Println(" -", *obj.Key)
}
```

## Subir Objeto

```
_, err = client.PutObject(ctx, &s3.PutObjectInput{
    Bucket: aws.String("bucket-target"),
    Key:    aws.String("test.txt"),
    Body:   strings.NewReader("hello rustfs"),
})
if err != nil {
    log.Fatalf("upload object failed: %v", err)
}
```

## Descargar Objeto

```
resp, err := client.GetObject(ctx, &s3.GetObjectInput{
    Bucket: aws.String("bucket-target"),
    Key:    aws.String("1.txt"),
})
if err != nil {
    log.Fatalf("download object fail: %v", err)
}
defer resp.Body.Close()

// read object content
data, err := io.ReadAll(resp.Body)
if err != nil {
    log.Fatalf("read object content fail: %v", err)
}
fmt.Println("content is :", string(data))
```

Para otros usos, puedes explorar por tu cuenta. ¡Con Vibe Coding es aún más simple!
