import type { Metadata } from "next";

import { SiteNotFound } from "@/components/templates/SiteNotFound";
import { TenantTemplate } from "@/components/templates/TenantTemplate";
import {
	buildSiteMetadata,
	getHeroImageUrl,
} from "@/lib/sites/site-page-utils";
import { getSiteByTenantKey } from "@/lib/sites";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ domain: string }>;
}): Promise<Metadata> {
	const { domain } = await params;
	const site = await getSiteByTenantKey(domain);

	if (!site?.blueprint) {
		return { title: "Site not found" };
	}

	return buildSiteMetadata(site.blueprint);
}

export default async function TenantDomainPage({
	params,
}: {
	params: Promise<{ domain: string; path?: string[] }>;
}) {
	const { domain } = await params;
	const site = await getSiteByTenantKey(domain);

	if (!site) {
		return <SiteNotFound domain={domain} />;
	}

	if (site.status !== "generated" || !site.blueprint) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6">
				<div className="text-center">
					<h1 className="text-2xl font-semibold">Site is still generating</h1>
					<p className="mt-2 text-muted-foreground">
						Check back in a moment while we finish building this page.
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
