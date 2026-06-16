import type { Blueprint } from "@/lib/schemas/blueprint";

export type SiteNavLink = {
	label: string;
	href: string;
};

export function getSiteNavLinks(
	blueprint: Blueprint,
	options: { showAbout?: boolean } = {},
): SiteNavLink[] {
	const { showAbout = true } = options;
	const links: SiteNavLink[] = [];

	if (showAbout) {
		links.push({ label: "About", href: "#about" });
	} else {
		links.push({ label: "Home", href: "#" });
	}

	if (blueprint.highlights.length > 0) {
		links.push({ label: "Services", href: "#highlights" });
	}

	const galleryItems = blueprint.gallery.filter(
		(item) => item.role !== "hero" || blueprint.gallery.length === 1,
	);
	if (galleryItems.length > 0) {
		links.push({ label: "Gallery", href: "#gallery" });
	}

	if (blueprint.reviews.length > 0) {
		links.push({ label: "Reviews", href: "#reviews" });
	}

	links.push({ label: "Contact", href: "#contact" });

	return links;
}
