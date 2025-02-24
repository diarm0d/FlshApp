/*
  Warnings:

  - Made the column `isPaid` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "startTime" SET DATA TYPE BIGINT,
ALTER COLUMN "endTime" SET DATA TYPE BIGINT,
ALTER COLUMN "isPaid" SET NOT NULL,
ALTER COLUMN "isPaid" SET DEFAULT false;
