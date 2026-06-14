import type { Blueprint } from "@/lib/schemas/blueprint";
import { resolveTheme } from "@/lib/theme/resolve-theme";

export function normalizeBlueprint(
	raw: Partial<Blueprint> & Pick<Blueprint, "meta" | "hero" | "about" | "highlights" | "gallery" | "reviews" | "contact" | "seo">,
): Blueprint {
	const categoryKey = raw.meta.category.replace(/\s+/g, "_").toLowerCase();

	return {
		meta: {
			rating: null,
			reviewCount: null,
			...raw.meta,
		},
		theme: raw.theme ?? resolveTheme([categoryKey]),
		motion: raw.motion ?? { variant: "cinematic" },
		hero: raw.hero,
		about: raw.about,
		highlights: raw.highlights,
		gallery: raw.gallery,
		reviews: raw.reviews,
		contact: {
			latitude: null,
			longitude: null,
			...raw.contact,
		},
		seo: raw.seo,
	};
}
