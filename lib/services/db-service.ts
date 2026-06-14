import { eq } from "drizzle-orm";
import type { z } from "zod";

import type { Db } from "@/db/db";
import { sites } from "@/db/schema";
import { siteBlueprintSchema } from "@/lib/schema/blueprint";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { slugifyBusinessName, slugWithSuffix } from "@/lib/utils/slug";

type SiteBlueprint = z.infer<typeof siteBlueprintSchema>;

async function resolveUniqueSlug(
	db: Db,
	businessName: string,
	siteId: string,
	existingSlug?: string | null,
): Promise<string> {
	if (existingSlug) return existingSlug;

	const baseSlug = slugifyBusinessName(businessName);
	const [collision] = await db
		.select({ id: sites.id })
		.from(sites)
		.where(eq(sites.slug, baseSlug))
		.limit(1);

	if (!collision || collision.id === siteId) {
		return baseSlug;
	}

	const suffixed = slugWithSuffix(baseSlug, siteId);
	const [suffixCollision] = await db
		.select({ id: sites.id })
		.from(sites)
		.where(eq(sites.slug, suffixed))
		.limit(1);

	if (!suffixCollision || suffixCollision.id === siteId) {
		return suffixed;
	}

	return slugWithSuffix(baseSlug, siteId.slice(0, 8));
}

export async function saveBlueprintToDb(
	placeId: string,
	businessName: string,
	blueprint: SiteBlueprint,
	db: Db,
	googleMapsUrl = "",
): Promise<string> {
	const id = crypto.randomUUID();
	const now = new Date();

	await db.insert(sites).values({
		id,
		placeId,
		businessName,
		googleMapsUrl,
		status: "generated",
		pipelineStage: "ready",
		blueprint: JSON.stringify(blueprint),
		createdAt: now,
		updatedAt: now,
	});

	return id;
}

export async function updateSiteWithBlueprint(
	siteId: string,
	businessName: string,
	blueprint: Blueprint,
	db: Db,
	rawPlacesData?: string,
): Promise<void> {
	const now = new Date();

	const [existing] = await db
		.select({ slug: sites.slug })
		.from(sites)
		.where(eq(sites.id, siteId))
		.limit(1);

	const slug = await resolveUniqueSlug(
		db,
		businessName,
		siteId,
		existing?.slug,
	);

	await db
		.update(sites)
		.set({
			status: "generated",
			pipelineStage: "ready",
			businessName,
			slug,
			blueprint: JSON.stringify(blueprint),
			rawPlacesData: rawPlacesData ?? null,
			errorMessage: null,
			updatedAt: now,
		})
		.where(eq(sites.id, siteId));
}
