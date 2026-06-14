import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

function r2RemotePattern(): { protocol: "https"; hostname: string; pathname: string }[] {
	const baseUrl = process.env.R2_PUBLIC_BASE_URL;
	if (!baseUrl) return [];

	try {
		const hostname = new URL(baseUrl).hostname;
		return [{ protocol: "https", hostname, pathname: "/**" }];
	} catch {
		return [];
	}
}

const nextConfig: NextConfig = {
	images: {
		remotePatterns: r2RemotePattern(),
	},
};

export default nextConfig;

initOpenNextCloudflareForDev();
