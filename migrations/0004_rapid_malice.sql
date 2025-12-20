PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`img` text,
	`role` text DEFAULT 'user',
	`type` text DEFAULT 'standard',
	`created_at` integer DEFAULT '"2025-09-15T19:37:24.391Z"'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "img", "role", "type", "created_at") SELECT "id", "name", "email", "password", "img", "role", "type", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
DROP INDEX `business_product_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `business_brand_product_unique` ON `business_brand_product` (`business_id`,`product_id`,`brand_id`);