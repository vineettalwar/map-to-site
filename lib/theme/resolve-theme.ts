export interface SiteTheme {
	accent: string;
	categoryKey: string;
}

const TYPE_TO_CATEGORY: Record<string, string> = {
	restaurant: "restaurant",
	cafe: "restaurant",
	bar: "restaurant",
	bakery: "restaurant",
	meal_delivery: "restaurant",
	meal_takeaway: "restaurant",
	hair_care: "salon",
	beauty_salon: "salon",
	spa: "salon",
	gym: "fitness",
	fitness_center: "fitness",
	store: "retail",
	shopping_mall: "retail",
	clothing_store: "retail",
	jewelry_store: "retail",
	lawyer: "professional",
	accounting: "professional",
	dentist: "professional",
	doctor: "professional",
	real_estate_agency: "professional",
	lodging: "hospitality",
	hotel: "hospitality",
};

const CATEGORY_ACCENTS: Record<string, string> = {
	restaurant: "24 95% 53%",
	salon: "330 81% 60%",
	fitness: "142 71% 45%",
	retail: "221 83% 53%",
	professional: "215 25% 40%",
	hospitality: "262 83% 58%",
	default: "220 70% 50%",
};

export function resolveTheme(types: string[]): SiteTheme {
	for (const type of types) {
		const categoryKey = TYPE_TO_CATEGORY[type];
		if (categoryKey) {
			return {
				categoryKey,
				accent: CATEGORY_ACCENTS[categoryKey] ?? CATEGORY_ACCENTS.default,
			};
		}
	}

	return {
		categoryKey: "default",
		accent: CATEGORY_ACCENTS.default,
	};
}

export function themeCssVariables(theme: SiteTheme): Record<string, string> {
	return {
		"--site-accent": theme.accent,
	};
}
