import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TenantTemplate } from "@/components/templates/TenantTemplate";
import {
	buildSiteMetadata,
	getHeroImageUrl,
} from "@/lib/sites/site-page-utils";
import { getSiteById } from "@/lib/sites";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const site = await getSiteById(id);

	if (!site?.blueprint) {
		return { title: "Site not found" };
	}

	return buildSiteMetadata(site.blueprint);
}

export default async function SitePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const site = await getSiteById(id);

	if (!site) notFound();

	if (site.status !== "generated" || !site.blueprint) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6">
				<div className="text-center">
					<h1 className="text-2xl font-semibold">Site is still generating</h1>
					<p className="mt-2 text-muted-foreground">
						Check back in a moment or return to the generator.
					</p>
				</div>
			</main>
		);
	}

	const heroImage = getHeroImageUrl(site.blueprint);

	return (
		<>
			{heroImage ? (
				<link rel="preload" as="image" href={heroImage} />
			) : null}
			<TenantTemplate blueprint={site.blueprint} />
		</>
	);
}
