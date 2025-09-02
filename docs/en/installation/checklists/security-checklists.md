---
title: "Security Checklist"
description: "RustFS Security Checklist (for enterprise deployers), RustFS is a high-performance distributed object storage software developed in Rust language, released under Apache 2.0 open-source license."
---

# Security Checklist

> To help enterprises deploy RustFS securely, we have compiled the following security best practices based on RustFS official security practice recommendations. It's recommended to check item by item according to the checklist during deployment to ensure system security and reliability.

## 1. Identity Authentication and Access Control

- **Use S3-Compatible Key Authentication**
 RustFS adopts signature mechanisms similar to AWS Signature V4 for identity verification. Each user or service must use valid Access Key and Secret Key for access, never skip authentication steps.

- **Policy-Based Access Control**
 Define access policies for different roles and users according to the principle of least privilege. You can set group policies and user policies, clearly defining allowed S3 operations. By default, operations not explicitly authorized in policies should be denied.

## 2. Network Transmission Encryption (TLS/SSL)

- **Enable TLS/SSL Encryption**
 When deploying, be sure to configure valid SSL certificates and private keys for RustFS. It's recommended to use different domain certificates for external and internal network access, and adopt TLS1.2 or higher security protocols.

- **Certificate Management**
 Ensure certificates are issued by trusted CAs (or use company internal root CA), avoid using expired or self-signed certificates. Private key files should have strict file permissions, only allowing RustFS service processes or dedicated users to read.

- **Multi-Domain and Cipher Suites**
 Configure independent certificates for multiple access domains; use recommended encryption algorithms when generating keys (such as 2048-bit RSA or 256-bit ECC).

## 3. Environment Variables and Credential Protection

- **Change Default Credentials**
 If using default accounts (such as `rustfsadmin` / `rustfsadmin`) when initializing RustFS, they must be changed to random complex passwords after deployment.

- **Secure Credential Storage**
 Don't hardcode plaintext passwords in scripts, images, or logs. Use environment variables or Kubernetes Secrets to manage passwords.

## 4. Logging and Audit Tracking

- **Enable Audit Logs**
 RustFS supports exporting audit logs to external systems like HTTP Webhook, Kafka, ELK, Splunk, etc.

- **Runtime Log Collection**
 Use standard methods to collect and analyze logs on different platforms (such as systemd, Docker, K8s). Recommend using with ELK, Grafana Loki.

- **Monitoring and Alerts**
 Set alert notifications for abnormal behaviors like login failures, access at unusual times, large-scale deletions, etc.

- **Observability**
 RustFS supports observable environment deployment, allowing precise tuning down to each function's execution time. You can further optimize your configuration for different environments.

## 5. API Access Restrictions

- **Restrict Network Access**
 By default, RustFS S3 API listens on port 9000, management console listens on port 9090. Restrict access source IPs through firewalls or cloud security groups.

- **Network Isolation and Proxy**
 Recommend exposing services through reverse proxies (such as Nginx), avoid directly exposing storage node IPs.

- **Close Unnecessary Ports**
 Disable unused ports or interfaces, for example, don't expose management interfaces to public networks.

## 6. Data Write-Once Read-Many (WORM)

- **Version Control and Object Locking**
 Enable object versioning and object locking policies to meet regulatory requirements (such as finance, government).

## 7. Updates and Version Management

- **Apply Patches and Upgrades Promptly**
 Pay attention to RustFS official update notifications, regularly upgrade and review change descriptions to avoid security vulnerabilities.

- **Non-Disruptive Upgrade Process**
 RustFS supports hot update processes, enabling zero-downtime service through node-by-node restarts.

- **Operating System and Dependency Management**
 Pay attention to vulnerability updates and fixes for operating systems and basic components (such as OpenSSL).

---

The above is the **RustFS Enterprise Deployment Security Checklist**. Check item by item before deployment, and regularly review after deployment to significantly reduce risks and improve stability.
