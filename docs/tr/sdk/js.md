---
title: "JavaScript SDK"
description: "This article mainly explains the use of JavaScript SDK in RustFS."
---

# JavaScript SDK

RustFS is an object storage system compatible with the S3 protocol, supporting integration through AWS S3 JavaScript SDK. This article will explain how to use JavaScript/Node.js to integrate with RustFS and complete basic object storage operations.

## 1. Environment Setup

### 1.1 Prerequisites

- Node.js 14+ or modern browser environment
- npm or yarn package manager

### 1.2 Install AWS SDK

Using npm:

```bash
npm install @aws-sdk/client-s3
```

Using yarn:

```bash
yarn add @aws-sdk/client-s3
```

For browser environments, you can also use CDN:

```html
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
```

## 2. Basic Configuration

### 2.1 Initialize S3 Client (Node.js)

```javascript
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'http://192.168.1.100:9000', // RustFS endpoint
  region: 'us-east-1', // Can be any value, RustFS doesn't validate region
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  },
  forcePathStyle: true, // Required for RustFS
  s3ForcePathStyle: true // For older SDK versions
});
```

### 2.2 Browser Environment

```javascript
// For browser environment
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  },
  forcePathStyle: true
});
```

## 3. Basic Operations

### 3.1 Create Bucket

```javascript
import { CreateBucketCommand } from '@aws-sdk/client-s3';

async function createBucket(bucketName) {
  try {
    const command = new CreateBucketCommand({
      Bucket: bucketName
    });

    const response = await s3Client.send(command);
    console.log('Bucket created successfully:', response);
    return response;
  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log('Bucket already exists');
    } else {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }
}

// Usage
await createBucket('my-bucket');
```

### 3.2 Upload Object

```javascript
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

async function uploadFile(bucketName, key, filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'application/octet-stream'
    });

    const response = await s3Client.send(command);
    console.log('File uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Usage
await uploadFile('my-bucket', 'hello.txt', './hello.txt');
```

### 3.3 Upload from String

```javascript
async function uploadString(bucketName, key, content) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
      ContentType: 'text/plain'
    });

    const response = await s3Client.send(command);
    console.log('String uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Error uploading string:', error);
    throw error;
  }
}

// Usage
await uploadString('my-bucket', 'greeting.txt', 'Hello RustFS!');
```

### 3.4 Download Object

```javascript
import { GetObjectCommand } from '@aws-sdk/client-s3';

async function downloadFile(bucketName, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    return buffer;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

// Usage
const fileBuffer = await downloadFile('my-bucket', 'hello.txt');
console.log('File content:', fileBuffer.toString());
```

### 3.5 List Objects

```javascript
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

async function listObjects(bucketName, prefix = '') {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      response.Contents.forEach(obj => {
        console.log(`- ${obj.Key} (${obj.Size} bytes)`);
      });
    }

    return response.Contents;
  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
}

// Usage
await listObjects('my-bucket');
```

### 3.6 Delete Object

```javascript
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

async function deleteObject(bucketName, key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);
    console.log('Object deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error deleting object:', error);
    throw error;
  }
}

// Usage
await deleteObject('my-bucket', 'hello.txt');
```

## 4. Advanced Features

### 4.1 Generate Presigned URLs

```javascript
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Generate download URL
async function getDownloadUrl(bucketName, key, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Download URL:', url);
    return url;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
}

// Generate upload URL
async function getUploadUrl(bucketName, key, expiresIn = 3600) {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Upload URL:', url);
    return url;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
}

// Usage
const downloadUrl = await getDownloadUrl('my-bucket', 'hello.txt');
const uploadUrl = await getUploadUrl('my-bucket', 'new-file.txt');
```

### 4.2 Multipart Upload

```javascript
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3';

async function multipartUpload(bucketName, key, file) {
  const partSize = 5 * 1024 * 1024; // 5MB parts
  const fileSize = file.size || file.length;

  if (fileSize <= partSize) {
    // Use regular upload for small files
    return uploadFile(bucketName, key, file);
  }

  try {
    // 1. Initiate multipart upload
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key
    });

    const { UploadId } = await s3Client.send(createCommand);

    // 2. Upload parts
    const parts = [];
    const numParts = Math.ceil(fileSize / partSize);

    for (let i = 0; i < numParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, fileSize);
      const partNumber = i + 1;

      const partData = file.slice(start, end);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        PartNumber: partNumber,
        UploadId,
        Body: partData
      });

      const partResult = await s3Client.send(uploadPartCommand);

      parts.push({
        ETag: partResult.ETag,
        PartNumber: partNumber
      });

      console.log(`Uploaded part ${partNumber}/${numParts}`);
    }

    // 3. Complete multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId,
      MultipartUpload: {
        Parts: parts
      }
    });

    const result = await s3Client.send(completeCommand);
    console.log('Multipart upload completed:', result);
    return result;

  } catch (error) {
    console.error('Multipart upload failed:', error);

    // Abort upload on error
    try {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId
      });
      await s3Client.send(abortCommand);
    } catch (abortError) {
      console.error('Error aborting upload:', abortError);
    }

    throw error;
  }
}
```

## 5. Browser Integration

### 5.1 File Upload from Browser

```html
<!DOCTYPE html>
<html>
<head>
    <title>RustFS File Upload</title>
</head>
<body>
    <input type="file" id="fileInput" />
    <button onclick="uploadFile()">Upload</button>
    <div id="progress"></div>

    <script type="module">
        import { S3Client, PutObjectCommand } from 'https://cdn.skypack.dev/@aws-sdk/client-s3';

        const s3Client = new S3Client({
            endpoint: 'http://localhost:9000',
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'rustfsadmin',
                secretAccessKey: 'rustfssecret'
            },
            forcePathStyle: true
        });

        window.uploadFile = async function() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file');
                return;
            }

            try {
                const command = new PutObjectCommand({
                    Bucket: 'my-bucket',
                    Key: file.name,
                    Body: file,
                    ContentType: file.type
                });

                const response = await s3Client.send(command);
                document.getElementById('progress').innerHTML = 'Upload successful!';
                console.log('Upload response:', response);
            } catch (error) {
                document.getElementById('progress').innerHTML = 'Upload failed: ' + error.message;
                console.error('Upload error:', error);
            }
        };
    </script>
</body>
</html>
```

### 5.2 Drag and Drop Upload

```javascript
// Drag and drop functionality
function setupDragAndDrop(dropZoneId) {
  const dropZone = document.getElementById(dropZoneId);

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;

    for (const file of files) {
      try {
        await uploadFileToRustFS(file);
        console.log(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
  });
}

async function uploadFileToRustFS(file) {
  const command = new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: file.name,
    Body: file,
    ContentType: file.type
  });

  return await s3Client.send(command);
}
```

## 6. Error Handling

### 6.1 Common Error Types

```javascript
async function handleS3Operation(operation) {
  try {
    return await operation();
  } catch (error) {
    switch (error.name) {
      case 'NoSuchBucket':
        console.error('Bucket does not exist');
        break;
      case 'NoSuchKey':
        console.error('Object does not exist');
        break;
      case 'AccessDenied':
        console.error('Access denied - check credentials');
        break;
      case 'NetworkError':
        console.error('Network connection failed');
        break;
      default:
        console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

### 6.2 Retry Logic

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Usage
const result = await retryOperation(async () => {
  return await downloadFile('my-bucket', 'important-file.txt');
});
```

## 7. Best Practices

1. **Error Handling**: Always wrap S3 operations in try-catch blocks
2. **Credentials Security**: Never expose credentials in frontend code; use temporary credentials or presigned URLs
3. **File Size**: Use multipart upload for files larger than 5MB
4. **Content Type**: Always set appropriate Content-Type for better compatibility
5. **Progress Tracking**: Implement progress indicators for large file uploads
6. **Connection Pooling**: Reuse S3 client instances to optimize performance

## 8. Complete Example

```javascript
class RustFSClient {
  constructor(config) {
    this.s3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region || 'us-east-1',
      credentials: config.credentials,
      forcePathStyle: true
    });
  }

  async uploadFile(bucketName, key, file, onProgress) {
    const fileSize = file.size || file.length;
    const partSize = 5 * 1024 * 1024;

    if (fileSize <= partSize) {
      return this.simpleUpload(bucketName, key, file);
    } else {
      return this.multipartUpload(bucketName, key, file, onProgress);
    }
  }

  async simpleUpload(bucketName, key, file) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: file.type || 'application/octet-stream'
    });

    return await this.s3Client.send(command);
  }

  // ... other methods
}

// Usage
const rustfs = new RustFSClient({
  endpoint: 'http://localhost:9000',
  credentials: {
    accessKeyId: 'rustfsadmin',
    secretAccessKey: 'rustfssecret'
  }
});

// Upload with progress tracking
await rustfs.uploadFile('my-bucket', 'large-file.zip', file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```
