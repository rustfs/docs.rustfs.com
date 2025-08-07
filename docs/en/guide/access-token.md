---
title: "RustFS Access Key Management"
description: "Create, use, and delete RustFS access keys."
---

# Access Keys

RustFS access keys are the core credentials of the RustFS system, used for authentication and authorization. They are essential in API and SDK scenarios. This section explains how to create and delete RustFS access keys.

Prerequisites:

- An available RustFS instance. See the [Installation Guide](/installation/index) to deploy one.

## Create an Access Key

1. Sign in to the RustFS UI console.
2. In the left navigation, select **Access Keys**.
3. On the Access Keys page, click **Add Access Key** in the upper right.
4. Enter the access key **expiration time, name, and description**, then click **Submit**.
5. (Optional but recommended) On the access key detail page, choose **Copy** or **Export** to securely save the credentials for later use.

![access key list page](images/access_token_creation.png)

## Delete an Access Key

1. Sign in to the RustFS UI console.
2. In the left navigation, select **Access Keys**.
3. On the Access Keys page, select the access key to delete.
4. Click **Delete** on the right of the access key, or click **Delete Selected** in the upper right to remove it.

![access key deletion](images/access_token_deletion.png)