import { getCloudflareContext } from "@opennextjs/cloudflare";

export type LlmProvider = "openai" | "anthropic" | "ollama";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434/api";

function getCloudflareEnvVar(name: string): string | undefined {
	try {
		const { env } = getCloudflareContext();
		const value = (env as unknown as Record<string, unknown>)[name];
		return typeof value === "string" && value.length > 0 ? value : undefined;
	} catch {
		return undefined;
	}
}

export function getEnvVar(name: string): string | undefined {
	return process.env[name] ?? getCloudflareEnvVar(name);
}

export function requireEnvVar(name: string): string {
	const value = getEnvVar(name);
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

export function getOllamaBaseUrl(): string {
	return getEnvVar("OLLAMA_BASE_URL") ?? DEFAULT_OLLAMA_BASE_URL;
}

export function getOllamaModel(): string {
	return requireEnvVar("OLLAMA_MODEL");
}

export function resolveLlmProvider(): LlmProvider {
	const configured = getEnvVar("LLM_PROVIDER") as LlmProvider | undefined;
	if (
		configured === "openai" ||
		configured === "anthropic" ||
		configured === "ollama"
	) {
		if (configured === "ollama") {
			getOllamaModel();
		}
		return configured;
	}
	if (getEnvVar("OPENAI_API_KEY")) return "openai";
	if (getEnvVar("ANTHROPIC_API_KEY")) return "anthropic";
	if (getEnvVar("OLLAMA_MODEL")) return "ollama";
	throw new Error(
		"No LLM provider configured. Set LLM_PROVIDER=ollama with OLLAMA_MODEL, or OPENAI_API_KEY, or ANTHROPIC_API_KEY.",
	);
}

export function getPlatformBaseDomain(): string {
	return getEnvVar("PLATFORM_BASE_DOMAIN") ?? "localhost";
}

export function getPlatformHosts(): string[] {
	const configured = getEnvVar("PLATFORM_HOSTS");
	if (configured) {
		return configured.split(",").map((host) => host.trim().toLowerCase());
	}
	const base = getPlatformBaseDomain().toLowerCase();
	return ["localhost", "127.0.0.1", base, `www.${base}`, `app.${base}`];
}
