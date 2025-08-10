---
title: "Falha de disco"
description: "Com EC, o RustFS mantém acesso durante falhas parciais de discos e realiza auto‑healing após substituição."
---

O RustFS, via Erasure Coding, mantém leitura/escrita mesmo com falhas parciais e executa healing após troca de disco.

---

### Índice

1. [Desmontar o disco com falha](#1-desmontar-o-disco-com-falha)
2. [Substituir o disco com falha](#2-substituir-o-disco-com-falha)
3. [Atualizar `/etc/fstab` ou configuração do RustFS](#3-atualizar-etcfstab-ou-configuração-do-rustfs)
4. [Remontar o novo disco](#4-remontar-o-novo-disco)
5. [Acionar e monitorizar o healing](#5-acionar-e-monitorizar-o-healing)
6. [Verificações finais e notas](#6-verificações-finais-e-notas)

---

### 1) Desmontar o disco com falha

Desmonte com segurança no SO antes de trocar fisicamente, evitando erros de I/O.

```bash
# Supondo /dev/sdb
umount /dev/sdb
```

> Nota
>
> - Se houver múltiplos pontos de montagem, execute `umount` em cada um
> - Se “device is busy”, pare o serviço RustFS:
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Substituir o disco com falha

Após trocar fisicamente, particione/formatte e aplique o mesmo rótulo do disco antigo.

```bash
# Formatar ext4 com label DISK1 (igual ao original)
mkfs.ext4 /dev/sdb -L DISK1
```

> Requisitos
>
> - Capacidade do novo disco ≥ anterior
> - Tipo de FS igual aos demais
> - Prefira montar por LABEL/UUID para resistir a reorder após reboot

---

### 3) Atualizar `/etc/fstab` ou configuração do RustFS

Garanta que LABEL/UUID no `fstab` apontem para o novo disco. Se usar config específica (ex.: `config.yaml`), atualize também.

```bash
# Ver fstab
cat /etc/fstab

# Exemplo de entrada (sem alterações se LABEL igual)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> Dicas
>
> - Para usar UUID:
>
> ```bash
> blkid /dev/sdb
> # copie o UUID para o fstab
> ```
> - Valide sintaxe do fstab:
>
> ```bash
> mount -a # sem erro => OK
> ```

---

### 4) Remontar o novo disco

Monte e inicie o RustFS:

```bash
mount -a
systemctl start rustfs
```

Confirme as montagens:

```bash
df -h | grep /mnt/disk
```

> Atenção
>
> - Se alguma montagem falhar, verifique fstab e LABEL/UUID

---

### 5) Acionar e monitorizar o healing

O RustFS aciona healing automático/manual. Exemplo com uma ferramenta hipotética `rustfs-admin`:

```bash
# Estado dos discos
rustfs-admin disk status

# Acionar healing no novo disco
rustfs-admin heal --disk /mnt/disk1

# Acompanhar progresso
rustfs-admin heal status --follow
```

Verifique logs do serviço:

```bash
# Em instalações geridas por systemd
journalctl -u rustfs -f

# Ou ficheiro dedicado
tail -f /var/log/rustfs/heal.log
```

> Notas
>
> - Healing roda em background e afeta pouco os acessos
> - Ao concluir, a ferramenta reporta sucesso ou objetos pendentes

---

### 6) Verificações finais e notas

1. Monitorização de performance
   - I/O pode oscilar; monitore disco e rede
2. Falhas em lote
   - Se vários discos falharem no mesmo lote, aumente inspeções preventivas
3. Exercícios periódicos
   - Simule falhas para treinar a equipa
4. Janela de manutenção
   - Se a taxa de falha aumentar, planeie janelas para acelerar substituição e healing

