import { SiteNav } from "@/components/templates/shared/SiteNav";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { themeCssVariables } from "@/lib/theme/resolve-theme";

import { CinematicAbout } from "./about";
import { CinematicContact } from "./contact";
import { CinematicFooter } from "./footer";
import { CinematicGallery } from "./gallery";
import { CinematicHero } from "./hero";
import { CinematicHighlights } from "./highlights";
import { CinematicReviews } from "./reviews";

export function CinematicTemplate({ blueprint }: { blueprint: Blueprint }) {
	return (
		<div
			className="min-h-screen bg-background text-foreground"
			style={themeCssVariables(blueprint.theme) as React.CSSProperties}
		>
			<SiteNav blueprint={blueprint} />
			<CinematicHero blueprint={blueprint} />
			<CinematicAbout blueprint={blueprint} />
			<CinematicHighlights blueprint={blueprint} />
			<CinematicGallery blueprint={blueprint} />
			<CinematicReviews blueprint={blueprint} />
			<CinematicContact blueprint={blueprint} />
			<CinematicFooter blueprint={blueprint} />
		</div>
	);
}
