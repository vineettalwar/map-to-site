import type { Blueprint } from "@/lib/schemas/blueprint";

export function Footer({ blueprint }: { blueprint: Blueprint }) {
	return (
		<footer className="border-t py-8">
			<div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<p>© {new Date().getFullYear()} {blueprint.meta.businessName}</p>
				<p>Generated with Map to Site</p>
			</div>
		</footer>
	);
}
