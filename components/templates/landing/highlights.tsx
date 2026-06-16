import {
	Clock,
	Heart,
	MapPin,
	Phone,
	Shield,
	Sparkles,
	Star,
	Users,
} from "lucide-react";

import type { Blueprint } from "@/lib/schemas/blueprint";

const ICONS = {
	star: Star,
	"map-pin": MapPin,
	clock: Clock,
	phone: Phone,
	shield: Shield,
	heart: Heart,
	sparkles: Sparkles,
	users: Users,
} as const;

export function Highlights({ blueprint }: { blueprint: Blueprint }) {
	return (
		<section id="highlights" className="bg-muted/40 py-20">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-3xl font-semibold tracking-tight">
					Why customers choose {blueprint.meta.businessName}
				</h2>
				<div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{blueprint.highlights.map((item) => {
						const Icon =
							ICONS[item.icon as keyof typeof ICONS] ?? Sparkles;
						return (
							<div
								key={item.title}
								className="rounded-2xl border bg-card p-6 shadow-sm"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-lg font-semibold">{item.title}</h3>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									{item.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
