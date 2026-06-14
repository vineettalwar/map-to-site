import type { Metadata } from "next";

import type { Blueprint } from "@/lib/schemas/blueprint";

export function getHeroImageUrl(blueprint: Blueprint): string | undefined {
	return (
		blueprint.gallery.find((item) => item.role === "hero")?.url ??
		blueprint.gallery[0]?.url
	);
}

export function buildSiteMetadata(blueprint: Blueprint): Metadata {
	const heroImage = getHeroImageUrl(blueprint);

	return {
		title: blueprint.meta.title,
		description: blueprint.meta.description,
		keywords: blueprint.seo.keywords,
		openGraph: {
			title: blueprint.meta.title,
			description: blueprint.meta.description,
			type: "website",
			...(heroImage
				? {
						images: [
							{ url: heroImage, alt: blueprint.meta.businessName },
						],
					}
				: {}),
		},
		twitter: {
			card: heroImage ? "summary_large_image" : "summary",
			title: blueprint.meta.title,
			description: blueprint.meta.description,
			...(heroImage ? { images: [heroImage] } : {}),
		},
	};
}
