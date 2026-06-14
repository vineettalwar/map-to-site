import {
	getPlaceDetails,
	normalizePlaceData,
	type NormalizedBusinessData,
} from "@/lib/services/places";
import { processAndUploadImages } from "@/lib/services/storage";

export interface ExtractionEnv {
	ASSETS_BUCKET: R2Bucket;
	GOOGLE_PLACES_API_KEY: string;
	R2_PUBLIC_BASE_URL?: string;
}

export async function extractAndStore(
	placeId: string,
	siteId: string,
	env: ExtractionEnv,
): Promise<NormalizedBusinessData> {
	try {
		const raw = await getPlaceDetails(placeId, env.GOOGLE_PLACES_API_KEY);
		const normalized = normalizePlaceData(raw);

		const uploads = await processAndUploadImages(
			normalized.photos,
			env.ASSETS_BUCKET,
			env.GOOGLE_PLACES_API_KEY,
			{
				siteId,
				businessName: normalized.name,
				publicBaseUrl: env.R2_PUBLIC_BASE_URL,
			},
		);

		return {
			...normalized,
			imageUrls: uploads.map((upload) => upload.url),
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown extraction error";
		throw new Error(`Failed to extract place ${placeId}: ${message}`);
	}
}
