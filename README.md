<div align="center">
  <img src="artifacts/moi-website/public/moi-logo-transparent.png" alt="MadeOverInfluence Logo" width="220" />
  
  <br />
  <br />

  # MadeOverInfluence (MOI)
  **Empowering Creators, Elevating Brands**
  
  <p align="center">
    A premium, creator-first talent management and influencer marketing platform. Engineered to scale long-term creator careers and secure high-value brand partnerships through cutting-edge technology and design.
  </p>

  <br />
</div>

---

## ⚡ Core Features

- **Architected for Speed:** Built on React 19 and Vite, ensuring near-instantaneous load times and a seamless user journey.
- **Premium Design System:** A sophisticated dark-mode aesthetic leveraging glassmorphism, tailored typography, and a cohesive color palette that reflects modern brand standards.
- **High-Performance Animations:** 60fps scroll experiences and dynamic micro-interactions powered by GSAP and Framer Motion. Heavy CSS filters have been replaced with hardware-accelerated radial gradients to ensure zero frame drops on mobile devices.
- **Serverless Infrastructure:** Native integration with Vercel Serverless Functions for robust, zero-maintenance API handling (eliminating the overhead of traditional Node.js servers).
- **Automated Communication:** Contact systems are driven by the Resend SDK, guaranteeing reliable and secure email delivery.
- **Search Engine Optimized:** Fully equipped with semantic meta tags, Open Graph (OG), and Twitter Cards for rich, perfect previews across all social platforms.

---

## 🛠 Technology Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite, TailwindCSS v4 |
| **Animation Engine** | GSAP, Framer Motion |
| **Backend & API** | Vercel Serverless Functions, Resend SDK |
| **Type Safety** | TypeScript (Strict Mode), Zod |
| **Workspace Management** | pnpm (Monorepo) |
| **CI/CD & Hosting** | Vercel |

---

## 🚀 Local Development Guide

This repository utilizes a monorepo architecture managed by `pnpm`. Please ensure `pnpm` is used for all package management commands.

### Prerequisites
1. **Node.js** (v20 or v24 recommended)
2. **pnpm** (`npm install -g pnpm`)
3. **Vercel CLI** (`npm install -g vercel`)

### 1. Install Dependencies
Run the following command in the repository root to install packages across all workspaces:
```bash
pnpm install
```

### 2. Environment Configuration
Create a `.env` file in the **root directory**. The repository's `.gitignore` is pre-configured to ensure this file remains secure and local.
```env
# Resend API Configuration for Contact Form
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=your_sender_domain_email@example.com
CONTACT_RECEIVER_EMAIL=your_receiving_email@example.com
```
*(Secure your API key and configure domains via your [Resend Dashboard](https://resend.com))*

### 3. Initialize Development Environment
To run the full stack (Frontend + Serverless API) locally, utilize the Vercel CLI:
```bash
vercel dev
```
- **Web Interface:** `http://localhost:3000`
- **Health Check Endpoint:** `http://localhost:3000/api/healthz`
- **Contact Form Endpoint:** `http://localhost:3000/api/contact`

---

## 📁 Repository Structure

```text
MOI-Website/
├── artifacts/
│   └── moi-website/               # Frontend Application & Serverless API
│       ├── api/                   # Vercel Serverless Route Handlers
│       ├── src/                   # React Components, Pages, and Hooks
│       └── public/                # Static Assets (Favicons, OG Images)
├── lib/                           # Internal Shared Packages
│   └── api-zod/                   # Zod validation schemas (Shared across Full Stack)
├── vercel.json                    # Vercel Deployment & Routing Configuration
├── pnpm-workspace.yaml            # Monorepo Workspace Definitions
└── .env                           # Local Environment Variables (Git Ignored)
```

## 📜 CLI Reference

From the root directory, you can execute:

```bash
pnpm install                                     # Install all dependencies across workspaces
vercel dev                                       # Boot full-stack local server environment
pnpm --filter @workspace/moi-website run dev     # Boot frontend exclusively (API disabled)
pnpm run build                                   # Compile production-ready builds
pnpm run typecheck                               # Execute global TypeScript validation
```

---

<div align="center">
  <br />
  <sub>Engineered with precision by <b>MadeOverInfluence</b></sub>
</div>
