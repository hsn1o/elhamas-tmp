-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "location_id" UUID;

-- CreateTable
CREATE TABLE "hotel_locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_en" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hotel_id" UUID NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "name_ar" VARCHAR(255) NOT NULL,
    "description_en" TEXT,
    "description_ar" TEXT,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'SAR',
    "max_guests" INTEGER NOT NULL,
    "amenities" TEXT[],
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "hotel_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
