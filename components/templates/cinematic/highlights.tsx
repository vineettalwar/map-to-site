"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { useRef } from "react";

import type { Blueprint } from "@/lib/schemas/blueprint";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

export function CinematicHighlights({ blueprint }: { blueprint: Blueprint }) {
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!sectionRef.current || !trackRef.current || reducedMotion) return;

			const cards = trackRef.current.querySelectorAll("[data-highlight]");
			gsap.from(cards, {
				opacity: 0,
				y: 40,
				duration: 0.7,
				stagger: 0.1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
				},
			});
		},
		{ scope: sectionRef, dependencies: [reducedMotion] },
	);

	return (
		<section
			ref={sectionRef}
			className="overflow-hidden bg-muted/30 py-[var(--section-gap)]"
		>
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
					Why customers choose {blueprint.meta.businessName}
				</h2>
				<div
					ref={trackRef}
					className="mt-12 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible"
				>
					{blueprint.highlights.map((item) => {
						const Icon =
							ICONS[item.icon as keyof typeof ICONS] ?? Sparkles;
						return (
							<div
								key={item.title}
								data-highlight
								className="min-w-[260px] snap-start rounded-2xl border bg-card p-6 shadow-sm lg:min-w-0"
							>
								<div
									className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
									style={{
										backgroundColor: `hsl(${blueprint.theme.accent} / 0.15)`,
										color: `hsl(${blueprint.theme.accent})`,
									}}
								>
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
