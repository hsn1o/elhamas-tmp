-- AlterTable
ALTER TABLE "transportation" ADD COLUMN     "excludes_ar" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "excludes_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "location_ar" VARCHAR(255),
ADD COLUMN     "location_en" VARCHAR(255);
