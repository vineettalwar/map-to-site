# Ollama Setup

Use Ollama for local, zero-cost copy generation instead of OpenAI or Anthropic.

## Prerequisites

1. [Ollama](https://ollama.com) installed and running
2. A model pulled locally, e.g.:

```bash
ollama pull llama3.2
ollama list
```

## Local development

Add to `.dev.vars`:

```env
GOOGLE_PLACES_API_KEY=your_key
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
# optional — defaults to http://localhost:11434/api
OLLAMA_BASE_URL=http://localhost:11434/api
```

Restart the dev server after changing `.dev.vars`.

## Production (Cloudflare Workers)

Cloudflare Workers **cannot** reach `localhost`. Set a reachable remote Ollama endpoint:

```bash
wrangler secret put GOOGLE_PLACES_API_KEY
wrangler secret put LLM_PROVIDER        # ollama
wrangler secret put OLLAMA_MODEL        # your-model-name
wrangler secret put OLLAMA_BASE_URL     # https://your-ollama-host/api
```

Use a tunnel, LAN IP, or internal server that Workers can reach over HTTPS.

## Recommended models

Models with strong JSON adherence work best for structured blueprint output:

- `llama3.2`
- `qwen2.5` (e.g. `qwen2.5:7b`)
- `mistral` variants

Smaller models may occasionally fail Zod schema validation. Retry generation or switch to a larger model.

## Provider selection

| Env | Effect |
|-----|--------|
| `LLM_PROVIDER=ollama` | Force Ollama (requires `OLLAMA_MODEL`) |
| `LLM_PROVIDER=openai` | Force OpenAI (requires `OPENAI_API_KEY`) |
| `LLM_PROVIDER=anthropic` | Force Anthropic (requires `ANTHROPIC_API_KEY`) |
| *(unset)* | Auto-detect: OpenAI key → OpenAI, Anthropic key → Anthropic, `OLLAMA_MODEL` → Ollama |

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Could not reach Ollama` | Run `ollama serve` or check `OLLAMA_BASE_URL` |
| `Missing required environment variable: OLLAMA_MODEL` | Set `OLLAMA_MODEL` to a pulled model name |
| Schema validation failed | Try a larger model or regenerate |
