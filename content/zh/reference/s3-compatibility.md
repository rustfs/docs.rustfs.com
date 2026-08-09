---
title: "S3 兼容性矩阵"
description: "查看当前 RustFS 兼容性门禁已测试和明确排除的 Amazon S3 行为。"
---

RustFS 实现了经过测试的 Amazon S3 API 子集。本矩阵汇总 `rustfs/rustfs` 中维护的可执行 Ceph s3tests 清单，不表示覆盖所有标准或厂商特定的 S3 行为。

以下快照已于 2026 年 8 月 9 日基于 RustFS 提交 [`1e6f5f1e`](https://github.com/rustfs/rustfs/commit/1e6f5f1e35f188f28844a7f81361ccca4d5d0c7b) 核验。

## 状态说明

| 状态 | 含义 |
| --- | --- |
| ✅ 已测试 | 已纳入默认兼容性门禁或生命周期兼容性门禁 |
| ❌ 计划支持 | 标准行为，已登记为尚未实现 |
| ⊘ 已排除 | 厂商特定、明确不支持或不属于默认门禁的行为 |

## 可执行测试清单

| 清单 | 用例数 | 作用 |
| --- | ---: | --- |
| [已实现测试](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/implemented_tests.txt) | 455 | 默认门禁中预期通过的标准用例 |
| [生命周期行为测试](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/lifecycle_behavior_tests.txt) | 5 | 在专用生命周期门禁中运行的过期用例 |
| [未实现测试](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/unimplemented_tests.txt) | 17 | 仍在计划中的标准行为 |
| [已排除测试](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/excluded_tests.txt) | 270 | 不阻塞 RustFS 兼容性门禁的用例 |

统计忽略空行和注释。测试会在各清单之间移动，请以链接中的文件作为最新结果。

## 存储桶操作

| 能力 | 状态 | 范围 |
| --- | --- | --- |
| 创建、删除、列出和查看存储桶 | ✅ 已测试 | 常用存储桶生命周期操作 |
| 存储桶标签 | ✅ 已测试 | 添加、获取和删除标签 |
| 存储桶策略 | ✅ 已测试 | 添加、获取和删除策略 |
| 阻止公共访问 | ✅ 已测试 | 添加、获取和删除配置 |
| 部分版本控制、对象锁定、CORS 和生命周期行为 | ✅ 已测试 | 仅覆盖已实现清单中的用例 |
| 存储桶访问日志 | ❌ 计划支持 | 已登记在未实现清单中 |
| 存储桶所有权控制 | ❌ 计划支持 | 已登记在未实现清单中 |
| ACL 授权 | ⊘ 已排除 | 产品明确不支持的行为 |

## 对象操作

| 能力 | 状态 | 范围 |
| --- | --- | --- |
| 上传、获取、复制、查看和删除对象 | ✅ 已测试 | 常用对象操作 |
| 前缀、分隔符、标记和 `max-keys` 列表行为 | ✅ 已测试 | `ListObjects` 和 `ListObjectsV2` |
| 范围读取和条件读取 | ✅ 已测试 | 部分 HTTP Range 和前置条件用例 |
| 用户元数据和对象标签 | ✅ 已测试 | 元数据和标签往返验证 |
| 预签名 GET 和 PUT URL | ✅ 已测试 | 部分签名和请求用例 |
| SSE-C 和部分 SSE-KMS 行为 | ✅ 已测试 | 仅验证由 RustFS 管理的对象往返 |
| POST Object 表单校验和处理 | ❌ 计划支持 | 已登记在未实现清单中 |

加密对象格式不能在 RustFS 与其他 S3 实现之间直接移植。加密测试通过表示 RustFS 能读取由 RustFS 加密的对象，不保证 RustFS 能读取从其他实现直接复制来的加密对象。

## 分片上传操作

| 能力 | 状态 | 范围 |
| --- | --- | --- |
| 创建、上传分片、完成和中止 | ✅ 已测试 | 核心分片上传工作流 |
| 部分分片复制、校验和及对象属性行为 | ✅ 已测试 | 已实现清单中的用例 |
| 分片上传列表和分片查询边界行为 | ⊘ 已排除 | 不属于默认兼容性门禁 |

## 事实来源

仓库中的 [S3 兼容性矩阵](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md) 说明门禁及其更新规则。[`scripts/s3-tests`](https://github.com/rustfs/rustfs/tree/main/scripts/s3-tests) 下的可执行文件决定当前结果。功能发生变化时，应同步更新测试清单和两处公开矩阵。
