"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { useRef } from "react";

import { PinnedSection } from "@/components/motion/pinned-section";
import { StaggerChildren } from "@/components/motion/stagger-children";
import type { Blueprint } from "@/lib/schemas/blueprint";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { accentBackgroundStyle } from "@/lib/theme/accent-style";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function getHeroImage(blueprint: Blueprint): string | undefined {
	return (
		blueprint.gallery.find((item) => item.role === "hero")?.url ??
		blueprint.gallery[0]?.url
	);
}

export function CinematicHero({ blueprint }: { blueprint: Blueprint }) {
	const heroImage = getHeroImage(blueprint);
	const sectionRef = useRef<HTMLElement>(null);
	const bgRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!sectionRef.current || !bgRef.current || reducedMotion) return;

			gsap.to(bgRef.current, {
				scale: 1.12,
				ease: "none",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: "bottom top",
					scrub: true,
				},
			});
		},
		{ scope: sectionRef, dependencies: [reducedMotion] },
	);

	const heroContent = (
		<div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-24 pt-32">
			<StaggerChildren>
				<p
					data-stagger
					className="mb-4 text-sm font-medium tracking-[0.25em] uppercase"
					style={{ color: "hsl(var(--site-accent))" }}
				>
					{blueprint.meta.category}
				</p>
				{blueprint.meta.rating ? (
					<div
						data-stagger
						className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"
					>
						<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
						<span>{blueprint.meta.rating.toFixed(1)}</span>
						{blueprint.meta.reviewCount ? (
							<span className="text-white/70">
								({blueprint.meta.reviewCount.toLocaleString()} reviews)
							</span>
						) : null}
					</div>
				) : null}
				<h1
					data-stagger
					className="max-w-4xl font-[family-name:var(--font-instrument-serif)] text-5xl leading-[1.05] tracking-tight text-balance sm:text-7xl"
				>
					{blueprint.hero.headline}
				</h1>
				<p
					data-stagger
					className="mt-6 max-w-2xl text-lg text-slate-200 text-pretty sm:text-xl"
				>
					{blueprint.hero.subheadline}
				</p>
				<a
					data-stagger
					href={blueprint.hero.ctaHref}
					className="mt-10 inline-flex w-fit rounded-full px-8 py-4 text-sm font-semibold text-slate-950 transition hover:opacity-90"
					style={accentBackgroundStyle(blueprint.theme.accent)}
				>
					{blueprint.hero.ctaText}
				</a>
			</StaggerChildren>
		</div>
	);

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-slate-950 text-white"
			style={
				{
					"--site-accent": blueprint.theme.accent,
				} as React.CSSProperties
			}
		>
			{heroImage ? (
				<div
					ref={bgRef}
					className="absolute inset-0 bg-cover bg-center will-change-transform"
					style={{ backgroundImage: `url(${heroImage})` }}
				/>
			) : (
				<div
					className="absolute inset-0"
					style={{
						background: `linear-gradient(135deg, hsl(${blueprint.theme.accent} / 0.35), hsl(var(--hero-overlay)))`,
					}}
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
			{reducedMotion ? heroContent : (
				<PinnedSection end="+=80%">{heroContent}</PinnedSection>
			)}
		</section>
	);
}
