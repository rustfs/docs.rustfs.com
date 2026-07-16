import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/developer/sdk/java.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Java SDK Guide",
	"description": "Guide to using the Java SDK with RustFS."
};
var _markdown = "\n\nRustFS is S3-compatible. This guide demonstrates how to use the AWS SDK for Java v2 with RustFS.\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Setup [#1-setup]\n\n    ### 1.1 Maven Project Setup [#11-maven-project-setup]\n\n    Create a new Maven project:\n\n    ```\n    rustfs-java-s3-demo/\n    ├── pom.xml\n    └── src/\n     └── main/\n     └── java/\n     └── com/\n     └── example/\n     └── RustfsS3Example.java\n    ```\n\n    ### 1.2 Add Dependencies [#12-add-dependencies]\n\n    Add AWS SDK dependencies in `pom.xml`:\n\n    ```xml\n    <dependencies>\n     <dependency>\n     <groupId>software.amazon.awssdk</groupId>\n     <artifactId>s3</artifactId>\n     <version>2.25.27</version>\n     </dependency>\n    </dependencies>\n    ```\n\n    > Recommend using AWS SDK v2, which has more complete features and supports async, reactive, and other patterns.\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Connecting to RustFS [#2-connecting-to-rustfs]\n\n    ### 2.1 Initialize the Client [#21-initialize-the-client]\n\n    ```java\n    package com.example;\n\n    import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;\n    import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;\n    import software.amazon.awssdk.regions.Region;\n    import software.amazon.awssdk.services.s3.S3Client;\n    import software.amazon.awssdk.services.s3.model.*;\n\n    import java.net.URI;\n    import java.nio.file.Paths;\n\n    public class RustfsS3Example {\n\n     public static void main(String[] args) {\n     // 1. Initialize S3 client\n     S3Client s3 = S3Client.builder()\n     .endpointOverride(URI.create(\"http://192.168.1.100:9000\")) // RustFS address\n     .region(Region.US_EAST_1) // RustFS does not validate regions\n     .credentialsProvider(\n     StaticCredentialsProvider.create(\n     // Use a unique access key and a strong secret (e.g. openssl rand -base64 24)\n     AwsBasicCredentials.create(\"<your-access-key>\", \"<your-secret-key>\")\n     )\n     )\n     .forcePathStyle(true) // Required for RustFS compatibility\n     .build();\n\n     // 2. Create Bucket\n     String bucket = \"my-bucket\";\n     try {\n     s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());\n     System.out.println(\"Bucket created: \" + bucket);\n     } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {\n     System.out.println(\"Bucket already exists.\");\n     }\n\n     // 3. Upload file\n     s3.putObject(\n     PutObjectRequest.builder().bucket(bucket).key(\"hello.txt\").build(),\n     Paths.get(\"hello.txt\")\n     );\n     System.out.println(\"Uploaded hello.txt\");\n\n     // 4. Download file\n     s3.getObject(\n     GetObjectRequest.builder().bucket(bucket).key(\"hello.txt\").build(),\n     Paths.get(\"downloaded-hello.txt\")\n     );\n     System.out.println(\"Downloaded hello.txt\");\n\n     // 5. List objects\n     ListObjectsV2Response listResponse = s3.listObjectsV2(ListObjectsV2Request.builder().bucket(bucket).build());\n     listResponse.contents().forEach(obj -> System.out.println(\"Found object: \" + obj.key()));\n\n     // 6. Delete object\n     s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(\"hello.txt\").build());\n     System.out.println(\"Deleted hello.txt\");\n\n     // 7. Delete bucket (optional)\n     // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());\n     }\n    }\n    ```\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Common Issues and Troubleshooting [#3-common-issues-and-troubleshooting]\n\n    | Issue                                  | Cause                                                                    | Solution                                                 |\n    | -------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |\n    | `S3Exception: 301 Moved Permanently`   | Path-style not enabled or region error                                   | Set `.forcePathStyle(true)` and use any value for region |\n    | `ConnectException: Connection refused` | RustFS not started or incorrect port                                     | Check RustFS status and port                             |\n    | `403 Forbidden`                        | AccessKey / SecretKey error                                              | Check authentication configuration                       |\n    | Upload fails with no response          | SDK defaults to HTTPS, RustFS only supports HTTP (or needs certificates) | Use `http://` address and configure `endpointOverride`   |\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Appendix [#4-appendix]\n\n    ### 4.1 Maven Package and Run [#41-maven-package-and-run]\n\n    Package project:\n\n    ```bash\n    mvn clean package\n    ```\n\n    Execute:\n\n    ```bash\n    java -cp target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar com.example.RustfsS3Example\n    ```\n\n    ### 4.2 RustFS Configuration Recommendations [#42-rustfs-configuration-recommendations]\n\n    * Ensure SSL validation is disabled when service uses HTTP protocol.\n    * Enable CORS support (if used for web frontend).\n    * Recommend setting limits like `max_object_size` and `max_part_size` to prevent large file transfer failures.\n\n    ***\n\n    Good, below is the **RustFS AWS S3 Java SDK Advanced Features Example Supplement**, including:\n\n    * Presigned URL generation and usage\n    * Multipart Upload complete process\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Java Advanced Features Examples [#5-java-advanced-features-examples]\n\n    ### 5.1 Generate and Use Presigned URLs [#51-generate-and-use-presigned-urls]\n\n    > Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download file scenarios.\n\n    #### 5.1.1 Generate Download Link (GET) [#511-generate-download-link-get]\n\n    ```java\n    import software.amazon.awssdk.services.s3.presigner.S3Presigner;\n    import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;\n\n    S3Presigner presigner = S3Presigner.builder()\n     .endpointOverride(URI.create(\"http://192.168.1.100:9000\"))\n     .region(Region.US_EAST_1)\n     .credentialsProvider(\n     StaticCredentialsProvider.create(\n     // Use a unique access key and a strong secret (e.g. openssl rand -base64 24)\n     AwsBasicCredentials.create(\"<your-access-key>\", \"<your-secret-key>\")\n     )\n     )\n     .build();\n\n    GetObjectRequest getObjectRequest = GetObjectRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"hello.txt\")\n     .build();\n\n    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()\n     .getObjectRequest(getObjectRequest)\n     .signatureDuration(Duration.ofMinutes(15)) // 15 minutes validity\n     .build();\n\n    PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);\n\n    System.out.println(\"Presigned URL: \" + presignedRequest.url());\n    ```\n\n    > 🔗 Open the link in browser to access the object.\n\n    #### 5.1.2 Upload Presigned URL (PUT) [#512-upload-presigned-url-put]\n\n    Similarly, you can also generate upload URLs:\n\n    ```java\n    PutObjectRequest putRequest = PutObjectRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"upload.txt\")\n     .build();\n\n    PresignedPutObjectRequest presignedPut = presigner.presignPutObject(\n     PutObjectPresignRequest.builder()\n     .putObjectRequest(putRequest)\n     .signatureDuration(Duration.ofMinutes(10))\n     .build()\n    );\n\n    System.out.println(\"Upload URL: \" + presignedPut.url());\n    ```\n\n    ***\n\n    ### 5.2 Implement Multipart Upload [#52-implement-multipart-upload]\n\n    > Multipart Upload is the recommended way for large file uploads, enabling resume from breakpoint during network fluctuations.\n\n    #### 5.2.1 Start Multipart Upload [#521-start-multipart-upload]\n\n    ```java\n    CreateMultipartUploadRequest createRequest = CreateMultipartUploadRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"bigfile.zip\")\n     .build();\n\n    CreateMultipartUploadResponse createResponse = s3.createMultipartUpload(createRequest);\n    String uploadId = createResponse.uploadId();\n    ```\n\n    #### 5.2.2 Upload Each Part [#522-upload-each-part]\n\n    ```java\n    List<CompletedPart> completedParts = new ArrayList<>();\n    for (int i = 1; i <= 3; i++) {\n     String partPath = \"part\" + i + \".bin\"; // Assume each part is a local file\n     UploadPartRequest uploadPartRequest = UploadPartRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"bigfile.zip\")\n     .uploadId(uploadId)\n     .partNumber(i)\n     .build();\n\n     UploadPartResponse uploadPartResponse = s3.uploadPart(uploadPartRequest, Paths.get(partPath));\n     completedParts.add(\n     CompletedPart.builder()\n     .partNumber(i)\n     .eTag(uploadPartResponse.eTag())\n     .build()\n     );\n    }\n    ```\n\n    #### 5.2.3 Complete Multipart Upload [#523-complete-multipart-upload]\n\n    ```java\n    CompletedMultipartUpload completedUpload = CompletedMultipartUpload.builder()\n     .parts(completedParts)\n     .build();\n\n    CompleteMultipartUploadRequest completeRequest = CompleteMultipartUploadRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"bigfile.zip\")\n     .uploadId(uploadId)\n     .multipartUpload(completedUpload)\n     .build();\n\n    s3.completeMultipartUpload(completeRequest);\n    System.out.println(\"Multipart upload completed.\");\n    ```\n\n    #### 5.2.4 Abort Upload on Exception (Optional) [#524-abort-upload-on-exception-optional]\n\n    ```java\n    AbortMultipartUploadRequest abortRequest = AbortMultipartUploadRequest.builder()\n     .bucket(\"my-bucket\")\n     .key(\"bigfile.zip\")\n     .uploadId(uploadId)\n     .build();\n\n    s3.abortMultipartUpload(abortRequest);\n    ```\n\n    ***\n  </div>\n</div>\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS is S3-compatible. This guide demonstrates how to use the AWS SDK for Java v2 with RustFS."
		},
		{
			"heading": "11-maven-project-setup",
			"content": "Create a new Maven project:"
		},
		{
			"heading": "12-add-dependencies",
			"content": "Add AWS SDK dependencies in `pom.xml`:"
		},
		{
			"heading": "12-add-dependencies",
			"content": "> Recommend using AWS SDK v2, which has more complete features and supports async, reactive, and other patterns."
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Issue"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Cause"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Solution"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "`S3Exception: 301 Moved Permanently`"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Path-style not enabled or region error"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Set `.forcePathStyle(true)` and use any value for region"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "`ConnectException: Connection refused`"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "RustFS not started or incorrect port"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Check RustFS status and port"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "`403 Forbidden`"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "AccessKey / SecretKey error"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Check authentication configuration"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Upload fails with no response"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "SDK defaults to HTTPS, RustFS only supports HTTP (or needs certificates)"
		},
		{
			"heading": "3-common-issues-and-troubleshooting",
			"content": "Use `http://` address and configure `endpointOverride`"
		},
		{
			"heading": "41-maven-package-and-run",
			"content": "Package project:"
		},
		{
			"heading": "41-maven-package-and-run",
			"content": "Execute:"
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Ensure SSL validation is disabled when service uses HTTP protocol."
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Enable CORS support (if used for web frontend)."
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Recommend setting limits like `max_object_size` and `max_part_size` to prevent large file transfer failures."
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Good, below is the **RustFS AWS S3 Java SDK Advanced Features Example Supplement**, including:"
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Presigned URL generation and usage"
		},
		{
			"heading": "42-rustfs-configuration-recommendations",
			"content": "Multipart Upload complete process"
		},
		{
			"heading": "51-generate-and-use-presigned-urls",
			"content": "> Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download file scenarios."
		},
		{
			"heading": "511-generate-download-link-get",
			"content": "> 🔗 Open the link in browser to access the object."
		},
		{
			"heading": "512-upload-presigned-url-put",
			"content": "Similarly, you can also generate upload URLs:"
		},
		{
			"heading": "52-implement-multipart-upload",
			"content": "> Multipart Upload is the recommended way for large file uploads, enabling resume from breakpoint during network fluctuations."
		}
	],
	"headings": [
		{
			"id": "1-setup",
			"content": "1\\. Setup"
		},
		{
			"id": "11-maven-project-setup",
			"content": "1.1 Maven Project Setup"
		},
		{
			"id": "12-add-dependencies",
			"content": "1.2 Add Dependencies"
		},
		{
			"id": "2-connecting-to-rustfs",
			"content": "2\\. Connecting to RustFS"
		},
		{
			"id": "21-initialize-the-client",
			"content": "2.1 Initialize the Client"
		},
		{
			"id": "3-common-issues-and-troubleshooting",
			"content": "3\\. Common Issues and Troubleshooting"
		},
		{
			"id": "4-appendix",
			"content": "4\\. Appendix"
		},
		{
			"id": "41-maven-package-and-run",
			"content": "4.1 Maven Package and Run"
		},
		{
			"id": "42-rustfs-configuration-recommendations",
			"content": "4.2 RustFS Configuration Recommendations"
		},
		{
			"id": "5-java-advanced-features-examples",
			"content": "5\\. Java Advanced Features Examples"
		},
		{
			"id": "51-generate-and-use-presigned-urls",
			"content": "5.1 Generate and Use Presigned URLs"
		},
		{
			"id": "511-generate-download-link-get",
			"content": "5.1.1 Generate Download Link (GET)"
		},
		{
			"id": "512-upload-presigned-url-put",
			"content": "5.1.2 Upload Presigned URL (PUT)"
		},
		{
			"id": "52-implement-multipart-upload",
			"content": "5.2 Implement Multipart Upload"
		},
		{
			"id": "521-start-multipart-upload",
			"content": "5.2.1 Start Multipart Upload"
		},
		{
			"id": "522-upload-each-part",
			"content": "5.2.2 Upload Each Part"
		},
		{
			"id": "523-complete-multipart-upload",
			"content": "5.2.3 Complete Multipart Upload"
		},
		{
			"id": "524-abort-upload-on-exception-optional",
			"content": "5.2.4 Abort Upload on Exception (Optional)"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-setup",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Setup" }),
		_step: 1
	},
	{
		depth: 3,
		url: "#11-maven-project-setup",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.1 Maven Project Setup" })
	},
	{
		depth: 3,
		url: "#12-add-dependencies",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "1.2 Add Dependencies" })
	},
	{
		depth: 2,
		url: "#2-connecting-to-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Connecting to RustFS" }),
		_step: 2
	},
	{
		depth: 3,
		url: "#21-initialize-the-client",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1 Initialize the Client" })
	},
	{
		depth: 2,
		url: "#3-common-issues-and-troubleshooting",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Common Issues and Troubleshooting" }),
		_step: 3
	},
	{
		depth: 2,
		url: "#4-appendix",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Appendix" }),
		_step: 4
	},
	{
		depth: 3,
		url: "#41-maven-package-and-run",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.1 Maven Package and Run" })
	},
	{
		depth: 3,
		url: "#42-rustfs-configuration-recommendations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.2 RustFS Configuration Recommendations" })
	},
	{
		depth: 2,
		url: "#5-java-advanced-features-examples",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Java Advanced Features Examples" }),
		_step: 5
	},
	{
		depth: 3,
		url: "#51-generate-and-use-presigned-urls",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1 Generate and Use Presigned URLs" })
	},
	{
		depth: 4,
		url: "#511-generate-download-link-get",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1.1 Generate Download Link (GET)" })
	},
	{
		depth: 4,
		url: "#512-upload-presigned-url-put",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1.2 Upload Presigned URL (PUT)" })
	},
	{
		depth: 3,
		url: "#52-implement-multipart-upload",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2 Implement Multipart Upload" })
	},
	{
		depth: 4,
		url: "#521-start-multipart-upload",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2.1 Start Multipart Upload" })
	},
	{
		depth: 4,
		url: "#522-upload-each-part",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2.2 Upload Each Part" })
	},
	{
		depth: 4,
		url: "#523-complete-multipart-upload",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2.3 Complete Multipart Upload" })
	},
	{
		depth: 4,
		url: "#524-abort-upload-on-exception-optional",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2.4 Abort Upload on Exception (Optional)" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		div: "div",
		h2: "h2",
		h3: "h3",
		h4: "h4",
		hr: "hr",
		li: "li",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is S3-compatible. This guide demonstrates how to use the AWS SDK for Java v2 with RustFS." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
			className: "fd-steps",
			children: [
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "1-setup",
							"data-fd-step": "1",
							children: "Setup"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "11-maven-project-setup",
							children: "1.1 Maven Project Setup"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Create a new Maven project:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "rustfs-java-s3-demo/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "├── pom.xml" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "└── src/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: " └── main/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: " └── java/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: " └── com/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: " └── example/" })
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: " └── RustfsS3Example.java" })
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "12-add-dependencies",
							children: "1.2 Add Dependencies"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Add AWS SDK dependencies in ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "pom.xml" }),
							":"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "<"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "dependencies"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "dependency"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "groupId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">software.amazon.awssdk</"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "groupId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "artifactId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">s3</"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "artifactId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " <"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "version"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">2.25.27</"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "version"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " </"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "dependency"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "</"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#22863A",
												"--shiki-dark": "#85E89D"
											},
											children: "dependencies"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ">"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Recommend using AWS SDK v2, which has more complete features and supports async, reactive, and other patterns." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "2-connecting-to-rustfs",
							"data-fd-step": "2",
							children: "Connecting to RustFS"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "21-initialize-the-client",
							children: "2.1 Initialize the Client"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "package"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " com.example;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.auth.credentials.AwsBasicCredentials;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.regions.Region;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.services.s3.S3Client;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "import"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " software.amazon.awssdk.services.s3.model."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "*"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ";"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " java.net.URI;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " java.nio.file.Paths;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "public"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " class"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: " RustfsS3Example"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " {"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " public"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " static"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " void"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: " main"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "String"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "[] "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#E36209",
												"--shiki-dark": "#FFAB70"
											},
											children: "args"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ") {"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 1. Initialize S3 client"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " S3Client s3 "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " S3Client."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "endpointOverride"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(URI."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"http://192.168.1.100:9000\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")) "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6A737D",
												"--shiki-dark": "#6A737D"
											},
											children: "// RustFS address"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "region"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(Region.US_EAST_1) "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6A737D",
												"--shiki-dark": "#6A737D"
											},
											children: "// RustFS does not validate regions"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "credentialsProvider"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " StaticCredentialsProvider."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // Use a unique access key and a strong secret (e.g. openssl rand -base64 24)"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " AwsBasicCredentials."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ", "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"<your-secret-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " )"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " )"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "forcePathStyle"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "true"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ") "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6A737D",
												"--shiki-dark": "#6A737D"
											},
											children: "// Required for RustFS compatibility"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 2. Create Bucket"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " String bucket "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ";"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: " try"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " {"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "createBucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(CreateBucketRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(bucket)."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "());"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Bucket created: \""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " +"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " bucket);"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " } "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "catch"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#E36209",
												"--shiki-dark": "#FFAB70"
											},
											children: "e"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ") {"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Bucket already exists.\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ");"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " }"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 3. Upload file"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "putObject"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " PutObjectRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(bucket)."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(),"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " Paths."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "get"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " );"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Uploaded hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ");"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 4. Download file"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "getObject"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " GetObjectRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(bucket)."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(),"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " Paths."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "get"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"downloaded-hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " );"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Downloaded hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ");"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 5. List objects"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ListObjectsV2Response listResponse "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "listObjectsV2"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(ListObjectsV2Request."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(bucket)."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "());"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " listResponse."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "contents"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "forEach"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(obj "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "->"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Found object: \""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " +"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " obj."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()));"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 6. Delete object"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "deleteObject"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(DeleteObjectRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(bucket)."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "());"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Deleted hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ");"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // 7. Delete bucket (optional)"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // s3.deleteBucket(DeleteBucketRequest.builder().bucket(bucket).build());"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " }"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "}"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "3-common-issues-and-troubleshooting",
							"data-fd-step": "3",
							children: "Common Issues and Troubleshooting"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Issue" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Cause" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Solution" })
						] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "S3Exception: 301 Moved Permanently" }) }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Path-style not enabled or region error" }),
								(0, import_jsx_runtime_react_server.jsxs)(_components.td, { children: [
									"Set ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: ".forcePathStyle(true)" }),
									" and use any value for region"
								] })
							] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "ConnectException: Connection refused" }) }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "RustFS not started or incorrect port" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check RustFS status and port" })
							] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "403 Forbidden" }) }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "AccessKey / SecretKey error" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check authentication configuration" })
							] }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Upload fails with no response" }),
								(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "SDK defaults to HTTPS, RustFS only supports HTTP (or needs certificates)" }),
								(0, import_jsx_runtime_react_server.jsxs)(_components.td, { children: [
									"Use ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "http://" }),
									" address and configure ",
									(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "endpointOverride" })
								] })
							] })
						] })] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "4-appendix",
							"data-fd-step": "4",
							children: "Appendix"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "41-maven-package-and-run",
							children: "4.1 Maven Package and Run"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Package project:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "mvn"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " clean"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " package"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Execute:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "java"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -cp"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " target/rustfs-java-s3-demo-1.0-SNAPSHOT.jar"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " com.example.RustfsS3Example"
									})
								]
							}) })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "42-rustfs-configuration-recommendations",
							children: "4.2 RustFS Configuration Recommendations"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Ensure SSL validation is disabled when service uses HTTP protocol." }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Enable CORS support (if used for web frontend)." }),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
								"Recommend setting limits like ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "max_object_size" }),
								" and ",
								(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "max_part_size" }),
								" to prevent large file transfer failures."
							] }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Good, below is the ",
							(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "RustFS AWS S3 Java SDK Advanced Features Example Supplement" }),
							", including:"
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Presigned URL generation and usage" }),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Multipart Upload complete process" }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				}),
				(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
					className: "fd-step",
					children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
							id: "5-java-advanced-features-examples",
							"data-fd-step": "5",
							children: "Java Advanced Features Examples"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "51-generate-and-use-presigned-urls",
							children: "5.1 Generate and Use Presigned URLs"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Presigned URLs allow clients to temporarily access private objects without exposing credentials, widely used for browser direct upload or download file scenarios." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "511-generate-download-link-get",
							children: "5.1.1 Generate Download Link (GET)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.services.s3.presigner.S3Presigner;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "import"
									}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;"
									})]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "S3Presigner presigner "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " S3Presigner."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "endpointOverride"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(URI."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"http://192.168.1.100:9000\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "))"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "region"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(Region.US_EAST_1)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "credentialsProvider"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " StaticCredentialsProvider."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " // Use a unique access key and a strong secret (e.g. openssl rand -base64 24)"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " AwsBasicCredentials."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "create"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"<your-access-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ", "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"<your-secret-key>\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " )"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " )"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "GetObjectRequest getObjectRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " GetObjectRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"hello.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "GetObjectPresignRequest presignRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " GetObjectPresignRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "getObjectRequest"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(getObjectRequest)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "signatureDuration"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(Duration."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "ofMinutes"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "15"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")) "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6A737D",
												"--shiki-dark": "#6A737D"
											},
											children: "// 15 minutes validity"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "PresignedGetObjectRequest presignedRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " presigner."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "presignGetObject"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(presignRequest);"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Presigned URL: \""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " +"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " presignedRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "url"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "());"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "🔗 Open the link in browser to access the object." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "512-upload-presigned-url-put",
							children: "5.1.2 Upload Presigned URL (PUT)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Similarly, you can also generate upload URLs:" }),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "PutObjectRequest putRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " PutObjectRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"upload.txt\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "PresignedPutObjectRequest presignedPut "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " presigner."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "presignPutObject"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " PutObjectPresignRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "putObjectRequest"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(putRequest)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "signatureDuration"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(Duration."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "ofMinutes"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: "10"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "))"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ");"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Upload URL: \""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " +"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " presignedPut."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "url"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "());"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
						(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
							id: "52-implement-multipart-upload",
							children: "5.2 Implement Multipart Upload"
						}),
						(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Multipart Upload is the recommended way for large file uploads, enabling resume from breakpoint during network fluctuations." }),
							"\n"
						] }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "521-start-multipart-upload",
							children: "5.2.1 Start Multipart Upload"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "CreateMultipartUploadRequest createRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " CreateMultipartUploadRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"bigfile.zip\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "CreateMultipartUploadResponse createResponse "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "createMultipartUpload"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(createRequest);"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "String uploadId "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " createResponse."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "uploadId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "522-upload-each-part",
							children: "5.2.2 Upload Each Part"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "List<"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "CompletedPart"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "> completedParts "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " new"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ArrayList<>();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "for"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "int"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " i "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " 1"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "; i "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "<="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#005CC5",
												"--shiki-dark": "#79B8FF"
											},
											children: " 3"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "; i"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "++"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ") {"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " String partPath "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \"part\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: " +"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " i "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "+"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: " \".bin\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "; "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6A737D",
												"--shiki-dark": "#6A737D"
											},
											children: "// Assume each part is a local file"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " UploadPartRequest uploadPartRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " UploadPartRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"bigfile.zip\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "uploadId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(uploadId)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "partNumber"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(i)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " UploadPartResponse uploadPartResponse "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "uploadPart"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(uploadPartRequest, Paths."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "get"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(partPath));"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " completedParts."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "add"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " CompletedPart."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "partNumber"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(i)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "eTag"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(uploadPartResponse."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "eTag"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "())"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " );"
									})
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									className: "line",
									children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "}"
									})
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "523-complete-multipart-upload",
							children: "5.2.3 Complete Multipart Upload"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "CompletedMultipartUpload completedUpload "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " CompletedMultipartUpload."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "parts"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(completedParts)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "CompleteMultipartUploadRequest completeRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " CompleteMultipartUploadRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"bigfile.zip\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "uploadId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(uploadId)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "multipartUpload"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(completedUpload)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "completeMultipartUpload"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(completeRequest);"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "System.out."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "println"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"Multipart upload completed.\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ");"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
							id: "524-abort-upload-on-exception-optional",
							children: "5.2.4 Abort Upload on Exception (Optional)"
						}),
						(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
							className: "shiki shiki-themes github-light github-dark",
							style: {
								"--shiki-light": "#24292e",
								"--shiki-dark": "#e1e4e8",
								"--shiki-light-bg": "#fff",
								"--shiki-dark-bg": "#24292e"
							},
							tabIndex: "0",
							icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
							children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "AbortMultipartUploadRequest abortRequest "
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#D73A49",
												"--shiki-dark": "#F97583"
											},
											children: "="
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " AbortMultipartUploadRequest."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "builder"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "()"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "bucket"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"my-bucket\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "key"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "("
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#032F62",
												"--shiki-dark": "#9ECBFF"
											},
											children: "\"bigfile.zip\""
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: ")"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "uploadId"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(uploadId)"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: " ."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "build"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "();"
										})
									]
								}),
								"\n",
								(0, import_jsx_runtime_react_server.jsx)(_components.span, { className: "line" }),
								"\n",
								(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
									className: "line",
									children: [
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "s3."
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#6F42C1",
												"--shiki-dark": "#B392F0"
											},
											children: "abortMultipartUpload"
										}),
										(0, import_jsx_runtime_react_server.jsx)(_components.span, {
											style: {
												"--shiki-light": "#24292E",
												"--shiki-dark": "#E1E4E8"
											},
											children: "(abortRequest);"
										})
									]
								})
							] })
						}) }),
						(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
					]
				})
			]
		})
	] });
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
