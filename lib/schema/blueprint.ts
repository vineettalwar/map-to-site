import { z } from "zod";

export const lucideIconNameSchema = z.enum([
	"star",
	"map-pin",
	"clock",
	"phone",
	"shield",
	"heart",
	"sparkles",
	"users",
	"utensils",
	"coffee",
	"scissors",
	"car",
]);

export const siteBlueprintSeoSchema = z.object({
	title: z.string().max(70),
	metaDescription: z.string().max(160),
});

export const siteBlueprintHeroSchema = z.object({
	headline: z.string().max(80),
	subheadline: z.string().max(200),
	ctaText: z.string().max(40),
});

export const siteBlueprintFeatureSchema = z.object({
	title: z.string().max(60),
	description: z.string().max(200),
	iconName: lucideIconNameSchema,
});

export const siteBlueprintTestimonialSchema = z.object({
	author: z.string().max(80),
	text: z.string().max(500),
});

export const siteBlueprintSocialProofSchema = z.object({
	averageRating: z.number().min(0).max(5),
	testimonials: z.array(siteBlueprintTestimonialSchema).min(2).max(3),
});

export const siteBlueprintFooterSchema = z.object({
	address: z.string(),
	phone: z.string(),
	hours: z.string(),
	copyrightText: z.string().max(120),
});

export const siteBlueprintSchema = z.object({
	seo: siteBlueprintSeoSchema,
	hero: siteBlueprintHeroSchema,
	features: z.array(siteBlueprintFeatureSchema).length(3),
	socialProof: siteBlueprintSocialProofSchema,
	footer: siteBlueprintFooterSchema,
});

export type SiteBlueprint = z.infer<typeof siteBlueprintSchema>;
