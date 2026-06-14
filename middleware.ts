import { type NextRequest, NextResponse } from "next/server";

import { resolveTenantFromHost } from "@/lib/tenant/resolve-host";

const PLATFORM_ROUTE_PREFIXES = ["/dashboard", "/generate", "/site", "/api"];

function isPlatformRoute(pathname: string): boolean {
	return PLATFORM_ROUTE_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

export function middleware(request: NextRequest) {
	const host = request.headers.get("host") ?? "";
	const { isPlatformHost, tenantKey } = resolveTenantFromHost(host);

	if (isPlatformHost || !tenantKey) {
		return NextResponse.next();
	}

	const pathname = request.nextUrl.pathname;

	if (isPlatformRoute(pathname)) {
		return NextResponse.next();
	}

	const url = request.nextUrl.clone();
	url.pathname =
		pathname === "/" ? `/${tenantKey}` : `/${tenantKey}${pathname}`;

	return NextResponse.rewrite(url);
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
