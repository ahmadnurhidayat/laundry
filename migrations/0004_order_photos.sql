CREATE TABLE IF NOT EXISTS `order_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`sort_order` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
