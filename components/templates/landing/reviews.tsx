import { Star } from "lucide-react";

import type { Blueprint } from "@/lib/schemas/blueprint";

export function Reviews({ blueprint }: { blueprint: Blueprint }) {
	if (blueprint.reviews.length === 0) return null;

	return (
		<section className="bg-slate-950 py-20 text-white">
			<div className="mx-auto max-w-6xl px-6">
				<h2 className="text-3xl font-semibold tracking-tight">
					What customers are saying
				</h2>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
					{blueprint.reviews.map((review) => (
						<article
							key={`${review.author}-${review.relativeTime}`}
							className="rounded-2xl border border-white/10 bg-white/5 p-6"
						>
							<div className="mb-4 flex gap-1">
								{Array.from({ length: review.rating }).map((_, index) => (
									<Star
										key={index}
										className="h-4 w-4 fill-amber-400 text-amber-400"
									/>
								))}
							</div>
							<p className="text-sm leading-7 text-slate-200">{review.text}</p>
							<p className="mt-6 text-sm font-medium text-white">
								{review.author}
							</p>
							<p className="text-xs text-slate-400">{review.relativeTime}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
