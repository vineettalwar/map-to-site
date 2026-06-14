import type { Blueprint } from "@/lib/schemas/blueprint";
import type { NormalizedBusinessData } from "@/lib/services/places";
import { resolveTheme } from "@/lib/theme/resolve-theme";

import type { SiteBlueprint } from "./blueprint";

function categoryToThemeTypes(category: string | null): string[] {
	if (!category) return [];
	return [category.toLowerCase().replace(/\s+/g, "_")];
}

function assignPhotoRole(index: number): "hero" | "about" | "gallery" {
	if (index === 0) return "hero";
	if (index === 1) return "about";
	return "gallery";
}

function resolveCtaHref(business: NormalizedBusinessData): string {
	if (business.website) return business.website;
	if (business.phone) return `tel:${business.phone.replace(/\s/g, "")}`;
	return "#contact";
}

function deriveKeywords(business: NormalizedBusinessData): string[] {
	const keywords: string[] = [];
	if (business.category) keywords.push(business.category);
	keywords.push(business.name);
	if (business.formattedAddress) {
		const cityPart = business.formattedAddress.split(",").slice(-2, -1)[0]?.trim();
		if (cityPart) keywords.push(cityPart);
	}
	keywords.push("local business");
	return keywords.slice(0, 5);
}

export function toFullBlueprint(
	site: SiteBlueprint,
	business: NormalizedBusinessData,
): Blueprint {
	const theme = resolveTheme(categoryToThemeTypes(business.category));
	const roundedRating = Math.round(site.socialProof.averageRating);

	const gallery = business.imageUrls.map((url, index) => ({
		url,
		alt: `${business.name} photo ${index + 1}`,
		role: assignPhotoRole(index),
	}));

	const aboutBody =
		site.hero.subheadline || site.features[0]?.description || business.name;

	return {
		meta: {
			title: site.seo.title,
			description: site.seo.metaDescription,
			businessName: business.name,
			category: business.category ?? "Local Business",
			rating: business.rating,
			reviewCount: business.userRatingCount,
		},
		theme,
		motion: { variant: "cinematic" },
		hero: {
			headline: site.hero.headline,
			subheadline: site.hero.subheadline,
			ctaText: site.hero.ctaText,
			ctaHref: resolveCtaHref(business),
		},
		about: {
			title: `About ${business.name}`,
			body: aboutBody,
		},
		highlights: site.features.map((feature) => ({
			icon: feature.iconName,
			title: feature.title,
			description: feature.description,
		})),
		gallery,
		reviews: site.socialProof.testimonials.map((testimonial) => ({
			author: testimonial.author,
			rating: roundedRating,
			text: testimonial.text,
			relativeTime: "",
		})),
		contact: {
			address: site.footer.address || business.formattedAddress,
			phone: site.footer.phone || business.phone || "",
			website: business.website ?? "",
			hours:
				site.footer.hours ||
				(business.hours.length > 0 ? business.hours.join("; ") : ""),
		},
		seo: {
			keywords: deriveKeywords(business),
		},
	};
}
