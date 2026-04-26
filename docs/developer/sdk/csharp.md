---
title: "C# SDK"
description: "本文主要讲解 RustFS 中 C# SDK 的使用。"
---

# C# SDK

RustFS 兼容 Amazon S3 协议，因此我们推荐使用官方的 AWS SDK for .NET (`AWSSDK.S3`) 与 RustFS 进行交互。这为您提供了稳定、高性能且维护良好的客户端体验。

## 1. 安装 SDK

在您的 .NET 项目中，通过 NuGet 包管理器安装 `AWSSDK.S3`。

### 使用 .NET CLI

```bash
dotnet add package AWSSDK.S3
```

## 2. 初始化客户端

在使用 SDK 之前，您需要初始化 `AmazonS3Client`。关键配置在于设置 `ServiceURL` 指向您的 RustFS 服务地址，并启用 `ForcePathStyle`。

```csharp
using Amazon.S3;
using Amazon.S3.Model;

// 配置 RustFS 连接信息
var config = new AmazonS3Config
{
    // RustFS 服务地址，例如 http://localhost:9000
    ServiceURL = "http://127.0.0.1:9000",
    
    // 必须启用 Path Style 访问模式
    ForcePathStyle = true,
    
    // 如果不使用 HTTPS，请设置为 true（默认为 false）
    UseHttp = true 
};

// 使用 Access Key 和 Secret Key 初始化客户端
var accessKey = "admin";
var secretKey = "admin123";
IAmazonS3 s3Client = new AmazonS3Client(accessKey, secretKey, config);
```

> **注意**：`ForcePathStyle = true` 是连接 RustFS 的必要配置。如果不设置，SDK 默认会使用 Virtual Hosted-Style（例如 `http://bucketname.localhost:9000`），这可能导致连接失败。

## 3. 基本操作示例

以下是一些常见操作的代码示例。

### 3.1 创建存储桶 (Create Bucket)

```csharp
public async Task CreateBucketAsync(IAmazonS3 client, string bucketName)
{
    var putBucketRequest = new PutBucketRequest
    {
        BucketName = bucketName,
        UseClientRegion = false
    };

    await client.PutBucketAsync(putBucketRequest);
    Console.WriteLine($"Bucket '{bucketName}' created successfully.");
}
```

### 3.2 列出存储桶 (List Buckets)

```csharp
public async Task ListBucketsAsync(IAmazonS3 client)
{
    var response = await client.ListBucketsAsync();
    Console.WriteLine("Buckets:");
    foreach (var bucket in response.Buckets)
    {
        Console.WriteLine($" - {bucket.BucketName} (Created: {bucket.CreationDate})");
    }
}
```

### 3.3 上传文件 (Upload Object)

```csharp
public async Task UploadFileAsync(IAmazonS3 client, string bucketName, string key, string filePath)
{
    var putRequest = new PutObjectRequest
    {
        BucketName = bucketName,
        Key = key,
        FilePath = filePath,
        ContentType = "application/octet-stream"
    };

    await client.PutObjectAsync(putRequest);
    Console.WriteLine($"File uploaded to {bucketName}/{key}");
}
```

### 3.4 下载文件 (Download Object)

```csharp
public async Task DownloadFileAsync(IAmazonS3 client, string bucketName, string key, string downloadPath)
{
    var request = new GetObjectRequest
    {
        BucketName = bucketName,
        Key = key
    };

    using var response = await client.GetObjectAsync(request);
    using var responseStream = response.ResponseStream;
    using var fileStream = File.Create(downloadPath);
    
    await responseStream.CopyToAsync(fileStream);
    Console.WriteLine($"File downloaded to {downloadPath}");
}
```

### 3.5 删除文件 (Delete Object)

```csharp
public async Task DeleteFileAsync(IAmazonS3 client, string bucketName, string key)
{
    var deleteRequest = new DeleteObjectRequest
    {
        BucketName = bucketName,
        Key = key
    };

    await client.DeleteObjectAsync(deleteRequest);
    Console.WriteLine($"File {key} deleted from {bucketName}");
}
```

### 3.6 生成预签名 URL (Generate Presigned URL)

预签名 URL 允许您生成一个临时的、带签名的 URL，供用户上传或下载文件，而无需暴露您的 Access Key。

```csharp
public string GeneratePresignedUrl(IAmazonS3 client, string bucketName, string key, double durationMinutes)
{
    var request = new GetPreSignedUrlRequest
    {
        BucketName = bucketName,
        Key = key,
        Verb = HttpVerb.GET, // 或 HttpVerb.PUT 用于上传
        Expires = DateTime.UtcNow.AddMinutes(durationMinutes)
    };

    string url = client.GetPreSignedURL(request);
    Console.WriteLine($"Presigned URL: {url}");
    return url;
}
```

## 4. 依赖注入集成 (ASP.NET Core)

如果您正在使用 ASP.NET Core，可以通过依赖注入容器来注册 `IAmazonS3` 服务。

```csharp
// Program.cs

using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;

var builder = WebApplication.CreateBuilder(args);

// 从配置中读取 RustFS 设置
var rustfsOptions = builder.Configuration.GetSection("RustFS");
var serviceUrl = rustfsOptions["ServiceUrl"] ?? "http://localhost:9000";
var accessKey = rustfsOptions["AccessKey"] ?? "admin";
var secretKey = rustfsOptions["SecretKey"] ?? "admin123";

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        ServiceURL = serviceUrl,
        ForcePathStyle = true,
        UseHttp = true // 根据实际情况配置
    };
    
    return new AmazonS3Client(accessKey, secretKey, config);
});

// ... 其他服务注册
```

## 5. 参考项目

完整的集成示例可以参考 [RustFS DotNet Demo](https://github.com/rustfs/rustfs-dotnet-demo) 项目。
