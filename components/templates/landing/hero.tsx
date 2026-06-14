import type { Blueprint } from "@/lib/schemas/blueprint";

export function Hero({ blueprint }: { blueprint: Blueprint }) {
	const heroImage = blueprint.gallery[0]?.url;

	return (
		<section className="relative overflow-hidden bg-slate-950 text-white">
			{heroImage ? (
				<div
					className="absolute inset-0 bg-cover bg-center opacity-30"
					style={{ backgroundImage: `url(${heroImage})` }}
				/>
			) : null}
			<div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/70" />
			<div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-24">
				<p className="mb-4 text-sm font-medium tracking-[0.2em] text-blue-200 uppercase">
					{blueprint.meta.category}
				</p>
				<h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
					{blueprint.hero.headline}
				</h1>
				<p className="mt-6 max-w-2xl text-lg text-slate-200 text-pretty">
					{blueprint.hero.subheadline}
				</p>
				<a
					href={blueprint.hero.ctaHref}
					className="mt-10 inline-flex w-fit rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
				>
					{blueprint.hero.ctaText}
				</a>
			</div>
		</section>
	);
}
