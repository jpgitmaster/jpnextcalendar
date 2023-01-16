-- CreateTable
CREATE TABLE `schedules` (
    `id` VARCHAR(191) NOT NULL,
    `event_id` VARCHAR(255) NOT NULL,
    `summary` VARCHAR(150) NOT NULL,
    `location` VARCHAR(200) NULL,
    `start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` TEXT NULL,
    `color` VARCHAR(20) NULL,
    `hangoutLink` VARCHAR(255) NOT NULL,
    `htmlLink` VARCHAR(255) NOT NULL,
    `attendees` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
