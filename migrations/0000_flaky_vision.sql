CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone_number` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`service_id` text NOT NULL,
	`qty` real NOT NULL,
	`subtotal` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`customer_id` text NOT NULL,
	`date_in` text NOT NULL,
	`date_estimated` text NOT NULL,
	`order_status` text DEFAULT 'PENDING' NOT NULL,
	`payment_status` text DEFAULT 'UNPAID' NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`notes` text,
	`tracking_token` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`service_name` text NOT NULL,
	`type` text NOT NULL,
	`price_per_unit` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_phone_number_unique` ON `customers` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_invoice_number_unique` ON `orders` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_tracking_token_unique` ON `orders` (`tracking_token`);