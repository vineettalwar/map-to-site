CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`place_id` text NOT NULL,
	`google_maps_url` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`raw_places_data` text,
	`blueprint` text,
	`error_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
