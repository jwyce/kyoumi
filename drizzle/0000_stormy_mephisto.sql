CREATE TABLE `kyoumi_bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` text NOT NULL,
	`post_id` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `kyoumi_users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `kyoumi_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kyoumi_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` text NOT NULL,
	`post_id` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `kyoumi_users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `kyoumi_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kyoumi_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text(30),
	`title` text(30) NOT NULL,
	`content` text NOT NULL,
	`topic` text NOT NULL,
	`complete` integer DEFAULT false,
	`cloak` integer DEFAULT false,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `slug_idx` ON `kyoumi_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `kyoumi_posts` (`title`);--> statement-breakpoint
CREATE TABLE `kyoumi_users` (
	`id` text PRIMARY KEY NOT NULL,
	`admin` integer
);
