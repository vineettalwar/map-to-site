import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db/db";
import { sites } from "@/db/schema";
import { normalizeBlueprint } from "@/lib/schemas/normalize-blueprint";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const db = getDb();
	const [site] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);

	if (!site || !site.blueprint) {
		return NextResponse.json({ error: "Site not found" }, { status: 404 });
	}

	const blueprint = normalizeBlueprint(
		JSON.parse(site.blueprint) as Parameters<typeof normalizeBlueprint>[0],
	);

	const exportPayload = {
		id: site.id,
		placeId: site.placeId,
		businessName: site.businessName,
		googleMapsUrl: site.googleMapsUrl,
		status: site.status,
		blueprint,
		rawPlacesData: site.rawPlacesData
			? (JSON.parse(site.rawPlacesData) as Record<string, unknown>)
			: null,
		exportedAt: new Date().toISOString(),
	};

	return NextResponse.json(exportPayload, {
		headers: {
			"Content-Disposition": `attachment; filename="site-${id}.json"`,
		},
	});
}
