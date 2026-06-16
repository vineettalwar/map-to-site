export function accentBackgroundStyle(accent: string): { backgroundColor: string } {
	if (accent.startsWith("#")) {
		return { backgroundColor: accent };
	}
	return { backgroundColor: `hsl(${accent})` };
}
