ALTER TABLE `sites` ADD `slug` text;
--> statement-breakpoint
ALTER TABLE `sites` ADD `custom_domain` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_slug_unique` ON `sites` (`slug`);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_custom_domain_unique` ON `sites` (`custom_domain`);
