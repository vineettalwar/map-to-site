ALTER TABLE `sites` ADD COLUMN `business_name` text;--> statement-breakpoint
UPDATE `sites` SET `status` = 'generated' WHERE `status` = 'ready';--> statement-breakpoint
CREATE UNIQUE INDEX `sites_place_id_unique` ON `sites` (`place_id`);
