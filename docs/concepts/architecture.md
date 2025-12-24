---
title: "RustFS Architecture"
description: "Introduction to RustFS Architecture"
---

# RustFS Architecture

RustFS is an object storage system, similar to the well-known AWS S3. As a MinIO alternative, RustFS references MinIO's concise, lightweight, scalable, and elegant architecture.

Objects can be documents, videos, PDF files, etc. To store objects, MinIO provides a scalable, flexible, and efficient solution for storing, accessing, and managing data. Its compatibility with AWS S3 API enables seamless integration with AWS S3-based applications.

The architecture diagram is as follows:

![RustFS Architecture Diagram](./images/s2-1.png)

This is RustFS's basic architecture. A distributed grid is a computer architecture that uses multiple nodes to execute a single task. Nodes are connected to each other through a network, enabling them to communicate with each other.

## Consistency Design

In both distributed and single-machine modes, all read and write operations strictly follow the read-after-write consistency model.

## Several Important Concepts in RustFS

**Object**: The fundamental unit of storage in RustFS, representing files, byte streams, or any unstructured data.

**Bucket**: A logical container for storing Objects. Data is isolated between Buckets. For clients, it functions similarly to a top-level directory.

**Drive**: The disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS will be stored in Drives.

**Set**: A collection of a group of Drives. Distributed deployment automatically divides one or more Sets based on cluster scale. Drives in each Set are distributed in different locations. An object is stored on one Set. (Some places also call the combination of Sets **Strips** - stripes).

Therefore, before designing the architecture and deploying devices, note that:

1. One object is stored on one Set;

2. One cluster is divided into multiple Sets;

3. The number of Drives contained in one Set is fixed, defaulting to automatic calculation by the system based on cluster scale;

4. Drives in one Set should be distributed across different nodes as much as possible;

## Architectural Design

Traditional distributed storage architectures often rely on distinct Master nodes, Metadata nodes, and Data nodes. This complexity can make deployment challenging and introduces single points of failure—if metadata is lost, data integrity is at risk.

RustFS adopts a decentralized, peer-to-peer architecture where all nodes are equal. This design greatly simplifies deployment and eliminates metadata bottlenecks. A single command is sufficient to start the system.

RustFS draws inspiration from the elegant and scalable architecture of MinIO, adopting a similar design philosophy that prioritizes simplicity and reliability without compromising on features. We acknowledge MinIO's contribution to promoting the S3 protocol and setting a high standard for object storage architecture.
