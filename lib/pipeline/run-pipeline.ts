import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import { generateBlueprint } from "@/lib/agents/generate-blueprint";
import { getEnvVar, requireEnvVar } from "@/lib/env";
import { updateSiteWithBlueprint } from "@/lib/services/db-service";
import { extractAndStore } from "@/lib/services/orchestrator";

async function updatePipelineStage(siteId: string, stage: string) {
	const db = getDb();
	await db
		.update(sites)
		.set({ pipelineStage: stage, updatedAt: new Date() })
		.where(eq(sites.id, siteId));
}

export async function runPipeline(siteId: string, placeId: string) {
	const db = getDb();

	try {
		await updatePipelineStage(siteId, "fetching_places");

		const { env } = getCloudflareContext();
		const business = await extractAndStore(placeId, siteId, {
			ASSETS_BUCKET: env.ASSETS_BUCKET,
			GOOGLE_PLACES_API_KEY: requireEnvVar("GOOGLE_PLACES_API_KEY"),
			R2_PUBLIC_BASE_URL: getEnvVar("R2_PUBLIC_BASE_URL"),
		});

		await updatePipelineStage(siteId, "generating_copy");
		const blueprint = await generateBlueprint(business);

		await updateSiteWithBlueprint(
			siteId,
			business.name,
			blueprint,
			db,
			JSON.stringify(business),
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown generation error";

		await db
			.update(sites)
			.set({
				status: "failed",
				pipelineStage: "failed",
				errorMessage: message,
				updatedAt: new Date(),
			})
			.where(eq(sites.id, siteId));

		console.error(`Pipeline failed for site ${siteId}`, error);
	}
}
