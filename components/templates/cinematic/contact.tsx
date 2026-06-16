"use client";

import { Clock, Globe, MapPin, Phone } from "lucide-react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { accentBackgroundStyle } from "@/lib/theme/accent-style";

export function CinematicContact({ blueprint }: { blueprint: Blueprint }) {
	const mapUrl =
		blueprint.contact.latitude != null && blueprint.contact.longitude != null
			? `https://maps.google.com/maps?q=${blueprint.contact.latitude},${blueprint.contact.longitude}&z=15&output=embed`
			: null;

	return (
		<>
			<section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-[var(--section-gap)]">
				<ScrollReveal>
					<div className="grid gap-10 lg:grid-cols-2">
						<div>
							<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
								Visit us
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Connect with {blueprint.meta.businessName} using the details
								below.
							</p>
						</div>
						<div className="space-y-5 rounded-2xl border bg-card p-8 shadow-sm">
							<ContactRow icon={MapPin} label="Address" value={blueprint.contact.address} />
							{blueprint.contact.phone ? (
								<ContactRow
									icon={Phone}
									label="Phone"
									value={blueprint.contact.phone}
									href={`tel:${blueprint.contact.phone}`}
								/>
							) : null}
							{blueprint.contact.website ? (
								<ContactRow
									icon={Globe}
									label="Website"
									value={blueprint.contact.website}
									href={blueprint.contact.website}
									external
								/>
							) : null}
							{blueprint.contact.hours ? (
								<ContactRow
									icon={Clock}
									label="Hours"
									value={blueprint.contact.hours}
								/>
							) : null}
						</div>
					</div>
				</ScrollReveal>
				{mapUrl ? (
					<ScrollReveal delay={0.1} className="mt-10">
						<div className="overflow-hidden rounded-3xl border">
							<iframe
								title={`Map of ${blueprint.meta.businessName}`}
								src={mapUrl}
								className="aspect-[16/9] w-full border-0"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
					</ScrollReveal>
				) : null}
			</section>

			<div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-4 backdrop-blur md:hidden">
				<a
					href={blueprint.hero.ctaHref}
					className="flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-slate-950"
					style={accentBackgroundStyle(blueprint.theme.accent)}
				>
					{blueprint.hero.ctaText}
				</a>
			</div>
		</>
	);
}

function ContactRow({
	icon: Icon,
	label,
	value,
	href,
	external,
}: {
	icon: typeof MapPin;
	label: string;
	value: string;
	href?: string;
	external?: boolean;
}) {
	return (
		<div className="flex items-start gap-3">
			<Icon className="mt-1 h-5 w-5" style={{ color: "hsl(var(--site-accent))" }} />
			<div>
				<p className="font-medium">{label}</p>
				{href ? (
					<a
						href={href}
						className="text-sm text-muted-foreground hover:text-foreground"
						{...(external
							? { target: "_blank", rel: "noreferrer" }
							: {})}
					>
						{value}
					</a>
				) : (
					<p className="text-sm text-muted-foreground">{value}</p>
				)}
			</div>
		</div>
	);
}
