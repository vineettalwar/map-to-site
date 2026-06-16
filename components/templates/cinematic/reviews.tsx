"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { useRef } from "react";

import type { Blueprint } from "@/lib/schemas/blueprint";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicReviews({ blueprint }: { blueprint: Blueprint }) {
	const sectionRef = useRef<HTMLElement>(null);
	const quotesRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (
				!sectionRef.current ||
				!quotesRef.current ||
				reducedMotion ||
				blueprint.reviews.length === 0
			) {
				return;
			}

			const quotes = quotesRef.current.querySelectorAll("[data-review]");
			quotes.forEach((quote, index) => {
				if (index === 0) return;
				gsap.set(quote, { opacity: 0, y: 40 });
			});

			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: `+=${blueprint.reviews.length * 100}%`,
					pin: true,
					scrub: 1,
					anticipatePin: 1,
				},
			});

			quotes.forEach((quote, index) => {
				if (index === 0) return;
				timeline.to(quotes[index - 1], { opacity: 0, y: -30, duration: 0.5 });
				timeline.to(quote, { opacity: 1, y: 0, duration: 0.5 }, "<0.2");
			});
		},
		{ scope: sectionRef, dependencies: [reducedMotion, blueprint.reviews.length] },
	);

	if (blueprint.reviews.length === 0) return null;

	if (reducedMotion) {
		return (
			<section id="reviews" className="bg-slate-950 py-[var(--section-gap)] text-white">
				<div className="mx-auto max-w-6xl px-6">
					<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
						What customers are saying
					</h2>
					<div className="mt-10 grid gap-6 md:grid-cols-3">
						{blueprint.reviews.map((review) => (
							<ReviewCard key={`${review.author}-${review.relativeTime}`} review={review} />
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="reviews"
			ref={sectionRef}
			className="flex min-h-screen items-center bg-slate-950 text-white"
		>
			<div className="mx-auto w-full max-w-4xl px-6">
				<h2 className="mb-12 font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight">
					What customers are saying
				</h2>
				<div ref={quotesRef} className="relative min-h-[320px]">
					{blueprint.reviews.map((review, index) => (
						<div
							key={`${review.author}-${review.relativeTime}`}
							data-review
							className={index === 0 ? "relative" : "absolute inset-0"}
						>
							<ReviewCard review={review} large />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function ReviewCard({
	review,
	large = false,
}: {
	review: Blueprint["reviews"][number];
	large?: boolean;
}) {
	return (
		<article className="rounded-2xl border border-white/10 bg-white/5 p-8">
			<div className="mb-4 flex gap-1">
				{Array.from({ length: review.rating }).map((_, index) => (
					<Star
						key={index}
						className="h-4 w-4 fill-amber-400 text-amber-400"
					/>
				))}
			</div>
			<p
				className={
					large
						? "text-xl leading-9 text-slate-100 sm:text-2xl sm:leading-10"
						: "text-sm leading-7 text-slate-200"
				}
			>
				&ldquo;{review.text}&rdquo;
			</p>
			<p className="mt-6 text-sm font-medium text-white">{review.author}</p>
			<p className="text-xs text-slate-400">{review.relativeTime}</p>
		</article>
	);
}
