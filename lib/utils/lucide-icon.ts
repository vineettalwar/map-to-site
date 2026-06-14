import type { LucideIcon } from "lucide-react";
import {
	Car,
	Coffee,
	Clock,
	Heart,
	MapPin,
	Phone,
	Scissors,
	Shield,
	Sparkles,
	Star,
	Users,
	Utensils,
} from "lucide-react";

import type { SiteBlueprint } from "@/lib/schema/blueprint";

type IconName = SiteBlueprint["features"][number]["iconName"];

const ICON_MAP: Record<IconName, LucideIcon> = {
	star: Star,
	"map-pin": MapPin,
	clock: Clock,
	phone: Phone,
	shield: Shield,
	heart: Heart,
	sparkles: Sparkles,
	users: Users,
	utensils: Utensils,
	coffee: Coffee,
	scissors: Scissors,
	car: Car,
};

export function getLucideIcon(iconName: string): LucideIcon {
	return ICON_MAP[iconName as IconName] ?? Sparkles;
}
