/*
  Warnings:

  - You are about to drop the column `placeId` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "placeId",
ADD COLUMN     "formattedAddress" TEXT NOT NULL DEFAULT '123 Weiner str, Berlin, 10999, Germany',
ALTER COLUMN "placeName" SET DEFAULT 'Tattoo Studio';
