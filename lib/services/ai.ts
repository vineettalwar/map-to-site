import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

import {
	getOllamaBaseUrl,
	getOllamaModel,
	resolveLlmProvider,
} from "@/lib/env";
import {
	lucideIconNameSchema,
	siteBlueprintSchema,
	type SiteBlueprint,
} from "@/lib/schema/blueprint";
import type { NormalizedBusinessData } from "@/lib/services/places";
import { BANNED_PHRASES, sanitizeCopy } from "@/lib/services/copy-sanitize";

const ALLOWED_ICONS = lucideIconNameSchema.options;

export class BlueprintGenerationError extends Error {
	constructor(
		message: string,
		readonly cause?: unknown,
	) {
		super(message);
		this.name = "BlueprintGenerationError";
	}
}

function getModel() {
	const provider = resolveLlmProvider();
	if (provider === "anthropic") {
		return anthropic("claude-3-5-sonnet-20241022");
	}
	if (provider === "ollama") {
		const ollama = createOllama({ baseURL: getOllamaBaseUrl() });
		return ollama(getOllamaModel());
	}
	return openai("gpt-4o");
}

function buildPrompt(businessData: NormalizedBusinessData): string {
	const trimmedBusiness = {
		placeId: businessData.placeId,
		name: businessData.name,
		category: businessData.category,
		formattedAddress: businessData.formattedAddress,
		phone: businessData.phone,
		website: businessData.website,
		hours: businessData.hours,
		rating: businessData.rating,
		userRatingCount: businessData.userRatingCount,
		reviews: businessData.reviews.slice(0, 5),
	};

	return JSON.stringify(
		{
			instructions: [
				"Analyze this business niche and write conversion-optimized landing page copy.",
				"Use only facts from the provided data. Do not invent services, awards, or reviews.",
				"Synthesize exactly 3 features from verifiable attributes: hours, location, rating, review themes.",
				"Polish 2-3 testimonials from raw reviews; keep author names when available.",
				"Headline: max 10 words. Subheadline: max 25 words.",
				"Choose niche-specific CTA text (e.g. restaurant → Reserve a Table, salon → Book Now).",
				`iconName must be one of: ${ALLOWED_ICONS.join(", ")}.`,
				`averageRating should reflect the business rating (${businessData.rating ?? "unknown"}).`,
				`Never use generic filler: ${BANNED_PHRASES.map((p) => `'${p}'`).join(", ")}.`,
			],
			businessData: trimmedBusiness,
		},
		null,
		2,
	);
}

function sanitizeSiteBlueprint(site: SiteBlueprint): SiteBlueprint {
	return {
		...site,
		hero: {
			...site.hero,
			headline: sanitizeCopy(site.hero.headline),
			subheadline: sanitizeCopy(site.hero.subheadline),
		},
		features: site.features.map((feature) => ({
			...feature,
			title: sanitizeCopy(feature.title),
			description: sanitizeCopy(feature.description),
		})),
	};
}

function classifyLlmError(error: unknown): string {
	if (error instanceof Error) {
		const msg = error.message.toLowerCase();
		if (msg.includes("timeout") || msg.includes("timed out")) {
			return "LLM request timed out. Please try again.";
		}
		if (
			msg.includes("token") ||
			msg.includes("context length") ||
			msg.includes("maximum")
		) {
			return "LLM token limit exceeded. Reduce input size and retry.";
		}
		if (msg.includes("econnrefused") || msg.includes("fetch failed")) {
			return "Could not reach Ollama. Check that Ollama is running and OLLAMA_BASE_URL is correct.";
		}
		return error.message;
	}
	return "Unknown LLM generation error.";
}

export async function generateLandingPageBlueprint(
	businessData: NormalizedBusinessData,
): Promise<SiteBlueprint> {
	try {
		const { output } = await generateText({
			model: getModel(),
			output: Output.object({ schema: siteBlueprintSchema }),
			system: `You are an elite Conversion Rate Optimization copywriter specializing in local business landing pages.
Analyze the provided business data — category, reviews, hours, and rating — to craft high-converting copy tailored to this specific niche.
Synthesize review themes into compelling features. Polish testimonials while preserving authenticity and author names.
Write concrete, credible copy with zero generic filler. Every word should drive action.
Return structured JSON only.`,
			prompt: buildPrompt(businessData),
			temperature: 0.35,
		});

		if (!output) {
			throw new Error("LLM returned no structured output.");
		}

		return sanitizeSiteBlueprint(output);
	} catch (error) {
		throw new BlueprintGenerationError(classifyLlmError(error), error);
	}
}
