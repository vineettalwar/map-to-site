import type { SiteBlueprint } from "@/lib/schema/blueprint";
import { getLucideIcon } from "@/lib/utils/lucide-icon";

type FeaturesSectionProps = {
	features: SiteBlueprint["features"];
};

export function FeaturesSection({ features }: FeaturesSectionProps) {
	const displayFeatures = features.slice(0, 3);

	return (
		<section id="highlights" className="py-[var(--section-gap)]">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Why customers choose us
				</h2>
				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{displayFeatures.map((feature) => {
						const Icon = getLucideIcon(feature.iconName);
						return (
							<div
								key={feature.title}
								className="rounded-2xl border bg-card p-6 shadow-sm"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-site-accent">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-lg font-semibold">{feature.title}</h3>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
