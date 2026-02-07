/*
  Warnings:

  - You are about to drop the column `meetingCreatedAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `meetingLink` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `meetingNote` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `meetingPlatform` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "meetingCreatedAt",
DROP COLUMN "meetingLink",
DROP COLUMN "meetingNote",
DROP COLUMN "meetingPlatform",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "meetingRoom" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);
