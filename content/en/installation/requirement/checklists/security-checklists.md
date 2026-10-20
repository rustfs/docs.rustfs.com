---
title: "Security Checklist"
description: "Review authentication, TLS, credentials, and network exposure before a production RustFS deployment."
---

Review this checklist during deployment so requests are signed, traffic is encrypted, and management ports are not exposed.

## Authentication and access control

- **Use S3-Compatible Key Authentication**
 RustFS uses AWS Signature V4. Make sure that all requests are signed with a valid access key and secret key.

- **Policy-Based Access Control**
 Define access policies based on the principle of least privilege. Explicitly define allowed operations; deny all others by default.

## Encryption (TLS)

- **Enable TLS/SSL**
 Configure valid TLS certificates. We recommend using different certificates for external and internal access, and enforcing TLS 1.2+.

- **Certificate Management**
 Use certificates from trusted CAs. Protect private keys with strict file permissions.

- **Multi-Domain and Cipher Suites**
 Use separate certificates for each domain. Use strong key algorithms (for example, RSA 2048-bit or ECDSA P-256).

## Credential protection

- **Change Default Credentials**
 Never keep the example placeholders (`<your-access-key>` / `<your-secret-key>`) in production. Set a unique access key and a strong, random secret — e.g. generate one with `openssl rand -base64 24` — immediately after initialization.

- **Secure Storage**
 Do not hardcode credentials. Use environment variables or secrets management systems (e.g., Kubernetes Secrets).

## Logging and auditing

- **Enable Audit Logs**
 Export audit logs to external systems (HTTP Webhook, Kafka, ELK, Splunk).

- **Log Collection**
 Collect logs with standard tools (journald, Docker, Kubernetes) and analyze them with ELK or Grafana Loki.

- **Monitoring and Alerts**
 Set alerts for abnormal behavior (login failures, unusual access patterns, mass deletions).

- **Observability**
 Monitor request latency to identify performance issues.

## API security

- **Restrict Network Access**
 Restrict access to the S3 API (port 9000) and Console (port 9001) using firewalls or security groups.

- **Network Isolation**
 Use reverse proxies (e.g., Nginx) instead of exposing storage nodes directly.

- **Close Unnecessary Ports**
 Disable unused ports and do not expose management interfaces to the public internet.

## WORM Compliance

- **Versioning and Object Lock**
 Enable versioning and Object Lock to meet regulatory requirements.

## Updates

- **Apply Patches**
 Regularly check for and apply RustFS updates.

- **Non-Disruptive Upgrades**
 Use a rolling restart so the cluster keeps serving requests during the upgrade. See [Upgrade](/operations/upgrade).

- **OS and Dependencies**
 Keep the operating system and dependencies (e.g., OpenSSL) updated.

---

Review this checklist regularly to maintain a secure RustFS deployment.
