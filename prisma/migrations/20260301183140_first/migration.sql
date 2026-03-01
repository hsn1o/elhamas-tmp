-- AlterTable
ALTER TABLE "package_categories" ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "package_discover_cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title_en" VARCHAR(255) NOT NULL,
    "title_ar" VARCHAR(255) NOT NULL,
    "image_url" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_discover_cards_pkey" PRIMARY KEY ("id")
);
