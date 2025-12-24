# Small File Optimization

> Memory Object Storage for High Performance

Use server DRAM for distributed shared memory pools for workloads requiring massive IOPS and throughput performance.

## Background

Small file optimization improves IOPS and throughput. In modern architectures, this is critical for AI/ML workloads. Without caching, I/O can become a bottleneck for GPUs.

Caching accelerates access to training, validation, and test datasets.

## Features

### Dedicated Object Cache

RustFS small file optimization is designed for caching file objects.
If an object is not found in the cache, RustFS retrieves it, caches it for future requests, and returns it to the caller.

### Consistent Hashing

RustFS uses consistent hashing algorithms to distribute cached object data across a cluster of cache nodes. Consistent hashing ensures objects can be easily found based on the object's key. This creates a one-to-one relationship between the object's key and the node holding the cached object. It ensures balanced data distribution and minimizes reshuffling when nodes are added or removed.

### Rolling Cache

RustFS uses rolling cache for memory management. It keeps the total cache size within specified limits. If adding new objects would exceed the limit, objects are removed based on timestamps (LRU).

### Automatic Version Updates

RustFS automatically updates the cache with new object versions when they are updated in storage.

### Seamless API Integration

Small file optimization is a seamlessly integrated extension of RustFS. Developers use the same APIs. If the requested object is in cache, RustFS fetches it from cache. If not, it fetches from storage and caches it.
