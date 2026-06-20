/* SQLite-compatible phone auth migration:
   Recreate users table with phone instead of email */
CREATE TABLE `users_new` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`phone` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'CASHIER' NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO `users_new` (`id`, `tenant_id`, `phone`, `password_hash`, `name`, `role`)
SELECT `id`, `tenant_id`, `email`, `password_hash`, `name`, `role` FROM `users`;
DROP TABLE `users`;
ALTER TABLE `users_new` RENAME TO `users`;
CREATE UNIQUE INDEX `users_phone_idx` ON `users` (`phone`);
