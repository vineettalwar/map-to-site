import type { Blueprint } from "@/lib/schemas/blueprint";
import { themeCssVariables } from "@/lib/theme/resolve-theme";

import { About } from "./about";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { Gallery } from "./gallery";
import { Hero } from "./hero";
import { Highlights } from "./highlights";
import { Reviews } from "./reviews";

export function LandingTemplate({ blueprint }: { blueprint: Blueprint }) {
	return (
		<div
			className="min-h-screen bg-background text-foreground"
			style={themeCssVariables(blueprint.theme) as React.CSSProperties}
		>
			<Hero blueprint={blueprint} />
			<About blueprint={blueprint} />
			<Highlights blueprint={blueprint} />
			<Gallery blueprint={blueprint} />
			<Reviews blueprint={blueprint} />
			<Contact blueprint={blueprint} />
			<Footer blueprint={blueprint} />
		</div>
	);
}
