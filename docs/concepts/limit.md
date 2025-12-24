---
title: "Usage Limits"
description: "RustFS is a simple, efficient, distributed object storage. It is fully S3 compatible, open source software released under the Apache2 license."
---

# Usage Limits

## 1. S3 API Limits

> The following standards strictly follow S3 protocol standards for specification.

| Item | Specification |
| --------------------- | ---------------------------------- |
| Maximum object size | 5 TiB |
| Minimum object size | 0 B |
| Maximum object size for single PUT operation | Non-multipart upload: 500 GiB; Multipart upload: 5 TiB |
| Maximum number of parts per upload | 10,000 |
| Part size range | 5 MiB to 5 GiB; last part can be 0 B to 5 GiB |
| Maximum number of parts returned per list parts request | 10,000 |
| Maximum number of objects returned per list objects request | 1,000 |
| Maximum number of multipart uploads returned per list multipart uploads request | 1,000 |
| Maximum length of bucket name | 63 characters |
| Maximum length of object name | 1024 characters |
| Maximum length of each `/` separated object name segment | 255 characters |
| Maximum number of versions per single object | 10,000 (configurable) |

---

## 2. Erasure Coding Limits

> EC parameters are configured based on Reed-Solomon matrix EC algorithm. Actual limits depend on the specific Erasure Coding (EC) configuration.

| Item | Specification |
| ---------------------------- | ------------------------------ |
| Maximum number of servers per cluster | No hard limit |
| Minimum number of servers | 1 |
| When server count is 1, minimum number of drives per server | 1 (for single-node single-drive deployment, cannot provide additional reliability or availability) |
| When server count is 2 or more, minimum number of drives per server | 1 |
| Maximum number of drives per server | No hard limit |
| Read quorum count | N/2 |
| Write quorum count | (N/2) + 1 |

---

## 3. Object Naming Limits

### File System and Operating System Limits

Object names in RustFS are primarily limited by the underlying operating system and file system. For example, Windows and some other operating systems restrict the use of certain special characters such as `^`, `*`, `|`, `\`, `/`, `&`, `"`, or `;`.

Please refer to relevant documentation for a complete list of restrictions based on your specific operating system and file system.

RustFS recommends using Linux operating systems based on XFS file systems in production environments for better performance and compatibility.

### Naming Conflict Handling

In RustFS, applications must assign unique and non-conflicting keys to all objects. This includes avoiding creating objects whose names might conflict with parent object or sibling object names. RustFS will return an empty set when performing LIST operations at locations where conflicts occur.

For example, the following operations would cause namespace conflicts:

```bash
PUT data/hello/2025/first/a.csv
PUT data/hello/2025/first # Conflicts with existing object prefix

PUT data/hello/2025/first/
PUT data/hello/2025/first/vendors.csv # Conflicts with existing object
```

Although you can perform GET or HEAD operations on these objects, naming conflicts will cause LIST operations executed at the `hello/2025/first/` path to return empty result sets.
