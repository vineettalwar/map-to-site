import {
	lucideIconNameSchema,
	siteBlueprintSchema,
	type SiteBlueprint,
} from "@/lib/schema/blueprint";
import type { Blueprint } from "@/lib/schemas/blueprint";

const ALLOWED_ICONS = new Set(lucideIconNameSchema.options);

function toIconName(icon: string): SiteBlueprint["features"][number]["iconName"] {
	if (ALLOWED_ICONS.has(icon as SiteBlueprint["features"][number]["iconName"])) {
		return icon as SiteBlueprint["features"][number]["iconName"];
	}
	return "sparkles";
}

export function fromFullBlueprint(blueprint: Blueprint): SiteBlueprint {
	const features = blueprint.highlights.slice(0, 3).map((highlight) => ({
		title: highlight.title,
		description: highlight.description,
		iconName: toIconName(highlight.icon),
	}));

	while (features.length < 3) {
		features.push({
			title: blueprint.meta.businessName,
			description: blueprint.meta.description,
			iconName: "sparkles",
		});
	}

	const averageRating =
		blueprint.meta.rating ?? blueprint.reviews[0]?.rating ?? 0;

	const testimonials = blueprint.reviews.slice(0, 3).map((review) => ({
		author: review.author,
		text: review.text,
	}));

	while (testimonials.length < 2) {
		testimonials.push({
			author: blueprint.meta.businessName,
			text: blueprint.meta.description,
		});
	}

	const copyrightText = `© ${new Date().getFullYear()} ${blueprint.meta.businessName}`.slice(
		0,
		120,
	);

	return siteBlueprintSchema.parse({
		seo: {
			title: blueprint.meta.title,
			metaDescription: blueprint.meta.description,
		},
		hero: {
			headline: blueprint.hero.headline,
			subheadline: blueprint.hero.subheadline,
			ctaText: blueprint.hero.ctaText,
		},
		features: features.slice(0, 3) as SiteBlueprint["features"],
		socialProof: {
			averageRating,
			testimonials: testimonials.slice(0, 3) as SiteBlueprint["socialProof"]["testimonials"],
		},
		footer: {
			address: blueprint.contact.address,
			phone: blueprint.contact.phone,
			hours: blueprint.contact.hours,
			copyrightText,
		},
	});
}
