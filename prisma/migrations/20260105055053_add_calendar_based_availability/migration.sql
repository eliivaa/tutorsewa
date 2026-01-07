/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `TutorAvailability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tutorId,date,startTime,endTime,sessionType]` on the table `TutorAvailability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `TutorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_availabilityId_fkey";

-- DropIndex
DROP INDEX "TutorAvailability_tutorId_dayOfWeek_startTime_endTime_sessi_key";

-- AlterTable
ALTER TABLE "TutorAvailability" DROP COLUMN "dayOfWeek",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_tutorId_startTime_endTime_idx" ON "Booking"("tutorId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "TutorAvailability_tutorId_date_startTime_endTime_sessionTyp_key" ON "TutorAvailability"("tutorId", "date", "startTime", "endTime", "sessionType");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "TutorAvailability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
