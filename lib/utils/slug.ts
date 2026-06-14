export function slugifyBusinessName(name: string): string {
	const slug = name
		.toLowerCase()
		.trim()
		.replace(/['']/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);

	return slug || "site";
}

export function slugWithSuffix(baseSlug: string, suffix: string): string {
	const shortSuffix = suffix.replace(/-/g, "").slice(0, 6);
	const trimmedBase = baseSlug.slice(0, 48 - shortSuffix.length - 1);
	return `${trimmedBase}-${shortSuffix}`;
}
