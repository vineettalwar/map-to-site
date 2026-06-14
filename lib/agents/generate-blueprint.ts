import { getEnvVar, resolveLlmProvider } from "@/lib/env";
import { toFullBlueprint } from "@/lib/schema/to-full-blueprint";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { generateLandingPageBlueprint } from "@/lib/services/ai";
import type { NormalizedBusinessData } from "@/lib/services/places";

export async function generateBlueprint(
	business: NormalizedBusinessData,
): Promise<Blueprint> {
	const siteBlueprint = await generateLandingPageBlueprint(business);
	return toFullBlueprint(siteBlueprint, business);
}

export class GenerationSetupError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GenerationSetupError";
	}
}

export function assertGenerationPrerequisites() {
	if (!getEnvVar("GOOGLE_PLACES_API_KEY")) {
		throw new GenerationSetupError(
			"Server setup incomplete: add GOOGLE_PLACES_API_KEY to .dev.vars (local) or wrangler secrets (deployed).",
		);
	}
	try {
		resolveLlmProvider();
	} catch {
		throw new GenerationSetupError(
			"Server setup incomplete: set LLM_PROVIDER=ollama with OLLAMA_MODEL, or OPENAI_API_KEY, or ANTHROPIC_API_KEY in .dev.vars (local) or wrangler secrets (deployed).",
		);
	}
}
