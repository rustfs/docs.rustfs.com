---
title: "RustFS Architecture"
description: "Introduction to RustFS Architecture"
---

# RustFS Architecture

RustFS is a high-performance object storage system compatible with the AWS S3 API. It features a concise, lightweight, scalable, and decentralized architecture.

Objects can be documents, videos, PDF files, or any other unstructured data. RustFS provides a scalable, flexible, and efficient solution for storing, accessing, and managing this data. Its compatibility with the AWS S3 API enables seamless integration with existing S3-based applications.

The following diagram illustrates the architecture:

![RustFS Architecture Diagram](./images/s2-1.png)

This diagram represents the basic architecture of RustFS. A distributed grid uses multiple nodes to execute a single task, connected via a network to enable communication.

## Consistency Design

In both distributed and single-machine modes, all read and write operations strictly follow the **read-after-write** consistency model.

## Key Concepts

**Object**: The fundamental unit of storage in RustFS, representing files, byte streams, or any unstructured data.

**Bucket**: A logical container for storing objects. Data is isolated between buckets. For clients, it functions similarly to a top-level directory.

**Drive**: The physical disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS is stored on these drives.

**Set**: A group of drives. Distributed deployment automatically divides the cluster into one or more sets based on scale. Drives in each set are distributed across different locations. An object is stored within a single set. (Sometimes referred to as **Stripes**).

Consider the following when designing the architecture and deploying devices:

- One object is stored on one set.
- One cluster is divided into multiple sets.
- The number of drives in a set is fixed, defaulting to automatic calculation by the system based on cluster scale.
- Drives in a set should be distributed across different nodes as much as possible.

## Architectural Design

Traditional distributed storage architectures often rely on distinct Master nodes, Metadata nodes, and Data nodes. This complexity can make deployment challenging and introduces single points of failure—if metadata is lost, data integrity is at risk.

RustFS adopts a decentralized, peer-to-peer architecture where all nodes are equal. This design greatly simplifies deployment and eliminates metadata bottlenecks. A single command is sufficient to start the system.

RustFS draws inspiration from the elegant and scalable architecture of MinIO, adopting a similar design philosophy that prioritizes simplicity and reliability without compromising on features. We acknowledge MinIO's contribution to promoting the S3 protocol and setting a high standard for object storage architecture.
