import { z } from "zod";

export const blueprintThemeSchema = z.object({
	accent: z.string(),
	categoryKey: z.string(),
});

export const blueprintMotionSchema = z.object({
	variant: z.enum(["cinematic", "minimal"]),
});

export const blueprintMetaSchema = z.object({
	title: z.string(),
	description: z.string(),
	businessName: z.string(),
	category: z.string(),
	rating: z.number().nullable().optional(),
	reviewCount: z.number().nullable().optional(),
});

export const blueprintHeroSchema = z.object({
	headline: z.string(),
	subheadline: z.string(),
	ctaText: z.string(),
	ctaHref: z.string(),
});

export const blueprintAboutSchema = z.object({
	title: z.string(),
	body: z.string(),
});

export const blueprintHighlightSchema = z.object({
	icon: z.string(),
	title: z.string(),
	description: z.string(),
});

export const blueprintGalleryItemSchema = z.object({
	url: z.string().url(),
	alt: z.string(),
	role: z.enum(["hero", "gallery", "about"]).optional(),
	attribution: z.string().optional(),
});

export const blueprintReviewSchema = z.object({
	author: z.string(),
	rating: z.number().min(1).max(5),
	text: z.string(),
	relativeTime: z.string(),
});

export const blueprintContactSchema = z.object({
	address: z.string(),
	phone: z.string(),
	website: z.string(),
	hours: z.string(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
});

export const blueprintSeoSchema = z.object({
	keywords: z.array(z.string()),
});

export const blueprintSchema = z.object({
	meta: blueprintMetaSchema,
	theme: blueprintThemeSchema,
	motion: blueprintMotionSchema,
	hero: blueprintHeroSchema,
	about: blueprintAboutSchema,
	highlights: z.array(blueprintHighlightSchema).min(3).max(4),
	gallery: z.array(blueprintGalleryItemSchema),
	reviews: z.array(blueprintReviewSchema),
	contact: blueprintContactSchema,
	seo: blueprintSeoSchema,
});

/** LLM generates copy only; theme/motion are resolved in post-processing. */
export const blueprintCopySchema = blueprintSchema.omit({ theme: true, motion: true });

export type Blueprint = z.infer<typeof blueprintSchema>;
export type BlueprintCopy = z.infer<typeof blueprintCopySchema>;
