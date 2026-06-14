import type { Blueprint } from "@/lib/schemas/blueprint";

export function CinematicFooter({ blueprint }: { blueprint: Blueprint }) {
	const attributions = [
		...new Set(
			blueprint.gallery
				.map((item) => item.attribution)
				.filter(Boolean) as string[],
		),
	];

	return (
		<footer className="border-t py-10 pb-24 md:pb-10">
			<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-muted-foreground">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<p>© {new Date().getFullYear()} {blueprint.meta.businessName}</p>
					<p>Made with Map to Site</p>
				</div>
				{attributions.length > 0 ? (
					<p className="text-xs">
						Photo credits: {attributions.join(" · ")}
					</p>
				) : null}
			</div>
		</footer>
	);
}
