"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface PinnedSectionProps {
	children: React.ReactNode;
	className?: string;
	pinSpacing?: boolean;
	end?: string;
}

export function PinnedSection({
	children,
	className,
	pinSpacing = true,
	end = "+=100%",
}: PinnedSectionProps) {
	const ref = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!ref.current || reducedMotion) return;

			ScrollTrigger.create({
				trigger: ref.current,
				start: "top top",
				end,
				pin: true,
				pinSpacing,
				anticipatePin: 1,
			});
		},
		{ scope: ref, dependencies: [reducedMotion, end, pinSpacing] },
	);

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
}
