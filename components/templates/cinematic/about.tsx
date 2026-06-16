import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { Blueprint } from "@/lib/schemas/blueprint";

function getAboutImage(blueprint: Blueprint): string | undefined {
	return (
		blueprint.gallery.find((item) => item.role === "about")?.url ??
		blueprint.gallery[1]?.url
	);
}

export function CinematicAbout({ blueprint }: { blueprint: Blueprint }) {
	const aboutImage = getAboutImage(blueprint);

	return (
		<section id="about" className="mx-auto grid max-w-6xl gap-12 px-6 py-[var(--section-gap)] lg:grid-cols-2 lg:items-center">
			<ScrollReveal>
				<h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight sm:text-5xl">
					{blueprint.about.title}
				</h2>
				<p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
					{blueprint.about.body}
				</p>
			</ScrollReveal>
			{aboutImage ? (
				<ScrollReveal delay={0.15}>
					<ParallaxImage
						src={aboutImage}
						alt={`${blueprint.meta.businessName} interior`}
						className="aspect-[4/5] rounded-3xl"
						speed={0.18}
					/>
				</ScrollReveal>
			) : null}
		</section>
	);
}
