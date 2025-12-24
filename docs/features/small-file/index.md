# Small File Optimization

> Creating Memory Object Storage for Ultra-High Performance Workloads

Leverage server DRAM to create distributed shared memory pools for workloads requiring massive IOPS and throughput performance.

## Background

RustFS small file optimization is ideal for workloads requiring IOPS and throughput performance. In modern architectures, this increasingly means AI/ML workloads. Without caching, I/O can become a bottleneck for GPUs.

Using enterprise caching, buckets containing training, validation, and test datasets can be kept in memory to provide high-speed access based on cached datasets.

## Features

### 🗃️ Dedicated Object Cache

RustFS small file optimization is specifically designed for caching file objects.
If an object is not found in the existing object cache, it will automatically retrieve the object, cache it for future requests, and return the object to the caller.

### 💾 Consistent Hashing Algorithm

RustFS's small file optimization prioritizes content.
Uses consistent hashing algorithms to distribute cached object data across a cluster of cache nodes (called peers). Consistent hashing ensures objects can be easily found based on the object's key. This creates a one-to-one relationship between the object's key value and the node holding the cached object. It also ensures nodes contain the same amount of data, preventing one node from being overloaded while others remain idle. More importantly, it distributes objects in such a way that if nodes are added or removed, only minimal reshuffling is needed to align the system.

### 🧹 Rolling Cache Memory Management

RustFS uses rolling cache for memory management. RustFS uses rolling cache to keep the total cache size within the limits specified in the small file optimization configuration. If adding new objects would cause the cache size to exceed the specified limit, one or more objects are removed based on timestamps indicating when the object was last requested.

### 🔄 Automatic Version Updates

Automatically updates new object versions. If a cached object has been updated, RustFS object storage automatically updates the cache with the new object version.

### 🧩 Seamless API Integration

RustFS small file optimization is a seamlessly integrated extension of RustFS. Since small file optimization is an extension of RustFS, developers don't need to learn new APIs. Developers use the same APIs as before. If the requested object is in cache, RustFS will automatically fetch it from cache. If an object should be cached and is being requested for the first time, RustFS will fetch it from object storage, return it to the caller, and place it in cache for subsequent requests.
