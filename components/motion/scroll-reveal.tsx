"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	y?: number;
}

export function ScrollReveal({
	children,
	className,
	delay = 0,
	y = 48,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!ref.current || reducedMotion) return;

			gsap.from(ref.current, {
				opacity: 0,
				y,
				duration: 0.9,
				delay,
				ease: "power3.out",
				scrollTrigger: {
					trigger: ref.current,
					start: "top 85%",
					toggleActions: "play none none reverse",
				},
			});
		},
		{ scope: ref, dependencies: [reducedMotion, delay, y] },
	);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
