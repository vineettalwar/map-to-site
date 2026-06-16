import { fromFullBlueprint } from "@/lib/schema/from-full-blueprint";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { SiteTemplate } from "@/lib/template/resolve-template";
import { themeCssVariables } from "@/lib/theme/resolve-theme";

import { SiteNav } from "./shared/SiteNav";
import { FeaturesSection } from "./FeaturesSection";
import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { TestimonialsSection } from "./TestimonialsSection";

function isKnownVariant(
	variant: string | undefined,
): variant is "cinematic" | "minimal" {
	return variant === "cinematic" || variant === "minimal";
}

function ModularTenantTemplate({ blueprint }: { blueprint: Blueprint }) {
	const siteBlueprint = fromFullBlueprint(blueprint);
	const themeVars = themeCssVariables(blueprint.theme);
	const averageRating =
		blueprint.meta.rating ??
		(blueprint.reviews.length > 0
			? blueprint.reviews.reduce((sum, review) => sum + review.rating, 0) /
				blueprint.reviews.length
			: 0);

	return (
		<div
			style={themeVars}
			className="min-h-screen bg-background text-foreground"
		>
			<SiteNav blueprint={blueprint} showAbout={false} />
			<HeroSection
				hero={siteBlueprint.hero}
				images={blueprint.gallery}
				ctaHref={blueprint.hero.ctaHref}
			/>
			<FeaturesSection features={siteBlueprint.features} />
			<TestimonialsSection
				reviews={blueprint.reviews}
				averageRating={averageRating}
			/>
			<FooterSection
				footer={siteBlueprint.footer}
				businessName={blueprint.meta.businessName}
				website={blueprint.contact.website}
			/>
		</div>
	);
}

export function TenantTemplate({ blueprint }: { blueprint: Blueprint }) {
	const variant = blueprint.motion?.variant;

	if (isKnownVariant(variant)) {
		return <SiteTemplate blueprint={blueprint} />;
	}

	return <ModularTenantTemplate blueprint={blueprint} />;
}
