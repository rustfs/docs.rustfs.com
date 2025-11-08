---
title: "Virtual Mode Configuration"
description: "RustFS S3 Virtual mode configuration and path style mode configuration"
---

# RustFS S3 Mode Introduction

RustFS is 100% compliant with S3 storage protocol requirements. In S3 storage, request paths are divided into two modes:

1. Virtual Host Style

2. Path Style

The core difference between these two modes is how the storage bucket (Bucket) name is placed in the request URL.

## 1. Path Style Mode

By default, Path style mode is used when starting. The characteristic of Path style mode is that the bucket name comes after the Endpoint access point. Assuming the hostname is rustfs.com and the bucket name is test, then the Path style path would be:

```
http://rustfs.com/test
```

Note:
- Default is Path style
- Users don't need to make any settings, it's Path style mode by default

## 2. Virtual Host Style

When starting, you can change the mode to Virtual Host Style. The characteristic of Virtual Host Style mode is that the bucket name becomes part of the domain name. Assuming the hostname is rustfs.com and the bucket name is test, then the Virtual Host Style path would be:

```
http://test.rustfs.com/
```

Steps to set Virtual Host Style:

1. Set wildcard DNS resolution for your domain to the specified server. Assuming the domain is rustfs.com, you can resolve *.rustfs.com to the specified server;
2. If it's Linux, modify the `/etc/default/rustfs` file; if it's Docker or Kubernetes, modify the yaml or startup configuration parameters;
3. Add `RUSTFS_SERVER_DOMAINS` to the configuration file, set this parameter to `RUSTFS_SERVER_DOMAINS = "rustfs.com"`;
4. Save the configuration file, then use `systemctl restart rustfs` to restart the service.
