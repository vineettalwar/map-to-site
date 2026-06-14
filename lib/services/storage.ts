import type { GooglePlacePhoto } from "@/lib/services/places";

export interface UploadedImage {
	url: string;
	key: string;
}

export interface ProcessImagesOptions {
	siteId: string;
	businessName: string;
	maxPhotos?: number;
	publicBaseUrl?: string;
}

function extensionForContentType(contentType: string): string {
	if (contentType.includes("png")) return "png";
	if (contentType.includes("webp")) return "webp";
	return "jpg";
}

export function publicUrlForKey(key: string, publicBaseUrl?: string): string {
	if (publicBaseUrl) {
		return `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
	}
	return `/api/assets/${key}`;
}

function rankPhotosByResolution(
	photos: Array<{ name: string; widthPx: number; heightPx: number }>,
): Array<{ name: string; widthPx: number; heightPx: number }> {
	return [...photos].sort(
		(a, b) => b.widthPx * b.heightPx - a.widthPx * a.heightPx,
	);
}

async function downloadPlacePhoto(
	photoName: string,
	googleApiKey: string,
): Promise<{ bytes: ArrayBuffer; contentType: string }> {
	const url = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
	url.searchParams.set("maxHeightPx", "1080");
	url.searchParams.set("key", googleApiKey);

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`Failed to download photo (${response.status})`);
	}

	return {
		bytes: await response.arrayBuffer(),
		contentType: response.headers.get("content-type") ?? "image/jpeg",
	};
}

export async function processAndUploadImages(
	photos: GooglePlacePhoto[] | Array<{ name: string; widthPx: number; heightPx: number }>,
	r2Bucket: R2Bucket,
	googleApiKey: string,
	options: ProcessImagesOptions,
): Promise<UploadedImage[]> {
	const { siteId, maxPhotos = 8, publicBaseUrl } = options;
	const ranked = rankPhotosByResolution(
		photos.map((photo) => ({
			name: photo.name,
			widthPx: photo.widthPx ?? 0,
			heightPx: photo.heightPx ?? 0,
		})),
	).slice(0, maxPhotos);

	const uploads: UploadedImage[] = [];

	for (const [index, photo] of ranked.entries()) {
		if (!photo.name) continue;

		try {
			const { bytes, contentType } = await downloadPlacePhoto(
				photo.name,
				googleApiKey,
			);
			const ext = extensionForContentType(contentType);
			const key = `sites/${siteId}/photos/${index}.${ext}`;

			await r2Bucket.put(key, bytes, {
				httpMetadata: { contentType },
			});

			uploads.push({
				key,
				url: publicUrlForKey(key, publicBaseUrl),
			});
		} catch (error) {
			console.error(
				`Failed to upload photo ${index} for site ${siteId}`,
				error,
			);
		}
	}

	return uploads;
}
