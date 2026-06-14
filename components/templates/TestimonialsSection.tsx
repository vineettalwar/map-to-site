import type { Blueprint } from "@/lib/schemas/blueprint";

import { StarRating } from "./shared/StarRating";

type TestimonialsSectionProps = {
	reviews: Blueprint["reviews"];
	averageRating: number;
};

export function TestimonialsSection({
	reviews,
	averageRating,
}: TestimonialsSectionProps) {
	const displayReviews = reviews.slice(0, 3);

	if (displayReviews.length === 0) {
		return null;
	}

	return (
		<section className="bg-muted/40 py-[var(--section-gap)]">
			<div className="mx-auto max-w-6xl px-6">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						What customers are saying
					</h2>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<StarRating rating={averageRating} />
						<span>{averageRating.toFixed(1)} average</span>
					</div>
				</div>
				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{displayReviews.map((review) => (
						<article
							key={`${review.author}-${review.text.slice(0, 24)}`}
							className="rounded-2xl border bg-card p-6 shadow-sm"
						>
							<StarRating rating={review.rating} />
							<p className="mt-4 text-sm leading-7 text-muted-foreground">
								{review.text}
							</p>
							<div className="mt-6 flex items-baseline justify-between gap-2">
								<p className="text-sm font-medium">{review.author}</p>
								{review.relativeTime ? (
									<p className="text-xs text-muted-foreground">
										{review.relativeTime}
									</p>
								) : null}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
