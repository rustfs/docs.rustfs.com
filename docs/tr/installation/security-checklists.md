---
title: "Security Checklist"
description: "RustFS Security Checklist (for enterprise deployers). RustFS is a high-performance distributed object storage software developed in Rust, released under the Apache 2.0 open source license."
---

# Security Checklist

> To help enterprises securely deploy RustFS, we have referenced official RustFS security practice recommendations and compiled the following security best practices. We recommend checking each item during deployment to ensure system security and reliability.

## 1. Identity Authentication and Access Control

- **Use S3-Compatible Key Authentication**
 RustFS uses a signature mechanism similar to AWS Signature V4 for identity verification. Each user or service must use legitimate Access Key and Secret Key for access; never skip authentication steps.

- **Policy-Based Access Control**
 Define access policies for different roles and users according to the principle of least privilege. You can set group policies and user policies, clearly specifying allowed S3 operations. By default, operations not explicitly authorized in policies should be denied.

## 2. Network Transport Encryption (TLS/SSL)

- **Enable TLS/SSL Encryption**
 Be sure to configure valid SSL certificates and private keys for RustFS during deployment. It's recommended to use certificates for different domain names for external and internal network access, and adopt TLS 1.2 or higher security protocols.

- **Certificate Management**
 Ensure certificates are issued by trusted CAs (or use internal corporate root CAs), avoid using expired or self-signed certificates. Private key files should have strict file permissions, allowing only RustFS service processes or dedicated users to read.

- **Multiple Domains and Cipher Suites**
 Configure independent certificates for multiple access domains; use recommended encryption algorithms (such as 2048-bit RSA or 256-bit ECC) when generating keys.

## 3. Environment Variables and Credential Protection

- **Change Default Credentials**
 If RustFS uses default accounts during initialization (such as `rustfsadmin` / `rustfsadmin`), you must change to random complex passwords after deployment.

- **Secure Credential Storage**
 Don't hardcode plaintext passwords in scripts, images, or logs. Use environment variables or Kubernetes Secrets to manage passwords.

## 4. Logging and Audit Trails

- **Enable Audit Logging**
 RustFS supports exporting audit logs to external systems such as HTTP Webhook, Kafka, ELK, Splunk, etc.

- **Runtime Log Collection**
 Use standard methods to collect and analyze logs on different platforms (such as systemd, Docker, K8s). Recommend using with ELK, Grafana Loki.

- **Monitoring and Alerting**
 Set alert notifications for abnormal behaviors such as login failures, access during unusual hours, large-scale deletions, etc.

- **Observability**
 RustFS supports observable environment deployment, enabling optimization down to individual function execution times. You can further optimize your configuration for different environments.

## 5. API Access Restrictions

- **Limit Network Access**
 By default, RustFS S3 API listens on port 9000, and the management console listens on port 9090. Restrict access source IPs through firewalls or cloud security groups.

- **Network Isolation and Proxy**
 Recommend exposing services through reverse proxy (such as Nginx), avoiding direct exposure of storage node IPs.

- **Close Unnecessary Ports**
 Disable unused ports or interfaces, for example, don't expose management interfaces to the public internet.

## 6. Write Once Read Many (WORM)

- **Versioning and Object Locking**
 Enable object versioning and object locking policies to meet regulatory requirements (such as financial, government).

## 7. Updates and Version Management

- **Timely Application of Patches and Upgrades**
 Follow official RustFS update notifications, regularly upgrade and review change notes to avoid security vulnerabilities.

- **Non-Destructive Upgrade Process**
 RustFS supports hot update processes, enabling zero-downtime service through node-by-node restarts.

- **Operating System and Dependency Management**
 Monitor vulnerability updates and fixes for operating systems and basic components (such as OpenSSL).

---

The above is the **RustFS Enterprise Deployment Security Checklist**. Check each item before deployment and regularly review after deployment to significantly reduce risks and improve stability.
