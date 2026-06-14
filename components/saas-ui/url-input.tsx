"use client";

import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UrlInput() {
	const router = useRouter();
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event?: React.FormEvent) {
		event?.preventDefault();
		if (!url.trim() || loading) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url }),
			});

			const data = (await response.json()) as {
				id?: string;
				error?: string;
				redirectUrl?: string;
				status?: string;
			};

			if (!response.ok || !data.id) {
				throw new Error(data.error ?? "Failed to start generation");
			}

			if (data.redirectUrl) {
				router.push(data.redirectUrl);
				return;
			}

			router.push(`/generate/${data.id}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-3xl">
			<div className="relative group">
				<div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />
				<div className="relative flex items-center gap-3 rounded-[2rem] border border-border/60 bg-card/80 px-5 py-4 shadow-2xl backdrop-blur-xl">
					<MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
					<Input
						value={url}
						onChange={(event) => setUrl(event.target.value)}
						placeholder="Paste a Google Maps URL or Place ID..."
						className="h-14 flex-1 border-0 bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
						disabled={loading}
					/>
					<Button
						type="submit"
						size="lg"
						className="h-12 rounded-full px-6"
						disabled={loading || !url.trim()}
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								Generate
								<ArrowRight className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			</div>
			<p className="mt-4 text-center text-sm text-muted-foreground">
				Use the link from Google Maps → Share (e.g.{" "}
				<span className="font-mono text-xs">maps.app.goo.gl/...</span> or{" "}
				<span className="font-mono text-xs">google.com/maps/place/...</span>).
				<span className="block mt-1">
					<span className="font-mono text-xs">share.google/...</span> links will
					not work.
				</span>
			</p>
			{error ? (
				<p className="mt-3 text-center text-sm text-destructive">{error}</p>
			) : null}
		</form>
	);
}
