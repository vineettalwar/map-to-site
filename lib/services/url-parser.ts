const PLACE_ID_PATTERN = /^ChI[\w-]{20,}$/;

const SHORT_LINK_HOSTS = ["goo.gl", "maps.app.goo.gl", "share.google"];

function isShortLinkHost(hostname: string): boolean {
	return SHORT_LINK_HOSTS.some(
		(host) => hostname === host || hostname.endsWith(`.${host}`),
	);
}

function isGoogleMapsHost(hostname: string): boolean {
	return (
		hostname.includes("google.") ||
		isShortLinkHost(hostname) ||
		hostname === "maps.google.com"
	);
}

export class UrlParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UrlParseError";
	}
}

function getDataFragment(url: URL): string | null {
	const fromQuery = url.searchParams.get("data");
	if (fromQuery) return fromQuery;

	const dataMatch = url.pathname.match(/\/data=([^/?#]+)/);
	return dataMatch?.[1] ?? null;
}

function extractPlaceIdFromData(data: string): string | null {
	const match = data.match(/!1s(ChI[\w-]+)/);
	return match?.[1] ?? null;
}

function extractBusinessName(url: URL): string | null {
	const nameMatch = url.pathname.match(/\/place\/([^/@]+)/);
	if (!nameMatch?.[1]) return null;

	return decodeURIComponent(nameMatch[1].replace(/\+/g, " ")).trim() || null;
}

function extractCoordinates(url: URL): { latitude: number; longitude: number } | null {
	const data = getDataFragment(url);
	if (data) {
		const precise = data.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
		if (precise) {
			return {
				latitude: Number(precise[1]),
				longitude: Number(precise[2]),
			};
		}
	}

	const atMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
	if (atMatch) {
		return {
			latitude: Number(atMatch[1]),
			longitude: Number(atMatch[2]),
		};
	}

	return null;
}

function extractPlaceIdFromUrl(url: URL): string | null {
	const placeIdParam = url.searchParams.get("place_id");
	if (placeIdParam) return placeIdParam;

	const q = url.searchParams.get("q");
	if (q) {
		const placeIdFromQ = q.match(/place_id:(ChI[\w-]+)/)?.[1];
		if (placeIdFromQ) return placeIdFromQ;
		if (PLACE_ID_PATTERN.test(q)) return q;
	}

	const query = url.searchParams.get("query_place_id");
	if (query) return query;

	const data = getDataFragment(url);
	if (data) {
		const fromData = extractPlaceIdFromData(data);
		if (fromData) return fromData;
	}

	const pathMatch = url.pathname.match(/(ChI[\w-]+)/);
	if (pathMatch?.[1]) return pathMatch[1];

	return null;
}

export async function parseGoogleMapsInput(
	input: string,
	options?: { apiKey?: string },
): Promise<{
	placeId: string;
	normalizedUrl: string;
}> {
	const trimmed = input.trim();
	if (!trimmed) {
		throw new UrlParseError("Please enter a Google Maps URL or Place ID.");
	}

	if (PLACE_ID_PATTERN.test(trimmed)) {
		return {
			placeId: trimmed,
			normalizedUrl: `https://www.google.com/maps/place/?q=place_id:${trimmed}`,
		};
	}

	let resolvedUrl: URL;
	try {
		resolvedUrl = new URL(trimmed);
	} catch {
		throw new UrlParseError("Invalid URL. Paste a Google Maps link or Place ID.");
	}

	if (!isGoogleMapsHost(resolvedUrl.hostname)) {
		throw new UrlParseError("URL must be a Google Maps link.");
	}

	if (resolvedUrl.hostname.includes("share.google")) {
		throw new UrlParseError(
			"That is a Google Share link, not a Maps listing. Open the business in Google Maps, tap Share, and copy the Maps link (maps.app.goo.gl or google.com/maps/place/...).",
		);
	}

	if (isShortLinkHost(resolvedUrl.hostname)) {
		const response = await fetch(resolvedUrl.toString(), {
			method: "HEAD",
			redirect: "follow",
		});
		resolvedUrl = new URL(response.url);
	}

	let placeId = extractPlaceIdFromUrl(resolvedUrl);

	if (!placeId && options?.apiKey) {
		const businessName = extractBusinessName(resolvedUrl);
		if (businessName) {
			const { searchPlaceByText } = await import("@/lib/services/places");
			placeId = await searchPlaceByText(
				businessName,
				options.apiKey,
				extractCoordinates(resolvedUrl) ?? undefined,
			);
		}
	}

	if (!placeId) {
		throw new UrlParseError(
			"Could not find a Place ID in that link. Open the business in Google Maps and copy the link from Share or the browser address bar.",
		);
	}

	return {
		placeId,
		normalizedUrl: resolvedUrl.toString(),
	};
}
