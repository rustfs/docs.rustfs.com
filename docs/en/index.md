---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "RustFS"
  text: "High-Performance Distributed Object Storage"
  tagline: "High-performance distributed object storage software built with Rust"
  image:
    src: /logo.png
    alt: RustFS
  actions:
    - theme: brand
      text: Quick Start
      link: /en/installation/
    - theme: alt
      text: Live Demo
      link: https://play.rustfs.com:7001
    - theme: alt
      text: Community Discussion
      link: https://github.com/rustfs/rustfs/discussions

features:
  - icon: ⚡️
    title: High Performance
    details: Built with Rust, providing exceptional performance and memory safety, fully utilizing modern hardware resources
  - icon: 🔄
    title: Distributed
    details: Native support for distributed architecture, providing high availability and scalability for enterprise-grade storage needs
  - icon: 🛡️
    title: Reliability
    details: Erasure coding technology and multiple data protection mechanisms ensure data safety and system stability
  - icon: 🔌
    title: S3 Compatible
    details: Fully compatible with Amazon S3 API, seamlessly integrating with existing ecosystems and toolchains
  - icon: 🌐
    title: Cloud Native
    details: Designed for cloud-native environments, supporting Kubernetes and containerized deployments
  - icon: 💼
    title: Enterprise Grade
    details: Provides enterprise-grade features such as encryption, versioning, lifecycle management, and more
---

<MenuCards />

<div class="features-section">
  <div class="container">
    <h2>Why Choose RustFS</h2>
    <div class="feature-grid">
      <div class="feature-item">
        <h3>🚀 Ultimate Performance</h3>
        <p>Rust's zero-cost abstractions and memory safety features enable RustFS to achieve ultimate performance while ensuring safety</p>
      </div>
      <div class="feature-item">
        <h3>📈 Elastic Scaling</h3>
        <p>Start small and seamlessly scale to petabyte-scale storage as needed, meeting business growth requirements</p>
      </div>
      <div class="feature-item">
        <h3>🔒 Data Security</h3>
        <p>Multi-layered data protection including erasure coding, encryption, versioning, ensuring data safety and reliability</p>
      </div>
      <div class="feature-item">
        <h3>🛠️ Easy Operations</h3>
        <p>Simple deployment process and intuitive management interface, reducing operational complexity and costs</p>
      </div>
    </div>
  </div>
</div>

<style>
.features-section {
  padding: 4rem 0;
  background: var(--vp-c-bg-alt);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--vp-c-text-1);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-item {
  background: var(--vp-c-bg);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  text-align: center;
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.feature-item p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-section {
    padding: 2rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .features-section h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .feature-grid {
    gap: 1.5rem;
  }

  .feature-item {
    padding: 1.5rem;
  }
}
</style>
