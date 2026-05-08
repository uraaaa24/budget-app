CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
