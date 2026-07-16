# Python SDK Guide (/developer/sdk/python)



<div className="fd-steps">
  <div className="fd-step">
    ## Overview [#1-overview]

    RustFS is S3-compatible and supports the [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK.

    This guide covers:

    * Bucket creation/deletion
    * Object upload/download/deletion
    * Listing objects
    * Generating presigned URLs
    * Multipart upload for large files

    ***
  </div>

  <div className="fd-step">
    ## Environment Preparation [#2-environment-preparation]

    ### 2.1 Example Configuration [#21-example-configuration]

    Assume RustFS is deployed as follows:

    ```
    Endpoint: http://192.168.1.100:9000
    AccessKey: <your-access-key>
    SecretKey: <your-secret-key>
    ```

    ### 2.2 Install Boto3 [#22-install-boto3]

    We recommend using a virtual environment:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install boto3
    ```

    > Boto3 depends on `botocore`, which will be installed automatically.

    ***
  </div>

  <div className="fd-step">
    ## Connecting to RustFS [#3-connecting-to-rustfs]

    ```python
    import boto3
    from botocore.client import Config

    s3 = boto3.client(
     's3',
     endpoint_url='http://192.168.1.100:9000',
     # Use a unique access key and a strong secret (e.g. openssl rand -base64 24)
     aws_access_key_id='<your-access-key>',
     aws_secret_access_key='<your-secret-key>',
     config=Config(signature_version='s3v4'),
     region_name='us-east-1'
    )
    ```

    > ✅ `endpoint_url`: Points to RustFS
    > ✅ `signature_version='s3v4'`: RustFS supports v4 signatures
    > ✅ `region_name`: RustFS does not validate regions; you can use any value.

    ***
  </div>

  <div className="fd-step">
    ## Basic Operations [#4-basic-operations]

    ### 4.1 Create Bucket [#41-create-bucket]

    ```python
    bucket_name = 'my-bucket'

    try:
     s3.create_bucket(Bucket=bucket_name)
     print(f'Bucket {bucket_name} created.')
    except s3.exceptions.BucketAlreadyOwnedByYou:
     print(f'Bucket {bucket_name} already exists.')
    ```

    ***

    ### 4.2 Upload File [#42-upload-file]

    ```python
    s3.upload_file('hello.txt', bucket_name, 'hello.txt')
    print('File uploaded.')
    ```

    ***

    ### 4.3 Download File [#43-download-file]

    ```python
    s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
    print('File downloaded.')
    ```

    ***

    ### 4.4 List Objects [#44-list-objects]

    ```python
    response = s3.list_objects_v2(Bucket=bucket_name)
    for obj in response.get('Contents', []):
     print(f"- {obj['Key']} ({obj['Size']} bytes)")
    ```

    ***

    ### 4.5 Delete Object and Bucket [#45-delete-object-and-bucket]

    ```python
    s3.delete_object(Bucket=bucket_name, Key='hello.txt')
    print('Object deleted.')

    s3.delete_bucket(Bucket=bucket_name)
    print('Bucket deleted.')
    ```

    ***
  </div>

  <div className="fd-step">
    ## Advanced Features [#5-advanced-features]

    ### 5.1 Generate Presigned URLs [#51-generate-presigned-urls]

    #### 5.1.1 Download Link (GET) [#511-download-link-get]

    ```python
    url = s3.generate_presigned_url(
     ClientMethod='get_object',
     Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
     ExpiresIn=600 # 10 minutes validity
    )

    print('Presigned GET URL:', url)
    ```

    #### 5.1.2 Upload Link (PUT) [#512-upload-link-put]

    ```python
    url = s3.generate_presigned_url(
     ClientMethod='put_object',
     Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
     ExpiresIn=600
    )

    print('Presigned PUT URL:', url)
    ```

    You can use `curl` tool to upload:

    ```bash
    curl -X PUT --upload-file hello.txt "http://..."
    ```

    ***

    ### 5.2 Multipart Upload [#52-multipart-upload]

    Suitable for files larger than 10 MB, allows manual control of each part.

    ```python
    import os

    file_path = 'largefile.bin'
    key = 'largefile.bin'
    part_size = 5 * 1024 * 1024 # 5 MB

    # 1. Start upload
    response = s3.create_multipart_upload(Bucket=bucket_name, Key=key)
    upload_id = response['UploadId']
    parts = []

    try:
     with open(file_path, 'rb') as f:
     part_number = 1
     while True:
     data = f.read(part_size)
     if not data:
     break

     part = s3.upload_part(
     Bucket=bucket_name,
     Key=key,
     PartNumber=part_number,
     UploadId=upload_id,
     Body=data
     )

     parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
     print(f'Uploaded part {part_number}')
     part_number += 1

     # 2. Complete upload
     s3.complete_multipart_upload(
     Bucket=bucket_name,
     Key=key,
     UploadId=upload_id,
     MultipartUpload={'Parts': parts}
     )
     print('Multipart upload complete.')

    except Exception as e:
     # Abort upload
     s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
     print('Multipart upload aborted due to error:', e)
    ```

    ***
  </div>

  <div className="fd-step">
    ## Common Issue Troubleshooting [#6-common-issue-troubleshooting]

    | Issue                     | Cause                                         | Solution                                                                                         |
    | ------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
    | `SignatureDoesNotMatch`   | Not using v4 signature                        | Set `signature_version='s3v4'`                                                                   |
    | `EndpointConnectionError` | Wrong RustFS address or service not started   | Check endpoint and RustFS service status                                                         |
    | `AccessDenied`            | Wrong credentials or insufficient permissions | Check AccessKey/SecretKey or bucket policies                                                     |
    | `PermanentRedirect`       | Path-style not enabled                        | Boto3 defaults to virtual-host, RustFS only supports path-style, but setting endpoint can bypass |

    ***
  </div>

  <div className="fd-step">
    ## Appendix: Quick Upload/Download Script Template [#7-appendix-quick-uploaddownload-script-template]

    ```python
    def upload_file(local_path, bucket, object_key):
     s3.upload_file(local_path, bucket, object_key)
     print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

    def download_file(bucket, object_key, local_path):
     s3.download_file(bucket, object_key, local_path)
     print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
    ```
  </div>
</div>
