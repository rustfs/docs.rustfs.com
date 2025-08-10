# Infraestrutura para dados em grande escala

O RustFS é concebido para escalar: técnica, operacional e economicamente.

Em armazenamento de objetos, a encriptação forte é requisito básico. O RustFS oferece encriptação de alto nível com otimizações amplas, praticamente eliminando overheads típicos da encriptação em storage.

![Arquitetura de encriptação](images/s5-1.png)

O RustFS encripta dados em repouso (disco) e em trânsito (rede). O esquema suporta encriptação ao nível do objeto com padrões modernos (AES‑256‑GCM, ChaCha20‑Poly1305, AES‑CBC). É compatível com semântica S3 e estende‑a com KMS não‑AWS (HashiCorp Vault, Thales/Gemalto KeySecure, Google Secrets Manager).

## Encriptação em rede

Ao transitar entre aplicações e storage, os dados podem cruzar redes não confiáveis. Encriptar “on‑the‑wire” mitiga ataques MITM e garante confidencialidade independentemente do caminho.

O RustFS suporta TLS v1.2+ entre todos os componentes do cluster, sem pontos fracos entre nós. A implementação TLS é otimizada ao nível de instruções de CPU, com overhead desprezável. Basta fornecer a cada servidor RustFS a chave privada e o certificado públicos. Em Kubernetes, o Operator trata da emissão/distribuição de certificados (SNI e múltiplos certificados/domínios suportados).

## Encriptação de objetos (at‑rest)

Antes de persistir, o servidor encripta automaticamente os dados (at‑rest), garantindo confidencialidade, integridade e autenticidade. Suporta encriptação dirigida pelo cliente e configuração por padrão do bucket.

Compatível com SSE‑S3 e SSE‑C. Além do AWS KMS, o RustFS integra KMS corporativos (HashiCorp Vault, Thales Ciphertrust). No SSE‑S3 e SSE‑C o servidor executa rotação de chaves e re‑encriptação.

Com encriptação automática no servidor, cada objeto recebe uma chave única, e camadas adicionais podem ser aplicadas com chaves dinâmicas derivadas de KMS externo ou fornecidas pelo cliente.

Usa AEAD (AES‑256‑GCM, ChaCha20‑Poly1305) em operações de PUT/GET. Otimizações de CPU (SIMD) tornam o overhead mínimo; pode manter encriptação por bucket ativa sem penalizações relevantes.

## Serviço de Encriptação de Chaves (KES)

O KES é um serviço distribuído e sem estado, de alto desempenho, para gestão de chaves, pensado para Kubernetes. É componente requerido para SSE‑S3.

O KES intermedeia cluster RustFS e KMS externo, gerando chaves e operações de encriptação sem sobrecarregar o KMS central. Sendo stateless, escala automaticamente (HPA). O Operator suporta implantar/configurar KES por inquilino.

![Arquitetura KES](images/s5-2.png)

## KMS externos suportados

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |
