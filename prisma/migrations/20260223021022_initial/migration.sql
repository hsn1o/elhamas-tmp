-- AlterTable
ALTER TABLE "tour_packages" ADD COLUMN     "category_id" UUID;

-- CreateTable
CREATE TABLE "package_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_en" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tour_packages" ADD CONSTRAINT "tour_packages_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "package_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
