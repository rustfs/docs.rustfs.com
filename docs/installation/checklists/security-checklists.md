---
title: "Security Checklist"
description: "Security checklist for enterprise deployments."
---

# Security Checklist

> Security best practices for RustFS. Review this checklist during deployment to ensure system security and reliability.

## 1. Authentication & Access Control

- **Use S3-Compatible Key Authentication**
 RustFS uses AWS Signature V4. Ensure all requests are authenticated with valid Access Keys and Secret Keys.

- **Policy-Based Access Control**
 Define access policies based on the principle of least privilege. Explicitly define allowed operations; deny all others by default.

## 2. Encryption (TLS/SSL)

- **Enable TLS/SSL**
 Configure valid SSL certificates. We recommend using different certificates for external and internal access, and enforcing TLS 1.2+.

- **Certificate Management**
 Use certificates from trusted CAs. Protect private keys with strict file permissions.

- **Multi-Domain and Cipher Suites**
 Configure independent certificates for multiple domains. Use strong encryption algorithms (e.g., 2048-bit RSA or 256-bit ECC).

## 3. Credential Protection

- **Change Default Credentials**
 Change default accounts (e.g., `rustfsadmin`) to strong, random passwords immediately after initialization.

- **Secure Storage**
 Do not hardcode credentials. Use environment variables or secrets management systems (e.g., Kubernetes Secrets).

## 4. Logging & Auditing

- **Enable Audit Logs**
 Export audit logs to external systems (HTTP Webhook, Kafka, ELK, Splunk).

- **Log Collection**
 Collect logs using standard tools (systemd, Docker, K8s) and analyze with ELK or Grafana Loki.

- **Monitoring and Alerts**
 Set alerts for abnormal behavior (login failures, unusual access patterns, mass deletions).

- **Observability**
 Monitor function execution times to optimize performance.

## 5. API Security

- **Restrict Network Access**
 Restrict access to the S3 API (port 9000) and Console (port 9090) using firewalls or security groups.

- **Network Isolation**
 Use reverse proxies (e.g., Nginx) instead of exposing storage nodes directly.

- **Close Unnecessary Ports**
 Disable unused ports and do not expose management interfaces to the public internet.

## 6. WORM Compliance

- **Version Control and Object Locking**
 Enable versioning and object locking to meet regulatory requirements.

## 7. Updates

- **Apply Patches**
 Regularly check for and apply RustFS updates.

- **Non-Disruptive Upgrades**
 Use the rolling restart process for zero-downtime upgrades.

- **OS and Dependencies**
 Keep the operating system and dependencies (e.g., OpenSSL) updated.

---

Review this checklist regularly to maintain a secure RustFS deployment.
