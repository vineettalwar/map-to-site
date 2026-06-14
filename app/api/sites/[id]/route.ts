import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import type { Blueprint } from "@/lib/schemas/blueprint";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const db = getDb();
	const [site] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);

	if (!site) {
		return NextResponse.json({ error: "Site not found" }, { status: 404 });
	}

	let blueprint: Blueprint | undefined;
	if (site.blueprint) {
		blueprint = JSON.parse(site.blueprint) as Blueprint;
	}

	return NextResponse.json({
		id: site.id,
		status: site.status,
		pipelineStage: site.pipelineStage ?? undefined,
		errorMessage: site.errorMessage ?? undefined,
		blueprint,
	});
}
