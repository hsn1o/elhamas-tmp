/*
  Warnings:

  - You are about to drop the column `image_url` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `testimonials` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `testimonials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "image_url",
DROP COLUMN "is_featured",
DROP COLUMN "location",
ADD COLUMN     "work_ar" VARCHAR(255),
ADD COLUMN     "work_en" VARCHAR(255);
