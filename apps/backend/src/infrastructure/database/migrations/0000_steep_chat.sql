CREATE TABLE IF NOT EXISTS `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`emoji` text NOT NULL,
	`type` text NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `categories_user_id_idx` ON `categories` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `categories_type_idx` ON `categories` (`type`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `categories_created_at_idx` ON `categories` (`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`memo` text,
	`spent_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `transactions_spent_at_idx` ON `transactions` (`spent_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `transactions_created_at_idx` ON `transactions` (`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `transactions_user_id_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'JPY' NOT NULL,
	`billing_cycle` text NOT NULL,
	`start_date` integer NOT NULL,
	`next_billing_date` integer NOT NULL,
	`status` text NOT NULL,
	`memo` text,
	`payment_method` text,
	`category_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `subscriptions_user_id_idx` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `subscriptions_next_billing_date_idx` ON `subscriptions` (`next_billing_date`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `subscriptions_created_at_idx` ON `subscriptions` (`created_at`);--> statement-breakpoint

-- Insert default categories
INSERT OR IGNORE INTO `categories` (`id`, `user_id`, `name`, `emoji`, `type`, `is_default`, `created_at`, `updated_at`)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, '食費', '🍜', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000002', NULL, '交通費', '🚃', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000003', NULL, '日用品', '🧴', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000004', NULL, '娯楽', '🎮', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000005', NULL, '医療', '💊', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000006', NULL, '教育', '📚', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000007', NULL, '通信費', '📱', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000008', NULL, '光熱費', '💡', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000009', NULL, '家賃', '🏠', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000a', NULL, '衣服', '👔', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000b', NULL, '美容', '💄', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000c', NULL, 'その他', '📦', 'expense', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000d', NULL, '給与', '💰', 'income', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000e', NULL, '副業', '💼', 'income', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-00000000000f', NULL, '投資', '📈', 'income', 1, strftime('%s', 'now'), strftime('%s', 'now')),
  ('00000000-0000-0000-0000-000000000010', NULL, 'その他', '💸', 'income', 1, strftime('%s', 'now'), strftime('%s', 'now'));