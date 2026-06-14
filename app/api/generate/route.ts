import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import {
	assertGenerationPrerequisites,
	GenerationSetupError,
} from "@/lib/agents/generate-blueprint";
import { getEnvVar } from "@/lib/env";
import { runPipeline } from "@/lib/pipeline/run-pipeline";
import { tenantUrlForSlug } from "@/lib/tenant/tenant-url";
import {
	parseGoogleMapsInput,
	UrlParseError,
} from "@/lib/services/url-parser";

export async function POST(request: Request) {
	try {
		assertGenerationPrerequisites();

		const body = (await request.json()) as { url?: string; force?: boolean };
		if (!body.url) {
			return NextResponse.json({ error: "url is required" }, { status: 400 });
		}

		const force = body.force === true;
		const { placeId, normalizedUrl } = await parseGoogleMapsInput(body.url, {
			apiKey: getEnvVar("GOOGLE_PLACES_API_KEY"),
		});
		const db = getDb();

		const [existing] = await db
			.select()
			.from(sites)
			.where(eq(sites.placeId, placeId))
			.limit(1);

		if (existing) {
			if (existing.status === "generated" && !force) {
				return NextResponse.json({
					id: existing.id,
					status: existing.status,
					slug: existing.slug,
					redirectUrl: `/site/${existing.id}`,
					...(existing.slug
						? { tenantUrl: tenantUrlForSlug(existing.slug) }
						: {}),
				});
			}

			if (
				force ||
				existing.status === "failed" ||
				existing.status === "generated"
			) {
				const now = new Date();
				await db
					.update(sites)
					.set({
						status: "processing",
						pipelineStage: "starting",
						errorMessage: null,
						googleMapsUrl: normalizedUrl,
						updatedAt: now,
					})
					.where(eq(sites.id, existing.id));

				const { ctx } = getCloudflareContext();
				ctx.waitUntil(runPipeline(existing.id, placeId));

				return NextResponse.json({
					id: existing.id,
					status: "processing" as const,
				});
			}

			return NextResponse.json({
				id: existing.id,
				status: existing.status,
			});
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

		const { ctx } = getCloudflareContext();
		ctx.waitUntil(runPipeline(id, placeId));

		return NextResponse.json({ id, status: "processing" as const });
	} catch (error) {
		if (error instanceof UrlParseError) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		if (error instanceof GenerationSetupError) {
			return NextResponse.json({ error: error.message }, { status: 503 });
		}

		const message =
			error instanceof Error ? error.message : "Failed to start generation";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
