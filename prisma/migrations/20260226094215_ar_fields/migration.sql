-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "amenities_ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "city_ar" VARCHAR(255);

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "amenities_ar" TEXT[] DEFAULT ARRAY[]::TEXT[];
