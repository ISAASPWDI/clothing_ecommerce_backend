-- DropForeignKey
ALTER TABLE `product_ages` DROP FOREIGN KEY `product_ages_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_categories` DROP FOREIGN KEY `product_categories_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_colors` DROP FOREIGN KEY `product_colors_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_details` DROP FOREIGN KEY `product_details_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_genres` DROP FOREIGN KEY `product_genres_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_sizes` DROP FOREIGN KEY `product_sizes_product_id_fkey`;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_details` ADD CONSTRAINT `product_details_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_ages` ADD CONSTRAINT `product_ages_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_genres` ADD CONSTRAINT `product_genres_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_sizes` ADD CONSTRAINT `product_sizes_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_colors` ADD CONSTRAINT `product_colors_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
