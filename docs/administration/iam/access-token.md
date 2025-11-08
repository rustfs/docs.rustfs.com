---
title: "RustFS Access Key Management"
description: "Creation, usage, and deletion of RustFS access keys."
---

# Access Keys

RustFS access keys are the core credentials of the RustFS system, used for identity authentication and operation authorization, and are very useful in API and SDK scenarios. This chapter introduces the creation and deletion of RustFS access keys.

Prerequisites:

- An available RustFS instance. You can refer to the [Installation Guide](../../installation/index.md) for installation.

## Creating Access Keys

1. Log in to the RustFS UI console.
2. In the left navigation bar, select **Access Keys**.
3. On the access keys page, in the upper right corner, click **Add Access Key**.
4. Enter the key's **expiration time, name, and description**, then click **Submit**.
5. (Optional but recommended). On the access key page that appears, select **Copy** or **Export** to save the access key for future use.

![access key list page](images/access_token_creation.png)

## Deleting Access Keys

1. Log in to the RustFS UI console.
2. In the left navigation bar, select **Access Keys**.
3. On the access keys page, select the access key you want to delete.
4. Select the **Delete** button on the right side of the access key or **Delete Selected Items** in the upper right corner to delete the access key.

![access key deletion](images/access_token_deletion.png)