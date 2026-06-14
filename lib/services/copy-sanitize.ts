export const BANNED_PHRASES = [
	"welcome to",
	"we are passionate",
	"your one-stop shop",
	"look no further",
	"we pride ourselves",
	"nestled in",
	"whether you're",
];

export function sanitizeCopy(text: string): string {
	let result = text;
	for (const phrase of BANNED_PHRASES) {
		const regex = new RegExp(phrase, "gi");
		result = result.replace(regex, "").trim();
	}
	return result.replace(/\s{2,}/g, " ");
}
