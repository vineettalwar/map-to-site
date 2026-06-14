import { UrlInput } from "@/components/saas-ui/url-input";

export default function HomePage() {
	return (
		<main className="relative flex min-h-screen flex-col overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_35%)]" />

			<header className="relative z-10 flex items-center justify-between px-6 py-6">
				<p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
					Map to Site
				</p>
				<a
					href="/dashboard"
					className="text-sm text-muted-foreground transition hover:text-foreground"
				>
					Dashboard
				</a>
			</header>

			<section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24">
				<div className="mb-10 max-w-3xl text-center">
					<h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
						Client pitch in 60 seconds
					</h1>
					<p className="mt-4 text-lg text-muted-foreground text-balance">
						Paste a Google Maps listing URL. We pull real photos, write factual
						copy, and build a cinematic landing page you can share with clients
						immediately.
					</p>
				</div>
				<UrlInput />
			</section>
		</main>
	);
}
