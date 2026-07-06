CREATE TABLE `discount_campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`criteria` text NOT NULL,
	`strategy` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`barcode` text PRIMARY KEY NOT NULL,
	`stock_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`barcode`) REFERENCES `items`(`barcode`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`barcode` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`barcode` text NOT NULL,
	`quantity` integer NOT NULL,
	`price_at_checkout` integer NOT NULL,
	`discount_applied` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`barcode`) REFERENCES `items`(`barcode`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`payment_amount` integer DEFAULT 0,
	`created_at` integer NOT NULL
);
