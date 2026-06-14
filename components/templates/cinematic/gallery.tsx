"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import type { Blueprint } from "@/lib/schemas/blueprint";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicGallery({ blueprint }: { blueprint: Blueprint }) {
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	const galleryItems = blueprint.gallery.filter(
		(item) => item.role !== "hero" || blueprint.gallery.length === 1,
	);

	useGSAP(
		() => {
			if (
				!sectionRef.current ||
				!trackRef.current ||
				reducedMotion ||
				galleryItems.length === 0
			) {
				return;
			}

			const totalScroll = trackRef.current.scrollWidth - window.innerWidth;

			gsap.to(trackRef.current, {
				x: -totalScroll,
				ease: "none",
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: () => `+=${totalScroll}`,
					pin: true,
					scrub: 1,
					anticipatePin: 1,
				},
			});
		},
		{ scope: sectionRef, dependencies: [reducedMotion, galleryItems.length] },
	);

	if (galleryItems.length === 0) return null;

	const attributions = [
		...new Set(
			galleryItems.map((item) => item.attribution).filter(Boolean) as string[],
		),
	];

	if (reducedMotion) {
		return (
			<section className="py-[var(--section-gap)]">
				<div className="mx-auto max-w-6xl px-6">
					<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
						Gallery
					</h2>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{galleryItems.map((image) => (
							<div
								key={image.url}
								className="aspect-[4/3] overflow-hidden rounded-2xl"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={image.url}
									alt={image.alt}
									className="h-full w-full object-cover"
								/>
							</div>
						))}
					</div>
					{attributions.length > 0 ? (
						<p className="mt-6 text-xs text-muted-foreground">
							Photos: {attributions.join(" · ")}
						</p>
					) : null}
				</div>
			</section>
		);
	}

	return (
		<section ref={sectionRef} className="relative bg-slate-950 text-white">
			<div className="absolute left-6 top-8 z-10">
				<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
					Gallery
				</h2>
			</div>
			<div ref={trackRef} className="flex h-screen items-center gap-6 px-6">
				{galleryItems.map((image) => (
					<div
						key={image.url}
						className="h-[70vh] w-[min(85vw,520px)] shrink-0 overflow-hidden rounded-3xl"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={image.url}
							alt={image.alt}
							className="h-full w-full object-cover"
						/>
					</div>
				))}
			</div>
			{attributions.length > 0 ? (
				<p className="absolute bottom-6 left-6 text-xs text-white/50">
					Photos: {attributions.join(" · ")}
				</p>
			) : null}
		</section>
	);
}
