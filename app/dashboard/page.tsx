"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SiteRow {
	id: string;
	slug: string | null;
	businessName: string | null;
	status: string;
	pipelineStage: string | null;
	googleMapsUrl: string;
	updatedAt: string;
}

export default function DashboardPage() {
	const [sites, setSites] = useState<SiteRow[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			const response = await fetch("/api/sites");
			const data = (await response.json()) as { sites?: SiteRow[] };
			setSites(data.sites ?? []);
			setLoading(false);
		}
		load();
	}, []);

	return (
		<main className="mx-auto max-w-5xl px-6 py-12">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
						Agency dashboard
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight">
						Generated sites
					</h1>
				</div>
				<Button asChild>
					<Link href="/">New site</Link>
				</Button>
			</div>

			{loading ? (
				<p className="text-muted-foreground">Loading…</p>
			) : sites.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No sites yet. Paste a Maps URL on the home page to generate one.
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{sites.map((site) => (
						<Card key={site.id}>
							<CardHeader className="flex flex-row items-start justify-between gap-4">
								<div>
									<CardTitle className="text-lg">
										{site.businessName ?? "Untitled business"}
									</CardTitle>
									<p className="mt-1 truncate text-sm text-muted-foreground">
										{site.googleMapsUrl}
									</p>
									{site.slug ? (
										<p className="mt-1 text-sm text-muted-foreground">
											Slug: {site.slug}
										</p>
									) : null}
								</div>
								<Badge variant={site.status === "generated" ? "default" : "secondary"}>
									{site.status}
								</Badge>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-3">
								{site.status === "generated" ? (
									<>
										<Button asChild size="sm">
											<Link href={`/site/${site.id}`}>View site</Link>
										</Button>
										{site.slug ? (
											<Button asChild size="sm" variant="outline">
												<Link href={`/${site.slug}`}>Tenant preview</Link>
											</Button>
										) : null}
									</>
								) : site.status === "processing" ? (
									<Button asChild size="sm" variant="outline">
										<Link href={`/generate/${site.id}`}>View progress</Link>
									</Button>
								) : null}
								<Button asChild size="sm" variant="outline">
									<a href={`/api/sites/${site.id}/export`} download>
										Export JSON
									</a>
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={async () => {
										await fetch(`/api/sites/${site.id}/regenerate`, {
											method: "POST",
										});
										window.location.href = `/generate/${site.id}`;
									}}
								>
									Regenerate
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</main>
	);
}
