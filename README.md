<div align="center">
  <img src="artifacts/moi-website/public/moi-logo-transparent.png" alt="MOI Logo" width="200" />
  
  # MadeOverInfluence (MOI)
  **Empowering Creators, Elevating Brands**
  
  <p>MOI is a creator-first talent management and influencer marketing agency built to scale long-term creator careers and secure premium brand partnerships.</p>
</div>

---

## ✨ Features

- **Blazing Fast Performance:** Built on React 19 and Vite for lightning-fast loads.
- **Premium Aesthetics:** Modern dark-mode UI with glassmorphism and tailored color palettes.
- **Buttery Smooth Animations:** High-performance, 60fps scrolling and micro-interactions powered by GSAP and Framer Motion. GPU-optimized gradients replace heavy blurs to ensure zero jank on mobile devices.
- **Serverless Architecture:** Fully integrated with Vercel Serverless Functions for seamless API handling (no separate Express server needed).
- **Automated Emails:** Contact forms are powered by the Resend SDK for reliable email delivery.
- **SEO Optimized:** Comprehensive Open Graph (OG), Twitter Cards, and semantic meta tags for perfect social sharing previews.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + TailwindCSS v4 + GSAP + Framer Motion |
| **Backend (API)** | Vercel Serverless Functions + Resend SDK |
| **Language** | TypeScript (Strict Mode) |
| **Monorepo** | pnpm workspaces |
| **Deployment** | Vercel (CI/CD) |

---

## 🚀 Local Development Setup

This project uses a monorepo structure managed by `pnpm`. Please ensure you use `pnpm` and not `npm` or `yarn`.

### Prerequisites
1. **Node.js** (v20 or v24)
2. **pnpm** (`npm install -g pnpm`)
3. **Vercel CLI** (`npm install -g vercel`)

### Step 1: Install Dependencies
Run the following command in the root directory to install packages for the entire workspace:
```bash
pnpm install
```

### Step 2: Environment Variables
Create a `.env` file in the **root folder**. The `.gitignore` is already configured to keep this secure.
```env
# Required for the Contact Form
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@madoverinfluence.com
CONTACT_RECEIVER_EMAIL=info.madeoverinfluence@gmail.com
```
*(You can obtain a free API key from [resend.com](https://resend.com))*

### Step 3: Start the Development Server
To run both the frontend and the serverless API functions locally, use the Vercel CLI:
```bash
vercel dev
```
- **Website:** `http://localhost:3000`
- **Health API:** `http://localhost:3000/api/healthz`
- **Contact API:** `http://localhost:3000/api/contact`

---

## 📁 Project Structure

```text
MOI-Website/
├── artifacts/
│   └── moi-website/               # Frontend + Serverless API
│       ├── api/                   # Vercel Serverless Functions
│       ├── src/                   # React Source Code (Components, Pages, Hooks)
│       └── public/                # Static assets (Favicons, OG Images)
├── lib/                           # Shared internal packages
│   └── api-zod/                   # Zod schemas shared between frontend and API
├── vercel.json                    # Vercel configuration & routing rules
├── pnpm-workspace.yaml            # Monorepo configuration
└── .env                           # Local environment variables (Git ignored)
```

## 📜 Available Commands

From the root of the project, you can run:

```bash
pnpm install                                     # Install all dependencies
vercel dev                                       # Start full-stack local server
pnpm --filter @workspace/moi-website run dev     # Start frontend ONLY (No API)
pnpm run build                                   # Build for production
pnpm run typecheck                               # Run TypeScript validation globally
```

---

<div align="center">
  <sub>Built with ❤️ by MadeOverInfluence</sub>
</div>
