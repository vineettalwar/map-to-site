import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const key = path.join("/");

	if (!key.startsWith("sites/")) {
		return NextResponse.json({ error: "Invalid path" }, { status: 400 });
	}

	const { env } = getCloudflareContext();
	const object = await env.ASSETS_BUCKET.get(key);

	if (!object) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const headers = new Headers();
	headers.set(
		"Content-Type",
		object.httpMetadata?.contentType ?? "image/jpeg",
	);
	headers.set("Cache-Control", "public, max-age=31536000, immutable");

	return new Response(object.body, { headers });
}
