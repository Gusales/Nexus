# 🖥️ Nexus

![React Native](https://img.shields.io/badge/react%20native-Expo-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-20%2B-339933?logo=node.js&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-2.x-67E8F9?logo=tauri&logoColor=black)
![Rust](https://img.shields.io/badge/rust-stable-DEA584?logo=rust&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

> 🇺🇸 English version: [README.md](./README.md)

> **Sistema de monitoramento e controle remoto de PC, conectando um app mobile a um agente Windows via WebSocket.**
>
> Projeto de portfólio em sistemas distribuídos: monitoramento em tempo real, gerenciamento de processos, controle de volume e ações remotas de energia (Wake-on-LAN, desligar, reiniciar) — do celular para o desktop, sem navegador ou nuvem de terceiros no meio.

---

## 📋 Conteúdos

- [Sobre](#-sobre)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar](#-como-rodar)
- [Estratégia de Branches](#-estratégia-de-branches)
- [CI/CD](#-cicd)
- [Licença](#-licença)

---

## 💡 Sobre

O Nexus permite monitorar e controlar um PC Windows remotamente a partir de um app Android. Um agente leve roda no PC, expondo dados do sistema e comandos via conexão WebSocket para o cliente mobile na mesma rede.

O projeto foi construído para explorar conceitos que vão além de um CRUD comum:

1. **Sistemas distribuídos** — dois processos independentes (cliente mobile, agente Windows) se comunicando por um protocolo definido.
2. **Comunicação em tempo real** — conexão WebSocket persistente transmitindo métricas ao vivo, em vez de polling.
3. **APIs do sistema operacional** — leitura de CPU/RAM/GPU/temperatura, gerenciamento de processos e controle de áudio diretamente por APIs do Windows.
4. **Arquitetura sidecar** — um shell nativo (Tauri/Rust) gerenciando o ciclo de vida de um processo Node.js que contém a lógica de negócio de fato.

Como é um projeto de estudo/portfólio, o desenvolvimento segue um modelo estruturado de branches e um pipeline de CI/CD automatizado com testes unitários, lint e releases versionadas no GitHub (veja [Estratégia de Branches](#-estratégia-de-branches) e [CI/CD](#-cicd) abaixo).

---

## 🏗️ Arquitetura

```
Android (React Native)
        ↓  WebSocket
Agente Windows
  ├── Shell (Tauri / Rust) — tray icon, janela de config, ciclo de vida do processo
  └── Sidecar (Node.js / TypeScript) — lógica de negócio, APIs de sistema
        ↓
APIs do Windows (áudio, processos, informações de sistema)
```

O app mobile e o sidecar do agente compartilham uma única fonte de verdade para o protocolo de comunicação — o package `@nexus/shared-types` — então uma mudança no formato de uma mensagem quebra o build dos dois lados em tempo de compilação, não em runtime.

---

## 🚀 Tecnologias

| Camada | Tecnologia |
| :--- | :--- |
| **Mobile** | React Native (Expo), TypeScript |
| **Agent Shell** | Tauri (Rust), React (janela de configuração) |
| **Agent Sidecar** | Node.js, TypeScript, `systeminformation`, `ws`, `better-sqlite3` |
| **Contratos Compartilhados** | TypeScript (`@nexus/shared-types`) |
| **Ferramentas de Monorepo** | pnpm workspaces, Turborepo |
| **Versionamento e Changelog** | Changesets |
| **Lint** | ESLint 9 (flat config), `typescript-eslint`, `@stylistic/eslint-plugin` |
| **CI/CD** | GitHub Actions |

---

## ✨ Funcionalidades

| Funcionalidade | Descrição | Status |
| :--- | :--- | :---: |
| **Monitoramento em tempo real** | CPU, RAM, GPU e temperatura transmitidos ao vivo via WebSocket | 🔜 |
| **Gerenciamento de processos** | Listar processos em execução e encerrá-los remotamente | 🔜 |
| **Controle de volume** | Volume global/mute e volume por aplicativo | 🔜 |
| **Wake-on-LAN** | Ligar o PC enviando um Magic Packet pela mesma rede | 🔜 |
| **Desligar / Reiniciar** | Ações remotas de energia, com confirmação obrigatória | 🔜 |
| **Histórico de uso** | Histórico de CPU/RAM salvo localmente (SQLite) para consulta | 🔜 |
| **Notificações por threshold** | Alerta quando CPU/GPU passam de um limite configurável | 🔜 |

> Status será atualizado conforme cada funcionalidade for implementada.

---

## 📁 Estrutura do Projeto

```
nexus/
├── apps/
│   ├── mobile/                 # Cliente React Native
│   ├── agent-shell/            # Shell Tauri (tray + janela de config)
│   └── agent-sidecar/          # Lógica de negócio em Node.js
├── packages/
│   ├── shared-types/           # Tipos compartilhados do protocolo WebSocket
│   └── eslint-config/          # Configuração compartilhada do ESLint
├── .github/workflows/          # Pipelines de CI/CD
└── pnpm-workspace.yaml
```

Cada app/package tem seu próprio README com detalhes de setup e desenvolvimento:

- [`apps/mobile`](./apps/mobile/README.md)
- [`apps/agent-shell`](./apps/agent-shell/README.md)
- [`apps/agent-sidecar`](./apps/agent-sidecar/README.md)
- [`packages/shared-types`](./packages/shared-types/README.md)
- [`packages/eslint-config`](./packages/eslint-config/README.md)

---

## ⚡ Como Rodar

### Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Rust](https://rustup.rs) + Visual Studio Build Tools (workload C++) — necessário pelo Tauri no Windows
- App [Expo Go](https://expo.dev/go) ou um emulador Android, para o cliente mobile

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/nexus.git
   cd nexus
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Rode cada parte em modo de desenvolvimento** (terminais separados):
   ```bash
   pnpm dev:sidecar   # Servidor WebSocket Node.js + APIs de sistema
   pnpm dev:shell     # Shell Tauri (tray + janela de config)
   pnpm dev:mobile    # Servidor de desenvolvimento Expo para o mobile
   ```

4. **Rode o lint em todo o monorepo:**
   ```bash
   pnpm lint
   ```

---

## 🌿 Estratégia de Branches

| Branch | Propósito |
| :--- | :--- |
| `main` | Código pronto para produção. Todo push dispara o pipeline de release. |
| `develop` | Branch de integração. Todo trabalho de feature/fix é mesclado aqui primeiro. |
| `feat/*` | Novas funcionalidades. |
| `fix/*` | Correção de bugs. |
| `docs/*` | Alterações somente de documentação. |

---

## 🔄 CI/CD

- **`ci.yml`** — roda em todo PR/push para `develop` e `feat/*`/`fix/*`/`docs/*`: lint, testes unitários e verificação de build (incluindo build check do Tauri no Windows).
- **`release.yml`** — roda em push para `main`: reexecuta a suíte de testes completa, e então abre um PR "Version Packages" (via [Changesets](https://github.com/changesets/changesets)) ou, quando esse PR já foi mesclado, builda o instalador do Windows, cria a tag e publica a release no GitHub com o checksum SHA-256.

---

## 📄 Licença

Distribuído sob a licença MIT.