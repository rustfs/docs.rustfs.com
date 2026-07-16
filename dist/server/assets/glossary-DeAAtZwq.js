import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/glossary.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Glossary",
	"description": "This article introduces commonly used vocabulary in object storage to help users quickly understand object storage"
};
var _markdown = "\n\n| No. | Term                         | Description                                                                                                         |\n| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |\n| 1   | Object Storage               | An architecture where data is stored as objects, replacing traditional file hierarchy structures                    |\n| 2   | Bucket                       | A container for storing objects with globally unique namespace                                                      |\n| 3   | Object                       | Basic storage unit containing data, metadata, and unique identifier (Object Key)                                    |\n| 4   | Metadata                     | Key-value pair information describing object attributes (such as file type, creation time)                          |\n| 5   | S3-Compatible                | Storage services compatible with Amazon S3 API standards                                                            |\n| 6   | Data Durability              | The probability that data remains intact and accessible over a period of time (e.g., 99.999999999%)                 |\n| 7   | Replication                  | Redundancy technology that ensures data safety through multiple copies                                              |\n| 8   | Erasure Coding               | A method of data protection in which data is broken into fragments, expanded and encoded with redundant data pieces |\n| 9   | Cold Storage                 | Low-cost storage type for infrequently accessed data (such as archived data)                                        |\n| 10  | Lifecycle Management         | Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days)                |\n| 11  | Versioning                   | Retaining historical versions of objects to prevent overwriting                                                     |\n| 12  | Storage Class                | Different performance/cost storage tiers (Standard, Infrequent Access, Archive)                                     |\n| 13  | Access Key                   | Authentication keys for API requests (Access Key ID + Secret Access Key)                                            |\n| 14  | Region                       | Geographic location of storage infrastructure (e.g., East China 1, US West)                                         |\n| 15  | Availability Zone (AZ)       | Isolated data centers with independent power/network within the same region                                         |\n| 16  | Endpoint                     | Domain address for accessing storage service (e.g., us-east1.rustfs.com)                                            |\n| 17  | RESTful API                  | API design specification based on HTTP protocol                                                                     |\n| 18  | Multipart Upload             | Mechanism for splitting large files for upload and merging                                                          |\n| 19  | Pre-Signed URL               | Temporary access links with time validity                                                                           |\n| 20  | Server-Side Encryption (SSE) | Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C)                                                     |\n| 21  | Client-Side Encryption (CSE) | Local encryption on client side before upload                                                                       |\n| 22  | Cross-Region Replication     | Automatic object replication across geographic regions                                                              |\n| 23  | Access Control List (ACL)    | Rule list controlling access permissions for buckets/objects                                                        |\n| 24  | Bucket Policy                | JSON-based fine-grained permission control policies                                                                 |\n| 25  | IAM                          | Identity and Access Management system for centralized user/role permission management                               |\n| 26  | Event Notification           | Sending notifications to message queues/function computing when events trigger                                      |\n| 27  | Data Lake                    | Repository for centralized storage of structured/unstructured data                                                  |\n| 28  | Compliance                   | Meeting data storage regulatory requirements like GDPR, HIPAA                                                       |\n| 29  | Logging & Audit              | Recording all API operation logs for auditing                                                                       |\n| 30  | Monitoring & Alerting        | Real-time monitoring of storage usage/requests with alerting                                                        |\n| 31  | CORS                         | Rules controlling browser cross-origin resource access                                                              |\n| 32  | Transfer Acceleration        | Optimizing upload/download speed through edge nodes                                                                 |\n| 33  | CDN Integration              | Combining with Content Delivery Network for caching acceleration                                                    |\n| 34  | Data Export                  | Process of migrating data to other storage systems                                                                  |\n| 35  | Data Import                  | Batch data migration from external systems to object storage                                                        |\n| 36  | Static Website Hosting       | Directly hosting HTML/CSS/JS static files through buckets                                                           |\n| 37  | Hotlink Protection           | Technology preventing external websites from stealing resource links                                                |\n| 38  | Request Rate Limiting        | Controlling API request frequency per user/IP                                                                       |\n| 39  | Tagging                      | Adding classification tags to buckets/objects for management                                                        |\n| 40  | Inventory Report             | Periodically generated CSV/ORC files listing storage objects                                                        |\n| 41  | Data Restoration             | Restoring data from archive storage to accessible state                                                             |\n| 42  | Storage Gateway              | Access layer mapping object storage as local file system                                                            |\n| 43  | Data Compression             | Compressing data before upload to save storage space                                                                |\n| 44  | Data Deduplication           | Eliminating duplicate data to reduce storage usage                                                                  |\n| 45  | Direct Read Archive          | Technology for directly reading archived data without restoration                                                   |\n| 46  | Bandwidth Control            | Limiting download bandwidth to avoid network congestion                                                             |\n| 47  | Concurrent Connections       | Number of simultaneous data transfer connections                                                                    |\n| 48  | Data Migration Service       | Automated migration tools (e.g., AWS Snowball)                                                                      |\n| 49  | Client SDK                   | Developer toolkits for integrating storage services (e.g., Python/Java SDK)                                         |\n| 50  | CLI                          | Command line management tools (e.g., aws s3 cp)                                                                     |\n| 51  | Web Console                  | Web-based management interface                                                                                      |\n| 52  | Data Integrity Check         | Verifying transmission integrity through MD5/SHA                                                                    |\n| 53  | Resumable Upload/Download    | Continuing transfer from breakpoint after network interruption                                                      |\n| 54  | Mirror Back to Source        | Pulling and saving from specified origin when requested object doesn't exist                                        |\n| 55  | Canary Release               | Release strategy gradually opening new features to some users                                                       |\n| 56  | Soft Delete                  | Marking objects for deletion while maintaining recovery period                                                      |\n| 57  | Object Lock                  | Compliance protection mechanism preventing object deletion or overwriting                                           |\n| 58  | Watermarking                 | Adding identification information to images/videos                                                                  |\n| 59  | Thumbnail Generation         | Automatically creating thumbnail versions of images                                                                 |\n| 60  | Image Processing             | Online cropping/scaling/rotation processing functions                                                               |\n| 61  | Video Transcoding            | Converting video formats/resolutions for different devices                                                          |\n| 62  | Content Moderation           | Automatically detecting inappropriate images/videos/text                                                            |\n| 63  | Cost Analysis                | Calculating costs by storage type/request count dimensions                                                          |\n| 64  | Usage Monitoring             | Real-time dashboard viewing storage/traffic/request counts                                                          |\n| 65  | Storage Analytics            | Tools analyzing storage patterns to optimize costs                                                                  |\n| 66  | Requester Pays               | Billing model where data downloader bears the cost                                                                  |\n| 67  | Tiered Storage               | Automatically moving data to lower-cost storage tiers                                                               |\n| 68  | Intelligent Tiering          | Automatically selecting optimal storage type based on access patterns                                               |\n| 69  | PrivateLink                  | Accessing object storage through internal network avoiding public exposure                                          |\n| 70  | VPC Endpoint                 | Entry point for securely accessing storage services within Virtual Private Cloud                                    |\n| 71  | SSL/TLS                      | Encrypting data transmission through HTTPS protocol                                                                 |\n| 72  | Client-Side Encryption       | Users encrypting data themselves before upload                                                                      |\n| 73  | KMS                          | Key Management Service for centralized encryption key management                                                    |\n| 74  | Permission Boundary          | Limiting maximum permission scope of IAM roles/users                                                                |\n| 75  | Temporary Credentials        | Short-term valid access tokens (e.g., STS Token)                                                                    |\n| 76  | MFA Delete                   | Requiring multi-factor authentication to delete data                                                                |\n| 77  | Immutability                 | Property preventing data tampering (combined with WORM model)                                                       |\n| 78  | Legal Hold                   | Mandatory protection prohibiting data deletion/modification in compliance scenarios                                 |\n| 79  | Cross-Account Sharing        | Allowing other cloud accounts to access specified storage resources                                                 |\n| 80  | Prefetch Policy              | Loading data into cache in advance to accelerate subsequent access                                                  |\n| 81  | Cache-Control                | Specifying browser/CDN caching behavior through HTTP headers                                                        |\n| 82  | Delayed Deletion             | Delaying deletion operations to prevent accidental actions                                                          |\n| 83  | Batch Operations             | Performing unified operations on multiple objects (delete/copy/restore)                                             |\n| 84  | Data Lineage                 | Metadata records tracking data sources and change history                                                           |\n| 85  | Data Catalog                 | Retrieval system storing metadata information                                                                       |\n| 86  | Storage Gateway              | Hybrid cloud solution connecting local systems with cloud storage                                                   |\n| 87  | Hybrid Cloud Storage         | Architecture using both local storage and cloud storage                                                             |\n| 88  | Edge Storage                 | Providing storage services at edge nodes close to data sources                                                      |\n| 89  | Multi-Cloud Storage          | Storage solutions across different cloud service providers                                                          |\n| 90  | Storage Federation           | Abstraction layer for unified management of multiple storage systems                                                |\n| 91  | Object Tag                   | Adding custom classification tags to objects                                                                        |\n| 92  | Bucket Tag                   | Adding management/billing related tags to buckets                                                                   |\n| 93  | Storage Quota                | Limiting maximum capacity of buckets                                                                                |\n| 94  | Request Throttling           | Limiting API requests per unit time                                                                                 |\n| 95  | SLA                          | Service Level Agreement commitments for availability/durability (e.g., 99.9% availability)                          |\n| 96  | Disaster Recovery            | Ensuring business continuity through cross-region backups                                                           |\n| 97  | Storage Topology             | Distribution structure of data at physical/logical levels                                                           |\n| 98  | Proximity Access             | Routing user requests to nearest storage nodes                                                                      |\n| 99  | Global Namespace             | Unified view management of cross-region buckets                                                                     |\n| 100 | Zero-Copy Migration          | Fast data migration through metadata operations                                                                     |\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "No."
		},
		{
			"heading": void 0,
			"content": "Term"
		},
		{
			"heading": void 0,
			"content": "Description"
		},
		{
			"heading": void 0,
			"content": "1"
		},
		{
			"heading": void 0,
			"content": "Object Storage"
		},
		{
			"heading": void 0,
			"content": "An architecture where data is stored as objects, replacing traditional file hierarchy structures"
		},
		{
			"heading": void 0,
			"content": "2"
		},
		{
			"heading": void 0,
			"content": "Bucket"
		},
		{
			"heading": void 0,
			"content": "A container for storing objects with globally unique namespace"
		},
		{
			"heading": void 0,
			"content": "3"
		},
		{
			"heading": void 0,
			"content": "Object"
		},
		{
			"heading": void 0,
			"content": "Basic storage unit containing data, metadata, and unique identifier (Object Key)"
		},
		{
			"heading": void 0,
			"content": "4"
		},
		{
			"heading": void 0,
			"content": "Metadata"
		},
		{
			"heading": void 0,
			"content": "Key-value pair information describing object attributes (such as file type, creation time)"
		},
		{
			"heading": void 0,
			"content": "5"
		},
		{
			"heading": void 0,
			"content": "S3-Compatible"
		},
		{
			"heading": void 0,
			"content": "Storage services compatible with Amazon S3 API standards"
		},
		{
			"heading": void 0,
			"content": "6"
		},
		{
			"heading": void 0,
			"content": "Data Durability"
		},
		{
			"heading": void 0,
			"content": "The probability that data remains intact and accessible over a period of time (e.g., 99.999999999%)"
		},
		{
			"heading": void 0,
			"content": "7"
		},
		{
			"heading": void 0,
			"content": "Replication"
		},
		{
			"heading": void 0,
			"content": "Redundancy technology that ensures data safety through multiple copies"
		},
		{
			"heading": void 0,
			"content": "8"
		},
		{
			"heading": void 0,
			"content": "Erasure Coding"
		},
		{
			"heading": void 0,
			"content": "A method of data protection in which data is broken into fragments, expanded and encoded with redundant data pieces"
		},
		{
			"heading": void 0,
			"content": "9"
		},
		{
			"heading": void 0,
			"content": "Cold Storage"
		},
		{
			"heading": void 0,
			"content": "Low-cost storage type for infrequently accessed data (such as archived data)"
		},
		{
			"heading": void 0,
			"content": "10"
		},
		{
			"heading": void 0,
			"content": "Lifecycle Management"
		},
		{
			"heading": void 0,
			"content": "Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days)"
		},
		{
			"heading": void 0,
			"content": "11"
		},
		{
			"heading": void 0,
			"content": "Versioning"
		},
		{
			"heading": void 0,
			"content": "Retaining historical versions of objects to prevent overwriting"
		},
		{
			"heading": void 0,
			"content": "12"
		},
		{
			"heading": void 0,
			"content": "Storage Class"
		},
		{
			"heading": void 0,
			"content": "Different performance/cost storage tiers (Standard, Infrequent Access, Archive)"
		},
		{
			"heading": void 0,
			"content": "13"
		},
		{
			"heading": void 0,
			"content": "Access Key"
		},
		{
			"heading": void 0,
			"content": "Authentication keys for API requests (Access Key ID + Secret Access Key)"
		},
		{
			"heading": void 0,
			"content": "14"
		},
		{
			"heading": void 0,
			"content": "Region"
		},
		{
			"heading": void 0,
			"content": "Geographic location of storage infrastructure (e.g., East China 1, US West)"
		},
		{
			"heading": void 0,
			"content": "15"
		},
		{
			"heading": void 0,
			"content": "Availability Zone (AZ)"
		},
		{
			"heading": void 0,
			"content": "Isolated data centers with independent power/network within the same region"
		},
		{
			"heading": void 0,
			"content": "16"
		},
		{
			"heading": void 0,
			"content": "Endpoint"
		},
		{
			"heading": void 0,
			"content": "Domain address for accessing storage service (e.g., us-east1.rustfs.com)"
		},
		{
			"heading": void 0,
			"content": "17"
		},
		{
			"heading": void 0,
			"content": "RESTful API"
		},
		{
			"heading": void 0,
			"content": "API design specification based on HTTP protocol"
		},
		{
			"heading": void 0,
			"content": "18"
		},
		{
			"heading": void 0,
			"content": "Multipart Upload"
		},
		{
			"heading": void 0,
			"content": "Mechanism for splitting large files for upload and merging"
		},
		{
			"heading": void 0,
			"content": "19"
		},
		{
			"heading": void 0,
			"content": "Pre-Signed URL"
		},
		{
			"heading": void 0,
			"content": "Temporary access links with time validity"
		},
		{
			"heading": void 0,
			"content": "20"
		},
		{
			"heading": void 0,
			"content": "Server-Side Encryption (SSE)"
		},
		{
			"heading": void 0,
			"content": "Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C)"
		},
		{
			"heading": void 0,
			"content": "21"
		},
		{
			"heading": void 0,
			"content": "Client-Side Encryption (CSE)"
		},
		{
			"heading": void 0,
			"content": "Local encryption on client side before upload"
		},
		{
			"heading": void 0,
			"content": "22"
		},
		{
			"heading": void 0,
			"content": "Cross-Region Replication"
		},
		{
			"heading": void 0,
			"content": "Automatic object replication across geographic regions"
		},
		{
			"heading": void 0,
			"content": "23"
		},
		{
			"heading": void 0,
			"content": "Access Control List (ACL)"
		},
		{
			"heading": void 0,
			"content": "Rule list controlling access permissions for buckets/objects"
		},
		{
			"heading": void 0,
			"content": "24"
		},
		{
			"heading": void 0,
			"content": "Bucket Policy"
		},
		{
			"heading": void 0,
			"content": "JSON-based fine-grained permission control policies"
		},
		{
			"heading": void 0,
			"content": "25"
		},
		{
			"heading": void 0,
			"content": "IAM"
		},
		{
			"heading": void 0,
			"content": "Identity and Access Management system for centralized user/role permission management"
		},
		{
			"heading": void 0,
			"content": "26"
		},
		{
			"heading": void 0,
			"content": "Event Notification"
		},
		{
			"heading": void 0,
			"content": "Sending notifications to message queues/function computing when events trigger"
		},
		{
			"heading": void 0,
			"content": "27"
		},
		{
			"heading": void 0,
			"content": "Data Lake"
		},
		{
			"heading": void 0,
			"content": "Repository for centralized storage of structured/unstructured data"
		},
		{
			"heading": void 0,
			"content": "28"
		},
		{
			"heading": void 0,
			"content": "Compliance"
		},
		{
			"heading": void 0,
			"content": "Meeting data storage regulatory requirements like GDPR, HIPAA"
		},
		{
			"heading": void 0,
			"content": "29"
		},
		{
			"heading": void 0,
			"content": "Logging & Audit"
		},
		{
			"heading": void 0,
			"content": "Recording all API operation logs for auditing"
		},
		{
			"heading": void 0,
			"content": "30"
		},
		{
			"heading": void 0,
			"content": "Monitoring & Alerting"
		},
		{
			"heading": void 0,
			"content": "Real-time monitoring of storage usage/requests with alerting"
		},
		{
			"heading": void 0,
			"content": "31"
		},
		{
			"heading": void 0,
			"content": "CORS"
		},
		{
			"heading": void 0,
			"content": "Rules controlling browser cross-origin resource access"
		},
		{
			"heading": void 0,
			"content": "32"
		},
		{
			"heading": void 0,
			"content": "Transfer Acceleration"
		},
		{
			"heading": void 0,
			"content": "Optimizing upload/download speed through edge nodes"
		},
		{
			"heading": void 0,
			"content": "33"
		},
		{
			"heading": void 0,
			"content": "CDN Integration"
		},
		{
			"heading": void 0,
			"content": "Combining with Content Delivery Network for caching acceleration"
		},
		{
			"heading": void 0,
			"content": "34"
		},
		{
			"heading": void 0,
			"content": "Data Export"
		},
		{
			"heading": void 0,
			"content": "Process of migrating data to other storage systems"
		},
		{
			"heading": void 0,
			"content": "35"
		},
		{
			"heading": void 0,
			"content": "Data Import"
		},
		{
			"heading": void 0,
			"content": "Batch data migration from external systems to object storage"
		},
		{
			"heading": void 0,
			"content": "36"
		},
		{
			"heading": void 0,
			"content": "Static Website Hosting"
		},
		{
			"heading": void 0,
			"content": "Directly hosting HTML/CSS/JS static files through buckets"
		},
		{
			"heading": void 0,
			"content": "37"
		},
		{
			"heading": void 0,
			"content": "Hotlink Protection"
		},
		{
			"heading": void 0,
			"content": "Technology preventing external websites from stealing resource links"
		},
		{
			"heading": void 0,
			"content": "38"
		},
		{
			"heading": void 0,
			"content": "Request Rate Limiting"
		},
		{
			"heading": void 0,
			"content": "Controlling API request frequency per user/IP"
		},
		{
			"heading": void 0,
			"content": "39"
		},
		{
			"heading": void 0,
			"content": "Tagging"
		},
		{
			"heading": void 0,
			"content": "Adding classification tags to buckets/objects for management"
		},
		{
			"heading": void 0,
			"content": "40"
		},
		{
			"heading": void 0,
			"content": "Inventory Report"
		},
		{
			"heading": void 0,
			"content": "Periodically generated CSV/ORC files listing storage objects"
		},
		{
			"heading": void 0,
			"content": "41"
		},
		{
			"heading": void 0,
			"content": "Data Restoration"
		},
		{
			"heading": void 0,
			"content": "Restoring data from archive storage to accessible state"
		},
		{
			"heading": void 0,
			"content": "42"
		},
		{
			"heading": void 0,
			"content": "Storage Gateway"
		},
		{
			"heading": void 0,
			"content": "Access layer mapping object storage as local file system"
		},
		{
			"heading": void 0,
			"content": "43"
		},
		{
			"heading": void 0,
			"content": "Data Compression"
		},
		{
			"heading": void 0,
			"content": "Compressing data before upload to save storage space"
		},
		{
			"heading": void 0,
			"content": "44"
		},
		{
			"heading": void 0,
			"content": "Data Deduplication"
		},
		{
			"heading": void 0,
			"content": "Eliminating duplicate data to reduce storage usage"
		},
		{
			"heading": void 0,
			"content": "45"
		},
		{
			"heading": void 0,
			"content": "Direct Read Archive"
		},
		{
			"heading": void 0,
			"content": "Technology for directly reading archived data without restoration"
		},
		{
			"heading": void 0,
			"content": "46"
		},
		{
			"heading": void 0,
			"content": "Bandwidth Control"
		},
		{
			"heading": void 0,
			"content": "Limiting download bandwidth to avoid network congestion"
		},
		{
			"heading": void 0,
			"content": "47"
		},
		{
			"heading": void 0,
			"content": "Concurrent Connections"
		},
		{
			"heading": void 0,
			"content": "Number of simultaneous data transfer connections"
		},
		{
			"heading": void 0,
			"content": "48"
		},
		{
			"heading": void 0,
			"content": "Data Migration Service"
		},
		{
			"heading": void 0,
			"content": "Automated migration tools (e.g., AWS Snowball)"
		},
		{
			"heading": void 0,
			"content": "49"
		},
		{
			"heading": void 0,
			"content": "Client SDK"
		},
		{
			"heading": void 0,
			"content": "Developer toolkits for integrating storage services (e.g., Python/Java SDK)"
		},
		{
			"heading": void 0,
			"content": "50"
		},
		{
			"heading": void 0,
			"content": "CLI"
		},
		{
			"heading": void 0,
			"content": "Command line management tools (e.g., aws s3 cp)"
		},
		{
			"heading": void 0,
			"content": "51"
		},
		{
			"heading": void 0,
			"content": "Web Console"
		},
		{
			"heading": void 0,
			"content": "Web-based management interface"
		},
		{
			"heading": void 0,
			"content": "52"
		},
		{
			"heading": void 0,
			"content": "Data Integrity Check"
		},
		{
			"heading": void 0,
			"content": "Verifying transmission integrity through MD5/SHA"
		},
		{
			"heading": void 0,
			"content": "53"
		},
		{
			"heading": void 0,
			"content": "Resumable Upload/Download"
		},
		{
			"heading": void 0,
			"content": "Continuing transfer from breakpoint after network interruption"
		},
		{
			"heading": void 0,
			"content": "54"
		},
		{
			"heading": void 0,
			"content": "Mirror Back to Source"
		},
		{
			"heading": void 0,
			"content": "Pulling and saving from specified origin when requested object doesn't exist"
		},
		{
			"heading": void 0,
			"content": "55"
		},
		{
			"heading": void 0,
			"content": "Canary Release"
		},
		{
			"heading": void 0,
			"content": "Release strategy gradually opening new features to some users"
		},
		{
			"heading": void 0,
			"content": "56"
		},
		{
			"heading": void 0,
			"content": "Soft Delete"
		},
		{
			"heading": void 0,
			"content": "Marking objects for deletion while maintaining recovery period"
		},
		{
			"heading": void 0,
			"content": "57"
		},
		{
			"heading": void 0,
			"content": "Object Lock"
		},
		{
			"heading": void 0,
			"content": "Compliance protection mechanism preventing object deletion or overwriting"
		},
		{
			"heading": void 0,
			"content": "58"
		},
		{
			"heading": void 0,
			"content": "Watermarking"
		},
		{
			"heading": void 0,
			"content": "Adding identification information to images/videos"
		},
		{
			"heading": void 0,
			"content": "59"
		},
		{
			"heading": void 0,
			"content": "Thumbnail Generation"
		},
		{
			"heading": void 0,
			"content": "Automatically creating thumbnail versions of images"
		},
		{
			"heading": void 0,
			"content": "60"
		},
		{
			"heading": void 0,
			"content": "Image Processing"
		},
		{
			"heading": void 0,
			"content": "Online cropping/scaling/rotation processing functions"
		},
		{
			"heading": void 0,
			"content": "61"
		},
		{
			"heading": void 0,
			"content": "Video Transcoding"
		},
		{
			"heading": void 0,
			"content": "Converting video formats/resolutions for different devices"
		},
		{
			"heading": void 0,
			"content": "62"
		},
		{
			"heading": void 0,
			"content": "Content Moderation"
		},
		{
			"heading": void 0,
			"content": "Automatically detecting inappropriate images/videos/text"
		},
		{
			"heading": void 0,
			"content": "63"
		},
		{
			"heading": void 0,
			"content": "Cost Analysis"
		},
		{
			"heading": void 0,
			"content": "Calculating costs by storage type/request count dimensions"
		},
		{
			"heading": void 0,
			"content": "64"
		},
		{
			"heading": void 0,
			"content": "Usage Monitoring"
		},
		{
			"heading": void 0,
			"content": "Real-time dashboard viewing storage/traffic/request counts"
		},
		{
			"heading": void 0,
			"content": "65"
		},
		{
			"heading": void 0,
			"content": "Storage Analytics"
		},
		{
			"heading": void 0,
			"content": "Tools analyzing storage patterns to optimize costs"
		},
		{
			"heading": void 0,
			"content": "66"
		},
		{
			"heading": void 0,
			"content": "Requester Pays"
		},
		{
			"heading": void 0,
			"content": "Billing model where data downloader bears the cost"
		},
		{
			"heading": void 0,
			"content": "67"
		},
		{
			"heading": void 0,
			"content": "Tiered Storage"
		},
		{
			"heading": void 0,
			"content": "Automatically moving data to lower-cost storage tiers"
		},
		{
			"heading": void 0,
			"content": "68"
		},
		{
			"heading": void 0,
			"content": "Intelligent Tiering"
		},
		{
			"heading": void 0,
			"content": "Automatically selecting optimal storage type based on access patterns"
		},
		{
			"heading": void 0,
			"content": "69"
		},
		{
			"heading": void 0,
			"content": "PrivateLink"
		},
		{
			"heading": void 0,
			"content": "Accessing object storage through internal network avoiding public exposure"
		},
		{
			"heading": void 0,
			"content": "70"
		},
		{
			"heading": void 0,
			"content": "VPC Endpoint"
		},
		{
			"heading": void 0,
			"content": "Entry point for securely accessing storage services within Virtual Private Cloud"
		},
		{
			"heading": void 0,
			"content": "71"
		},
		{
			"heading": void 0,
			"content": "SSL/TLS"
		},
		{
			"heading": void 0,
			"content": "Encrypting data transmission through HTTPS protocol"
		},
		{
			"heading": void 0,
			"content": "72"
		},
		{
			"heading": void 0,
			"content": "Client-Side Encryption"
		},
		{
			"heading": void 0,
			"content": "Users encrypting data themselves before upload"
		},
		{
			"heading": void 0,
			"content": "73"
		},
		{
			"heading": void 0,
			"content": "KMS"
		},
		{
			"heading": void 0,
			"content": "Key Management Service for centralized encryption key management"
		},
		{
			"heading": void 0,
			"content": "74"
		},
		{
			"heading": void 0,
			"content": "Permission Boundary"
		},
		{
			"heading": void 0,
			"content": "Limiting maximum permission scope of IAM roles/users"
		},
		{
			"heading": void 0,
			"content": "75"
		},
		{
			"heading": void 0,
			"content": "Temporary Credentials"
		},
		{
			"heading": void 0,
			"content": "Short-term valid access tokens (e.g., STS Token)"
		},
		{
			"heading": void 0,
			"content": "76"
		},
		{
			"heading": void 0,
			"content": "MFA Delete"
		},
		{
			"heading": void 0,
			"content": "Requiring multi-factor authentication to delete data"
		},
		{
			"heading": void 0,
			"content": "77"
		},
		{
			"heading": void 0,
			"content": "Immutability"
		},
		{
			"heading": void 0,
			"content": "Property preventing data tampering (combined with WORM model)"
		},
		{
			"heading": void 0,
			"content": "78"
		},
		{
			"heading": void 0,
			"content": "Legal Hold"
		},
		{
			"heading": void 0,
			"content": "Mandatory protection prohibiting data deletion/modification in compliance scenarios"
		},
		{
			"heading": void 0,
			"content": "79"
		},
		{
			"heading": void 0,
			"content": "Cross-Account Sharing"
		},
		{
			"heading": void 0,
			"content": "Allowing other cloud accounts to access specified storage resources"
		},
		{
			"heading": void 0,
			"content": "80"
		},
		{
			"heading": void 0,
			"content": "Prefetch Policy"
		},
		{
			"heading": void 0,
			"content": "Loading data into cache in advance to accelerate subsequent access"
		},
		{
			"heading": void 0,
			"content": "81"
		},
		{
			"heading": void 0,
			"content": "Cache-Control"
		},
		{
			"heading": void 0,
			"content": "Specifying browser/CDN caching behavior through HTTP headers"
		},
		{
			"heading": void 0,
			"content": "82"
		},
		{
			"heading": void 0,
			"content": "Delayed Deletion"
		},
		{
			"heading": void 0,
			"content": "Delaying deletion operations to prevent accidental actions"
		},
		{
			"heading": void 0,
			"content": "83"
		},
		{
			"heading": void 0,
			"content": "Batch Operations"
		},
		{
			"heading": void 0,
			"content": "Performing unified operations on multiple objects (delete/copy/restore)"
		},
		{
			"heading": void 0,
			"content": "84"
		},
		{
			"heading": void 0,
			"content": "Data Lineage"
		},
		{
			"heading": void 0,
			"content": "Metadata records tracking data sources and change history"
		},
		{
			"heading": void 0,
			"content": "85"
		},
		{
			"heading": void 0,
			"content": "Data Catalog"
		},
		{
			"heading": void 0,
			"content": "Retrieval system storing metadata information"
		},
		{
			"heading": void 0,
			"content": "86"
		},
		{
			"heading": void 0,
			"content": "Storage Gateway"
		},
		{
			"heading": void 0,
			"content": "Hybrid cloud solution connecting local systems with cloud storage"
		},
		{
			"heading": void 0,
			"content": "87"
		},
		{
			"heading": void 0,
			"content": "Hybrid Cloud Storage"
		},
		{
			"heading": void 0,
			"content": "Architecture using both local storage and cloud storage"
		},
		{
			"heading": void 0,
			"content": "88"
		},
		{
			"heading": void 0,
			"content": "Edge Storage"
		},
		{
			"heading": void 0,
			"content": "Providing storage services at edge nodes close to data sources"
		},
		{
			"heading": void 0,
			"content": "89"
		},
		{
			"heading": void 0,
			"content": "Multi-Cloud Storage"
		},
		{
			"heading": void 0,
			"content": "Storage solutions across different cloud service providers"
		},
		{
			"heading": void 0,
			"content": "90"
		},
		{
			"heading": void 0,
			"content": "Storage Federation"
		},
		{
			"heading": void 0,
			"content": "Abstraction layer for unified management of multiple storage systems"
		},
		{
			"heading": void 0,
			"content": "91"
		},
		{
			"heading": void 0,
			"content": "Object Tag"
		},
		{
			"heading": void 0,
			"content": "Adding custom classification tags to objects"
		},
		{
			"heading": void 0,
			"content": "92"
		},
		{
			"heading": void 0,
			"content": "Bucket Tag"
		},
		{
			"heading": void 0,
			"content": "Adding management/billing related tags to buckets"
		},
		{
			"heading": void 0,
			"content": "93"
		},
		{
			"heading": void 0,
			"content": "Storage Quota"
		},
		{
			"heading": void 0,
			"content": "Limiting maximum capacity of buckets"
		},
		{
			"heading": void 0,
			"content": "94"
		},
		{
			"heading": void 0,
			"content": "Request Throttling"
		},
		{
			"heading": void 0,
			"content": "Limiting API requests per unit time"
		},
		{
			"heading": void 0,
			"content": "95"
		},
		{
			"heading": void 0,
			"content": "SLA"
		},
		{
			"heading": void 0,
			"content": "Service Level Agreement commitments for availability/durability (e.g., 99.9% availability)"
		},
		{
			"heading": void 0,
			"content": "96"
		},
		{
			"heading": void 0,
			"content": "Disaster Recovery"
		},
		{
			"heading": void 0,
			"content": "Ensuring business continuity through cross-region backups"
		},
		{
			"heading": void 0,
			"content": "97"
		},
		{
			"heading": void 0,
			"content": "Storage Topology"
		},
		{
			"heading": void 0,
			"content": "Distribution structure of data at physical/logical levels"
		},
		{
			"heading": void 0,
			"content": "98"
		},
		{
			"heading": void 0,
			"content": "Proximity Access"
		},
		{
			"heading": void 0,
			"content": "Routing user requests to nearest storage nodes"
		},
		{
			"heading": void 0,
			"content": "99"
		},
		{
			"heading": void 0,
			"content": "Global Namespace"
		},
		{
			"heading": void 0,
			"content": "Unified view management of cross-region buckets"
		},
		{
			"heading": void 0,
			"content": "100"
		},
		{
			"heading": void 0,
			"content": "Zero-Copy Migration"
		},
		{
			"heading": void 0,
			"content": "Fast data migration through metadata operations"
		}
	],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	const _components = {
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "No." }),
		(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Term" }),
		(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Description" })
	] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Object Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "An architecture where data is stored as objects, replacing traditional file hierarchy structures" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Bucket" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "A container for storing objects with globally unique namespace" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "3" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Object" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Basic storage unit containing data, metadata, and unique identifier (Object Key)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Key-value pair information describing object attributes (such as file type, creation time)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "5" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "S3-Compatible" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage services compatible with Amazon S3 API standards" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "6" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Durability" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "The probability that data remains intact and accessible over a period of time (e.g., 99.999999999%)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "7" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Replication" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Redundancy technology that ensures data safety through multiple copies" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "8" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Erasure Coding" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "A method of data protection in which data is broken into fragments, expanded and encoded with redundant data pieces" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "9" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cold Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low-cost storage type for infrequently accessed data (such as archived data)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "10" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Lifecycle Management" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "11" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Versioning" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Retaining historical versions of objects to prevent overwriting" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "12" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Class" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Different performance/cost storage tiers (Standard, Infrequent Access, Archive)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "13" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Access Key" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Authentication keys for API requests (Access Key ID + Secret Access Key)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "14" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Region" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Geographic location of storage infrastructure (e.g., East China 1, US West)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "15" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Availability Zone (AZ)" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Isolated data centers with independent power/network within the same region" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "16" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Endpoint" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Domain address for accessing storage service (e.g., us-east1.rustfs.com)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "17" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "RESTful API" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "API design specification based on HTTP protocol" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "18" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Multipart Upload" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Mechanism for splitting large files for upload and merging" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "19" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Pre-Signed URL" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Temporary access links with time validity" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "20" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Server-Side Encryption (SSE)" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "21" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Client-Side Encryption (CSE)" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Local encryption on client side before upload" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "22" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cross-Region Replication" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatic object replication across geographic regions" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "23" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Access Control List (ACL)" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Rule list controlling access permissions for buckets/objects" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "24" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Bucket Policy" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "JSON-based fine-grained permission control policies" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "25" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "IAM" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Identity and Access Management system for centralized user/role permission management" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "26" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Event Notification" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Sending notifications to message queues/function computing when events trigger" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "27" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Lake" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Repository for centralized storage of structured/unstructured data" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "28" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Compliance" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Meeting data storage regulatory requirements like GDPR, HIPAA" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "29" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Logging & Audit" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Recording all API operation logs for auditing" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "30" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Monitoring & Alerting" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Real-time monitoring of storage usage/requests with alerting" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "31" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "CORS" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Rules controlling browser cross-origin resource access" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "32" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Transfer Acceleration" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Optimizing upload/download speed through edge nodes" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "33" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "CDN Integration" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Combining with Content Delivery Network for caching acceleration" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "34" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Export" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Process of migrating data to other storage systems" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "35" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Import" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Batch data migration from external systems to object storage" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "36" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Static Website Hosting" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Directly hosting HTML/CSS/JS static files through buckets" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "37" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hotlink Protection" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Technology preventing external websites from stealing resource links" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "38" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Request Rate Limiting" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Controlling API request frequency per user/IP" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "39" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Tagging" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Adding classification tags to buckets/objects for management" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "40" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Inventory Report" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Periodically generated CSV/ORC files listing storage objects" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "41" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Restoration" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Restoring data from archive storage to accessible state" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "42" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Gateway" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Access layer mapping object storage as local file system" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "43" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Compression" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Compressing data before upload to save storage space" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "44" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Deduplication" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Eliminating duplicate data to reduce storage usage" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "45" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Direct Read Archive" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Technology for directly reading archived data without restoration" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "46" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Bandwidth Control" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Limiting download bandwidth to avoid network congestion" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "47" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Concurrent Connections" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Number of simultaneous data transfer connections" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "48" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Migration Service" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automated migration tools (e.g., AWS Snowball)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "49" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Client SDK" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Developer toolkits for integrating storage services (e.g., Python/Java SDK)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "50" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "CLI" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Command line management tools (e.g., aws s3 cp)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "51" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Web Console" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Web-based management interface" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "52" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Integrity Check" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Verifying transmission integrity through MD5/SHA" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "53" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Resumable Upload/Download" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Continuing transfer from breakpoint after network interruption" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "54" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Mirror Back to Source" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Pulling and saving from specified origin when requested object doesn't exist" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "55" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Canary Release" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Release strategy gradually opening new features to some users" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "56" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Soft Delete" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Marking objects for deletion while maintaining recovery period" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "57" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Object Lock" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Compliance protection mechanism preventing object deletion or overwriting" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "58" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Watermarking" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Adding identification information to images/videos" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "59" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Thumbnail Generation" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatically creating thumbnail versions of images" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "60" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Image Processing" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Online cropping/scaling/rotation processing functions" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "61" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Video Transcoding" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Converting video formats/resolutions for different devices" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "62" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Content Moderation" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatically detecting inappropriate images/videos/text" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "63" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cost Analysis" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Calculating costs by storage type/request count dimensions" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "64" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Usage Monitoring" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Real-time dashboard viewing storage/traffic/request counts" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "65" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Analytics" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Tools analyzing storage patterns to optimize costs" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "66" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Requester Pays" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Billing model where data downloader bears the cost" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "67" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Tiered Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatically moving data to lower-cost storage tiers" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "68" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Intelligent Tiering" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Automatically selecting optimal storage type based on access patterns" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "69" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "PrivateLink" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Accessing object storage through internal network avoiding public exposure" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "70" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "VPC Endpoint" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Entry point for securely accessing storage services within Virtual Private Cloud" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "71" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "SSL/TLS" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Encrypting data transmission through HTTPS protocol" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "72" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Client-Side Encryption" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Users encrypting data themselves before upload" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "73" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "KMS" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Key Management Service for centralized encryption key management" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "74" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Permission Boundary" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Limiting maximum permission scope of IAM roles/users" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "75" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Temporary Credentials" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Short-term valid access tokens (e.g., STS Token)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "76" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "MFA Delete" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Requiring multi-factor authentication to delete data" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "77" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Immutability" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Property preventing data tampering (combined with WORM model)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "78" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Legal Hold" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Mandatory protection prohibiting data deletion/modification in compliance scenarios" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "79" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cross-Account Sharing" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Allowing other cloud accounts to access specified storage resources" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "80" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Prefetch Policy" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Loading data into cache in advance to accelerate subsequent access" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "81" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cache-Control" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Specifying browser/CDN caching behavior through HTTP headers" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "82" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Delayed Deletion" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Delaying deletion operations to prevent accidental actions" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "83" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Batch Operations" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Performing unified operations on multiple objects (delete/copy/restore)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "84" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Lineage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata records tracking data sources and change history" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "85" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Data Catalog" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Retrieval system storing metadata information" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "86" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Gateway" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hybrid cloud solution connecting local systems with cloud storage" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "87" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hybrid Cloud Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Architecture using both local storage and cloud storage" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "88" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Edge Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Providing storage services at edge nodes close to data sources" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "89" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Multi-Cloud Storage" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage solutions across different cloud service providers" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "90" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Federation" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Abstraction layer for unified management of multiple storage systems" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "91" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Object Tag" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Adding custom classification tags to objects" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "92" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Bucket Tag" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Adding management/billing related tags to buckets" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "93" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Quota" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Limiting maximum capacity of buckets" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "94" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Request Throttling" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Limiting API requests per unit time" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "95" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "SLA" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Service Level Agreement commitments for availability/durability (e.g., 99.9% availability)" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "96" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Disaster Recovery" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Ensuring business continuity through cross-region backups" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "97" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage Topology" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Distribution structure of data at physical/logical levels" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "98" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Proximity Access" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Routing user requests to nearest storage nodes" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "99" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Global Namespace" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Unified view management of cross-region buckets" })
		] }),
		(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "100" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Zero-Copy Migration" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Fast data migration through metadata operations" })
		] })
	] })] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime_react_server.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime_react_server.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
