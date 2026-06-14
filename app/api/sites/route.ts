import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";

export async function GET() {
	const db = getDb();
	const rows = await db
		.select({
			id: sites.id,
			slug: sites.slug,
			businessName: sites.businessName,
			status: sites.status,
			pipelineStage: sites.pipelineStage,
			googleMapsUrl: sites.googleMapsUrl,
			createdAt: sites.createdAt,
			updatedAt: sites.updatedAt,
		})
		.from(sites)
		.orderBy(desc(sites.updatedAt))
		.limit(50);

	return NextResponse.json({ sites: rows });
}
