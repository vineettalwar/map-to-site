/**
 * Cloudflare D1 migration workflow:
 *   1. npm run db:generate
 *   2. npm run db:migrate:local   (dev)
 *   3. npm run db:migrate:remote  (production)
 *
 * After wrangler.jsonc binding changes:
 *   npm run cf-typegen
 *
 * Migrations are applied by Wrangler, not drizzle-kit migrate.
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./db/schema/index.ts",
	out: "./drizzle",
	dialect: "sqlite",
	strict: true,
});
