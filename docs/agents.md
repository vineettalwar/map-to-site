# Agents

## Intelligence Layer (Phase 2)

**Schema:** `lib/schema/blueprint.ts` — strict Zod `siteBlueprintSchema` (seo, hero, features, socialProof, footer)

**AI service:** `lib/services/ai.ts`

- Input: `NormalizedBusinessData` from Phase 1
- Output: `SiteBlueprint` via AI SDK `generateText` + `Output.object`
- Providers: Ollama, OpenAI GPT-4o, or Anthropic Claude 3.5 Sonnet
- Selection: `LLM_PROVIDER` env var, with automatic fallback to whichever credentials are present

**Adapter:** `lib/schema/to-full-blueprint.ts` — maps `SiteBlueprint` + business data to the full `Blueprint` consumed by templates

**Persistence:** `lib/services/db-service.ts` — `saveBlueprintToDb` (INSERT) and `updateSiteWithBlueprint` (UPDATE)

## Blueprint Generator

File: `lib/agents/generate-blueprint.ts`

- Orchestrates Intelligence layer + adapter
- `generateBlueprint()` returns full `Blueprint` for templates
- `assertGenerationPrerequisites()` validates API keys

## Pipeline

File: `lib/pipeline/run-pipeline.ts`

1. Fetch Places details
2. Upload photos to R2
3. Generate blueprint (Intelligence layer → adapter)
4. Persist to D1 via `updateSiteWithBlueprint`

Triggered asynchronously from `POST /api/generate` using `ctx.waitUntil`.

See [ollama.md](./ollama.md) for local Ollama configuration.
