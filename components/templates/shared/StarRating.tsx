import { Star } from "lucide-react";

type StarRatingProps = {
	rating: number;
	className?: string;
};

export function StarRating({ rating, className }: StarRatingProps) {
	const filled = Math.round(Math.min(5, Math.max(0, rating)));

	return (
		<div className={`flex gap-1 ${className ?? ""}`}>
			{Array.from({ length: 5 }).map((_, index) => (
				<Star
					key={index}
					className={`h-4 w-4 ${
						index < filled
							? "fill-amber-400 text-amber-400"
							: "fill-transparent text-slate-300"
					}`}
				/>
			))}
		</div>
	);
}
