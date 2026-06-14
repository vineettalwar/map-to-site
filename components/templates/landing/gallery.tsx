import type { Blueprint } from "@/lib/schemas/blueprint";

export function Gallery({ blueprint }: { blueprint: Blueprint }) {
	if (blueprint.gallery.length === 0) return null;

	return (
		<section className="mx-auto max-w-6xl px-6 py-20">
			<h2 className="text-3xl font-semibold tracking-tight">Gallery</h2>
			<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{blueprint.gallery.map((image) => (
					<div
						key={image.url}
						className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
					>
						{/* eslint-disable-next-line @next/next/no-img-element -- R2 URLs are external and dynamic */}
						<img
							src={image.url}
							alt={image.alt}
							className="h-full w-full object-cover"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
