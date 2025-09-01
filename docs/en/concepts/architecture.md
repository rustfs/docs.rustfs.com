---
title: "RustFS Architecture"
description: "Introduction to RustFS architecture"
---

# RustFS Architecture

RustFS is an object storage system similar to the well-known AWS S3. As an alternative to MinIO, RustFS references MinIO's clean, lightweight, scalable, and elegant architecture.

Objects can be documents, videos, PDF files, and more. For storing objects, MinIO provides a scalable, flexible, and efficient solution for storing, accessing, and managing data. Its compatibility with the AWS S3 API enables seamless integration with AWS S3-based applications.

The architecture diagram is as follows:

![RustFS Architecture Diagram](./images/s2-1.png)

This is the basic architecture of RustFS. A distributed mesh is a computer architecture that uses multiple nodes to perform a single task. Nodes are connected to each other through a network, allowing them to communicate with each other.

## Consistency Design

In both distributed and single-machine modes, all read and write operations strictly follow the read-after-write consistency model.

## Important Concepts in RustFS

**Object**: The basic object stored in RustFS, such as files, byte streams, anything...

**Bucket**: The logical space used to store objects. Data between each bucket is mutually isolated. For clients, it's equivalent to a top-level folder for storing files.

**Drive**: The disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS will be stored in drives.

**Set**: A collection of drives. Distributed deployment automatically divides into one or more sets based on cluster scale, and drives in each set are distributed in different locations. An object is stored in one set.

Therefore, when designing architecture and deploying equipment, you need to consider:

1. An object is stored in one set;
2. A cluster is divided into multiple sets;
3. The number of drives in a set is fixed, automatically calculated by the system based on cluster scale by default;
4. Drives in a set are distributed across different nodes as much as possible;

## Special Thanks

All nodes are in peer-to-peer relationships, greatly simplifying architectural design and eliminating concerns about metadata loss. It can be started with a single command.

Without losing elegance, simplicity, and reliability, RustFS adopts the same architectural design as MinIO.

Thanks to MinIO for the proposed architectural concept, which has greatly facilitated users worldwide and promoted the S3 protocol.