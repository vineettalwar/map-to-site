import type { Blueprint } from "@/lib/schemas/blueprint";

export function About({ blueprint }: { blueprint: Blueprint }) {
	return (
		<section className="mx-auto max-w-6xl px-6 py-20">
			<div className="max-w-3xl">
				<h2 className="text-3xl font-semibold tracking-tight">
					{blueprint.about.title}
				</h2>
				<p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
					{blueprint.about.body}
				</p>
			</div>
		</section>
	);
}
