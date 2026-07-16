import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/developer/sdk/python.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Python SDK Guide",
	"description": "Guide to using the Python SDK with RustFS."
};
var _markdown = "\n\n<div className=\"fd-steps\">\n  <div className=\"fd-step\">\n    ## Overview [#1-overview]\n\n    RustFS is S3-compatible and supports the [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK.\n\n    This guide covers:\n\n    * Bucket creation/deletion\n    * Object upload/download/deletion\n    * Listing objects\n    * Generating presigned URLs\n    * Multipart upload for large files\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Environment Preparation [#2-environment-preparation]\n\n    ### 2.1 Example Configuration [#21-example-configuration]\n\n    Assume RustFS is deployed as follows:\n\n    ```\n    Endpoint: http://192.168.1.100:9000\n    AccessKey: <your-access-key>\n    SecretKey: <your-secret-key>\n    ```\n\n    ### 2.2 Install Boto3 [#22-install-boto3]\n\n    We recommend using a virtual environment:\n\n    ```bash\n    python3 -m venv venv\n    source venv/bin/activate\n    pip install boto3\n    ```\n\n    > Boto3 depends on `botocore`, which will be installed automatically.\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Connecting to RustFS [#3-connecting-to-rustfs]\n\n    ```python\n    import boto3\n    from botocore.client import Config\n\n    s3 = boto3.client(\n     's3',\n     endpoint_url='http://192.168.1.100:9000',\n     # Use a unique access key and a strong secret (e.g. openssl rand -base64 24)\n     aws_access_key_id='<your-access-key>',\n     aws_secret_access_key='<your-secret-key>',\n     config=Config(signature_version='s3v4'),\n     region_name='us-east-1'\n    )\n    ```\n\n    > ✅ `endpoint_url`: Points to RustFS\n    > ✅ `signature_version='s3v4'`: RustFS supports v4 signatures\n    > ✅ `region_name`: RustFS does not validate regions; you can use any value.\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Basic Operations [#4-basic-operations]\n\n    ### 4.1 Create Bucket [#41-create-bucket]\n\n    ```python\n    bucket_name = 'my-bucket'\n\n    try:\n     s3.create_bucket(Bucket=bucket_name)\n     print(f'Bucket {bucket_name} created.')\n    except s3.exceptions.BucketAlreadyOwnedByYou:\n     print(f'Bucket {bucket_name} already exists.')\n    ```\n\n    ***\n\n    ### 4.2 Upload File [#42-upload-file]\n\n    ```python\n    s3.upload_file('hello.txt', bucket_name, 'hello.txt')\n    print('File uploaded.')\n    ```\n\n    ***\n\n    ### 4.3 Download File [#43-download-file]\n\n    ```python\n    s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')\n    print('File downloaded.')\n    ```\n\n    ***\n\n    ### 4.4 List Objects [#44-list-objects]\n\n    ```python\n    response = s3.list_objects_v2(Bucket=bucket_name)\n    for obj in response.get('Contents', []):\n     print(f\"- {obj['Key']} ({obj['Size']} bytes)\")\n    ```\n\n    ***\n\n    ### 4.5 Delete Object and Bucket [#45-delete-object-and-bucket]\n\n    ```python\n    s3.delete_object(Bucket=bucket_name, Key='hello.txt')\n    print('Object deleted.')\n\n    s3.delete_bucket(Bucket=bucket_name)\n    print('Bucket deleted.')\n    ```\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Advanced Features [#5-advanced-features]\n\n    ### 5.1 Generate Presigned URLs [#51-generate-presigned-urls]\n\n    #### 5.1.1 Download Link (GET) [#511-download-link-get]\n\n    ```python\n    url = s3.generate_presigned_url(\n     ClientMethod='get_object',\n     Params={'Bucket': bucket_name, 'Key': 'hello.txt'},\n     ExpiresIn=600 # 10 minutes validity\n    )\n\n    print('Presigned GET URL:', url)\n    ```\n\n    #### 5.1.2 Upload Link (PUT) [#512-upload-link-put]\n\n    ```python\n    url = s3.generate_presigned_url(\n     ClientMethod='put_object',\n     Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},\n     ExpiresIn=600\n    )\n\n    print('Presigned PUT URL:', url)\n    ```\n\n    You can use `curl` tool to upload:\n\n    ```bash\n    curl -X PUT --upload-file hello.txt \"http://...\"\n    ```\n\n    ***\n\n    ### 5.2 Multipart Upload [#52-multipart-upload]\n\n    Suitable for files larger than 10 MB, allows manual control of each part.\n\n    ```python\n    import os\n\n    file_path = 'largefile.bin'\n    key = 'largefile.bin'\n    part_size = 5 * 1024 * 1024 # 5 MB\n\n    # 1. Start upload\n    response = s3.create_multipart_upload(Bucket=bucket_name, Key=key)\n    upload_id = response['UploadId']\n    parts = []\n\n    try:\n     with open(file_path, 'rb') as f:\n     part_number = 1\n     while True:\n     data = f.read(part_size)\n     if not data:\n     break\n\n     part = s3.upload_part(\n     Bucket=bucket_name,\n     Key=key,\n     PartNumber=part_number,\n     UploadId=upload_id,\n     Body=data\n     )\n\n     parts.append({'ETag': part['ETag'], 'PartNumber': part_number})\n     print(f'Uploaded part {part_number}')\n     part_number += 1\n\n     # 2. Complete upload\n     s3.complete_multipart_upload(\n     Bucket=bucket_name,\n     Key=key,\n     UploadId=upload_id,\n     MultipartUpload={'Parts': parts}\n     )\n     print('Multipart upload complete.')\n\n    except Exception as e:\n     # Abort upload\n     s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)\n     print('Multipart upload aborted due to error:', e)\n    ```\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Common Issue Troubleshooting [#6-common-issue-troubleshooting]\n\n    | Issue                     | Cause                                         | Solution                                                                                         |\n    | ------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------ |\n    | `SignatureDoesNotMatch`   | Not using v4 signature                        | Set `signature_version='s3v4'`                                                                   |\n    | `EndpointConnectionError` | Wrong RustFS address or service not started   | Check endpoint and RustFS service status                                                         |\n    | `AccessDenied`            | Wrong credentials or insufficient permissions | Check AccessKey/SecretKey or bucket policies                                                     |\n    | `PermanentRedirect`       | Path-style not enabled                        | Boto3 defaults to virtual-host, RustFS only supports path-style, but setting endpoint can bypass |\n\n    ***\n  </div>\n\n  <div className=\"fd-step\">\n    ## Appendix: Quick Upload/Download Script Template [#7-appendix-quick-uploaddownload-script-template]\n\n    ```python\n    def upload_file(local_path, bucket, object_key):\n     s3.upload_file(local_path, bucket, object_key)\n     print(f\"Uploaded {local_path} to s3://{bucket}/{object_key}\")\n\n    def download_file(bucket, object_key, local_path):\n     s3.download_file(bucket, object_key, local_path)\n     print(f\"Downloaded s3://{bucket}/{object_key} to {local_path}\")\n    ```\n  </div>\n</div>\n";
var structuredData = {
	"contents": [
		{
			"heading": "1-overview",
			"content": "RustFS is S3-compatible and supports the Boto3 SDK."
		},
		{
			"heading": "1-overview",
			"content": "This guide covers:"
		},
		{
			"heading": "1-overview",
			"content": "Bucket creation/deletion"
		},
		{
			"heading": "1-overview",
			"content": "Object upload/download/deletion"
		},
		{
			"heading": "1-overview",
			"content": "Listing objects"
		},
		{
			"heading": "1-overview",
			"content": "Generating presigned URLs"
		},
		{
			"heading": "1-overview",
			"content": "Multipart upload for large files"
		},
		{
			"heading": "21-example-configuration",
			"content": "Assume RustFS is deployed as follows:"
		},
		{
			"heading": "22-install-boto3",
			"content": "We recommend using a virtual environment:"
		},
		{
			"heading": "22-install-boto3",
			"content": "> Boto3 depends on `botocore`, which will be installed automatically."
		},
		{
			"heading": "3-connecting-to-rustfs",
			"content": "> ✅ `endpoint_url`: Points to RustFS\n> ✅ `signature_version='s3v4'`: RustFS supports v4 signatures\n> ✅ `region_name`: RustFS does not validate regions; you can use any value."
		},
		{
			"heading": "512-upload-link-put",
			"content": "You can use `curl` tool to upload:"
		},
		{
			"heading": "52-multipart-upload",
			"content": "Suitable for files larger than 10 MB, allows manual control of each part."
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Issue"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Cause"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Solution"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "`SignatureDoesNotMatch`"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Not using v4 signature"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Set `signature_version='s3v4'`"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "`EndpointConnectionError`"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Wrong RustFS address or service not started"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Check endpoint and RustFS service status"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "`AccessDenied`"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Wrong credentials or insufficient permissions"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Check AccessKey/SecretKey or bucket policies"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "`PermanentRedirect`"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Path-style not enabled"
		},
		{
			"heading": "6-common-issue-troubleshooting",
			"content": "Boto3 defaults to virtual-host, RustFS only supports path-style, but setting endpoint can bypass"
		}
	],
	"headings": [
		{
			"id": "1-overview",
			"content": "1\\. Overview"
		},
		{
			"id": "2-environment-preparation",
			"content": "2\\. Environment Preparation"
		},
		{
			"id": "21-example-configuration",
			"content": "2.1 Example Configuration"
		},
		{
			"id": "22-install-boto3",
			"content": "2.2 Install Boto3"
		},
		{
			"id": "3-connecting-to-rustfs",
			"content": "3\\. Connecting to RustFS"
		},
		{
			"id": "4-basic-operations",
			"content": "4\\. Basic Operations"
		},
		{
			"id": "41-create-bucket",
			"content": "4.1 Create Bucket"
		},
		{
			"id": "42-upload-file",
			"content": "4.2 Upload File"
		},
		{
			"id": "43-download-file",
			"content": "4.3 Download File"
		},
		{
			"id": "44-list-objects",
			"content": "4.4 List Objects"
		},
		{
			"id": "45-delete-object-and-bucket",
			"content": "4.5 Delete Object and Bucket"
		},
		{
			"id": "5-advanced-features",
			"content": "5\\. Advanced Features"
		},
		{
			"id": "51-generate-presigned-urls",
			"content": "5.1 Generate Presigned URLs"
		},
		{
			"id": "511-download-link-get",
			"content": "5.1.1 Download Link (GET)"
		},
		{
			"id": "512-upload-link-put",
			"content": "5.1.2 Upload Link (PUT)"
		},
		{
			"id": "52-multipart-upload",
			"content": "5.2 Multipart Upload"
		},
		{
			"id": "6-common-issue-troubleshooting",
			"content": "6\\. Common Issue Troubleshooting"
		},
		{
			"id": "7-appendix-quick-uploaddownload-script-template",
			"content": "7\\. Appendix: Quick Upload/Download Script Template"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#1-overview",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Overview" }),
		_step: 1
	},
	{
		depth: 2,
		url: "#2-environment-preparation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Environment Preparation" }),
		_step: 2
	},
	{
		depth: 3,
		url: "#21-example-configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.1 Example Configuration" })
	},
	{
		depth: 3,
		url: "#22-install-boto3",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "2.2 Install Boto3" })
	},
	{
		depth: 2,
		url: "#3-connecting-to-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Connecting to RustFS" }),
		_step: 3
	},
	{
		depth: 2,
		url: "#4-basic-operations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Basic Operations" }),
		_step: 4
	},
	{
		depth: 3,
		url: "#41-create-bucket",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.1 Create Bucket" })
	},
	{
		depth: 3,
		url: "#42-upload-file",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.2 Upload File" })
	},
	{
		depth: 3,
		url: "#43-download-file",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.3 Download File" })
	},
	{
		depth: 3,
		url: "#44-list-objects",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.4 List Objects" })
	},
	{
		depth: 3,
		url: "#45-delete-object-and-bucket",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "4.5 Delete Object and Bucket" })
	},
	{
		depth: 2,
		url: "#5-advanced-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Advanced Features" }),
		_step: 5
	},
	{
		depth: 3,
		url: "#51-generate-presigned-urls",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1 Generate Presigned URLs" })
	},
	{
		depth: 4,
		url: "#511-download-link-get",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1.1 Download Link (GET)" })
	},
	{
		depth: 4,
		url: "#512-upload-link-put",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.1.2 Upload Link (PUT)" })
	},
	{
		depth: 3,
		url: "#52-multipart-upload",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "5.2 Multipart Upload" })
	},
	{
		depth: 2,
		url: "#6-common-issue-troubleshooting",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Common Issue Troubleshooting" }),
		_step: 6
	},
	{
		depth: 2,
		url: "#7-appendix-quick-uploaddownload-script-template",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Appendix: Quick Upload/Download Script Template" }),
		_step: 7
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
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
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(_components.div, {
		className: "fd-steps",
		children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
				className: "fd-step",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "1-overview",
						"data-fd-step": "1",
						children: "Overview"
					}),
					(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
						"RustFS is S3-compatible and supports the ",
						(0, import_jsx_runtime_react_server.jsx)(_components.a, {
							href: "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html",
							children: "Boto3"
						}),
						" SDK."
					] }),
					(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This guide covers:" }),
					(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Bucket creation/deletion" }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Object upload/download/deletion" }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Listing objects" }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Generating presigned URLs" }),
						"\n",
						(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Multipart upload for large files" }),
						"\n"
					] }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
				]
			}),
			(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
				className: "fd-step",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "2-environment-preparation",
						"data-fd-step": "2",
						children: "Environment Preparation"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "21-example-configuration",
						children: "2.1 Example Configuration"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Assume RustFS is deployed as follows:" }),
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
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "Endpoint: http://192.168.1.100:9000" })
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "AccessKey: <your-access-key>" })
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "SecretKey: <your-secret-key>" })
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "22-install-boto3",
						children: "2.2 Install Boto3"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "We recommend using a virtual environment:" }),
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
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "python3"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " -m"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " venv"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " venv"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "source"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " venv/bin/activate"
								})]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6F42C1",
											"--shiki-dark": "#B392F0"
										},
										children: "pip"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " install"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " boto3"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
						"\n",
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"Boto3 depends on ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "botocore" }),
							", which will be installed automatically."
						] }),
						"\n"
					] }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
				]
			}),
			(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
				className: "fd-step",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "3-connecting-to-rustfs",
						"data-fd-step": "3",
						children: "Connecting to RustFS"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
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
									children: " boto3"
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
										children: "from"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " botocore.client "
									}),
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
										children: " Config"
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
										children: "s3 "
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
										children: " boto3.client("
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " 's3'"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: ","
								})]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " endpoint_url"
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
										children: "'http://192.168.1.100:9000'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ","
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
									children: " # Use a unique access key and a strong secret (e.g. openssl rand -base64 24)"
								})
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " aws_access_key_id"
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
										children: "'<your-access-key>'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ","
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " aws_secret_access_key"
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
										children: "'<your-secret-key>'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ","
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " config"
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
										children: "Config("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "signature_version"
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
										children: "'s3v4'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "),"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " region_name"
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
										children: "'us-east-1'"
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
									children: ")"
								})
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
						"\n",
						(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
							"✅ ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "endpoint_url" }),
							": Points to RustFS\n✅ ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "signature_version='s3v4'" }),
							": RustFS supports v4 signatures\n✅ ",
							(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "region_name" }),
							": RustFS does not validate regions; you can use any value."
						] }),
						"\n"
					] }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
				]
			}),
			(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
				className: "fd-step",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
						id: "4-basic-operations",
						"data-fd-step": "4",
						children: "Basic Operations"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "41-create-bucket",
						children: "4.1 Create Bucket"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "bucket_name "
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
										children: " 'my-bucket'"
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
									children: "try"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: ":"
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
										children: " s3.create_bucket("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name)"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "f"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Bucket "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "bucket_name"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "}"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " created.'"
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
								children: [(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#D73A49",
										"--shiki-dark": "#F97583"
									},
									children: "except"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: " s3.exceptions.BucketAlreadyOwnedByYou:"
								})]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "f"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Bucket "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "bucket_name"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "}"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " already exists.'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ")"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "42-upload-file",
						children: "4.2 Upload File"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "s3.upload_file("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'hello.txt'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ", bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'hello.txt'"
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
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'File uploaded.'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ")"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "43-download-file",
						children: "4.3 Download File"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "s3.download_file(bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'hello.txt'"
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
										children: "'hello-downloaded.txt'"
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
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'File downloaded.'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ")"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "44-list-objects",
						children: "4.4 List Objects"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "response "
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
										children: " s3.list_objects_v2("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name)"
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
										children: " obj "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "in"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " response.get("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Contents'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ", []):"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "f"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "\"- "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "obj["
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Key'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "]"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "}"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " ("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "obj["
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Size'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "]"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "}"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: " bytes)\""
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ")"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "45-delete-object-and-bucket",
						children: "4.5 Delete Object and Bucket"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "s3.delete_object("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Key"
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
										children: "'hello.txt'"
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
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'Object deleted.'"
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
										children: "s3.delete_bucket("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name)"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'Bucket deleted.'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ")"
									})
								]
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
						id: "5-advanced-features",
						"data-fd-step": "5",
						children: "Advanced Features"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "51-generate-presigned-urls",
						children: "5.1 Generate Presigned URLs"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
						id: "511-download-link-get",
						children: "5.1.1 Download Link (GET)"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "url "
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
										children: " s3.generate_presigned_url("
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " ClientMethod"
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
										children: "'get_object'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ","
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Params"
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
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Bucket'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Key'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'hello.txt'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "},"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " ExpiresIn"
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
										children: "600"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " # 10 minutes validity"
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
									children: ")"
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
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'Presigned GET URL:'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ", url)"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
						id: "512-upload-link-put",
						children: "5.1.2 Upload Link (PUT)"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "url "
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
										children: " s3.generate_presigned_url("
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " ClientMethod"
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
										children: "'put_object'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ","
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Params"
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
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Bucket'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Key'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'upload-by-url.txt'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "},"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " ExpiresIn"
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
										children: "600"
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
									children: ")"
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
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "print"
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
										children: "'Presigned PUT URL:'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ", url)"
									})
								]
							})
						] })
					}) }),
					(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
						"You can use ",
						(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "curl" }),
						" tool to upload:"
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
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
						children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "line",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-dark": "#B392F0"
									},
									children: "curl"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: " -X"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " PUT"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: " --upload-file"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " hello.txt"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " \"http://...\""
								})
							]
						}) })
					}) }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
					(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
						id: "52-multipart-upload",
						children: "5.2 Multipart Upload"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Suitable for files larger than 10 MB, allows manual control of each part." }),
					(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
						className: "shiki shiki-themes github-light github-dark",
						style: {
							"--shiki-light": "#24292e",
							"--shiki-dark": "#e1e4e8",
							"--shiki-light-bg": "#fff",
							"--shiki-dark-bg": "#24292e"
						},
						tabIndex: "0",
						icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
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
									children: " os"
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
										children: "file_path "
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
										children: " 'largefile.bin'"
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
										children: "key "
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
										children: " 'largefile.bin'"
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
										children: "part_size "
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
										children: " 5"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: " *"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " 1024"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: " *"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " 1024"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#6A737D",
											"--shiki-dark": "#6A737D"
										},
										children: " # 5 MB"
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
									children: "# 1. Start upload"
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
										children: "response "
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
										children: " s3.create_multipart_upload("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Key"
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
										children: "key)"
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
										children: "upload_id "
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
										children: " response["
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'UploadId'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "]"
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
										children: "parts "
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
										children: " []"
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
									children: "try"
								}), (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: ":"
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
										children: " with"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " open"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "(file_path, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'rb'"
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
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "as"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " f:"
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
										children: " part_number "
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
										children: " while"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " True"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ":"
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
										children: " data "
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
										children: " f.read(part_size)"
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
										children: " if"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: " not"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " data:"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsx)(_components.span, {
								className: "line",
								children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#D73A49",
										"--shiki-dark": "#F97583"
									},
									children: " break"
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
										children: " part "
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
										children: " s3.upload_part("
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Bucket"
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
										children: "bucket_name,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Key"
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
										children: "key,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " PartNumber"
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
										children: "part_number,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " UploadId"
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
										children: "upload_id,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Body"
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
										children: "data"
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
										children: " parts.append({"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'ETag'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": part["
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'ETag'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "], "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'PartNumber'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": part_number})"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "f"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Uploaded part "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: "part_number"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: "}"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'"
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
										children: " part_number "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: "+="
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " 1"
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
									children: " # 2. Complete upload"
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
									children: " s3.complete_multipart_upload("
								})
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Bucket"
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
										children: "bucket_name,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " Key"
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
										children: "key,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " UploadId"
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
										children: "upload_id,"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: " MultipartUpload"
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
										children: "{"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#032F62",
											"--shiki-dark": "#9ECBFF"
										},
										children: "'Parts'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ": parts}"
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
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "'Multipart upload complete.'"
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
										children: "except"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " Exception"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#D73A49",
											"--shiki-dark": "#F97583"
										},
										children: " as"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: " e:"
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
									children: " # Abort upload"
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
										children: " s3.abort_multipart_upload("
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Bucket"
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
										children: "bucket_name, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "Key"
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
										children: "key, "
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#E36209",
											"--shiki-dark": "#FFAB70"
										},
										children: "UploadId"
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
										children: "upload_id)"
									})
								]
							}),
							"\n",
							(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
								className: "line",
								children: [
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#005CC5",
											"--shiki-dark": "#79B8FF"
										},
										children: " print"
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
										children: "'Multipart upload aborted due to error:'"
									}),
									(0, import_jsx_runtime_react_server.jsx)(_components.span, {
										style: {
											"--shiki-light": "#24292E",
											"--shiki-dark": "#E1E4E8"
										},
										children: ", e)"
									})
								]
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
						id: "6-common-issue-troubleshooting",
						"data-fd-step": "6",
						children: "Common Issue Troubleshooting"
					}),
					(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
						(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Issue" }),
						(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Cause" }),
						(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Solution" })
					] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "SignatureDoesNotMatch" }) }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Not using v4 signature" }),
							(0, import_jsx_runtime_react_server.jsxs)(_components.td, { children: ["Set ", (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "signature_version='s3v4'" })] })
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "EndpointConnectionError" }) }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Wrong RustFS address or service not started" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check endpoint and RustFS service status" })
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "AccessDenied" }) }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Wrong credentials or insufficient permissions" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Check AccessKey/SecretKey or bucket policies" })
						] }),
						(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "PermanentRedirect" }) }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Path-style not enabled" }),
							(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Boto3 defaults to virtual-host, RustFS only supports path-style, but setting endpoint can bypass" })
						] })
					] })] }),
					(0, import_jsx_runtime_react_server.jsx)(_components.hr, {})
				]
			}),
			(0, import_jsx_runtime_react_server.jsxs)(_components.div, {
				className: "fd-step",
				children: [(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
					id: "7-appendix-quick-uploaddownload-script-template",
					"data-fd-step": "7",
					children: "Appendix: Quick Upload/Download Script Template"
				}), (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
					className: "shiki shiki-themes github-light github-dark",
					style: {
						"--shiki-light": "#24292e",
						"--shiki-dark": "#e1e4e8",
						"--shiki-light-bg": "#fff",
						"--shiki-dark-bg": "#24292e"
					},
					tabIndex: "0",
					icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z\" fill=\"currentColor\" /></svg>",
					children: (0, import_jsx_runtime_react_server.jsxs)(_components.code, { children: [
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "line",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#D73A49",
										"--shiki-dark": "#F97583"
									},
									children: "def"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-dark": "#B392F0"
									},
									children: " upload_file"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "(local_path, bucket, object_key):"
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
								children: " s3.upload_file(local_path, bucket, object_key)"
							})
						}),
						"\n",
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "line",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: " print"
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
									children: "f"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "\"Uploaded "
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "local_path"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " to s3://"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "bucket"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "/"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "object_key"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "\""
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
									children: "def"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#6F42C1",
										"--shiki-dark": "#B392F0"
									},
									children: " download_file"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "(bucket, object_key, local_path):"
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
								children: " s3.download_file(bucket, object_key, local_path)"
							})
						}),
						"\n",
						(0, import_jsx_runtime_react_server.jsxs)(_components.span, {
							className: "line",
							children: [
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: " print"
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
									children: "f"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "\"Downloaded s3://"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "bucket"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "/"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "object_key"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: " to "
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "{"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: "local_path"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#005CC5",
										"--shiki-dark": "#79B8FF"
									},
									children: "}"
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#032F62",
										"--shiki-dark": "#9ECBFF"
									},
									children: "\""
								}),
								(0, import_jsx_runtime_react_server.jsx)(_components.span, {
									style: {
										"--shiki-light": "#24292E",
										"--shiki-dark": "#E1E4E8"
									},
									children: ")"
								})
							]
						})
					] })
				}) })]
			})
		]
	});
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
