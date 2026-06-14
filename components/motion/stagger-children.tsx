"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(useGSAP);

interface StaggerChildrenProps {
	children: React.ReactNode;
	className?: string;
	stagger?: number;
}

export function StaggerChildren({
	children,
	className,
	stagger = 0.12,
}: StaggerChildrenProps) {
	const ref = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!ref.current || reducedMotion) return;

			const items = ref.current.querySelectorAll("[data-stagger]");
			if (items.length === 0) return;

			gsap.from(items, {
				opacity: 0,
				y: 32,
				duration: 0.8,
				stagger,
				ease: "power3.out",
				delay: 0.2,
			});
		},
		{ scope: ref, dependencies: [reducedMotion, stagger] },
	);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
