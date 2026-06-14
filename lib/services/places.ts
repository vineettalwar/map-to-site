const PLACE_FIELD_MASK = [
	"id",
	"displayName",
	"primaryTypeDisplayName",
	"formattedAddress",
	"nationalPhoneNumber",
	"websiteUri",
	"regularOpeningHours",
	"rating",
	"userRatingCount",
	"reviews",
	"photos",
].join(",");

export interface RawPlaceReview {
	authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
	rating?: number;
	text?: { text?: string; languageCode?: string };
	relativePublishTimeDescription?: string;
}

export interface GooglePlacePhoto {
	name: string;
	widthPx?: number;
	heightPx?: number;
	authorAttributions?: Array<{ displayName?: string; uri?: string; photoUri?: string }>;
}

export interface RawPlaceData {
	id: string;
	displayName?: { text?: string; languageCode?: string };
	primaryTypeDisplayName?: { text?: string; languageCode?: string };
	formattedAddress?: string;
	nationalPhoneNumber?: string;
	websiteUri?: string;
	regularOpeningHours?: { weekdayDescriptions?: string[] };
	rating?: number;
	userRatingCount?: number;
	reviews?: RawPlaceReview[];
	photos?: GooglePlacePhoto[];
}

export interface NormalizedReview {
	author: string;
	rating: number;
	text: string;
	relativeTime: string;
}

export interface NormalizedBusinessData {
	placeId: string;
	name: string;
	category: string | null;
	formattedAddress: string;
	phone: string | null;
	website: string | null;
	hours: string[];
	rating: number | null;
	userRatingCount: number | null;
	reviews: NormalizedReview[];
	photos: Array<{ name: string; widthPx: number; heightPx: number }>;
	imageUrls: string[];
}

export async function searchPlaceByText(
	textQuery: string,
	apiKey: string,
	location?: { latitude: number; longitude: number },
): Promise<string> {
	const body: Record<string, unknown> = { textQuery };
	if (location) {
		body.locationBias = {
			circle: {
				center: {
					latitude: location.latitude,
					longitude: location.longitude,
				},
				radius: 250,
			},
		};
	}

	const response = await fetch(
		"https://places.googleapis.com/v1/places:searchText",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": apiKey,
				"X-Goog-FieldMask": "places.id",
			},
			body: JSON.stringify(body),
		},
	);

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(
			`Google Places search error (${response.status}): ${errorBody || response.statusText}`,
		);
	}

	const data = (await response.json()) as { places?: Array<{ id?: string }> };
	const placeId = data.places?.[0]?.id;
	if (!placeId) {
		throw new Error(`No matching place found for "${textQuery}".`);
	}

	return placeId;
}

export async function getPlaceDetails(
	placeId: string,
	apiKey: string,
): Promise<RawPlaceData> {
	const response = await fetch(
		`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
		{
			headers: {
				"X-Goog-Api-Key": apiKey,
				"X-Goog-FieldMask": PLACE_FIELD_MASK,
			},
		},
	);

	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Google Places API error (${response.status}): ${body || response.statusText}`,
		);
	}

	return (await response.json()) as RawPlaceData;
}

export function normalizePlaceData(raw: RawPlaceData): NormalizedBusinessData {
	return {
		placeId: raw.id,
		name: raw.displayName?.text ?? "Local Business",
		category: raw.primaryTypeDisplayName?.text ?? null,
		formattedAddress: raw.formattedAddress ?? "",
		phone: raw.nationalPhoneNumber ?? null,
		website: raw.websiteUri ?? null,
		hours: raw.regularOpeningHours?.weekdayDescriptions ?? [],
		rating: raw.rating ?? null,
		userRatingCount: raw.userRatingCount ?? null,
		reviews: (raw.reviews ?? []).map((review) => ({
			author: review.authorAttribution?.displayName ?? "Anonymous",
			rating: review.rating ?? 5,
			text: review.text?.text ?? "",
			relativeTime: review.relativePublishTimeDescription ?? "",
		})),
		photos: (raw.photos ?? [])
			.filter((photo): photo is GooglePlacePhoto & { name: string } =>
				Boolean(photo.name),
			)
			.map((photo) => ({
				name: photo.name,
				widthPx: photo.widthPx ?? 0,
				heightPx: photo.heightPx ?? 0,
			})),
		imageUrls: [],
	};
}
