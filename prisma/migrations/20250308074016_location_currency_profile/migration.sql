-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'Euro',
ADD COLUMN     "placeId" TEXT NOT NULL DEFAULT 'Test',
ADD COLUMN     "placeName" TEXT NOT NULL DEFAULT 'Test';
