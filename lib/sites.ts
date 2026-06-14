import { eq, or } from "drizzle-orm";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { blueprintSchema } from "@/lib/schemas/blueprint";
import { normalizeBlueprint } from "@/lib/schemas/normalize-blueprint";

function parseBlueprint(raw: string | null): Blueprint | null {
	if (!raw) return null;

	try {
		const parsed = JSON.parse(raw) as Parameters<typeof normalizeBlueprint>[0];
		const normalized = normalizeBlueprint(parsed);
		const result = blueprintSchema.safeParse(normalized);
		if (!result.success) return null;
		return result.data;
	} catch {
		return null;
	}
}

export function normalizeTenantKey(key: string): string {
	const normalized = key.trim().toLowerCase();
	if (normalized.startsWith("www.")) {
		return normalized.slice(4);
	}
	return normalized;
}

export async function getSiteById(id: string) {
	const db = getDb();
	const [site] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
	if (!site) return null;

	return { ...site, blueprint: parseBlueprint(site.blueprint) };
}

export async function getSiteByTenantKey(key: string) {
	const tenantKey = normalizeTenantKey(key);
	const db = getDb();

	const [site] = await db
		.select()
		.from(sites)
		.where(
			or(eq(sites.slug, tenantKey), eq(sites.customDomain, tenantKey)),
		)
		.limit(1);

	if (!site) return null;

	return { ...site, blueprint: parseBlueprint(site.blueprint) };
}
