import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sites = sqliteTable("sites", {
	id: text("id").primaryKey(),
	placeId: text("place_id").notNull().unique(),
	slug: text("slug").unique(),
	customDomain: text("custom_domain").unique(),
	businessName: text("business_name"),
	googleMapsUrl: text("google_maps_url").notNull(),
	status: text("status", {
		enum: ["pending", "processing", "generated", "failed"],
	})
		.notNull()
		.default("pending"),
	pipelineStage: text("pipeline_stage"),
	rawPlacesData: text("raw_places_data"),
	blueprint: text("blueprint"),
	errorMessage: text("error_message"),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type SiteStatus = Site["status"];
