PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_business_brand_product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`business_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`brand_id` integer NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_business_brand_product`("id", "business_id", "product_id", "brand_id") SELECT "id", "business_id", "product_id", "brand_id" FROM `business_brand_product`;--> statement-breakpoint
DROP TABLE `business_brand_product`;--> statement-breakpoint
ALTER TABLE `__new_business_brand_product` RENAME TO `business_brand_product`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `business_product_unique` ON `business_brand_product` (`business_id`,`product_id`,`brand_id`);--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`business_id` integer NOT NULL,
	`type` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "business_id", "type", "value") SELECT "id", "business_id", "type", "value" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
CREATE TABLE `__new_product_brand` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`brand_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_product_brand`("id", "product_id", "brand_id") SELECT "id", "product_id", "brand_id" FROM `product_brand`;--> statement-breakpoint
DROP TABLE `product_brand`;--> statement-breakpoint
ALTER TABLE `__new_product_brand` RENAME TO `product_brand`;--> statement-breakpoint
CREATE UNIQUE INDEX `product_brand_unique` ON `product_brand` (`product_id`,`brand_id`);