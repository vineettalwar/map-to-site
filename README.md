# Map to Site

Turn Google Maps listings into cinematic, photo-led landing pages for agency client pitches. Built on Next.js and deployed to Cloudflare Workers.

## Features

- Paste a Google Maps URL → async generation pipeline
- Real listing photos stored on Cloudflare R2
- LLM-generated copy constrained to verified Places data
- Cinematic scroll template (GSAP ScrollTrigger) with reduced-motion fallback
- Agency dashboard at `/dashboard`
- Batch generation, regenerate, and JSON export APIs

## Prerequisites

- Node.js 20+
- Cloudflare account with D1, R2, and Workers enabled
- Google Places API key
- LLM provider: **Ollama** (local/remote), **OpenAI**, or **Anthropic**

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.dev.vars` in the project root:

```env
GOOGLE_PLACES_API_KEY=your_key

# Option A: Ollama (see docs/ollama.md)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2

# Option B: OpenAI
# OPENAI_API_KEY=your_key

# Option C: Anthropic
# ANTHROPIC_API_KEY=your_key
# LLM_PROVIDER=anthropic

# Optional: public R2 bucket URL. Without this, photos are served via /api/assets/
R2_PUBLIC_BASE_URL=https://your-r2-public-domain

# Multi-tenant routing (optional — defaults shown)
PLATFORM_BASE_DOMAIN=localhost
# Comma-separated platform hosts that skip tenant rewrite (admin, landing, etc.)
PLATFORM_HOSTS=localhost,127.0.0.1
```

3. Apply database migrations:

```bash
npm run db:migrate:local
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

```bash
npm run deploy
```

Set secrets on Cloudflare:

```bash
wrangler secret put GOOGLE_PLACES_API_KEY
# LLM — pick one provider:
wrangler secret put LLM_PROVIDER        # ollama | openai | anthropic
wrangler secret put OLLAMA_MODEL        # if using Ollama
wrangler secret put OLLAMA_BASE_URL     # if using Ollama (remote URL for Workers)
wrangler secret put OPENAI_API_KEY      # if using OpenAI
```

Apply remote migrations:

```bash
npm run db:migrate:remote
```

## API quick reference

| Endpoint | Description |
|----------|-------------|
| `POST /api/generate` | `{ "url": "...", "force": false }` |
| `POST /api/generate/batch` | `{ "urls": ["...", "..."] }` (max 10) |
| `GET /api/sites` | List recent sites |
| `GET /api/sites/:id` | Poll generation status |
| `POST /api/sites/:id/regenerate` | Re-run pipeline |
| `GET /api/sites/:id/export` | Download blueprint JSON |

## Docs

- [PRD](./docs/prd.md)
- [QA checklist](./docs/qa-checklist.md)
- [Design notes](./docs/design.md)
- [Agents & pipeline](./docs/agents.md)
- [Ollama setup](./docs/ollama.md)

## Multi-tenant routing

Generated business sites are served on tenant subdomains (`{slug}.yourdomain.com`) or custom domains. Edge middleware rewrites tenant requests to the internal `/[domain]` route; platform hosts (`localhost`, `app.yourdomain.com`, entries in `PLATFORM_HOSTS`) pass through to the admin app unchanged.

| Variable | Purpose |
|----------|---------|
| `PLATFORM_BASE_DOMAIN` | Base domain for subdomain tenants (default: `localhost`) |
| `PLATFORM_HOSTS` | Comma-separated hostnames that never trigger tenant rewrite |
| `R2_PUBLIC_BASE_URL` | Public R2 URL for `next/image` remote patterns |

Local tenant preview: `http://{slug}.localhost:3000` (requires slug assigned after generation completes).

## Architecture

```
Maps URL → POST /api/generate → runPipeline (waitUntil)
  → Google Places API
  → R2 photo upload (ranked by resolution)
  → LLM copy (Zod schema)
  → D1 persist
→ {slug}.yourdomain.com or /site/:id (TenantTemplate → cinematic | landing | modular)
```
