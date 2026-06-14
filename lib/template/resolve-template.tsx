import { LandingTemplate } from "@/components/templates/landing";
import { CinematicTemplate } from "@/components/templates/cinematic";
import type { Blueprint } from "@/lib/schemas/blueprint";

export function SiteTemplate({ blueprint }: { blueprint: Blueprint }) {
	if (blueprint.motion?.variant === "minimal") {
		return <LandingTemplate blueprint={blueprint} />;
	}

	return <CinematicTemplate blueprint={blueprint} />;
}
