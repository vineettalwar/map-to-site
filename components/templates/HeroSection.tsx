import Image from "next/image";

import type { SiteBlueprint } from "@/lib/schema/blueprint";
import type { Blueprint } from "@/lib/schemas/blueprint";

type HeroSectionProps = {
	hero: SiteBlueprint["hero"];
	images: Blueprint["gallery"];
	ctaHref?: string;
};

function orderHeroImages(images: Blueprint["gallery"]): Blueprint["gallery"] {
	return [...images].sort((a, b) => {
		if (a.role === "hero" && b.role !== "hero") return -1;
		if (b.role === "hero" && a.role !== "hero") return 1;
		return 0;
	});
}

export function HeroSection({
	hero,
	images,
	ctaHref = "#contact",
}: HeroSectionProps) {
	const displayImages = orderHeroImages(images).slice(0, 4);

	return (
		<section className="relative overflow-hidden bg-slate-950 text-white">
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
			<div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
				<div>
					<h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
						{hero.headline}
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 text-pretty">
						{hero.subheadline}
					</p>
					<a
						href={ctaHref}
						className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
					>
						{hero.ctaText}
					</a>
				</div>

				{displayImages.length > 0 ? (
					<div className="grid grid-cols-2 gap-3 sm:gap-4">
						{displayImages.map((image, index) => (
							<div
								key={image.url}
								className={`relative overflow-hidden rounded-2xl bg-slate-800 ${
									index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
								}`}
							>
								<Image
									src={image.url}
									alt={image.alt || hero.headline}
									fill
									className="object-cover"
									sizes={
										index === 0
											? "(max-width: 1024px) 100vw, 50vw"
											: "(max-width: 1024px) 50vw, 25vw"
									}
									priority={index === 0}
								/>
							</div>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
