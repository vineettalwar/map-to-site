import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import { assertGenerationPrerequisites } from "@/lib/agents/generate-blueprint";
import { getEnvVar } from "@/lib/env";
import { runPipeline } from "@/lib/pipeline/run-pipeline";
import {
	parseGoogleMapsInput,
	UrlParseError,
} from "@/lib/services/url-parser";

export async function POST(request: Request) {
	try {
		assertGenerationPrerequisites();

		const body = (await request.json()) as { urls?: string[] };
		if (!body.urls || body.urls.length === 0) {
			return NextResponse.json({ error: "urls array is required" }, { status: 400 });
		}

		if (body.urls.length > 10) {
			return NextResponse.json(
				{ error: "Maximum 10 URLs per batch" },
				{ status: 400 },
			);
		}

		const db = getDb();
		const { ctx } = getCloudflareContext();
		const results: Array<{ url: string; id?: string; status?: string; error?: string }> =
			[];

		for (const url of body.urls) {
			try {
				const { placeId, normalizedUrl } = await parseGoogleMapsInput(url, {
					apiKey: getEnvVar("GOOGLE_PLACES_API_KEY"),
				});
				const [existing] = await db
					.select()
					.from(sites)
					.where(eq(sites.placeId, placeId))
					.limit(1);

				if (existing) {
					results.push({
						url,
						id: existing.id,
						status: existing.status,
					});
					continue;
				}

				const id = crypto.randomUUID();
				const now = new Date();

				await db.insert(sites).values({
					id,
					placeId,
					googleMapsUrl: normalizedUrl,
					status: "processing",
					pipelineStage: "starting",
					createdAt: now,
					updatedAt: now,
				});

				ctx.waitUntil(runPipeline(id, placeId));
				results.push({ url, id, status: "processing" });
			} catch (error) {
				results.push({
					url,
					error:
						error instanceof UrlParseError
							? error.message
							: error instanceof Error
								? error.message
								: "Failed",
				});
			}
		}

		return NextResponse.json({ results });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Batch generation failed";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
