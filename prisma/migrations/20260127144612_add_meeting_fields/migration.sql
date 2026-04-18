/*
  Warnings:

  - You are about to drop the column `isSuspended` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "meetingCreatedAt" TIMESTAMP(3),
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "meetingNote" TEXT,
ADD COLUMN     "meetingPlatform" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSuspended",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
