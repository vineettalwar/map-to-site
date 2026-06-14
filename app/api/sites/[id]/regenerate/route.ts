import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import { assertGenerationPrerequisites } from "@/lib/agents/generate-blueprint";
import { runPipeline } from "@/lib/pipeline/run-pipeline";

export async function POST(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		assertGenerationPrerequisites();

		const { id } = await params;
		const db = getDb();
		const [site] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);

		if (!site) {
			return NextResponse.json({ error: "Site not found" }, { status: 404 });
		}

		const now = new Date();
		await db
			.update(sites)
			.set({
				status: "processing",
				pipelineStage: "starting",
				errorMessage: null,
				updatedAt: now,
			})
			.where(eq(sites.id, id));

		const { ctx } = getCloudflareContext();
		ctx.waitUntil(runPipeline(id, site.placeId));

		return NextResponse.json({ id, status: "processing" as const });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to regenerate site";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
