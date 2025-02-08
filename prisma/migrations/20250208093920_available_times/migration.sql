-- CreateEnum
CREATE TYPE "Day" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Flash" DROP CONSTRAINT "Flash_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Flash" DROP CONSTRAINT "Flash_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- CreateTable
CREATE TABLE "AvailableTime" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "fromTime" TEXT NOT NULL,
    "tillTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailableTime_pkey" PRIMARY KEY ("id")
);
