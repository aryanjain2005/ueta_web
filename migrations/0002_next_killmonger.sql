CREATE TABLE `business_brand_product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`business_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`brand_id` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_brand_product_uniques` ON `business_brand_product` (`business_id`,`product_id`,`brand_id`);--> statement-breakpoint
DROP TABLE `business_brand`;--> statement-breakpoint
DROP TABLE `business_product`;