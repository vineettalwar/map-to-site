"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ParallaxImageProps {
	src: string;
	alt: string;
	className?: string;
	speed?: number;
}

export function ParallaxImage({
	src,
	alt,
	className,
	speed = 0.25,
}: ParallaxImageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const reducedMotion = useReducedMotion();

	useGSAP(
		() => {
			if (!containerRef.current || !imageRef.current || reducedMotion) return;

			gsap.to(imageRef.current, {
				yPercent: speed * 100,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			});
		},
		{ scope: containerRef, dependencies: [reducedMotion, speed] },
	);

	return (
		<div ref={containerRef} className={`overflow-hidden ${className ?? ""}`}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				ref={imageRef}
				src={src}
				alt={alt}
				className="h-[120%] w-full object-cover"
			/>
		</div>
	);
}
