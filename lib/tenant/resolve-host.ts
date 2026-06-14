import { getPlatformBaseDomain, getPlatformHosts } from "@/lib/env";

export interface TenantResolution {
	isPlatformHost: boolean;
	tenantKey: string | null;
}

function stripPort(hostname: string): string {
	return hostname.split(":")[0].toLowerCase();
}

function isPlatformHostname(hostname: string): boolean {
	const host = stripPort(hostname);
	const platformHosts = getPlatformHosts();

	if (platformHosts.includes(host)) {
		return true;
	}

	const baseDomain = getPlatformBaseDomain().toLowerCase();
	if (host === baseDomain || host === `www.${baseDomain}`) {
		return true;
	}

	if (host.endsWith(`.${baseDomain}`)) {
		const subdomain = host.slice(0, -(baseDomain.length + 1));
		if (subdomain === "www" || subdomain === "app") {
			return true;
		}
	}

	return false;
}

export function resolveTenantFromHost(hostname: string): TenantResolution {
	const host = stripPort(hostname);

	if (isPlatformHostname(host)) {
		return { isPlatformHost: true, tenantKey: null };
	}

	const baseDomain = getPlatformBaseDomain().toLowerCase();
	if (host.endsWith(`.${baseDomain}`)) {
		const slug = host.slice(0, -(baseDomain.length + 1));
		if (slug && slug !== "www" && slug !== "app") {
			return { isPlatformHost: false, tenantKey: slug };
		}
	}

	const tenantKey = host.startsWith("www.") ? host.slice(4) : host;
	return { isPlatformHost: false, tenantKey };
}
