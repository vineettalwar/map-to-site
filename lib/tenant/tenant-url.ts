import { getPlatformBaseDomain } from "@/lib/env";

export function tenantUrlForSlug(slug: string): string {
	const baseDomain = getPlatformBaseDomain();
	if (baseDomain === "localhost") {
		return `http://${slug}.localhost:3000`;
	}
	return `https://${slug}.${baseDomain}`;
}
