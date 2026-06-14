import Link from "next/link";

export function SiteNotFound({ domain }: { domain?: string }) {
	return (
		<main className="flex min-h-screen items-center justify-center px-6">
			<div className="max-w-md text-center">
				<p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
					404
				</p>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight">
					Site not found
				</h1>
				<p className="mt-3 text-muted-foreground">
					{domain
						? `We couldn't find a business site for "${domain}".`
						: "We couldn't find the business site you're looking for."}
				</p>
				<Link
					href="/"
					className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
				>
					Go to Map to Site
				</Link>
			</div>
		</main>
	);
}
