# 🖥️ Nexus

![React Native](https://img.shields.io/badge/react%20native-Expo-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-20%2B-339933?logo=node.js&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-2.x-67E8F9?logo=tauri&logoColor=black)
![Rust](https://img.shields.io/badge/rust-stable-DEA584?logo=rust&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-in%20development-yellow)

> 🇧🇷 Versão em português: [README_PT.md](./README_PT.md)

> **Remote PC monitoring and control system, connecting a mobile app to a Windows agent over WebSocket.**
>
> A distributed-systems portfolio project: real-time system monitoring, process management, volume control, and remote power actions (Wake-on-LAN, shutdown, restart) — from a phone to a desktop, without a browser or third-party cloud in between.

---

## 📋 Contents

- [About](#-about)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [How to Run](#-how-to-run)
- [Branching Strategy](#-branching-strategy)
- [CI/CD](#-cicd)
- [License](#-license)

---

## 💡 About

Nexus lets you monitor and control a Windows PC remotely from an Android app. A lightweight agent runs on the PC, exposing system data and commands over a WebSocket connection to the mobile client on the same network.

The project was built to explore concepts that go beyond a typical CRUD app:

1. **Distributed systems** — two independent processes (mobile client, Windows agent) communicating over a defined protocol.
2. **Real-time communication** — persistent WebSocket connection streaming live metrics instead of polling.
3. **Operating system APIs** — reading CPU/RAM/GPU/temperature, managing processes, and controlling audio directly through Windows-level APIs.
4. **Sidecar architecture** — a native shell (Tauri/Rust) managing the lifecycle of a Node.js process that holds the actual business logic.

Since this is a learning/portfolio project, development follows a structured branching model and an automated CI/CD pipeline with unit tests, linting, and versioned GitHub Releases (see [Branching Strategy](#-branching-strategy) and [CI/CD](#-cicd) below).

---

## 🏗️ Architecture

```
Android (React Native)
        ↓  WebSocket
Windows Agent
  ├── Shell (Tauri / Rust) — tray icon, config window, process lifecycle
  └── Sidecar (Node.js / TypeScript) — business logic, system APIs
        ↓
Windows APIs (audio, processes, system info)
```

The mobile app and the agent's sidecar share a single source of truth for the communication protocol — the `@nexus/shared-types` package — so a change to a message shape breaks the build on both sides at compile time, not at runtime.

---

## 🚀 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile** | React Native (Expo), TypeScript |
| **Agent Shell** | Tauri (Rust), React (config window) |
| **Agent Sidecar** | Node.js, TypeScript, `systeminformation`, `ws`, `better-sqlite3` |
| **Shared Contracts** | TypeScript (`@nexus/shared-types`) |
| **Monorepo Tooling** | pnpm workspaces, Turborepo |
| **Versioning & Changelog** | Changesets |
| **Linting** | ESLint 9 (flat config), `typescript-eslint`, `@stylistic/eslint-plugin` |
| **CI/CD** | GitHub Actions |

---

## ✨ Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **Real-time monitoring** | CPU, RAM, GPU, and temperature pushed live over WebSocket | 🔜 |
| **Process management** | List running processes and terminate them remotely | 🔜 |
| **Volume control** | Global volume/mute and per-application volume | 🔜 |
| **Wake-on-LAN** | Power on the PC by sending a Magic Packet from the same network | 🔜 |
| **Shutdown / Restart** | Remote power actions, with confirmation required | 🔜 |
| **Usage history** | CPU/RAM history stored locally (SQLite) for later review | 🔜 |
| **Threshold notifications** | Alert when CPU/GPU usage crosses a configurable limit | 🔜 |

> Status will be updated as each feature is implemented.

---

## 📁 Project Structure

```
nexus/
├── apps/
│   ├── mobile/                 # React Native client
│   ├── agent-shell/            # Tauri shell (tray + config window)
│   └── agent-sidecar/          # Node.js business logic
├── packages/
│   ├── shared-types/           # Shared WebSocket protocol types
│   └── eslint-config/          # Shared ESLint configuration
├── .github/workflows/          # CI/CD pipelines
└── pnpm-workspace.yaml
```

Each app/package has its own README with setup and development details:

- [`apps/mobile`](./apps/mobile/README.md)
- [`apps/agent-shell`](./apps/agent-shell/README.md)
- [`apps/agent-sidecar`](./apps/agent-sidecar/README.md)
- [`packages/shared-types`](./packages/shared-types/README.md)
- [`packages/eslint-config`](./packages/eslint-config/README.md)

---

## ⚡ How to Run

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Rust](https://rustup.rs) + Visual Studio Build Tools (C++ workload) — required by Tauri on Windows
- [Expo Go](https://expo.dev/go) app or an Android emulator, for the mobile client

### Step by Step

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nexus.git
   cd nexus
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run each part in development mode** (separate terminals):
   ```bash
   pnpm dev:sidecar   # Node.js WebSocket server + system APIs
   pnpm dev:shell     # Tauri shell (tray + config window)
   pnpm dev:mobile    # Expo dev server for the mobile client
   ```

4. **Lint the whole monorepo:**
   ```bash
   pnpm lint
   ```

---

## 🌿 Branching Strategy

| Branch | Purpose |
| :--- | :--- |
| `main` | Production-ready code. Every push triggers the release pipeline. |
| `develop` | Integration branch. All feature/fix work merges here first. |
| `feat/*` | New features. |
| `fix/*` | Bug fixes. |
| `docs/*` | Documentation-only changes. |

---

## 🔄 CI/CD

- **`ci.yml`** — runs on every PR/push to `develop` and `feat/*`/`fix/*`/`docs/*`: lint, unit tests, and build checks (including a Tauri build check on Windows).
- **`release.yml`** — runs on push to `main`: re-runs the full test suite, then either opens a "Version Packages" PR (via [Changesets](https://github.com/changesets/changesets)) or, once that PR is merged, builds the Windows installer, tags the release, and publishes it to GitHub Releases with a SHA-256 checksum.

---

## 📄 License

Distributed under the MIT License.